import { useState, useEffect } from 'react'
import axios from 'axios'
import style from 'styled-components'
import { useRouter } from 'next/router'

import { API_URL } from '../util/api'
import ProfileImg from './ProfileImg'
import Button from './Button'

const Profile = style.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 1em;
`

const UsernameContainer = style.div`
  :hover {
    cursor: pointer;
  }
  b {
    margin-bottom: 3px;
    display: block;
  }
`

const StyledButton = style(Button)`
  padding: 0.5em;
  margin-right: 4px;
  font-size: 12px;
  border-color: ${p => p.theme.textSecondary};
  color: ${p => p.theme.textSecondary};
  :hover {
    border-color: ${p => p.type === 'lens' ? p.theme.primary : p.theme.secondary};
    color: ${p => p.type === 'lens' ? p.theme.primary : p.theme.secondary};
  }
  ${p => p.type === 'lens' ? `
  position: relative;
  span {
    transition: opacity 100ms;
  }
  a {
    transition: opacity 100ms;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    text-decoration: none;
  }
  :hover span {
    opacity: 0;
  }
  :hover a {
    opacity: 100;
    text-decoration: none;
  }
  ` : `a {
    display: none;
  }`
  }
`

const FollowButton = ({ type, username }) => {
  if(!username) return <></>;
  return <StyledButton type={type}>
    <span>@{username}</span><a>Follow</a>
  </StyledButton>
}


const Connections = ({ username, type, profileId, address }) => {
  const router = useRouter()
  const [connections, setConnections] = useState([])

  useEffect(() => {
    if (type === 'following') {
      const getData = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/following/${username}?address=${address}`, {})
          setConnections(res.data.length ? res.data : [])
        } catch (e) {
          console.log('error fetching', e)
        }
      }
      getData()
      return
    }
    if (type === 'followers') {
      if (!profileId) return;
      const getData = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/followers/${username}?profileId=${profileId}`, {})
          setConnections(res.data.length ? res.data : [])
        } catch (e) {
          console.log('error fetching', e)
        }
      }
      getData()
      return
    }
  }, [type, username, profileId])

  return <>
    {connections.map(connection => {
      const talentHandle = connection.username ? '@' + connection.username : ''
      const lensHandle = connection.lensHandle ? '@' + connection.lensHandle : ''
      return (
        <Profile key={connection.username || connection.lensHandle}>
          <ProfileImg size='50px' src={connection.profile_picture_url || 'https://beta.talentprotocol.com/packs/media/images/648f6f70811618825dc9.png'} />
          <UsernameContainer onClick={() => router.push(`/profile/${connection.username}`)}>
            <b>{connection.name}</b>
            <FollowButton type='talent' username={connection.username} />
            <FollowButton type='lens' username={connection.lensHandle} />
          </UsernameContainer>
        </Profile>
      )
    })}
  </>
}

export default Connections