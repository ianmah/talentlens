import style from 'styled-components'

import ProfileImg from './ProfileImg'
import Button from './Button'

export const Profile = style.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 1em;
`

export const UsernameContainer = style.div`
  :hover {
    cursor: pointer;
  }
`

export const StyledButton = style(Button)`
  margin-left: auto;
  padding: 0.4em 0.5em;
`

export const Username = style.span`
  color: ${p => p.theme.textSecondary};
  padding-top: 2px;
  display: block;
`

const LensConnection = ({ profile }) => {
  console.log(profile)
  const profileImgSrc = profile.picture?.original?.url.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
  
  return <Profile>
    <ProfileImg size='50px' src={profileImgSrc} />
    <UsernameContainer onClick={() => router.push(`/profile/${profile.username}`)}>
      <b>{profile.name}</b>
      <Username>{profile.handle}</Username>
    </UsernameContainer>
      <StyledButton
        title="View on LensFrens"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.lensfrens.xyz/${profile.handle}`}
      >
        {profile.handle}
      </StyledButton>
  </Profile>
}

export default LensConnection