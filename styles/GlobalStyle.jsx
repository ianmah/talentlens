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
  font-size: 15px;
  background: #101113;
  padding: 0;
  margin: 0;
  font-family: Acid Grotesk TP, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif;
  color: white;
}

a {
  color: ${p => p.theme.primary};
  text-decoration: none;
  
  text-decoration: underline rgba(187, 237, 85, 0);
  transition: text-decoration-color 200ms;
  text-underline-offset: 2px;
  
  &:hover {
    text-decoration: underline rgba(187, 237, 85, 1);
  }
}
`

export default GlobalStyles;