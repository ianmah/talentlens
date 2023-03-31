import { useState, useEffect } from 'react'
import axios from 'axios'
import style from 'styled-components'
import { useRouter } from 'next/router'

import useLensClient from '../util/useLensClient'
import { API_URL } from '../util/api'
import ProfileImg from './ProfileImg'
import Button from './Button'


function sortConnections (x, y) {
  if (x.lensHandle && x.username) {
    return -1;
  }
  if (y.lensHandle && y.username) {
    return 1;
  }
  if (x.lensHandle && !y.lensHandle) {
      return -1;
  }
  if (!x.lensHandle && y.lensHandle) {
      return 1;
  }
  return 0;
}

const Profile = style.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 1em;
`

const UsernameContainer = style.div`
  :hover {
    cursor: pointer;
  }
  b {
    margin-bottom: 3px;
    display: block;
  }
`

const Connections = ({ username, type, profileId, address }) => {
  const router = useRouter()
  const { lensClient } = useLensClient()
  const [connections, setConnections] = useState([])

  useEffect(() => {
    if (type === 'following') {
      const getData = async () => {
        if (!address) {
          const res = await axios.get(`${API_URL}/api/following/${username}?address=${address}`, {})
          setConnections(res.data.length ? res.data : [])
          return;
        }
        const following = await lensClient.profile.allFollowing({ address })
        try {
          const res = await axios({
            method: 'POST',
            url: `${API_URL}/api/following/${username}?address=${address}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: following.items
          })
          // const res = await axios.get(`${API_URL}/api/following/${username}?address=${address}`, { followers })
          setConnections(res.data.length ? res.data : [])
        } catch (e) {
          console.log('error fetching', e)
        }
      }
      getData()
      return
    }
    if (type === 'followers') {
      const getData = async () => {
        if (!profileId) {
          try {
            const res = await axios.get(`${API_URL}/api/followers/${username}`, {})
            setConnections(res.data.length ? res.data : [])
          } catch (e) {
            console.log('error fetching', e)
          }
          
          return;
        }
        // const followers = await lensClient.profile.allFollowers({ profileId })
        const followers = {
          items: FOLLOWERS
        }
        
        try {
          const res = await axios({
            method: 'POST',
            url: `${API_URL}/api/followers/${username}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: []
          })
          const walletMap = res.data
          const profiles = await lensClient.profile.fetchAll({ 
            ownedBy: Object.keys(walletMap),
          })

          profiles.items.forEach(profile => {
            walletMap[profile.ownedBy.toLowerCase()] = {
              ...walletMap[profile.ownedBy.toLowerCase()],
              lensHandle: profile.handle,
              lensId: profile.id,
              isFollowedByMe: profile.isFollowedByMe
            }
          })
          
          const data = Object.values(walletMap).sort((x, y) => sortConnections(x, y))

          console.log(data)
          setConnections(data)
        } catch (e) {
          console.log('error fetching', e)
        }
      }
      getData()
      return
    }
  }, [type, username, profileId, address])

  return <>
    {connections.map(connection => {
      return (
        <Profile key={connection.username || connection.lensHandle}>
          <ProfileImg size='50px' src={connection.profile_picture_url} />
          <UsernameContainer>
            <b onClick={() => connection.username ? router.push(`/profile/${connection.username}`) : {}}>{connection.name}</b>
            {connection.username &&
              <Button
              type='mini-talent'
              onClick={() => router.push(`/profile/${connection.username}`)}>
                @{connection.username}
              </Button>
            }
            {connection.lensHandle &&
              <Button
              type='mini-lens'
              lensId={connection.lensId}
              username={connection.lensHandle}
              isFollowedByMe={connection.isFollowedByMe}>
                @{connection.lensHandle}
              </Button>
            }
          </UsernameContainer>
        </Profile>
      )
    })}
  </>
}

export default Connections

const FOLLOWERS = [
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xA20EeBB486ddD615fe3603d74CBdE8622186F979",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x010472",
              "name": "Lythong.eth ◱ ◱",
              "bio": "Phi x Yasai Event Quest Object. Redeem this object by completing a Phi Quest",
              "handle": "akropolis.lens",
              "ownedBy": "0xA20EeBB486ddD615fe3603d74CBdE8622186F979",
              "interests": [
                  "CRYPTO__DAOS",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "LENS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmPNNcgG5JWnWJwcDpBFcFUw9VHQRmZCmAdvhh4GFQwQVU",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 1457,
                  "totalFollowing": 2871,
                  "totalPosts": 38
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/lythong.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "lythong_art"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "Slowly but Surely"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x57Fb0520CD3CA7Dc9947b57892411338bbbD21c1",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x01558b",
              "name": null,
              "bio": null,
              "handle": "93393.lens",
              "ownedBy": "0x57Fb0520CD3CA7Dc9947b57892411338bbbD21c1",
              "interests": [],
              "picture": null,
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 1116,
                  "totalFollowing": 1258,
                  "totalPosts": 192
              },
              "followModule": null,
              "attributes": [],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x3e62ce10233c010a4ac2A1ED2742BbAFD92aF426",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x015b7d",
              "name": "Mike 🛸",
              "bio": "human",
              "handle": "sourcecode.lens",
              "ownedBy": "0x3e62ce10233c010a4ac2A1ED2742BbAFD92aF426",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmfPxG2KTQ2czr64VKonKzhBrvJKnprRTEWFnEFDujFCHT",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmSWJSEhPDAWqJVwcdfj1fECaHrz76y94N2nRqroiDDo9z",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 24,
                  "totalFollowing": 87,
                  "totalPosts": 1
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "0xmic"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Orb"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xF9155ea3e3C972875819a12ecC5A413a9119D798",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x0179da",
              "name": "Rohit 🌿",
              "bio": "No Pain No Gain ",
              "handle": "dafi2708.lens",
              "ownedBy": "0xF9155ea3e3C972875819a12ecC5A413a9119D798",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "ART_ENTERTAINMENT__MEMES",
                  "ART_ENTERTAINMENT__PHOTOGRAPHY",
                  "BUSINESS__FINANCE",
                  "CAREER",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "HOME_GARDEN__NATURE",
                  "LAW_GOVERNMENT_POLITICS__REGULATION",
                  "LENS",
                  "NEWS",
                  "TECHNOLOGY__AI_ML"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmS447rTjoo4r3hNC4BxrXEj4nPw56GaiftPwC2nnQMhfy",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 945,
                  "totalFollowing": 643,
                  "totalPosts": 868
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "India "
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@rkumar6119"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Orb"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x40DE3299Bd8a10D8Ac3f32C1A55DE40640cF9B75",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x018d5d",
              "name": "yuva",
              "bio": "#BTC #ETH #AVAX #MATIC #BNB",
              "handle": "yuvaa.lens",
              "ownedBy": "0x40DE3299Bd8a10D8Ac3f32C1A55DE40640cF9B75",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "ART_ENTERTAINMENT__FASHION",
                  "ART_ENTERTAINMENT__FILM_TV",
                  "ART_ENTERTAINMENT__MEMES",
                  "BUSINESS__FINANCE",
                  "CRYPTO__DAOS",
                  "CRYPTO__ETHEREUM",
                  "CRYPTO__L2",
                  "CRYPTO__METAVERSE",
                  "FOOD_DRINK__COOKING",
                  "LENS",
                  "NEWS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmeUfA7baVh7HVCR538GgxiUDbk9spE5XegzVTDiULCZny",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 836,
                  "totalFollowing": 1377,
                  "totalPosts": 102
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x9cD7D1981B3e15a2DEE4d512ac60E0579Ae18546",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x018d65",
              "name": "Shravan",
              "bio": "👑Official Account",
              "handle": "shravan.lens",
              "ownedBy": "0x9cD7D1981B3e15a2DEE4d512ac60E0579Ae18546",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "ART_ENTERTAINMENT__DESIGN",
                  "ART_ENTERTAINMENT__FASHION",
                  "ART_ENTERTAINMENT__MEMES",
                  "ART_ENTERTAINMENT__PHOTOGRAPHY",
                  "BUSINESS__FINANCE",
                  "TECHNOLOGY__SCIENCE"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreihnxawlpdjwdlqvjaxulydsxqlx6jkl4oatyxtb7sn2fxnl7zfg5i",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafybeig6ryxmwmvegpp3wc3zlyupwrni45bjb3akjcwzfa5gxsekr6wedy",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 472,
                  "totalFollowing": 886,
                  "totalPosts": 117
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "India"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://quest.philand.xyz/account/0x9cD7D1981B3e15a2DEE4d512ac60E0579Ae18546"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "Remo137384702"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusEmoji",
                      "value": "🥰"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "Beauty of Crypto "
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xc2D3a804794Df0331Dbc8cD238221029DB4B2c1b",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x018da6",
              "name": "(🌿,👻) kingjunaid12 (💙,🧡)",
              "bio": "I Share Best Airdrops , Crypto News & Educational Post 🏣📯\n\n♥️ Web3 ☘️ DEFI ☘️ Airdrops ♥️\n#Lens | #Lenster | #Lenstube | #Crypto Supporter ☘️\n\nFollow 2nd Account 👇\nhttps://lenster.xyz/u/justinsunset",
              "handle": "kingjunaid12.lens",
              "ownedBy": "0xc2D3a804794Df0331Dbc8cD238221029DB4B2c1b",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreibvb5psiafku5afnvrn7tpgifnqsymnpjrcrkbdocfqdyzlacr7yy",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmbGcnBKEmCnEq7dBmJeWweYD7ECYERTq6EvNqUjLp6NAM",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 10882,
                  "totalFollowing": 25617,
                  "totalPosts": 1318
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[{\"title\":\"#Lens \",\"icon\":null,\"nfts\":[],\"poaps\":[]}]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Global 🌍"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://twitter.com/JunaidAliKassa1"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "JunaidAliKassa1"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x07C8A8395f5C77791D1B44A651f9C8Aa18e345F5",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x01a163",
              "name": "Crypto and Football ⚽️🌿",
              "bio": "The first Crypto/football page on lens protocol. Crypto and Football Journalist",
              "handle": "future_whale.lens",
              "ownedBy": "0x07C8A8395f5C77791D1B44A651f9C8Aa18e345F5",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmTXVV1b1hTkwBUyyAfmZGAk2fgnakiYAcDVLq3cyopthB",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://assets.lenstube.xyz/images/coverGradient.jpeg",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 1923,
                  "totalFollowing": 2226,
                  "totalPosts": 832
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "github",
                      "value": "@Yabo225588"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/future_whale.lens"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@A__yabo"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xc7C274A7cD4aA39b86a124fFcd0f7AeC0bA4e486",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x050c",
              "name": "Ties",
              "bio": "NFT collector |\nAavegotchi enthusiast |\ngm",
              "handle": "wabjoern.lens",
              "ownedBy": "0xc7C274A7cD4aA39b86a124fFcd0f7AeC0bA4e486",
              "interests": [
                  "ART_ENTERTAINMENT__MEMES",
                  "BUSINESS__CREATOR_ECONOMY",
                  "BUSINESS__FINANCE",
                  "CAREER",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "FOOD_DRINK__BEER",
                  "HOBBIES_INTERESTS__CARS",
                  "HOME_GARDEN__NATURE",
                  "LENS",
                  "TECHNOLOGY__SCIENCE",
                  "TECHNOLOGY__TOOLS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/Qmccjwx9eV8tJJcntjtGJwFdf3L6iQYewzjj1hmFeRSsVn",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmVFJ19T3DndzVw8TyJVS6dw6bDhMJi27xcSLWotJ2feus",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 277,
                  "totalFollowing": 337,
                  "totalPosts": 73
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Germany"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://opensea.io/Aavegotchi_Fren"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@wabjoern"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xE756050D41de631b1b2DDCc59d5633bd66d96322",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x2fe3",
              "name": "bluewiz.eth",
              "bio": "Crypto evangelist (XMR, BTC, ETH), Sovereign individual, Session ID 050cfefa77ce0d2a69736cc6d3bbd343d56768f64d554f36c28ed2b7ae1a641412",
              "handle": "bluewiz.lens",
              "ownedBy": "0xE756050D41de631b1b2DDCc59d5633bd66d96322",
              "interests": [
                  "ART_ENTERTAINMENT__PHOTOGRAPHY",
                  "BUSINESS__FINANCE",
                  "CRYPTO__BITCOIN",
                  "CRYPTO__DAOS",
                  "CRYPTO__DEFI",
                  "CRYPTO__ETHEREUM",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "HOBBIES_INTERESTS__TRAVEL",
                  "LENS",
                  "TECHNOLOGY__SCIENCE"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmYG5V6DcBUaG5n3z9Fs4HdbB6NpqNAbx6qsp6zqCB4J7y",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmPTxfPXKVggnXouyE7kedDHpSToMvVDgnS8ctbiq4hD5z",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 67,
                  "totalFollowing": 156,
                  "totalPosts": 38
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "metaverse"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://opensea.io/bluewiz"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "0xbluewiz"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "The woods are lovely, dark and deep, But I have promises to keep, And miles to go before I sleep."
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Orb"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xd6Cf8c0033Ba3e7e205b9aa1beDc559edA980aF9",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x38b0",
              "name": "polycat",
              "bio": null,
              "handle": "berber.lens",
              "ownedBy": "0xd6Cf8c0033Ba3e7e205b9aa1beDc559edA980aF9",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreidpleexf7l7ttsr43a45bt5lakhz2hfki7wtqgy2qtaq2k6ix3hbm",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreicrs3oecefkpnz7c54zdxdsml5vryque6lonhhubyyzqbhprnypda",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 423,
                  "totalFollowing": 683,
                  "totalPosts": 82
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "china"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@Runner24496012"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xF05Abab203216009F6E41920845eD940C947Acc1",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x39f2",
              "name": "king009 ◱ ◱",
              "bio": null,
              "handle": "lilnounsdao.lens",
              "ownedBy": "0xF05Abab203216009F6E41920845eD940C947Acc1",
              "interests": [],
              "picture": null,
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 23,
                  "totalFollowing": 168,
                  "totalPosts": 45
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/kingqin.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x635dF107cFa1AD04089Ec73225AA0d2874d006A8",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x8754",
              "name": "BFFs",
              "bio": "Love lens\nThat really cool\n",
              "handle": "20116.lens",
              "ownedBy": "0x635dF107cFa1AD04089Ec73225AA0d2874d006A8",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "BUSINESS__MARKETING",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "LENS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreice5cjl5npvbm3taztawrwfkc3ukjy3yh4iyrdxhkdpr64wbpvmby",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 132,
                  "totalFollowing": 168,
                  "totalPosts": 12
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/20116.lens"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@poaps"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusEmoji",
                      "value": "😇"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "so far"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x1b13FFEd169E74e9129c9163c55D3cFAd115992A",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x87cf",
              "name": "Mystery of crypto◱ ◱",
              "bio": "Mystery of crypto with dx ",
              "handle": "zksynce.lens",
              "ownedBy": "0x1b13FFEd169E74e9129c9163c55D3cFAd115992A",
              "interests": [],
              "picture": {
                  "__typename": "NftImage",
                  "contractAddress": "0x4750C7dDc7Abe83f64A888fC6322ff522D359209",
                  "tokenId": "596",
                  "uri": "https://statics-polygon-lens.s3.eu-west-1.amazonaws.com/profile/nft-0x1b13FFEd169E74e9129c9163c55D3cFAd115992A_eth_0x4750C7dDc7Abe83f64A888fC6322ff522D359209_596.png",
                  "verified": true
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://media.orb.ac/thumbnailDimension768/https://lens.infura-ipfs.io/ipfs/Qmdrt8MsfDUCZNsHmy5cLgaS8fJRTaSGJCnNMXXWQ8e6EL",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 648,
                  "totalFollowing": 1182,
                  "totalPosts": 107
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/sajeebwazed.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@joydxofficial"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusEmoji",
                      "value": "🧡"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "pain"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Orb"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x425C90B7CA97BEc31aa2ae2Eb58F683F5D11E03a",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x8807",
              "name": "Sidd",
              "bio": "👽 Follow4Follow ⚔️\n👍 50% referral fee - mirror my post and get reward! 💰\n\nFollow🡻🡻🡻🡻🡻🡻\n@cryptogirlsdao.lens  \n\n#music #anime #crypto #CGB #cryptogirlsdao \n\n🐲 Hi all, I'm Sidd, a early stage project tester and content creator =_=\n\n",
              "handle": "siddxa.lens",
              "ownedBy": "0x425C90B7CA97BEc31aa2ae2Eb58F683F5D11E03a",
              "interests": [
                  "ART_ENTERTAINMENT__ANIME",
                  "ART_ENTERTAINMENT__BOOKS",
                  "ART_ENTERTAINMENT__MUSIC",
                  "BUSINESS__CREATOR_ECONOMY",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "HOBBIES_INTERESTS__GAMING",
                  "LENS",
                  "TECHNOLOGY__SCIENCE",
                  "TECHNOLOGY__TOOLS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmSXVMyaobW1TmSfGbJT7kvKzX6UCqzjfQBEQEsBJv6DBs",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreihwmnm5fuuxpxnkpgqiooaynxpnpcvaaatzwvgr4lnqhrfylq77su",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 1584,
                  "totalFollowing": 3495,
                  "totalPosts": 138
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "about",
                      "value": "**As a crypto blogger with over 10 years of experience researching markets and the crypto industry, I have established myself as a trusted voice in the community. My in-depth analysis and insights into the ever-evolving world of cryptocurrency have allowed me to provide valuable information to those looking to stay informed and make informed investment decisions. My passion for the subject is evident in the quality of my content and the dedication I bring to my research. I am proud of the wealth of knowledge and understanding of the crypto market that I have acquired over the years.**"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "cardView",
                      "value": "stack"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "corners",
                      "value": "0.4"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "gradient",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "theme",
                      "value": "{\"h\":288.8888888888889,\"s\":0.5510204081632653,\"l\":0.4803921568627451,\"a\":1}"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Prontera, the capital of the kingdom of Rune-Midgarts"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/siddxa.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@Invest_Quest_ru"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusEmoji",
                      "value": "👁️"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "statusMessage",
                      "value": "Crypto Girls and Boys"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x3Ab8c2C27a9C1A0b396758a77719E361b87240D6",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x8911",
              "name": "Dyula ⌐◨-◨",
              "bio": "part @cryptogirlsdao",
              "handle": "dyula.lens",
              "ownedBy": "0x3Ab8c2C27a9C1A0b396758a77719E361b87240D6",
              "interests": [
                  "ART_ENTERTAINMENT__PHOTOGRAPHY",
                  "CRYPTO__GM",
                  "HEALTH_FITNESS__BIOHACKING",
                  "LENS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreicjymrcob76pbidwl4d2cuo6bh46gp3o4n55knonilsgyx6vvyymy",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreiaoh4qkc4bldkttdkzums2znir4kvprpdwwc4ld36oosr5mn2gwj4",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 2726,
                  "totalFollowing": 4902,
                  "totalPosts": 34
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "link3.to/cryptofood"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/dyula.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "cryptofood"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xB4EA76d9488ED2E56FEb5F803A9733D513cc9027",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0x9dc5",
              "name": "aro ◱ ◱",
              "bio": "flanuer",
              "handle": "aro67.lens",
              "ownedBy": "0xB4EA76d9488ED2E56FEb5F803A9733D513cc9027",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "ART_ENTERTAINMENT__BOOKS",
                  "ART_ENTERTAINMENT__DESIGN",
                  "ART_ENTERTAINMENT__FASHION",
                  "ART_ENTERTAINMENT__PHOTOGRAPHY"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmRMY67WXnjowawoLmpjEFPQ65qDnUm2qjjpFxPYFLRz4A",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://ik.imagekit.io/orbapp/tr:n-attachment,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmWmxbFQSo4USpvjLqa8QByaSBs8MQ2k6wpTpR1LsaF8dN",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 1369,
                  "totalFollowing": 2578,
                  "totalPosts": 238
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "projects",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "skills",
                      "value": "[{\"title\":\"Flaneur \",\"icon\":null,\"nfts\":[],\"poaps\":[]}]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "experience",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "education",
                      "value": "[]"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Yoknapatawpha County"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/nyctalgia.eth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "@yegsam_lucci"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xb6b197E24f5B3c2d47Dd641dc7F12ab7b6965798",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xa67e",
              "name": "Anirban Saha",
              "bio": "Civil Engineer",
              "handle": "anirban.lens",
              "ownedBy": "0xb6b197E24f5B3c2d47Dd641dc7F12ab7b6965798",
              "interests": [
                  "ART_ENTERTAINMENT__PHOTOGRAPHY",
                  "BUSINESS__FINANCE",
                  "CRYPTO__BITCOIN",
                  "CRYPTO__DAOS",
                  "CRYPTO__DEFI",
                  "CRYPTO__ETHEREUM",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "HOBBIES_INTERESTS__TRAVEL",
                  "LENS",
                  "TECHNOLOGY__AI_ML",
                  "TECHNOLOGY__SCIENCE"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafybeifozma64gt4t4lc2gyqijtlpkwbgbpcref2xyagmgrvdspt6jnpaq",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreibn4pok7g7tnnvil7lyzf73txenxpilwvrk7ssdxvrd425ccqc2cm",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 29,
                  "totalFollowing": 124,
                  "totalPosts": 0
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Kolkata"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xaF691206fa6528843Dafc8924f2f6A522b991724",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xabcc",
              "name": "norah",
              "bio": "Something about me.",
              "handle": "norah.lens",
              "ownedBy": "0xaF691206fa6528843Dafc8924f2f6A522b991724",
              "interests": [
                  "ART_ENTERTAINMENT",
                  "ART_ENTERTAINMENT__MEMES",
                  "ART_ENTERTAINMENT__MUSIC",
                  "CRYPTO",
                  "CRYPTO__DEFI",
                  "CRYPTO__GM",
                  "CRYPTO__METAVERSE",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "LENS",
                  "TECHNOLOGY",
                  "TECHNOLOGY__SCIENCE"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreihqpkjmco6fhsyffjteepw7wmhcn556p6y7e4pt6asi45pukpttcm",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreib6gsfg5tt7uhizmbiqclad3harv224gxp2zth2scm5qh7s73qetm",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 71,
                  "totalFollowing": 183,
                  "totalPosts": 3
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "metaverse"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "norah.lens"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "isBeta",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x03E6dfbb08c1997d41BB7781C1765919D1b2b890",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xb108",
              "name": "Rektman",
              "bio": null,
              "handle": "web3wrold.lens",
              "ownedBy": "0x03E6dfbb08c1997d41BB7781C1765919D1b2b890",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafybeicbhiichvxjho3lmfyjqlr2qljsux4lysu2sizghykhmb4u73thoe",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 184,
                  "totalFollowing": 484,
                  "totalPosts": 64
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://lenster.xyz/u/web3wrold.lens"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0xDff33F1d17db3df7ef625Bf4b60dFa59c95Bb176",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xc745",
              "name": "withpoll",
              "bio": "Since 2022, I have dedicated myself to the world of cryptocurrencies and blockchain technology. I started my journey as an investor, but soon fell in love with the potential of the technology .\n\nall in web3\n#btc #lens #crypto #web3 #ethereum #defi #nft",
              "handle": "withpoll.lens",
              "ownedBy": "0xDff33F1d17db3df7ef625Bf4b60dFa59c95Bb176",
              "interests": [
                  "ART_ENTERTAINMENT__ART",
                  "ART_ENTERTAINMENT__BOOKS",
                  "BUSINESS__CREATOR_ECONOMY",
                  "CRYPTO__BITCOIN",
                  "CRYPTO__DEFI",
                  "CRYPTO__ETHEREUM",
                  "CRYPTO__GM",
                  "CRYPTO__GOVERNANCE",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "EDUCATION",
                  "FAMILY_PARENTING"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreiftl2lcqmwkfta3d723luvsukys62j5rhku7ouufna737a7hpuzra",
                      "mimeType": null
                  }
              },
              "coverPicture": null,
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 260,
                  "totalFollowing": 1226,
                  "totalPosts": 57
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Earth"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "withpoll"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "hasPrideLogo",
                      "value": "true"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": true,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x4cC02fE75307c2E9E6b4a3e4Ddb45a05829D4312",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xe924",
              "name": "(🌿,👻) Rising Star (💙,🧡) ",
              "bio": "Blockchain Could Change Our Future\n📰 Crypto News & Update , Technical Anylsis & Find Share Huge Potential Airdrops\n👑#Web3 #Defi #Lens #Lenster #Lenstube 🚀🚀🚀🚀🚀🚀🌱🌱\n💯Follow Me 💯 Back 💯",
              "handle": "freedogecoin.lens",
              "ownedBy": "0x4cC02fE75307c2E9E6b4a3e4Ddb45a05829D4312",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmbWHN6jbqHeER7QsCyhEKXZG7DBZmSXWZnzoTTj8CS8wd",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://QmWPJG97rjiNaaypYoSMhdHAwBMMtXuYdNcXzRhhMvUy8o",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 11102,
                  "totalFollowing": 28764,
                  "totalPosts": 967
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "UK London"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "TheRisingStar50"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x55F5429343891f0a2b2A8da63a48E82DA8D9f2F6",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xf0",
              "name": "Serg",
              "bio": "LFGROW",
              "handle": "serglo.lens",
              "ownedBy": "0x55F5429343891f0a2b2A8da63a48E82DA8D9f2F6",
              "interests": [],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmXJWzCVEW7HwNv6n7jQsdwuB9kH46cKB9G5ZjLVXyRrGs",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "https://lens.infura-ipfs.io/ipfs/QmbBrB8BpZ3JEJcs4W8AQAuU3447nffQjgBii5KVVUHxqG",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 3049,
                  "totalFollowing": 74,
                  "totalPosts": 6
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": "string",
                      "key": "app",
                      "value": "LensFrens"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  },
  {
      "__typename": "Follower",
      "wallet": {
          "__typename": "Wallet",
          "address": "0x48B61678eA8748b81abc677D1Bd6050878a86d27",
          "defaultProfile": {
              "__typename": "Profile",
              "id": "0xf071",
              "name": "H.E. Justin Sun🌞🇬🇩🇩🇲🔥₮ ",
              "bio": "♥️ Web3 ☘️ DEFI ♥️\n#Tron | #Huobi | #ETH | #BTC #Lens | #Lenster | #Lenstube | #Crypto | #Aave | #LensProtocol | #Metamask | #Optimism | #Arbitrum | #zkSync | #LayerZero | #Aztec | #Zapper | #Zerion | #Layer3 supporter ☘️\nhttps://lenster.xyz/u/kingjunaid12",
              "handle": "justinsunset.lens",
              "ownedBy": "0x48B61678eA8748b81abc677D1Bd6050878a86d27",
              "interests": [
                  "CRYPTO",
                  "CRYPTO__BITCOIN",
                  "CRYPTO__DAOS",
                  "CRYPTO__DEFI",
                  "CRYPTO__GM",
                  "CRYPTO__GOVERNANCE",
                  "CRYPTO__L1",
                  "CRYPTO__L2",
                  "CRYPTO__NFT",
                  "CRYPTO__WEB3",
                  "CRYPTO__WEB3_SOCIAL",
                  "LENS"
              ],
              "picture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreihclh6qiez6vz6ogyomj5ryr64rdcpbpmkdopqyt5uhpd6bbudtty",
                      "mimeType": null
                  }
              },
              "coverPicture": {
                  "__typename": "MediaSet",
                  "original": {
                      "__typename": "Media",
                      "url": "ipfs://bafkreidm3nnrjvuxym6fulo6lcu53ywjkl5v553tkgwqd3kocvi5ngakye",
                      "mimeType": null
                  }
              },
              "stats": {
                  "__typename": "ProfileStats",
                  "totalFollowers": 11809,
                  "totalFollowing": 29794,
                  "totalPosts": 667
              },
              "followModule": null,
              "attributes": [
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "location",
                      "value": "Geneva, Switzerlandhuobi"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "website",
                      "value": "https://land.philand.xyz/"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "twitter",
                      "value": "JunaidAliKassa1"
                  },
                  {
                      "__typename": "Attribute",
                      "displayType": null,
                      "key": "app",
                      "value": "Lenster"
                  }
              ],
              "dispatcher": {
                  "address": "0xD1FecCF6881970105dfb2b654054174007f0e07E",
                  "canUseRelay": true
              },
              "isDefault": false,
              "isFollowedByMe": false,
              "isFollowing": false
          }
      }
  }
]