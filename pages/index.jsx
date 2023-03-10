import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import style from 'styled-components'
import { useAccount, useDisconnect } from 'wagmi'

import { API_URL } from '../util/api'
import Container from '../components/Container'
import Footer from '../components/Footer'

const Content = style.div`
  padding-top: 25vh;
  margin-bottom: 5em;
`

const Home = () => {
  const [talentProfile, setTalentProfile] = useState({})
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (isConnected) {
      const getProfile = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/talent/${address}`, {})
          const { username } = res.data.talent
          router.push(`/profile/${username}`)
          setTalentProfile(res.data.talent)
        } catch (e) {
          console.log('no talent profile found')
          setNotFound(true)
        }}
      getProfile()
    }
  }, [address, isConnected, router])

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
        <Content>
          <h1>Welcome</h1>
          {isConnected
            ? <>
              {notFound ? <>
                No Talent profile found. <a href="#" onClick={() => disconnect()}>Switch wallets</a> or&nbsp;
              <a
                href="https://www.talentprotocol.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                create an account
              </a>.</> : 'Loading...'}
            </>
            : <p>Connect your wallet to get started --E</p>
          }
          {!isConnected && <ConnectButton />}
        </Content>
      </main>

      <Footer />
    </Container>
  );
};

export default Home;
