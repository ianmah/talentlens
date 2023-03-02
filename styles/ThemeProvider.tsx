import React from 'react'
import { ThemeProvider } from 'styled-components'

type Props = {
  children: React.ReactNode
}

const PRIMITIVES = {
  primary01: '#FFFFFF',
  primary02: '#CCCED1',
  primary03: '#AAADB3',
  primary04: '#71767B',
  surface01: '#1C1D1F', 
  surface02: '#232427',
  primary: '#BBED55',
}

const theme = {
  color: PRIMITIVES,
  primary: PRIMITIVES.primary,
  text: PRIMITIVES.primary01,
  background: '#131415',
}

export default ({ children }: Props) => <ThemeProvider theme={theme}>{children}</ThemeProvider>