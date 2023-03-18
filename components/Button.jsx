import style from 'styled-components'

const StyledButton = style.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  background: transparent;
  font-size: 1em;
  cursor: pointer;
  color: ${p => p.theme.text};
  font-family: ${p => p.theme.font};

  border: 1px solid ${p => p.theme.text};
  padding: 0.5em 1em;
  border-radius: 6px;

  transition: all 200ms;

  :hover {
    border-color: ${p => p.theme.primary};
    color: ${p => p.theme.primary};
  }
`

const Button = ({ children, href, lensHandle, lensId, ...props }) => {

  if (href) {
    return <a target="_blank" rel="noreferrer" href={href}>
      <StyledButton {...props}>{children}</StyledButton>
    </a>
  }
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button;