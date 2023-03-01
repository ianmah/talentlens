import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
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

const Profile = ({}) => {
  const router = useRouter()
  const { username } = router.query
  const [talentProfile, setTalentProfile] = useState({})
  const [lensProfile, setLensProfile] = useState({})
  const [getProfiles, { loading, error, data }] = useLazyQuery(GET_PROFILES, {
    variables: {
      request: {
          ownedBy: [talentProfile.wallet_address],
          limit: 1,
      },
    }
  })

  useEffect(() => {
    if (!username) return;
    const getData = async () => {
      const res = await axios.get(`${API_URL}/api/talent/${username}`, {})
      const {
        name,
        followers_count,
        following_count,
        profile_picture_url,
        wallet_address
      } = res.data.talent
  
      setTalentProfile({
        name,
        followers_count,
        following_count,
        profile_picture_url,
        wallet_address
      })
    }
    getData()
  }, [setTalentProfile, getProfiles, username])

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

        <h1>
          {username} {talentProfile.name}
        </h1>
        <p>{data && JSON.stringify(data)}</p>
      </main>

      <Footer />
    </Container>
  );
};

export default Profile;
