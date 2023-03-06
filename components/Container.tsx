import style from 'styled-components'

export default style.div`
  padding: 0 2rem;
  padding-bottom: 100px;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  background: ${p => p.theme.bg};
  min-height: calc(100vh - 100px);
  position:relative;
`