import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import Head from 'next/head'
import style from 'styled-components'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import Posts from '../../components/Posts'
import Connections from '../../components/Connections'
import Navbar from '../../components/Navbar'
import ProfileImg from '../../components/ProfileImg'
import { API_URL } from '../../util/api'
import useLensClient from '../../util/useLensClient'
import Toast from '../../components/Toast'

const Spacer = style.pre`
  height: 3em;
`

const Header = style.div`
  display: flex;
  gap: 1em;
  margin: 1em 0;
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
  const { lensClient } = useLensClient()
  const { isConnected } = useAccount()
  const { username } = router.query
  const [talentProfile, setTalentProfile] = useState({})
  const [notFound, setNotFound] = useState(false)
  const [lensPopulated, setLensPopulated] = useState(false)
  const [lensProfile, setLensProfile] = useState({})
  // const lensProfile = data && data.profiles.items[0] || {}
  const showFollowing = (router.query.following !== undefined)
  const showFollowers = (router.query.followers !== undefined)
  const showConnections = (showFollowers || showFollowing)

  useEffect(() => {
    if (!username) return;
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/talent/${username}`, {})
        setTalentProfile(res.data.talent)
      } catch (e) {
        console.log('no talent profile found')
        setNotFound(true)
      }
    }
    getData()
  }, [setTalentProfile, username])

  useEffect(() => {
    const getData = async () => {
      if (talentProfile.wallet_address) {
        const res = await lensClient.profile.fetchAll({
          ownedBy: [talentProfile.wallet_address]
        })
        setLensProfile(res.items[0] || {})
        setLensPopulated(true)
      }
    }
    getData()
  }, [lensProfile.handle, talentProfile.wallet_address])

  const title = `${username} ✦ Talentlens`

  if (notFound) {
    return <Container>
      <Head>
        <title>{title}</title>
        <meta
          name={title}
          content="Talent Protocol x Lens social app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <br/>
        <br/>
        <br/>
        <br/>
        <H1>
          Profile {username} not found :(
        </H1>
      </main>
    </Container>
  }

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
        {isConnected ? <Navbar/> : <ConnectButton />}

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
                  <Button
                    secondary
                    title="View on Talent Protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://beta.talentprotocol.com/u/${username}`}
                  >
                    @{username}
                  </Button>
                  {lensProfile.handle && <Button
                    type='lens'
                    lensId={lensProfile.id}
                    username={lensProfile.handle}
                    isFollowedByMe={lensProfile.isFollowedByMe}>
                    @{lensProfile.handle}
                  </Button>}
                </ButtonGroup>
              </div>
            </Header>
    
            {talentProfile.headline && <Headline>--E {talentProfile.headline}</Headline>}
    
            <Stats>
              <H3>On Talent Protocol</H3>
              <Stat
                onClick={() => {
                  router.push(
                    `/profile/${username}/?followers`,
                    undefined,
                    { shallow: true }
                  )
                }}
              >
                <b>{talentProfile.subscribers_count}</b> Followers
              </Stat>
              <Stat
                onClick={() => {
                  router.push(
                    `/profile/${username}/?following`,
                    undefined,
                    { shallow: true }
                  )
                }}
              >
                <b>{talentProfile.subscribing_count}</b> Following
              </Stat>
              {lensProfile.stats && <>
                <H3>On Lens Protocol</H3>
                <Stat
                  onClick={() => {
                    router.push(
                      `/profile/${username}/?followers`,
                      undefined,
                      { shallow: true }
                    )
                  }}
                >
                  <b>{lensProfile.stats.totalFollowers}</b> Followers
                </Stat>
                <Stat
                  onClick={() => {
                    router.push(
                      `/profile/${username}/?following`,
                      undefined,
                      { shallow: true }
                    )
                  }}
                >
                  <b>{lensProfile.stats.totalFollowing}</b> Following
                </Stat>
              </>}
            </Stats>

            <Menu>
              <MenuItem
                href="#"
                selected={!showConnections}
                onClick={() => router.replace(`/profile/${username}`, undefined, { shallow: true })}
              >
                posts
              </MenuItem>
              <MenuItem
                href="#"
                selected={showFollowers}
                onClick={() => router.replace(`/profile/${username}?followers`, undefined, { shallow: true })}
              >
                followers
              </MenuItem>
              <MenuItem
                href="#"
                selected={showFollowing}
                onClick={() => router.replace(`/profile/${username}?following`, undefined, { shallow: true })}
              >
                following
              </MenuItem>
            </Menu>

            {!showConnections && <Posts handle={lensProfile.handle} profileId={lensProfile.id} />}
    
            {showConnections && 
              <Connections
                username={username}
                profileId={lensProfile.id}
                address={talentProfile.wallet_address}
                type={showFollowers ? `followers` : `following`}
                lensPopulated={lensPopulated}
              />
            }
          </>
          : <></>
        }
      </main>

      <Footer />
      <Toast />
    </Container>
  );
};

export default Profile;
