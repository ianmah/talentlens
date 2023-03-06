import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import style from 'styled-components'

import GET_POSTS from '../util/queries/getPosts'
import ProfileImg from './ProfileImg'
import { UsernameContainer } from './Connection'

const Post = style.div`
  background: ${p => p.theme.color.surface01};
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
  display: flex;
  gap: 10px;
`

const Posts = ({ profile, profileId }) => {  
  const [getPosts, { loading, error, data }] = useLazyQuery(gql`${GET_POSTS}`, {
    variables: {
      request: {
        profileId,
        publicationTypes: ['POST'],
        limit: 5,
      },
    }
  })
  
  useEffect(() => {
    if(profileId) {
      getPosts()
    }
  }, [profileId, getPosts])
  
  return ( 
    <>
      {
        data && data.publications.items.map(pub => {
          
          const profileImgSrc = pub.profile.picture?.original?.url.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
          return <Post key={profileImgSrc}>
            <div>
              <ProfileImg src={profileImgSrc} size="50px" />
            </div>
            <div>
              <UsernameContainer><b>{pub.profile.name}</b></UsernameContainer>
              <>{pub.metadata.content}</>
            </div>
          </Post>
        })
      }
    </>
  )
}

export default Posts