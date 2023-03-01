import React from 'react'
import { ThemeProvider } from 'styled-components'

type Props = {
  children: React.ReactNode
}

const theme = {
  primary: '#ABFE2C',
  background: '#131415',
}

export default ({ children }: Props) => <ThemeProvider theme={theme}>{children}</ThemeProvider>