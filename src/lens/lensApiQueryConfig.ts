export const getProfileQuery = `query profiles($request: ProfileQueryRequest!) {
  profiles(request: $request) {
    items {
      ...ProfileFields
      __typename
    }
    pageInfo {
      ...CommonPaginatedResultInfoFields
      __typename
    }
    __typename
  }
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
    __typename
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  ownedBy
  dispatcher {
    address
    canUseRelay
    __typename
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
    __typename
  }
  followModule {
    ...FollowModuleFields
    __typename
  }
  onChainIdentity {
    ens {
      name
      __typename
    }
    proofOfHumanity
    sybilDotOrg {
      verified
      source {
        twitter {
          handle
          __typename
        }
        __typename
      }
      __typename
    }
    worldcoin {
      isHuman
      __typename
    }
    __typename
  }
  __typename
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
  __typename
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    recipient
    __typename
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
    __typename
  }
  __typename
}

fragment CommonPaginatedResultInfoFields on PaginatedResultInfo {
  prev
  next
  totalCount
  __typename
}`


export const getOneProfileQuery = `query profile($request: SingleProfileQueryRequest!) {
  profile(request: $request) {
    ...ProfileFields
    __typename
  }
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
    __typename
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  ownedBy
  dispatcher {
    address
    canUseRelay
    __typename
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
    __typename
  }
  followModule {
    ...FollowModuleFields
    __typename
  }
  onChainIdentity {
    ens {
      name
      __typename
    }
    proofOfHumanity
    sybilDotOrg {
      verified
      source {
        twitter {
          handle
          __typename
        }
        __typename
      }
      __typename
    }
    worldcoin {
      isHuman
      __typename
    }
    __typename
  }
  __typename
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
  __typename
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    recipient
    __typename
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
    __typename
  }
  __typename
}`


export const getFollowingQuery = `query following($request: FollowingRequest!) {
  following(request: $request) {
    items {
      profile {
        ...ProfileFields
        __typename
      }
      totalAmountOfTimesFollowing
      __typename
    }
    pageInfo {
      ...CommonPaginatedResultInfoFields
      __typename
    }
    __typename
  }
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
    __typename
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  ownedBy
  dispatcher {
    address
    canUseRelay
    __typename
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
    __typename
  }
  followModule {
    ...FollowModuleFields
    __typename
  }
  onChainIdentity {
    ens {
      name
      __typename
    }
    proofOfHumanity
    sybilDotOrg {
      verified
      source {
        twitter {
          handle
          __typename
        }
        __typename
      }
      __typename
    }
    worldcoin {
      isHuman
      __typename
    }
    __typename
  }
  __typename
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
  __typename
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    recipient
    __typename
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
    __typename
  }
  __typename
}

fragment CommonPaginatedResultInfoFields on PaginatedResultInfo {
  prev
  next
  totalCount
  __typename
}`


export const getFollowerQuery = `query followers($request: FollowersRequest!) {
  followers(request: $request) {
    items {
      wallet {
        ...WalletFields
        __typename
      }
      totalAmountOfTimesFollowed
      __typename
    }
    pageInfo {
      ...CommonPaginatedResultInfoFields
      __typename
    }
    __typename
  }
}

fragment WalletFields on Wallet {
  address
  defaultProfile {
    ...ProfileFields
    __typename
  }
  __typename
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
    __typename
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
      __typename
    }
    ... on MediaSet {
      original {
        ...MediaFields
        __typename
      }
      small {
        ...MediaFields
        __typename
      }
      medium {
        ...MediaFields
        __typename
      }
      __typename
    }
    __typename
  }
  ownedBy
  dispatcher {
    address
    canUseRelay
    __typename
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
    __typename
  }
  followModule {
    ...FollowModuleFields
    __typename
  }
  onChainIdentity {
    ens {
      name
      __typename
    }
    proofOfHumanity
    sybilDotOrg {
      verified
      source {
        twitter {
          handle
          __typename
        }
        __typename
      }
      __typename
    }
    worldcoin {
      isHuman
      __typename
    }
    __typename
  }
  __typename
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
  __typename
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    recipient
    __typename
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
    __typename
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
    __typename
  }
  __typename
}

fragment CommonPaginatedResultInfoFields on PaginatedResultInfo {
  prev
  next
  totalCount
  __typename
}`