import type { AppProps } from 'next/app'
import ThemeProvider from '../styles/ThemeProvider'
import GlobalStyles from '../styles/GlobalStyle'

function MyApp({ Component, pageProps }: AppProps) {

  return (
      <ThemeProvider>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default MyApp;
