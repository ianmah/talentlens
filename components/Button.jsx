import style from 'styled-components'
import useLensClient from '../util/useLensClient'

const StyledButton = style.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  background: transparent;
  font-size: 1em;
  cursor: pointer;
  color: ${p => p.theme.textSecondary};
  font-family: ${p => p.theme.font};

  border: 1px solid ${p => p.theme.textSecondary};
  padding: 0.5em 1em;
  border-radius: 6px;

  transition: all 200ms;

  :hover {
    border-color: ${p => p.secondary ? p.theme.secondary : p.theme.primary};
    color: ${p => p.secondary ? p.theme.secondary : p.theme.primary};
  }
`

const Button = ({ children, href, lensHandle, lensId, ...props }) => {
  const { lensClient } = useLensClient()

  const handleFollow = async () => {
    const followRes = await lensClient.proxyAction.freeFollow(lensId)
    console.log(followRes)
  }

  if (lensId) {
    return <StyledButton onClick={handleFollow} {...props}>{children}</StyledButton>
  }

  if (href) {
    return <a target="_blank" rel="noreferrer" href={href}>
      <StyledButton {...props}>{children}</StyledButton>
    </a>
  }
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button;