import { createContext, useContext, useState } from 'react'

const Context = createContext('');

export default function useProfile() {
    return useContext(Context)
}

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState({})
  return (
    <Context.Provider
        value={{profile, setProfile}} >
        {children}
    </Context.Provider>
  );
}