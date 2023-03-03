import { useState, useEffect } from 'react'
import axios from 'axios'
import style from 'styled-components'

import { API_URL } from '../util/api'

const Connections = ({ username, type }) => {
  const [connections, setConnections] = useState([])

  useEffect(() => {
    if (type === 'followers-talent') {
      const getData = async () => {
        const res = await axios.get(`${API_URL}/api/connections/${username}?type=following`, {})
        console.log(res.data)
        setConnections(res.data.connections)
      }
      getData()
      return 
    }
    if (type === 'following-talent') {
      return <p>hi ing t</p>
    }
    if (type === 'followers-lens') {
      return <p>hi ers L</p>
    }
    if (type === 'following-lens') {
      return <p>hi ing L</p>
    }
  }, [])

  if (type === 'followers-talent') {
    return <>
    {
      connections.map(connection => {
        return <p>{connection.username}</p>
      })
    }</>
  }
  if (type === 'following-talent') {
    return <p>hi ing t</p>
  }
  if (type === 'followers-lens') {
    return <p>hi ers L</p>
  }
  if (type === 'following-lens') {
    return <p>hi ing L</p>
  }
  return <>
  </>
}

export default Connections