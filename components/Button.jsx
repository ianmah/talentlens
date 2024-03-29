import { useEffect, useState } from 'react'
import style from 'styled-components'
import { useAccount, useSignMessage } from 'wagmi'

import useLensClient from '../util/useLensClient'
import useProfile from '../util/useProfile'

const StyledButton = style.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  background: transparent;
  font-size: 1em;
  cursor: pointer;
  color: ${p => p.theme.textSecondary};
  font-family: ${p => p.theme.font};

  border: 1px solid ${p => p.theme.textSecondary};
  padding: 0.5em 1em;
  border-radius: 6px;

  transition: all 200ms;

  :hover {
    border-color: ${p => p.secondary ? p.theme.secondary : p.theme.primary};
    color: ${p => p.secondary ? p.theme.secondary : p.theme.primary};
  }
`

const FollowButton = style(StyledButton)`
  margin-right: 4px;
  border-color: ${p => p.theme.textSecondary};
  color: ${p => p.theme.textSecondary};
  :hover {
    border-color: ${p => p.type === 'lens' ? p.theme.primary : p.theme.secondary};
    color: ${p => p.type === 'lens' ? p.theme.primary : p.theme.secondary};
  }
  position: relative;
  span {
    transition: opacity 100ms;
  }
  .follow {
    transition: opacity 100ms;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    text-decoration: none;
  }
  :hover span {
    opacity: 0;
  }
  :hover .follow {
    opacity: 100;
    text-decoration: none;
  }
`

const MiniFollowButton = style(FollowButton)`
  padding: 0.5em;
  font-size: 12px;
`

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Button = ({ children, href, username, lensId, type, isFollowedByMe, ...props }) => {
  const { lensClient } = useLensClient()
  const { address } = useAccount()
  const { profile, setToastType, setToastText } = useProfile()

  const auth = async (signature) => {
    await lensClient.authentication.authenticate(address, signature)
    // const isAuthenticated = await lensClient.authentication.isAuthenticated()
    await lensClient.proxyAction.freeFollow(lensId)
    location.reload()
  }

  const { signMessage } = useSignMessage({
    onSuccess(data) { auth(data) },
  })
  
  const authenticate = async () => {
    const message = await lensClient.authentication.generateChallenge(address)
    signMessage({ message })
  }

  const handleFollow = async () => {
    const isAuth = await lensClient.authentication.isAuthenticated()

    if (!isAuth) {
      console.log('authing')
      await authenticate(signMessage, lensClient)
    } else {
      setToastType('loading')
      setToastText('Following user...')
      const res = await lensClient.proxyAction.freeFollow(lensId)
      while (true) {
        await sleep(500)
        const status = await lensClient.proxyAction.checkStatus(res.value)
        console.log(status)
        if (status.value?.status === 'TRANSFERRING') {
          setToastText('Indexing...')
        }
        if (status.value?.status === 'COMPLETE') {
          setToastType('success')
          setToastText('Success!')
          break;
        }
      }
      // location.reload()
    }
  }

  if (type === 'mini-lens') {
    if (isFollowedByMe) {
      return <a target="_blank" rel="noreferrer" href={`https://lenster.xyz/u/${username}`}>
        <MiniFollowButton
          type='lens'>
            <span>{children}</span>
            <span className='follow'>Following</span>
        </MiniFollowButton>
      </a>
    }
    return <MiniFollowButton
      type='lens'
      onClick={() => handleFollow()}
      {...props}>
      <span>{children}</span>
      <span className='follow'>Follow</span>
    </MiniFollowButton>
  }

  if (type === 'lens') {
    if (isFollowedByMe) {
      return <a target="_blank" rel="noreferrer" href={`https://lenster.xyz/u/${username}`}>
        <FollowButton
          type='lens'>
            <span>{children}</span>
            <span className='follow'>Following</span>
        </FollowButton>
      </a>
    }
    return <FollowButton
      type='lens'
      onClick={() => handleFollow()}
      {...props}>
      <span>{children}</span>
      <span className='follow'>Follow</span>
    </FollowButton>
  }

  if (type === 'mini-talent') {
    return <MiniFollowButton
      type='talent'
      {...props}>
      <span>{children}</span><span className='follow'>Profile</span>
    </MiniFollowButton>
  }

  if (href) {
    return <a target="_blank" rel="noreferrer" href={href}>
      <StyledButton {...props}>{children}</StyledButton>
    </a>
  }
  return <StyledButton {...props}>{children}</StyledButton>
}

const SignInWithLensButton = style(Button)`
  background: ${p => p.theme.primary};
  border-color: ${p => p.theme.primary};
  color: ${p => p.theme.bg};
  :hover {
    color: ${p => p.theme.bg};
    background-color: ${p => p.theme.primaryHover};
  }
`

export const SignInWithLens = () => {
  const { address } = useAccount()
  const { lensClient } = useLensClient()
  const { profile, setProfile } = useProfile()
  
  const auth = async (signature) => {
    await lensClient.authentication.authenticate(address, signature)
    const isAuthenticated = await lensClient.authentication.isAuthenticated()
    if (isAuthenticated) {
      setProfile({ ...profile, isAuthenticated: true })
    }
  }

  const { signMessage } = useSignMessage({
    onSuccess(data) { auth(data) },
  })

  return <SignInWithLensButton onClick={async () => {
    const message = await lensClient.authentication.generateChallenge(address)
    signMessage({ message })
  }}>
    Sign in with Lens
  </SignInWithLensButton>
}

export default Button;