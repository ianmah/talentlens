import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

function Providers({ children }) {

  return (

           <>{ children }</>
  );
}

export default Providers;
