import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import style from 'styled-components'

import GET_POSTS from '../util/queries/getPosts'
import ProfileImg from './ProfileImg'
import { UsernameContainer } from './Connection'

const Post = style.a`
  background: ${p => p.theme.color.surface01};
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
  display: flex;
  gap: 10px;
  cursor: pointer;
  transition: all 200ms;
  &:hover {
    background: ${p => p.theme.color.surface02};
    text-decoration: none;
  }
  text-decoration: none;
  color: ${p => p.theme.textSecondary};
`

const Content = style.div`
  margin: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`

const Posts = ({ handle, profileId }) => {  
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
          return <Post
              key={pub.id}
              href={`https://lenster.xyz/posts/${pub.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            <div>
              <ProfileImg src={profileImgSrc} size="50px" />
            </div>
            <div>
              <UsernameContainer><b>{pub.profile.name}</b></UsernameContainer>
              <Content>{pub.metadata.content}</Content>
            </div>
          </Post>
        })
      }
      {data && !data.publications.items.length && `No lens posts by ${handle}`}
    </>
  )
}

export default Posts