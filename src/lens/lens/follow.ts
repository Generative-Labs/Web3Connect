import { apolloClient } from '../utils/apollo-client';
import { signedTypeData, splitSignature } from '../utils/ethers.service';
import {
  CreateFollowTypedDataDocument,
  FollowersDocument,
  FollowersRequest, FollowingDocument,
  FollowingRequest,
  FollowRequest
} from '../graphql/generated';
import { lensHub } from '../utils/lens-hub';
import {getUserInfoByJWT} from "../../constant/utils";

export const createFollowTypedData = async (request: FollowRequest) => {
  const result = await apolloClient.mutate({
    mutation: CreateFollowTypedDataDocument,
    variables: {
      request,
    },
  });

  return result.data!.createFollowTypedData;
};




export const follow = async (profileId: string = '0x11') => {
  // const address = getAddressFromSigner();
  // console.log('follow: address', address);
  //
  // await login(address);

  const result = await createFollowTypedData({
    follow: [
      {
        profile: profileId,
      },
    ],
  });
  console.log('follow: result', result);

  const typedData = result.typedData;
  console.log('follow: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('follow: signature', signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.followWithSig({
    follower: getUserInfoByJWT().id,
    profileIds: typedData.value.profileIds,
    datas: typedData.value.datas,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('follow: tx hash', tx.hash);
  return tx.hash;
};


const followersRequest = async (request: FollowersRequest) => {
  const result = await apolloClient.query({
    query: FollowersDocument,
    variables: {
      request,
    },
  });

  return result.data.followers;
};

export const followers = async (profileId: string) => {
  const result = await followersRequest({ profileId, limit: 50 });
  console.log('followers: result', result);

  return result;
};

const followingRequest = async (request: FollowingRequest) => {
  const result = await apolloClient.query({
    query: FollowingDocument,
    variables: {
      request,
    },
  });

  return result.data.following;
};

export const following = async (address: string) => {
  const result = await followingRequest({ address });
  console.log('following: result', result);

  return result;
};