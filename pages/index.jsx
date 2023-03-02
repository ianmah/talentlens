import Head from 'next/head'
import { API_URL } from '../util/api'
import Container from '../components/Container'
import Footer from '../components/Footer'

const Home = () => {
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
        <h1>Welcome</h1>
      </main>

      <Footer />
    </Container>
  );
};

export default Home;
