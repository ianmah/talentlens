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
`

const StyledButton = style(Button)`
  margin-left: auto;
  padding: 0.4em 0.5em;
`

const Username = style.span`
  color: ${p => p.theme.textSecondary};
  padding-top: 2px;
  display: block;
`


const Connections = ({ username, type }) => {
  const router = useRouter()
  const [connections, setConnections] = useState([])

  useEffect(() => {
    if (type === 'followers-talent') {
      const getData = async () => {
        const res = await axios.get(`${API_URL}/api/connections/${username}?type=following`, {})
        setConnections(res.data.length ? res.data : [])
      }
      getData()
      return 
    }
    if (type === 'following-talent') {
      const getData = async () => {
        const res = await axios.get(`${API_URL}/api/connections/${username}?type=follower`, {})
        setConnections(res.data.length ? res.data : [])
      }
      getData()
      return
    }
    if (type === 'followers-lens') {
      return
    }
    if (type === 'following-lens') {
      return
    }
  }, [type])

  if (type === 'followers-talent' || type === 'following-talent') {
    return <>
      {connections.map(connection => (
        <Profile key={connection.username}>
          <ProfileImg size='50px' src={connection.profile_picture_url} />
          <UsernameContainer onClick={() => router.push(`/profile/${connection.username}`)}>
            <b>{connection.name}</b>
            <Username>{connection.username}</Username>
          </UsernameContainer>
          {connection.lensHandle && <StyledButton>{connection.lensHandle}</StyledButton>}
        </Profile>
      ))}
    </>
  }
  if (type === 'followers-lens') {
    return <p>hi ers L</p>
  }
  if (type === 'following-lens') {
    return <p>hi ing L</p>
  }
  return <></>
}

export default Connections