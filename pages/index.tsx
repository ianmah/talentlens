import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Container from '../components/Container'
import Footer from '../components/Footer'

const Home: NextPage = () => {
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
      if (isConnected) {
        setIsDefinitelyConnected(true);
      } else {
        setIsDefinitelyConnected(false);
      }
    }, [address, setIsDefinitelyConnected, isConnected]);
  
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

      <main className={styles.main}>
        {!isDefinitelyConnected && <ConnectButton />}

        <h1 className={styles.title}>
          Welcome to Talent Lens
        </h1>
        {isDefinitelyConnected && <a href="/profile/asdasd">View your profile, {address}</a>}
      </main>

      <Footer/>
    </Container>
  );
};

export default Home;
