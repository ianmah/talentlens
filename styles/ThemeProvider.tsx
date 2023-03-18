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
  primaryHover: '#D8FF88',
  secondary: '#7857ED',
}

const theme = {
  color: PRIMITIVES,
  primary: PRIMITIVES.primary,
  primaryHover: PRIMITIVES.primaryHover,
  secondary: PRIMITIVES.secondary,
  text: PRIMITIVES.primary01,
  textSecondary: PRIMITIVES.primary04,
  bg: '#131415',
  font: 'Acid Grotesk TP',
}

export default ({ children }: Props) => <ThemeProvider theme={theme}>{children}</ThemeProvider>