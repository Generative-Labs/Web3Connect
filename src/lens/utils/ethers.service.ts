import { TypedDataDomain } from '@ethersproject/abstract-signer';
import { ethers, utils } from 'ethers';
import { omit } from './helpers';

// export const ethersProvider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC_URL);
//@ts-ignore
export const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)

export const getSigner = () => {
  return ethersProvider.getSigner()
  // const key = ethers.utils.toUtf8Bytes(PK)
  // console.log(key, 'key')
  // const a = ethers.utils.hexlify(PK)
  // console.log(a, 'a')
  // return new Wallet();
};

export const getAddressFromSigner = () => {
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  const signer = getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner().signMessage(text);
};
