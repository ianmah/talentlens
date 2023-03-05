import { useEffect, useState } from 'react'
import style from 'styled-components'
import { useRouter } from 'next/router'
import axios from 'axios'

import { API_URL } from '../util/api'
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
  b {
    color: ${p => p.theme.text};
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

const UserLink = style.a`
`

const LensConnection = ({ profile, type }) => {
  const router = useRouter()
  const [talentProfile, setTalentProfile] = useState({})
  const profileImgSrc = profile.picture?.original?.url.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')

  useEffect(() => {
    if (type === 'lens') {
      const wallet = profile.ownedBy.toLowerCase()
      const getProfile = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/talent/${wallet}`, {})
          const {
            name,
            username,
            followers_count,
            following_count,
            profile_picture_url,
            wallet_address,
            headline
          } = res.data.talent

          setTalentProfile({
            name,
            username,
            followers_count,
            following_count,
            profile_picture_url,
            wallet_address,
            headline
          })
        } catch (e) {
          return
        }
      }
      getProfile()
    }
  }, [type, setTalentProfile])

  const handleClick = () => {
    if (talentProfile.username) {
      router.push(`/profile/${talentProfile.username}`)
    }
  }

  return <Profile>
    <ProfileImg size='50px' src={profileImgSrc} />
    <UsernameContainer
      onClick={handleClick}
    >
      <b>{profile.name}</b><UserLink> {talentProfile.username && `✦ @${talentProfile.username}`}</UserLink>
      <Username>@{profile.handle}</Username>
    </UsernameContainer>
    <StyledButton
      title="View on LensFrens"
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.lensfrens.xyz/${profile.handle}`}
    >
      Follow
    </StyledButton>
  </Profile>
}

export default LensConnection