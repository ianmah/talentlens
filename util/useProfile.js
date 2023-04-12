import { createContext, useContext, useState } from 'react'

const Context = createContext('');

export default function useProfile() {
    return useContext(Context)
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({})
  const [toastText, setToastText] = useState('')
  const [toastType, setToastType] = useState('')

  return (
    <Context.Provider
        value={{profile, setProfile, toastText, setToastText, toastType, setToastType}} >
        {children}
    </Context.Provider>
  );
}