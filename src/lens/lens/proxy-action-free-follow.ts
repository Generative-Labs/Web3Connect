import { apolloClient } from '../utils/apollo-client';
import {
  ProxyActionDocument,
  ProxyActionRequest,
  ProxyActionStatusTypes,
} from '../graphql/generated';
import { sleep } from '../utils/helpers';
import { proxyActionStatusRequest } from './proxy-action-status';

const proxyActionFreeFollowRequest = async (request: ProxyActionRequest) => {
  const result = await apolloClient.query({
    query: ProxyActionDocument,
    variables: {
      request,
    },
  });

  return result.data.proxyAction;
};

export const proxyActionFreeFollow = async () => {

  const result = await proxyActionFreeFollowRequest({
    follow: {
      freeFollow: {
        profileId: '0x01',
      },
    },
  });
  console.log('proxy action free follow: result', result);

  while (true) {
    const statusResult = await proxyActionStatusRequest(result);
    console.log('proxy action free follow: status', statusResult);
    if (statusResult.__typename === 'ProxyActionStatusResult') {
      if (statusResult.status === ProxyActionStatusTypes.Complete) {
        console.log('proxy action free follow: complete', statusResult);
        break;
      }
    }
    if (statusResult.__typename === 'ProxyActionError') {
      console.log('proxy action free follow: failed', statusResult);
      break;
    }
    await sleep(1000);
  }

  return result;
};

