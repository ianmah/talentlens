import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useAccount } from 'wagmi'
import type { NextPage } from 'next'
import Head from 'next/head'
import { API_URL } from '../util/api'
import Container from '../components/Container'
import Footer from '../components/Footer'

const Home: NextPage = () => {
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false)
  const { address, isConnected } = useAccount()
  const [talentProfile, setTalentProfile] = useState({})

  useEffect(() => {
    if (!address) return;
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/talent/${address}`, {})
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
      } catch (e) {
        console.log(e.message)
      }
    }
    getData()
  }, [setTalentProfile, address])

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [
    address,
    setIsDefinitelyConnected,
    isConnected,
  ]);

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
        <br/>
        <br/>
        <h1>
          Welcome to Talent Lens
        </h1>
        
        {talentProfile.username ? <a href={`/profile/${talentProfile.username}`}>View your profile, {address}</a> : <>
        <p>You don't seem to have a Talent profile.</p>
        </>}
      </main>

      <Footer />
    </Container>
  );
};

export default Home;
