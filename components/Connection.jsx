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
`

export const StyledButton = style(Button)`
  margin-left: auto;
  padding: 0.4em 0.5em;
`

export const Username = style.span`
  color: ${p => p.theme.textSecondary};
  padding-top: 2px;
  display: block;
  b {
    color: ${p => p.theme.text};
  }
`

const LensConnection = ({ profile, type }) => {
  const router = useRouter()
  const [talentProfile, setTalentProfile] = useState({})
  const profileImgSrc = profile.picture?.original?.url.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')

  useEffect(() => {
    if (type === 'lens') {
      const wallet = profile.ownedBy
      const getProfile = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/talent/${wallet}`, {})
          const {
            name,
            followers_count,
            following_count,
            profile_picture_url,
            wallet_address,
            headline
          } = res.data.talent
    
          setTalentProfile({
            name,
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
      <Username><b>{profile.name}</b> @{profile.handle}</Username>
      <Username>{talentProfile.username ? `@${talentProfile.username}` : 'No Talent profile'}</Username>
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