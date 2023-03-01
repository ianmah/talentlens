import style from 'styled-components'

export default style.div`
  display: block;
  height: 120px;
  width: 120px;
  background: url(${p => p.src}) center no-repeat;
  border-radius: 100%;
`