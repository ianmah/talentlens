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
      console.log(connection)
      return (
        <Profile key={connection.username || connection.lensHandle}>
          <ProfileImg size='50px' src={connection.profile_picture_url} />
          <UsernameContainer>
            <b onClick={() => connection.username ? router.push(`/profile/${connection.username}`) : {}}>{connection.name}</b>
            {connection.username &&
              <Button
              type='mini-talent'
              onClick={() => router.push(`/profile/${connection.username}`)}>
                @{connection.username}
              </Button>
            }
            {connection.lensHandle &&
              <Button
              type='mini-lens'
              lensId={connection.lensId}
              username={connection.lensHandle}
              isFollowed={connection.isFollowedByMe}
              href={`https://lensfrens.xyz/${connection.lensHandle}`}>
                @{connection.lensHandle}
              </Button>
            }
          </UsernameContainer>
        </Profile>
      )
    })}
  </>
}

export default Connections