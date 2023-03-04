import style from 'styled-components'

export default style.div`
  display: block;
  height: ${p => p.size || '100px'};
  width: ${p => p.size || '100px'};
  background: url(${p => p.src}) center;
  background-size: cover;
  border-radius: 100%;
`