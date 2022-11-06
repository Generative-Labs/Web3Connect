import { useMemo, useState } from "react";
import { Client, KeyPairsType } from "web3-mq";
import { useStore } from "../services/mobx/service";
import { TOKEN_KEY, tokenMgr } from "../constant/utils";
import {authenticate, challenge, client} from "../lens/api";
import {ethers} from "ethers";
import {getProfilesRequest} from "../lens/lens/get-profile";
import {useHistory} from "react-router-dom";

const useLogin = () => {
  const store = useStore();
  const history = useHistory()
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem("PRIVATE_KEY") || "";
    const PublicKey = localStorage.getItem("PUBLICKEY") || "";
    const userid = localStorage.getItem("USERID") || "";
    if (PrivateKey && PublicKey && userid) {
      return { PrivateKey, PublicKey, userid };
    }
    return null;
  }, []);
  const hasLensToken = useMemo(() => {
    const token = tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS);
    if (token) {
      return token;
    }
    return null;
  }, []);

  const [keys, setKeys] = useState<KeyPairsType | null>(hasKeys);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);
  const [lensToken, setLensToken] = useState<string | null>(hasLensToken);

  const init = async () => {
    const fastUrl = await Client.init({
      connectUrl: localStorage.getItem("FAST_URL"),
      app_key: "vAUJTFXbBZRkEDRE",
      env: "dev",
    });
    localStorage.setItem("FAST_URL", fastUrl);
    setFastUrl(fastUrl);
  };

  const signMetaMask = async () => {
    await init();
    const { PrivateKey, PublicKey, userid } =
      await Client.register.signMetaMask({
        signContentURI: "https://www.web3mq.com",
      });
    localStorage.setItem("PRIVATE_KEY", PrivateKey);
    localStorage.setItem("PUBLICKEY", PublicKey);
    localStorage.setItem("USERID", userid);
    setKeys({ PrivateKey, PublicKey, userid });
    const client = Client.getInstance({ PrivateKey, PublicKey, userid });
    await store.setClient(client);
  };

  const logout = () => {
    localStorage.clear();
    setKeys(null);
    setLensToken(null)
    history.push('/auth')
  };

  const loginWeb3MQ = async () => {
    store.setShowLoading(true)
    if (!keys) {
      await signMetaMask();
    } else {
      await init();
      store.setClient(Client.getInstance(keys));
    }
    store.setShowLoading(false)
  };
  return { keys, fastestUrl, init, signMetaMask, logout, loginWeb3MQ, hasLensToken, lensToken, setLensToken };
};

export default useLogin;
