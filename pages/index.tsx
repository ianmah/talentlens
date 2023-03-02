import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useLazyQuery, gql } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '../components/Container'
import Footer from '../components/Footer'

const GET_PROFILES = gql`
query Profiles {
  profiles(request: { ownedBy: ["0x374002dD7f555D037F7566cC75ce563765a2F456"], limit: 10 }) {
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

const Home: NextPage = () => {
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false)
  const [getProfiles, { loading, error, data }] = useLazyQuery(GET_PROFILES)
  const { address, isConnected } = useAccount()
  const [profile, setProfile] = useState<any>({})

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
      getProfiles();
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [
    address,
    setIsDefinitelyConnected,
    isConnected,
    getProfiles
  ]);

  useEffect(() => {
    if (!data?.profiles.items.length) {
      return
    }

    setProfile(data.profiles.items[0])

  }, [data?.profiles.items])

  return (
    <Container>
      <Head>
        <title>Talent Lens</title>
        <meta
          name="description"
          content="Talent Protocol x Lens social app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {!isDefinitelyConnected && <ConnectButton />}

        <h1>
          Welcome to Talent Lens
        </h1>
        {isDefinitelyConnected && <a href={`/profile/${profile.handle}`}>View your profile, {address}</a>}
        <p>{data && JSON.stringify(profile)}</p>
      </main>

      <Footer />
    </Container>
  );
};

export default Home;
