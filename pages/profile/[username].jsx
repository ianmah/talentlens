import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import style from 'styled-components'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import Connections from '../../components/Connections'
import ProfileImg from '../../components/ProfileImg'
import { API_URL } from '../../util/api'

// TODO: Move to query file
const GET_PROFILES = gql`
query($request: ProfileQueryRequest!) {
  profiles(request: $request) {
    items {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}`

const Header = style.div`
  display: flex;
  gap: 1em;
  margin: 1em 0;
  margin-top: 3em;
`

const H1 = style.h1`
  margin: 8px 0;
`

const ButtonGroup = style.div`
  display: flex;
  gap: 6px;
`

const Headline = style.div`
  font-size: 1.4em;
  margin-bottom: 1em;
`

const Stats = style.div`
  margin: 12px 0;
`

const H3 = style.h3`
  color: ${p => p.theme.color.primary04};
  font-weight: 400;
  font-size: 14px;
  margin: 6px 0;
`

const Stat = style.p`
  color: ${p => p.theme.color.primary04};
  font-weight: 400;
  font-size: 14px;
  display: inline-block;
  margin: 0 16px 12px 0;
  text-decoration: underline rgba(255, 255, 255, 0);
  transition: text-decoration-color 200ms;
  text-underline-offset: 4px;
  
  &:hover {
    text-decoration: underline rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  
  b {
    color: ${p => p.theme.text};
  }
`

const Profile = ({ }) => {
  const router = useRouter()
  const { username } = router.query
  const [talentProfile, setTalentProfile] = useState({})
  const [getProfiles, { loading, error, data }] = useLazyQuery(GET_PROFILES, {
    variables: {
      request: {
        ownedBy: [talentProfile.wallet_address],
        limit: 1,
      },
    }
  })

  const lensProfile = data && data.profiles.items[0] || {}

  useEffect(() => {
    if (!username) return;
    const getData = async () => {
      const res = await axios.get(`${API_URL}/api/talent/${username}`, {})
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
        headline: headline || 'This is a hardcoded bio until one is added to API'
      })
    }
    getData()
  }, [setTalentProfile, username])

  useEffect(() => {
    if (talentProfile.wallet_address) {
      getProfiles()
    }
  }, [getProfiles, talentProfile.wallet_address])

  const title = `${username} ✦ Talentlens`

  return (
    <Container>
      <Head>
        <title>{title}</title>
        <meta
          name={title}
          content="Talent Protocol x Lens social app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ConnectButton />

        <Header>
          <ProfileImg src={talentProfile.profile_picture_url} />
          <div>
            <H1>
              {talentProfile.name}
            </H1>
            <ButtonGroup>
              <Button>{username}</Button>
              <Button>{lensProfile.handle}</Button>
            </ButtonGroup>
          </div>
        </Header>

        <Headline>--E {talentProfile.headline}</Headline>

        <Stats>
          <H3>On Talent Protocol</H3>
          <Stat
            onClick={() => {
              router.push(`/profile/${username}/?followers=talent`, undefined, { shallow: true })
            }}
          >
            <b>{talentProfile.followers_count}</b> Followers
          </Stat>
          <Stat
            onClick={() => {
              router.push(`/profile/${username}/?following=talent`, undefined, { shallow: true })
            }}
          >
            <b>{talentProfile.following_count}</b> Following
          </Stat>
          {lensProfile.stats && <>
            <H3>On Lens Protocol</H3>
            <Stat
              onClick={() => {
                router.push(`/profile/${username}/?followers=lens`, undefined, { shallow: true })
              }}
            >
              <b>{lensProfile.stats.totalFollowers}</b> Followers
            </Stat>
            <Stat
              onClick={() => {
                router.push(`/profile/${username}/?following=lens`, undefined, { shallow: true })
              }}
            >
              <b>{lensProfile.stats.totalFollowing}</b> Following
            </Stat>
          </>}
        </Stats>

        {(router.query.followers || router.query.following) && 
          <Connections
            username={username}
            type={router.query.followers
              ? `followers-${router.query.followers}`
              : `following-${router.query.following}`
            }
          />
        }
      </main>

      <Footer />
    </Container>
  );
};

export default Profile;
