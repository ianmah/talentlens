import { useState, useEffect } from 'react'
import axios from 'axios'
import style from 'styled-components'
import { useRouter } from 'next/router'

import { API_URL } from '../util/api'
import ProfileImg from './ProfileImg'
import Button from './Button'
import Connection from './Connection'

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

const TalentHandle = style.span`
  color: ${p => p.theme.textSecondary};
`

const LensHandle = style.span`
  color: ${p => p.theme.primary};
`


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
            <Username><TalentHandle>{talentHandle}</TalentHandle> {talentHandle && lensHandle && '|'} <LensHandle>{lensHandle}</LensHandle></Username>
          </UsernameContainer>
        </Profile>
      )
    })}
  </>
}

export default Connections