(function (w, d) {
  'use strict';

  // document.currentScript is null when loaded with async — fall back to last matching tag
  var script = d.currentScript || (function () {
    var tags = d.querySelectorAll('script[data-workspace-id]');
    return tags[tags.length - 1] || null;
  })();
  var WORKSPACE = script.getAttribute('data-workspace-id');
  var COLOR     = script.getAttribute('data-color')    || '#1a3fbf';
  var NAME      = script.getAttribute('data-name')     || 'Support';
  var GREETING  = script.getAttribute('data-greeting') || 'Hi! How can we help you today?';
  var POS       = script.getAttribute('data-position') || 'right';

  if (!WORKSPACE) { console.warn('[Wavio] data-workspace-id is required'); return; }

  var API         = script.src.replace(/\/widget\.js.*$/, '');
  var SESSION_KEY = 'wavio_sid_' + WORKSPACE;
  var sessionId   = localStorage.getItem(SESSION_KEY);
  var isOpen      = false;
  var socket      = null;
  var rendered    = {};      // msgId → true (dedup guard)
  var visitorEls  = [];      // visitor message wrapper elements (for read receipt upgrades)
  var typingTimer = null;
  var recentlySent = [];     // texts sent optimistically — dedup when polling

  var wSide = POS === 'left' ? 'left:20px' : 'right:20px';
  var pSide = POS === 'left' ? 'left:0'    : 'right:0';

  /* ── CSS ──────────────────────────────────────────────────────────────────── */
  var C = COLOR; // shorthand
  var css = [
    // Container
    '#wv-wrap{position:fixed;' + wSide + ';bottom:20px;z-index:2147483647;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '#wv-wrap *{box-sizing:border-box;margin:0;padding:0}',

    // Panel
    '#wv-panel{position:absolute;' + pSide + ';bottom:76px;width:368px;border-radius:20px;' +
      'background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.16),0 4px 16px rgba(0,0,0,.08);' +
      'overflow:hidden;flex-direction:column;display:none;max-height:580px;min-height:380px}',
    '#wv-panel.wv-open{display:flex;animation:wvSlide .25s cubic-bezier(.34,1.56,.64,1)}',
    '@keyframes wvSlide{from{opacity:0;transform:translateY(16px) scale(.97)}' +
      'to{opacity:1;transform:translateY(0) scale(1)}}',

    // Header
    '#wv-head{padding:18px 16px 14px;background:' + C + ';flex-shrink:0}',
    '#wv-hrow{display:flex;align-items:center;gap:12px}',
    '#wv-av{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.22);' +
      'display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;' +
      'font-size:18px;flex-shrink:0;border:2px solid rgba(255,255,255,.35);letter-spacing:-.5px}',
    '#wv-hi{flex:1;min-width:0}',
    '#wv-hn{font-weight:700;color:#fff;font-size:15px;letter-spacing:-.2px}',
    '#wv-hs{color:rgba(255,255,255,.82);font-size:11.5px;margin-top:3px;display:flex;align-items:center;gap:5px}',
    '.wv-od{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0}',
    '#wv-x{background:rgba(255,255,255,.18);border:none;cursor:pointer;color:#fff;' +
      'width:30px;height:30px;border-radius:50%;display:flex;align-items:center;' +
      'justify-content:center;font-size:19px;line-height:1;transition:background .15s;flex-shrink:0}',
    '#wv-x:hover{background:rgba(255,255,255,.32)}',
    '#wv-greet{margin-top:12px;color:rgba(255,255,255,.9);font-size:13px;line-height:1.5;' +
      'border-top:1px solid rgba(255,255,255,.15);padding-top:12px}',

    // Messages area
    '#wv-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;' +
      'gap:6px;background:#f8fafc;min-height:0}',
    '#wv-msgs::-webkit-scrollbar{width:4px}',
    '#wv-msgs::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}',

    // Message wrappers
    '.wv-mw{display:flex;flex-direction:column;gap:3px}',
    '.wv-vw{align-self:flex-end;align-items:flex-end;max-width:82%}',
    '.wv-aw{align-self:flex-start;align-items:flex-start;max-width:82%}',
    '.wv-sw{align-self:center;align-items:center;max-width:96%}',

    // Bubbles
    '.wv-m{padding:10px 14px;border-radius:18px;font-size:13.5px;line-height:1.5;' +
      'word-break:break-word;animation:wvPop .22s cubic-bezier(.34,1.56,.64,1)}',
    '@keyframes wvPop{from{opacity:0;transform:scale(.88) translateY(8px)}to{opacity:1;transform:none}}',
    '.wv-vm{background:' + C + ';color:#fff;border-radius:18px 18px 4px 18px}',
    '.wv-am{background:#fff;color:#1e293b;border-radius:18px 18px 18px 4px;' +
      'box-shadow:0 1px 6px rgba(0,0,0,.09)}',
    '.wv-sm{background:rgba(148,163,184,.12);color:#64748b;font-size:12px;border-radius:10px;' +
      'padding:7px 14px;text-align:center}',

    // Message meta (timestamp + ticks)
    '.wv-meta{display:flex;align-items:center;gap:3px;font-size:10px;color:#94a3b8;padding:0 2px}',
    '.wv-tk{font-size:12px;line-height:1}',
    '.wv-tk-s{color:#94a3b8}',   // single grey tick = sent
    '.wv-tk-r{color:' + C + '}', // double blue ticks = read

    // Typing dots
    '#wv-typing{display:none;align-items:center;gap:5px;padding:10px 14px;background:#fff;' +
      'border-radius:18px 18px 18px 4px;box-shadow:0 1px 6px rgba(0,0,0,.09);' +
      'align-self:flex-start}',
    '.wv-d{width:6px;height:6px;border-radius:50%;background:#94a3b8;' +
      'animation:wvBounce 1.2s ease-in-out infinite}',
    '.wv-d:nth-child(2){animation-delay:.15s}',
    '.wv-d:nth-child(3){animation-delay:.3s}',
    '@keyframes wvBounce{0%,60%,100%{transform:translateY(0);opacity:.45}' +
      '30%{transform:translateY(-6px);opacity:1}}',

    // Input bar
    '#wv-bottom{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #f1f5f9;' +
      'background:#fff;align-items:flex-end;flex-shrink:0}',
    '#wv-in{flex:1;border:1.5px solid #e4e7ed;border-radius:12px;padding:9px 12px;' +
      'font-size:13.5px;outline:none;font-family:inherit;resize:none;line-height:1.45;' +
      'max-height:96px;overflow-y:auto;transition:border-color .15s;display:block}',
    '#wv-in:focus{border-color:' + C + '}',
    '#wv-send{background:' + C + ';color:#fff;border:none;border-radius:12px;width:40px;height:40px;' +
      'cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;' +
      'transition:opacity .15s,transform .1s}',
    '#wv-send:hover{opacity:.88;transform:scale(1.05)}',
    '#wv-send:active{transform:scale(.95)}',

    // Powered by
    '#wv-pw{text-align:center;font-size:10px;color:#94a3b8;padding:4px 0 9px;' +
      'background:#fff;flex-shrink:0}',
    '#wv-pw a{color:' + C + ';text-decoration:none;font-weight:600}',

    // Trigger button
    '#wv-btn{width:60px;height:60px;border-radius:50%;background:' + C + ';border:none;' +
      'cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 4px 24px rgba(0,0,0,.24);transition:transform .2s,box-shadow .2s;position:relative}',
    '#wv-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(0,0,0,.32)}',
    '#wv-btn:active{transform:scale(.95)}',
    '#wv-badge{position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;' +
      'border-radius:50%;width:20px;height:20px;font-size:10px;font-weight:700;' +
      'display:none;align-items:center;justify-content:center;border:2px solid #fff}',
  ].join('');

  var styleEl = d.createElement('style');
  styleEl.textContent = css;
  d.head.appendChild(styleEl);

  /* ── DOM ──────────────────────────────────────────────────────────────────── */
  var wrap = d.createElement('div');
  wrap.id = 'wv-wrap';
  var av = (NAME[0] || 'S').toUpperCase();
  wrap.innerHTML =
    '<div id="wv-panel">' +
      '<div id="wv-head">' +
        '<div id="wv-hrow">' +
          '<div id="wv-av">' + av + '</div>' +
          '<div id="wv-hi">' +
            '<div id="wv-hn">' + NAME + '</div>' +
            '<div id="wv-hs"><span class="wv-od"></span>Online now</div>' +
          '</div>' +
          '<button id="wv-x" aria-label="Close">×</button>' +
        '</div>' +
        '<div id="wv-greet">' + GREETING + '</div>' +
      '</div>' +
      '<div id="wv-msgs">' +
        '<div id="wv-typing">' +
          '<span class="wv-d"></span><span class="wv-d"></span><span class="wv-d"></span>' +
        '</div>' +
      '</div>' +
      '<div id="wv-bottom">' +
        '<textarea id="wv-in" rows="1" placeholder="Type a message…" autocomplete="off"></textarea>' +
        '<button id="wv-send" aria-label="Send">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
          ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="22" y1="2" x2="11" y2="13"/>' +
          '<polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="wv-pw">Powered by <a href="https://wavio.io" target="_blank">Wavio</a></div>' +
    '</div>' +
    '<button id="wv-btn" aria-label="Open chat">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>' +
      '<div id="wv-badge"></div>' +
    '</button>';

  d.body.appendChild(wrap);

  var panel    = d.getElementById('wv-panel');
  var btn      = d.getElementById('wv-btn');
  var closeX   = d.getElementById('wv-x');
  var msgs     = d.getElementById('wv-msgs');
  var input    = d.getElementById('wv-in');
  var sendBtn  = d.getElementById('wv-send');
  var badge    = d.getElementById('wv-badge');
  var typingEl = d.getElementById('wv-typing');

  /* ── Helpers ──────────────────────────────────────────────────────────────── */
  function scrollBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function fmtTime(dt) {
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Add a message bubble. msgId deduplicates. Returns the wrapper element.
  function addMsg(text, type, msgId, isAlreadyRead) {
    if (msgId && rendered[msgId]) return null;
    if (msgId) rendered[msgId] = true;

    var isV = type === 'visitor';
    var isA = type === 'agent';

    var mw = d.createElement('div');
    mw.className = 'wv-mw ' + (isV ? 'wv-vw' : isA ? 'wv-aw' : 'wv-sw');

    var bubble = d.createElement('div');
    bubble.className = 'wv-m ' + (isV ? 'wv-vm' : isA ? 'wv-am' : 'wv-sm');
    bubble.textContent = text;
    mw.appendChild(bubble);

    if (isV || isA) {
      var meta = d.createElement('div');
      meta.className = 'wv-meta';
      var ts = d.createElement('span');
      ts.textContent = fmtTime(new Date());
      meta.appendChild(ts);

      if (isV) {
        var tick = d.createElement('span');
        tick.className = 'wv-tk ' + (isAlreadyRead ? 'wv-tk-r' : 'wv-tk-s');
        tick.textContent = isAlreadyRead ? '✓✓' : '✓';
        meta.appendChild(tick);
        mw._tick = tick;
        visitorEls.push(mw);
      }

      mw.appendChild(meta);
    }

    msgs.insertBefore(mw, typingEl);
    scrollBottom();
    return mw;
  }

  // Upgrade all visitor message ticks to double-blue (agent has read them)
  function upgradeAllTicks() {
    visitorEls.forEach(function(mw) {
      if (!mw._tick) return;
      mw._tick.textContent = '✓✓';
      mw._tick.className = 'wv-tk wv-tk-r';
    });
  }

  function showTyping(show) {
    typingEl.style.display = show ? 'flex' : 'none';
    if (show) scrollBottom();
  }

  /* ── Session ──────────────────────────────────────────────────────────────── */
  function startSession(cb) {
    fetch(API + '/api/widget/' + WORKSPACE + '/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: w.location.href }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      sessionId = data.sessionId;
      localStorage.setItem(SESSION_KEY, sessionId);
      if (cb) cb();
    })
    .catch(function(e) { console.error('[Wavio]', e); });
  }

  /* ── Initial message load via HTTP ───────────────────────────────────────── */
  function loadMessages(onDone) {
    if (!sessionId) { if (onDone) onDone(); return; }
    fetch(API + '/api/widget/' + WORKSPACE + '/messages?sessionId=' + encodeURIComponent(sessionId))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        (data.messages || []).forEach(function(m) {
          if (rendered[m.id]) return;
          if (m.from_type === 'visitor') {
            // Was this sent optimistically? Dedup by text to avoid a double bubble.
            var idx = recentlySent.indexOf(m.text);
            if (idx >= 0) {
              rendered[m.id] = true;
              recentlySent.splice(idx, 1);
            } else {
              addMsg(m.text, 'visitor', m.id, m.is_read);
            }
          } else {
            addMsg(m.text, 'agent', m.id, false);
          }
        });
        if (onDone) onDone();
      })
      .catch(function() { if (onDone) onDone(); });
  }

  /* ── Socket.IO (real-time) ────────────────────────────────────────────────── */
  function initSocket() {
    if (socket || !sessionId) return;

    var s = d.createElement('script');
    s.src = API + '/socket.io/socket.io.js';
    s.onload = function() {
      socket = w.io(API + '/widget', {
        auth: { sessionId: sessionId, workspaceId: WORKSPACE },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', function() {
        socket.emit('widget:mark_read');
      });

      socket.on('connect_error', function(err) {
        console.warn('[Wavio] socket error:', err.message);
      });

      // New agent message in real-time
      socket.on('message:new', function(data) {
        var m = data.message;
        if (m.from_type === 'agent' && !rendered[m.id]) {
          addMsg(m.text, 'agent', m.id);
        }
        if (!isOpen && m.from_type !== 'visitor') {
          var cur = parseInt(badge.textContent || '0', 10);
          badge.textContent = String(cur + 1);
          badge.style.display = 'flex';
        }
      });

      // Agent typing indicators
      socket.on('agent:typing:start', function() { showTyping(true); });
      socket.on('agent:typing:stop',  function() { showTyping(false); });

      // Our messages were read by the agent
      socket.on('messages:read', function() { upgradeAllTicks(); });
    };
    d.head.appendChild(s);
  }

  /* ── Send message ─────────────────────────────────────────────────────────── */
  function doSend() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';

    // Stop typing event
    if (socket) {
      clearTimeout(typingTimer);
      socket.emit('widget:typing:stop');
    }

    // Optimistic bubble (no msgId — server will confirm via polling)
    recentlySent.push(text);
    addMsg(text, 'visitor');

    function postMsg() {
      fetch(API + '/api/widget/' + WORKSPACE + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId, text: text }),
      }).catch(function() {});
    }

    if (!sessionId) {
      startSession(function() { initSocket(); loadMessages(); postMsg(); });
    } else {
      postMsg();
    }
  }

  /* ── Auto-grow textarea ───────────────────────────────────────────────────── */
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 96) + 'px';

    if (socket && this.value.trim()) {
      socket.emit('widget:typing:start');
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function() {
        if (socket) socket.emit('widget:typing:stop');
      }, 1800);
    }
  });

  /* ── Panel toggle ─────────────────────────────────────────────────────────── */
  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add('wv-open');
      badge.style.display = 'none';
      badge.textContent = '0';
      input.focus();
      if (!sessionId) {
        startSession(function() { loadMessages(); initSocket(); });
      } else {
        loadMessages();
        initSocket();
        if (socket && socket.connected) socket.emit('widget:mark_read');
      }
    } else {
      panel.classList.remove('wv-open');
      showTyping(false);
    }
  }

  btn.addEventListener('click', toggle);
  closeX.addEventListener('click', toggle);
  sendBtn.addEventListener('click', doSend);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  // Poll every 3s — reliable fallback for agent replies even if socket fails
  setInterval(function() { if (isOpen && sessionId) loadMessages(); }, 3000);

})(window, document);
