import style from 'styled-components'

export default style.div`
  display: block;
  height: 100px;
  width: 100px;
  background: url(${p => p.src}) center;
  background-size: cover;
  border-radius: 100%;
`