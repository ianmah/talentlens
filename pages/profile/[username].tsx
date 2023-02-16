import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '../../components/Container'

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

      <footer>
        <a href="https://twitter.com/irislabsxyz" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at Iris Labs
        </a>
      </footer>
    </Container>
  );
};

export default Profile;
