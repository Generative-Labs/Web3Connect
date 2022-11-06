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


export const getProfileFeedQuery = `query ProfileFeed($request: PublicationsQueryRequest!, $reactionRequest: ReactionFieldResolverRequest, $profileId: ProfileId) {
  publications(request: $request) {
    items {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        ...CommentFields
        __typename
      }
      ... on Mirror {
        ...MirrorFields
        __typename
      }
      __typename
    }
    pageInfo {
      totalCount
      next
      __typename
    }
    __typename
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  hasCollectedByMe
  collectedBy {
    address
    defaultProfile {
      ...ProfileFields
      __typename
    }
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  __typename
}

fragment ProfileFields on Profile {
  id
  name
  handle
  bio
  ownedBy
  attributes {
    key
    value
    __typename
  }
  picture {
    ... on MediaSet {
      original {
        url
        __typename
      }
      __typename
    }
    ... on NftImage {
      uri
      __typename
    }
    __typename
  }
  followModule {
    __typename
  }
  __typename
}

fragment CollectModuleFields on CollectModule {
  ... on FreeCollectModuleSettings {
    type
    contractAddress
    followerOnly
    __typename
  }
  ... on FeeCollectModuleSettings {
    type
    recipient
    referralFee
    contractAddress
    followerOnly
    amount {
      asset {
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    __typename
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    recipient
    referralFee
    contractAddress
    followerOnly
    amount {
      asset {
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    __typename
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    recipient
    endTimestamp
    referralFee
    contractAddress
    followerOnly
    amount {
      asset {
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    __typename
  }
  ... on TimedFeeCollectModuleSettings {
    type
    recipient
    endTimestamp
    referralFee
    contractAddress
    followerOnly
    amount {
      asset {
        symbol
        decimals
        address
        __typename
      }
      value
      __typename
    }
    __typename
  }
  __typename
}

fragment StatsFields on PublicationStats {
  totalUpvotes
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  __typename
}

fragment MetadataFields on MetadataOutput {
  name
  description
  content
  image
  attributes {
    traitType
    value
    __typename
  }
  cover {
    original {
      url
      __typename
    }
    __typename
  }
  media {
    original {
      url
      mimeType
      __typename
    }
    __typename
  }
  __typename
}

fragment CommentFields on Comment {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  hasCollectedByMe
  collectedBy {
    address
    defaultProfile {
      ...ProfileFields
      __typename
    }
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  commentOn {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      canComment(profileId: $profileId) {
        result
        __typename
      }
      canMirror(profileId: $profileId) {
        result
        __typename
      }
      hasCollectedByMe
      collectedBy {
        address
        defaultProfile {
          handle
          __typename
        }
        __typename
      }
      collectModule {
        ...CollectModuleFields
        __typename
      }
      metadata {
        ...MetadataFields
        __typename
      }
      stats {
        ...StatsFields
        __typename
      }
      mainPost {
        ... on Post {
          ...PostFields
          __typename
        }
        ... on Mirror {
          ...MirrorFields
          __typename
        }
        __typename
      }
      hidden
      createdAt
      __typename
    }
    ... on Mirror {
      ...MirrorFields
      __typename
    }
    __typename
  }
  __typename
}

fragment MirrorFields on Mirror {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  mirrorOf {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      canComment(profileId: $profileId) {
        result
        __typename
      }
      canMirror(profileId: $profileId) {
        result
        __typename
      }
      stats {
        ...StatsFields
        __typename
      }
      createdAt
      __typename
    }
    __typename
  }
  createdAt
  appId
  __typename
}`;