import { createContext, useContext, useState } from 'react'

const Context = createContext('');

export default function useLensClient() {
    return useContext(Context)
}

export function LensProvider({ client, children }) {
    const [lensClient, setClient] = useState(client)
    const [lensKey, setKey] = useState('')
  return (
    <Context.Provider
    value={{lensClient, setClient, lensKey, setKey}} >
        {children}
    </Context.Provider>
  );
}