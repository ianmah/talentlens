import style from 'styled-components'

export default style.div`
  padding: 0 1.5em;
  padding-bottom: 100px;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  background: ${p => p.theme.bg};
  min-height: calc(100dvh - 100px);
  position:relative;
`