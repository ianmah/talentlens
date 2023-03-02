import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: 'Acid Grotesk TP';
  src: url('/fonts/AcidGroteskTP-Light.otf');
}

@font-face {
  font-family: 'Acid Grotesk TP';
  src: url('/fonts/AcidGroteskTP-Medium.otf');
  font-weight: 500;
}

@font-face {
  font-family: 'Acid Grotesk TP';
  src: url('/fonts/AcidGroteskTP-Bold.otf');
  font-weight: 700;
}

html,
body {
  background: #131415;
  padding: 0;
  margin: 0;
  font-family: Acid Grotesk TP, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif;
  color: white;
}

a {
  color: inherit;
  text-decoration: none;
}
`

export default GlobalStyles;