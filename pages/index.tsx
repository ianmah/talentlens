import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Container from '../components/Container'

const Home: NextPage = () => {
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
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to Talent Lens
        </h1>
      </main>

      <footer className={styles.footer}>
        <a href="https://twitter.com/irislabsxyz" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at Iris Labs
        </a>
      </footer>
    </Container>
  );
};

export default Home;
