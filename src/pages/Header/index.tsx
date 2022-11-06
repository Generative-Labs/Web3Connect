import React, { useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import headerLogo from "../../assert/svg/headerLogo.svg";
import lensLogoIcon from "../../assert/svg/lensLogoIcon.svg";

import ss from "./index.module.scss";
import { useStore } from "../../services/mobx/service";
import {
  getShortAddressByAddress,
  TOKEN_KEY,
  tokenMgr,
} from "../../constant/utils";
import { PAGE_TYPE } from "../../constant/enum";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { getIPFSLink, imageProxy } from "../../lens/utils";
import { COVER } from "../../constant";
import { authenticate, challenge, client } from "../../lens/api";
import { ethers } from "ethers";
import { Client } from "web3-mq";
import { getProfilesRequest } from "../../lens/lens/get-profile";
import { useIonLoading, useIonToast } from "@ionic/react";

interface IAppProps {
  isMobile: boolean;
  isLensStyle?: boolean;
}

const Header: React.FC<IAppProps> = (props) => {
  const store = useStore();
  const history = useHistory();
  const { keys, signMetaMask, init, logout } = useLogin();
  const [open] = useIonToast();
  const [address, setAddress] = useState();
  const [openLoading, closeLoading] = useIonLoading();
  const { isMobile, isLensStyle = false } = props;

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
    await openLoading("Loading");
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
      const profile = await getProfilesRequest({
        ownedBy: address,
      });
      if (profile && profile.items && profile.items.length > 0) {
        await store.setLoginUserInfo(profile.items[0]);
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
      await closeLoading();
    } catch (err) {
      await closeLoading();
      console.log("Error signing in: ", err);
    }
  }

  const handleLoginOut = () => {
    logout();
    store.logout();
  };
  const handleSubscribers = async () => {
    store.setShowModal(true);
    store.setPageType(PAGE_TYPE.SUBSCRIBERS);
    if (store.contacts.length <= 0 || store.followers.length <= 0) {
      await openLoading('Loading')
      await store.getContacts(store.loginUserInfo.ownedBy);
      await store.getFollowers(store.loginUserInfo.id);
      await closeLoading()
    }
  };

  const handleProfile = async () => {
    if (store.loginUserInfo && store.loginUserInfo.handle) {
      history.push(`/home/${store.loginUserInfo.handle}`);
    }
  };

  const menus = useMemo(
    () => [
      {
        title: "Subscribers",
        fn: handleSubscribers,
      },
      {
        title: "Logout",
        fn: handleLoginOut,
      },
    ],
    [handleLoginOut, handleSubscribers]
  );

  const handleLogin = async () => {
    await login();
  };

  const RenderLoginBar = useCallback(() => {
    if (store.loginUserInfo) {
      const userAvatar = imageProxy(
        getIPFSLink(store.loginUserInfo?.picture?.original?.url),
        COVER
      );

      return (
        <div className={ss.headRight}>
          <div className={ss.userInfo}>
            {!isMobile && (
              <div
                className={cx(ss.name, {
                  [ss.lensName]: isLensStyle,
                })}
              >
                <div className={ss.successConnectedBox}></div>
                {`Connected to ${getShortAddressByAddress(
                  store.loginUserInfo.ownedBy
                )}`}
              </div>
            )}
            <div className={ss.avatar}>
              <img src={userAvatar} alt="" />
            </div>
          </div>
          <div className={ss.popover}>
            <ul>
              {isMobile && (
                <li className={ss.popoverItem}>
                  <div className={ss.successConnectedBox}></div>
                  {`Connected to ${getShortAddressByAddress(
                    store.loginUserInfo.ownedBy
                  )}`}
                </li>
              )}
              {store.loginUserInfo && (
                <li className={ss.popoverItem} onClick={handleProfile}>
                  Profile
                </li>
              )}
              {menus.map((item) => {
                return (
                  <li
                    className={ss.popoverItem}
                    key={item.title}
                    onClick={item.fn}
                  >
                    {item.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    if (!address) {
      return (
        <div
          className={cx(ss.connectBtn, {
            [ss.lensConnectBtn]: isLensStyle,
          })}
          onClick={connect}
        >
          Connect wallet
        </div>
      );
    } else {
      return (
        <div
          className={cx(ss.connectBtn, {
            [ss.lensConnectBtn]: isLensStyle,
          })}
          onClick={handleLogin}
        >
          Login
        </div>
      );
    }
  }, [store.loginUserInfo, isMobile, address]);
  return (
    <>
      <div
        className={cx(ss.header, {
          [ss.mobileHeader]: isMobile,
          [ss.lensHeader]: isLensStyle,
        })}
        style={
          store.userInfo?.coverPicture?.original?.url
            ? {
                height: "80px",
                padding: "20px 100px 0",
              }
            : {}
        }
      >
        <div
          className={cx(ss.headerBox, {
            [ss.mobileHeaderBox]: isMobile,
          })}
        >
          <div className={ss.headLeft}>
            <img
              style={isLensStyle ? { height: "70px" } : {}}
              src={isLensStyle ? lensLogoIcon : headerLogo}
              alt=""
            />
          </div>
          <RenderLoginBar />
        </div>
      </div>

      {store.userInfo?.coverPicture?.original?.url && (
        <div
          style={{
            height: "300px",
            backgroundImage: `url(${imageProxy(
              getIPFSLink(store.userInfo?.coverPicture?.original?.url),
              COVER
            )})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      )}
    </>
  );
};

export default observer(Header);
