import { useState, useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import axios from 'axios'
import style from 'styled-components'
import { useRouter } from 'next/router'

import { API_URL } from '../util/api'
import ProfileImg from './ProfileImg'
import Button from './Button'
import Connection from './Connection'
import GET_FOLLOWING from '../util/queries/getFollowing'

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
  const [getFollowing, getFollowingRes] = useLazyQuery(gql`${GET_FOLLOWING}`, {
    variables: {
      request: {
        address,
      },
    }
  })

  useEffect(() => {
    if (type === 'following-talent') {
      const getData = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/connections/${username}?type=follower`, {})
          setConnections(res.data.length ? res.data : [])
        } catch (e) {

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
    if (type === 'following-lens') {
      getFollowing()
      return
    }
  }, [type, username, getFollowing, profileId])

  if (type === 'followers' || type === 'following-talent' || type === 'followers-lens') {
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
  
  if (type === 'following-lens') {
    return <>
      {
        getFollowingRes.data && getFollowingRes.data.following.items.map(follower => (
          <Connection
            profile={follower.profile}
            key={follower.profile.ownedBy + follower.profile.handle}
            type="lens"
          />
        ))
      }
    </>
  }
  return <></>
}

export default Connections