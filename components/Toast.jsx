import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Check from '../assets/Check'
import Spinner from '../assets/Spinner'
// import Error from '../assets/Error'
import useProfile from '../util/useProfile'

const ToastDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: ${p => p.theme.color.surface01};
    position: fixed;
    z-index: 10000;
    bottom: ${p => (p.shown ? '40px' : '-100px')};
    opacity: ${p => (p.shown ? '100%' : '0%')};
    transition: all 0.75s ease;
    margin-left: auto;
    margin-right: auto;
    padding: 0.25em 1em 0.25em 0.5em;
    right: 3em;
    border-radius: 6px;
    word-break: break-word;
    ${p => p.type === 'success' && `border-left: #4DD06A 4px solid;`}
    ${p => p.type === 'loading' && `border-left: ${p.theme.secondary} 4px solid;`}
    ${p => p.type === 'error' && `border-left: ${p.theme.error} 4px solid;`}
    box-shadow: 0px 2px 9px rgba(12, 12, 12, 0.5);
`
const ToastText = styled.p`
    text-align: center;
    color: ${p => p.theme.text};
`

export default function Toast() {
  const [showToast, setShowToast] = useState(false)
  const { toastText, toastType } = useProfile()

  useEffect(() => {
    if (toastText) {
      setShowToast(true)
    } else {
      setShowToast(false)
    }

    if (toastType !== 'loading') {
        const toastTimeout = setTimeout(() => {
          setShowToast(false)
        }, 4000)
        return () => {
          clearTimeout(toastTimeout)
        }
    }
  }, [toastText, toastType])

  return (
    <ToastDiv shown={showToast} type={toastType}>
        {toastType === 'success' && <Check/>}
        {toastType === 'loading' && <Spinner/>}
        {/* {toastType === 'error' && <Error/>} */}
        <ToastText>{toastText}</ToastText>
    </ToastDiv>
  )
}