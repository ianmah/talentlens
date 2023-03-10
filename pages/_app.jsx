import { useEffect, useState } from 'react'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import ThemeProvider from '../styles/ThemeProvider'
import GlobalStyles from '../styles/GlobalStyle'

const client = new ApolloClient({
  uri: 'https://api.lens.dev/',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const [wagmiClient, setWagmiClient] = useState()
  const [chains, setChains] = useState()

  useEffect(() => {
    const { chains, provider, webSocketProvider } = configureChains(
      [
        polygon,
      ],
      [
        alchemyProvider({
          apiKey: process.env.ALCHEMY_KEY || '',
        }),
        publicProvider(),
      ]
    );

    const { connectors } = getDefaultWallets({
      appName: 'Talent Lens',
      chains,
    });

    const wagmiClient = createClient({
      autoConnect: true,
      connectors,
      provider,
      webSocketProvider,
    });

    setWagmiClient(wagmiClient)
    setChains(chains)

  }, [setWagmiClient, setChains])

  return (
    <ThemeProvider>
      <GlobalStyles />
      {
        wagmiClient
          ? <>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider chains={chains}>
                <ApolloProvider client={client}>
                  <ThemeProvider>
                    <GlobalStyles />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </ApolloProvider>
              </RainbowKitProvider>
            </WagmiConfig>
          </>
          : <p>loading</p>
      }
    </ThemeProvider>
  );
}

export default MyApp;
