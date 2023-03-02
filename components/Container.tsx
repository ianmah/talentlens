import style from 'styled-components'

export default style.div`
  padding: 0 2rem;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  background: ${p => p.theme.bg};
  min-height: 100vh;
`