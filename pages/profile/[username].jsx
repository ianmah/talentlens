import { useEffect, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import style from 'styled-components'

import Web3Providers from '../../components/Web3Providers'
import UsernamePage from '../../components/UsernamePage'

const Profile = (props) => {
  return <Web3Providers>
    <UsernamePage {...props}/>
  </Web3Providers>
};

export default Profile;
