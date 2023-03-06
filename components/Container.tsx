import style from 'styled-components'

export default style.div`
  padding: 0 2rem;
  padding-bottom: 100px;
  max-width: 400px;
  margin: 0 auto;
  display: block;
  background: ${p => p.theme.bg};
  min-height: 90vh;
  position:relative;
`