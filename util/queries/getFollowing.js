const GET_FOLLOWING = `query($request: FollowingRequest!) {
  following(request: $request) {
    items {
      profile {
        id
        name
        bio
        attributes {
            displayType
            traitType
            key
            value
        }
        followNftAddress
        metadata
        isDefault
        isFollowedByMe
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              width
              height
              mimeType
            }
            medium {
              url
              width
              height
              mimeType
            }
            small {
              url
              width
              height
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              width
              height
              mimeType
            }
            small {
              width
              url
              height
              mimeType
            }
            medium {
              url
              width
              height
              mimeType
            }
          }
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                name
                symbol
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
           type
          }
          ... on RevertFollowModuleSettings {
           type
          }
        }
      }
      totalAmountOfTimesFollowing
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}`

export default GET_FOLLOWING