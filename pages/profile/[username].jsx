import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import { API_URL } from '../../util/api'

export async function getServerSideProps() {
  const res = await axios.get(API_URL + "/api/user", {
  })
  
  return {
    props: {}, // will be passed to the page component as props
  }
}

const Profile = () => {
  const router = useRouter()
  const { username } = router.query

  const title = `${username} ✦ Talentlens`

  return (
    <Container>
      <Head>
        <title>{title}</title>
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

      <Footer />
    </Container>
  );
};

export default Profile;
