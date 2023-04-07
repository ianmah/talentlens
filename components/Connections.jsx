import { useState, useEffect } from 'react'
import axios from 'axios'
import style from 'styled-components'
import { useRouter } from 'next/router'

import useLensClient from '../util/useLensClient'
import { API_URL } from '../util/api'
import ProfileImg from './ProfileImg'
import Button from './Button'


function sortConnections (x, y) {
  if (x.lensHandle && x.username) {
    return -1;
  }
  if (y.lensHandle && y.username) {
    return 1;
  }
  if (x.lensHandle && !y.lensHandle) {
      return -1;
  }
  if (!x.lensHandle && y.lensHandle) {
      return 1;
  }
  return 0;
}

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
  const { lensClient } = useLensClient()
  const [connections, setConnections] = useState([])

  useEffect(() => {
    if (type === 'following') {
      const getData = async () => {
        if (!address) {
          const res = await axios({
            method: 'POST',
            url: `${API_URL}/api/following/${username}`,
            headers: {
              'Content-Type': 'application/json'
            },
          })
          setConnections(res.data.length ? res.data : [])
          return;
        }
        const following = await lensClient.profile.allFollowing({ address })
        try {
          const res = await axios({
            method: 'POST',
            url: `${API_URL}/api/following/${username}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: following.items
          })
          const walletMap = res.data
          const profiles = await lensClient.profile.fetchAll({ 
            ownedBy: Object.keys(walletMap),
          })
          profiles.items.forEach(profile => {
            walletMap[profile.ownedBy.toLowerCase()] = {
              ...walletMap[profile.ownedBy.toLowerCase()],
              lensHandle: profile.handle,
              lensId: profile.id,
              isFollowedByMe: profile.isFollowedByMe
            }
          })
          
          const data = Object.values(walletMap).sort((x, y) => sortConnections(x, y))

          setConnections(data)
          // const res = await axios.get(`${API_URL}/api/following/${username}?address=${address}`, { followers })
          // setConnections(res.data.length ? res.data : [])
        } catch (e) {
          console.log('error fetching', e)
        }
      }
      getData()
      return
    }
    if (type === 'followers') {
      const getData = async () => {
        if (!profileId) {
          try {
            const res = await axios({
              method: 'POST',
              url: `${API_URL}/api/followers/${username}`,
              headers: {
                'Content-Type': 'application/json'
              },
            })
            setConnections(res.data.length ? res.data : [])
          } catch (e) {
            console.log('error fetching', e)
          }
          
          return;
        }
        const followers = await lensClient.profile.allFollowers({ profileId })
        // const followers = {
        //   items: FOLLOWERS
        // }
        
        try {
          const res = await axios({
            method: 'POST',
            url: `${API_URL}/api/followers/${username}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: followers.items
          })
          const walletMap = res.data
          const profiles = await lensClient.profile.fetchAll({ 
            ownedBy: Object.keys(walletMap),
          })

          profiles.items.forEach(profile => {
            walletMap[profile.ownedBy.toLowerCase()] = {
              ...walletMap[profile.ownedBy.toLowerCase()],
              lensHandle: profile.handle,
              lensId: profile.id,
              isFollowedByMe: profile.isFollowedByMe
            }
          })
          
          const data = Object.values(walletMap).sort((x, y) => sortConnections(x, y))

          setConnections(data)
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
            <b onClick={() => connection.username ? router.push(`/profile/${connection.username}`) : {}}>{connection.name || connection.lensHandle || connection.username}</b>
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
              isFollowedByMe={connection.isFollowedByMe}>
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