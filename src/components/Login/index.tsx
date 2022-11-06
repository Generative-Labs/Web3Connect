import React, { useEffect, useState } from "react";
import {LensIcon, MetaMaskIcon} from "../../icons";

import "./index.css";
import useLogin from "../../hooks/useLogin";
import {useIonLoading, useIonToast} from "@ionic/react";
import { ethers } from "ethers";
import { authenticate, challenge, client } from "../../lens/api";
import { getUserInfoByJWT, TOKEN_KEY, tokenMgr } from "../../constant/utils";
import { getProfilesRequest } from "../../lens/lens/get-profile";
import { useStore } from "../../services/mobx/service";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { Client } from "web3-mq";
import headerLogo from "../../assert/svg/blackheaderLogo.svg";
import lensLogo from "../../assert/svg/lensLogoIcon.svg";
import Header from "../../pages/Header";
import ss from "../../pages/Home/index.module.scss";
import HomePageSkeleton from "../Skeletons/HomePageSkeleton/HomePageSkeleton";
import MemberProfileModal from "../MemberProfileModal";

const Login: React.FC = () => {
  const { signMetaMask, keys, lensToken, init, setLensToken } =
    useLogin();
  const history = useHistory();
  const [open] = useIonToast();
  const [address, setAddress] = useState();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [openLoading, closeLoading] = useIonLoading()
  const store = useStore();

  useEffect(() => {
    initRender();
  }, []);

  useEffect(() => {
    /* when the app loads, check to see if the user has already connected their wallet */
    checkConnection();
  }, []);

  async function checkConnection() {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      //@ts-ignore
      setAddress(accounts[0]);
    }
  }

  async function connect() {
    /* this allows the user to connect their wallet */
    //@ts-ignore
    const account = await window.ethereum.send("eth_requestAccounts");
    if (account.result.length) {
      setAddress(account.result[0]);
    }
  }

  async function login() {
    await openLoading()
    try {
      client.defaultOptions = {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      };
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address },
      });
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(
        challengeInfo.data.challenge.text
      );
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address,
          signature,
        },
      });
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const {
        data: {
          authenticate: { accessToken },
        },
      } = authData;
      tokenMgr().setToken(accessToken, TOKEN_KEY.LENS_ACCESS);
      setLensToken(accessToken);
      const profile = await getProfilesRequest({
        ownedBy: address,
      });
      console.log(profile, "profile");
      if (profile && profile.items && profile.items.length > 0) {
        const lensProfile = profile.items[0];
        await store.setLoginUserInfo(lensProfile);
        history.push(`/home/${lensProfile.handle}`);
      } else {
        open({
          message: "跳转到lenster注册",
          duration: 3000,
        });
        setTimeout(() => {
          localStorage.clear();
          window.open("https://testnet.lenster.xyz/");
        }, 3000);
      }
      await closeLoading()
    } catch (err) {
      await closeLoading()
      console.log("Error signing in: ", err);
    }
  }

  const initRender = async () => {
    if (keys && lensToken) {
      // lens 和 web3mq全部登录成功了
      await openLoading()
      await init();
      store.setClient(Client.getInstance(keys));
      let address = getUserInfoByJWT().id;
      const profile = await getProfilesRequest({
        ownedBy: address,
      });
      if (profile && profile.items && profile.items.length > 0) {
        await store.setLoginUserInfo(profile.items[0]);
      }
      history.push(`/home/${store.loginUserInfo.handle}`);
      await closeLoading()
    }
  };

  const loginWeb3mq = async () => {
    store.setShowLoading(true)
    if (!keys) {
      await signMetaMask();
    } else {
      await init();
      store.setClient(Client.getInstance(keys));
    }

    console.log(address, 'address')
    const profile = await getProfilesRequest({
      ownedBy: address,
    });
    console.log(profile, "profile");
    if (profile && profile.items && profile.items.length > 0) {
      setUserInfo(profile.items[0])
    }
    store.setShowLoading(false)
  }

  return (
    <>
      {!keys && (
        <div className="login_container">
          <div
            className="logoBox"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ height: "60px", width: "auto" }}
              src={headerLogo}
              alt=""
            />
          </div>
          <div className="step_box" style={{ marginTop: "50px" }}>
            <div className="up_text">Welcome to web3connect</div>
            <div className="down_text">Powered by web3mq</div>
            <div className="step_text">Connect Wallet</div>
          </div>
          <div className="button_box">
            <button onClick={loginWeb3mq} className="sign_btn">
              <MetaMaskIcon />
              Connect Web3MQ
            </button>
          </div>
        </div>
      )}
      {keys && !lensToken && (
        <>
          <Header isMobile={store.isMobile} />
          <div className={ss.profileContentBox}>
            <div className={ss.profileContent}>
              {
                userInfo &&
                  <MemberProfileModal
                      userInfo={userInfo}
                      isMobile={store.isMobile}
                      needName={false}
                  />
              }
            </div>
          </div>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.2)",
              position: "fixed",
              left: "0",
              top: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              {!address ? (
                <button onClick={connect} className="sign_btn" style={{ background: '#abff2c' }}>
                  <img style={{ width: '30px' }} src={lensLogo} alt=""/>
                  Connect Wallet
                </button>
              ) : (
                <button onClick={login} className="sign_btn" style={{ background: '#abff2c', color: '#00501e' }}>
                  <img style={{ width: '30px' }} src={lensLogo} alt=""/>
                  Connect Lens
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default observer(Login);
