import { useEffect, useState } from 'react'
import style from 'styled-components'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAccount } from 'wagmi'

import useLensClient from '../util/useLensClient'
import { API_URL } from '../util/api'
import useProfile from '../util/useProfile'
import ProfileImg from './ProfileImg'
import Button, { SignInWithLens } from '../components/Button'

const Container = style.div`
    height: 3em;
    display: flex;
    align-items: center;
`

const StyledProfileImg = style(ProfileImg)`
    margin-left: auto;
`

const Navbar = () => {
    const { isConnected, address } = useAccount()
    const { lensClient } = useLensClient()
    const { profile, setProfile } = useProfile()
    const [isAuth, setIsAuth] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const isAuthenticated = await lensClient.authentication.isAuthenticated()
            setIsAuth(isAuthenticated)
        }
        getData()
    }, [])

    useEffect(() => {
        if (profile.wallet_address || !isConnected) { return }
        
        const getProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/talent/${address}`, {})
                setProfile(res.data.talent)
            } catch (e) {
                console.log('no talent profile found')
            }}
        getProfile()

    }, [profile, setProfile, address, isConnected])

    return <Container>
        {!isAuth && <SignInWithLens/>} 
        <StyledProfileImg size='24px' src={profile.profile_picture_url} />
    </Container>
}

export default Navbar