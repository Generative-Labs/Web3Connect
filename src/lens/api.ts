import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { TOKEN_KEY, tokenMgr } from "../constant/utils";
import {
  getFollowerQuery,
  getFollowingQuery,
  getOneProfileQuery,
  getProfileQuery,
} from "./lensApiQueryConfig";
export const LENS_API = 'https://api-mumbai.lens.dev/';



export const client = new ApolloClient({
  uri: LENS_API,
  cache: new InMemoryCache(),
});

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export const getProfiles = async (address: string) => {
  const query = getProfileQuery;
  const variables = {
    request: {
      ownedBy: address,
    },
  };
  const result = await fetch("https://api-mumbai.lens.dev/", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-access-token": tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS),
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "profiles",
      query,
      variables,
    }),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
  return result.data.profiles;
};

export const getProfile = async (handle: string) => {
  const query = getOneProfileQuery;
  const variables = {
    request: {
      handle,
    },
  };
  const operationName = "profile";
  const result = await fetch("https://api-mumbai.lens.dev/", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-access-token": tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS),
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName,
      query,
      variables,
    }),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
  return result.data.profile;
};

export const getFollowingData = async (address: string) => {
  const query = getFollowingQuery;
  const variables = {
    request: {
      address,
    },
  };
  const operationName = "following";

  const body = JSON.stringify({
    operationName,
    query,
    variables,
  });

  const result = await fetch("https://api-mumbai.lens.dev/", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-access-token": tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS),
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: body,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
  return result.data.following;
};

export const getFollowerData = async (profileId: string) => {
  const query = getFollowerQuery;
  const variables = {
    request: {
      profileId,
      limit: 50,
    },
  };
  const operationName = "followers";

  const body = JSON.stringify({
    operationName,
    query,
    variables,
  });

  const result = await fetch("https://api-mumbai.lens.dev/", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-access-token": tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS),
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: body,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
  return result.data.followers;
};
