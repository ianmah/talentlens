import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '../../components/Container'
import Footer from '../../components/Footer'

const Profile: NextPage = () => {
  const router = useRouter()
  const { username } = router.query

  return (
    <Container>
      <Head>
        <title>{username} ✦ Talentlens</title>
        <meta
          name="description"
          content="Talent Protocol x Lens social app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ConnectButton />

        <h1>
          {username}
        </h1>
      </main>

      <Footer/>
    </Container>
  );
};

export default Profile;
