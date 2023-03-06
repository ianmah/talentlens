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
import Posts from '../../components/Posts'
import Connections from '../../components/Connections'
import ProfileImg from '../../components/ProfileImg'
import { API_URL } from '../../util/api'
import GET_PROFILES from '../../util/queries/getProfiles'

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
  line-height: 1.35em;
  margin-bottom: 1em;
`

const Stats = style.div`
  margin: 12px 0;
`

const H3 = style.h3`
  color: ${p => p.theme.color.primary04};
  font-weight: 400;
  font-size: 15px;
  margin: 6px 0;
`

const Stat = style.p`
  color: ${p => p.theme.color.primary04};
  font-weight: 400;
  display: inline-block;
  margin: 0 16px 12px 0;
  text-decoration: underline rgba(255, 255, 255, 0);
  transition: text-decoration-color 200ms;
  text-underline-offset: 4px;

  ${p => p.onClick && `
  &:hover {
    text-decoration: underline rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  `}
  
  b {
    color: ${p => p.theme.text};
  }
`

const Menu = style.div`
  display: flex;
  gap: 14px;
  margin-bottom: 1em;
`

const MenuItem = style.a`
  color: ${p => p.theme.text};
  font-weight: bold;
  font-size: 18px;
  ${p => p.selected && `
    text-decoration: underline rgba(187, 237, 85, 1);
  `}
`

const Profile = ({ }) => {
  const router = useRouter()
  const { username } = router.query
  const [talentProfile, setTalentProfile] = useState({})
  const [getProfiles, { loading, error, data }] = useLazyQuery(gql`${GET_PROFILES}`, {
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
      setTalentProfile(res.data.talent)
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

        {
          talentProfile.username
          ? <>
            <Header>
              <ProfileImg src={talentProfile.profile_picture_url} />
              <div>
                <H1>
                  {talentProfile.name}
                </H1>
                <ButtonGroup>
                  <Button>{username}</Button>
                  <Button
                    title="View on LensFrens"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://lensfrens.xyz/${lensProfile.handle}`}
                  >
                    {lensProfile.handle}
                  </Button>
                </ButtonGroup>
              </div>
            </Header>
    
            {talentProfile.headline && <Headline>--E {talentProfile.headline}</Headline>}
    
            <Stats>
              <H3>On Talent Protocol</H3>
              <Stat
                onClick={() => {
                  router.push(`/profile/${username}/?followers=talent`, undefined, { shallow: true })
                }}
              >
                <b>{talentProfile.followers_count}</b> Followers
              </Stat>
              <Stat>
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

            <Menu>
              <MenuItem
                href="#"
                selected={!(router.query.followers || router.query.following)}
                onClick={() => 
                  router.replace(`/profile/${username}`, undefined, { shallow: true })
                }
              >
                posts
              </MenuItem>
              {router.query.followers && <MenuItem href="#" selected>followers</MenuItem>}
              {router.query.following && <MenuItem href="#" selected>following</MenuItem>}   
            </Menu>

            <Posts profileId={lensProfile.id} />
    
            {(router.query.followers || router.query.following) && 
              <Connections
                username={username}
                profileId={lensProfile.id}
                address={talentProfile.wallet_address}
                type={router.query.followers
                  ? `followers-${router.query.followers}`
                  : `following-${router.query.following}`
                }
              />
            }
          </>
          : <></>
        }
      </main>

      <Footer />
    </Container>
  );
};

export default Profile;
