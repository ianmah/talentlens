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
  .follow {
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
  :hover .follow {
    opacity: 100;
    text-decoration: none;
  }
  ` : `.follow {
    display: none;
  }`
  }
`

const FollowButton = ({ type, username, ...props }) => {
  if(!username) return <></>;
  return <StyledButton type={type} {...props}>
    <span>@{username}</span><span className='follow'>Follow</span>
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
  }, [type, username, profileId, address])

  return <>
    {connections.map(connection => {
      return (
        <Profile key={connection.username || connection.lensHandle}>
          <ProfileImg size='50px' src={connection.profile_picture_url} />
          <UsernameContainer>
            <b onClick={() => connection.username ? router.push(`/profile/${connection.username}`) : {}}>{connection.name}</b>
            <FollowButton
              type='talent'
              username={connection.username}
              onClick={() => router.push(`/profile/${connection.username}`)} />
            <FollowButton
              type='lens'
              lensId={connection.lensId}
              username={connection.lensHandle}
              isFollowed={connection.isFollowedByMe}
              href={`https://lensfrens.xyz/${connection.lensHandle}`}/>
          </UsernameContainer>
        </Profile>
      )
    })}
  </>
}

export default Connections