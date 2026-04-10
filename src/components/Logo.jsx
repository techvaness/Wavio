import logoImg from '../assets/WavioLogo.png'

export default function Logo({ height = 36 }) {
  return (
    <img
      src={logoImg}
      alt="Wavio"
      style={{ height, width: 'auto', display: 'block', objectFit: 'contain' }}
    />
  )
}
