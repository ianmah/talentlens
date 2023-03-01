import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import { API_URL } from '../../util/api'

export async function getServerSideProps() {
  const res = await axios.get(API_URL + "/api/user", {})

  const {
    name,
    followers_count,
    following_count,
    profile_picture_url,
    wallet_address
  } = res.data.talent
  
  return {
    props: {
      name,
      followers_count,
      following_count,
      profile_picture_url,
      wallet_address
    }
  }
}

const Profile = ({
      name,
      followers_count,
      following_count,
      profile_picture_url,
      wallet_address
    }) => {
  const router = useRouter()
  const { username } = router.query

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

        <h1>
          {username} {name}
        </h1>
      </main>

      <Footer />
    </Container>
  );
};

export default Profile;
