import { useEffect, useState } from 'react'
import style from 'styled-components'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAccount } from 'wagmi'

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
    const { profile, setProfile } = useProfile()

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
        {!profile.isAuthenticated && <SignInWithLens/>}
        {profile.username && <p>@{profile.username}</p>}
        <StyledProfileImg size='24px' src={profile.profile_picture_url} />
    </Container>
}

export default Navbar