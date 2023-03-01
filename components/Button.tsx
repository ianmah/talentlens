import style from 'styled-components'

export default style.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  background: transparent;
  font-size: 1em;
  cursor: pointer;
  color: ${p => p.theme.text};

  border: 1px solid ${p => p.theme.text};
  padding: 0.5em 1em;
  border-radius: 6px;
`