import { apolloClient } from '../utils/apollo-client';
import {
  DefaultProfileDocument,
  DefaultProfileRequest, FeedRequest,
  ProfileDocument, ProfileFeedDocument, ProfileQueryRequest, ProfilesDocument,
  SingleProfileQueryRequest
} from '../graphql/generated';

export const getProfileRequest = async (request: SingleProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  });
  return result.data.profile;
};



export const getDefaultProfileRequest = async (request: DefaultProfileRequest) => {
  const result = await apolloClient.query({
    query: DefaultProfileDocument,
    variables: {
      request,
    },
  });

  return result.data.defaultProfile;
};

export const getProfilesRequest = async (request: ProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfilesDocument,
    variables: {
      request,
    },
  });

  return result.data.profiles;
};

const getProfileFeedRequest = async (request: FeedRequest) => {
  const result = await apolloClient.query({
    query: ProfileFeedDocument,
    variables: {
      request,
    },
  });
  return result.data.feed;
};

export const profileFeed = async (profileId: string) => {
  const result = await getProfileFeedRequest({ profileId, limit: 50 });
  console.log('profile feed: result', result);
  return result;
};
