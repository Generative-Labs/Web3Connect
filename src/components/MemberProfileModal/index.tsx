import React, { useCallback, useEffect, useState } from "react";
import ss from "./index.module.scss";
import { IonButton, IonModal, useIonToast } from "@ionic/react";
import { useStore } from "src/services/mobx/service";
import { observer } from "mobx-react-lite";
import { getShortAddressByAddress } from "../../constant/utils";
import {PAGE_TYPE, PLATFORM_ENUM} from "../../constant/enum";
import cx from "classnames";
import copy from "copy-to-clipboard";
import ConnectAccountModal, {
  ACCOUNT_CONNECT_TYPE,
} from "../ConnectAccountModal";
import { getIPFSLink, imageProxy } from "../../lens/utils";
import { COVER } from "../../constant";
import { follow } from "../../lens/lens/follow";
import { proxyActionFreeFollow } from "../../lens/lens/proxy-action-free-follow";
import useLogin from "../../hooks/useLogin";
import { profileFeed } from "../../lens/lens/get-profile";
import { logoEuro } from "ionicons/icons";

const userIcon =
  "https://s3.us-west-2.amazonaws.com/videos.house.west2/SwapChat-static/svg/user.svg";
const sendMessageIcon =
  require("../../assert/svg/profileSendMessageIcon.svg").default;
const followIcon = require("../../assert/svg/followIcon.svg").default;
const copyIcon = require("../../assert/svg/copyIcon.svg").default;
const lensCopyIcon = require("../../assert/svg/lensCopyIcon.svg").default;
const facebookIcon = require("../../assert/img/pre-facebook-icon.png").default;
const twitterIcon = require("../../assert/svg/twitterIcon.svg").default;
const openseaIcon = require("../../assert/svg/openseaIcon.svg").default;
const discordIcon = require("../../assert/svg/discordIcon.svg").default;
const insIcon = require("../../assert/img/pre-instagram-icon.png").default;
const nextIdIcon = require("../../assert/img/nextIdIcon.jpeg").default;
const profileENSIcon =
  "https://s3.us-west-2.amazonaws.com/videos.house.west2/SwapChat-static/svg/profileENSIcon.svg";
const profileDotBitIcon =
  require("../../assert/svg/profileDotBitIcon.svg").default;
const profileNameTagIcon =
  require("../../assert/svg/profileNameTagIcon.svg").default;
const isBusinessUserIcon =
  require("../../assert/svg/isBusinessUser.svg").default;
const emailIcon = require("../../assert/svg/emailIcon.svg").default;
const phoneIcon = require("../../assert/svg/phoneIcon.svg").default;
const connectMoreAccountIcon =
  require("../../assert/svg/connectMoreAccountIcon.svg").default;

const accountsConfigs = [
  {
    platform: PLATFORM_ENUM.TWITTER,
    defaultIcon: twitterIcon,
    title: "Twitter",
  },
  {
    platform: PLATFORM_ENUM.OPENSEA,
    defaultIcon: openseaIcon,
    title: "OpenSea",
  },
  {
    platform: PLATFORM_ENUM.DISCORD,
    defaultIcon: discordIcon,
    title: "Discord",
  },
  {
    platform: PLATFORM_ENUM.FACEBOOK,
    defaultIcon: facebookIcon,
    title: "Facebook",
  },
  {
    platform: PLATFORM_ENUM.INSTAGRAM,
    defaultIcon: insIcon,
    title: "Instagram",
  },
];

interface IAppProps {
  userInfo: any;
  isMobile: boolean;
  needName?: boolean;
  isLensStyle?: boolean;
}

type dids = {
  nextId: string;
  ens: string;
  dotBit: string[];
  nameTag: string[];
};

const size = 30;
const MemberProfileModal: React.FC<IAppProps> = observer((props) => {
  const store = useStore();
  const { loginWeb3MQ } = useLogin();
  const [present] = useIonToast();
  const {
    userInfo,
    isMobile = false,
    needName = true,
    isLensStyle = false,
  } = props;
  const [segmentValue, setSegmentValue] = useState("1");
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [pageType, setPageType] = useState<ACCOUNT_CONNECT_TYPE>(
    ACCOUNT_CONNECT_TYPE.PHONE
  );

  const getUserNFTs = async (page: number = 1) => {
    const res = await profileFeed(userInfo.id).catch((e) => {
      console.log(e, "e");
    });
    console.log(res, "profileFeed -res");

    // if (nftData.data) {
    //   if (nftData.data.assets.length < size) {
    //     setIsInfiniteDisabled(true);
    //   }
    //   if (page === 1) {
    //     setUserNFTs(nftData.data.assets);
    //   } else {
    //     setUserNFTs(nftData.data.assets.concat(userNFTs));
    //   }
    // }
  };

  const loadData = async (ev: any) => {
    let currentPage = (userNFTs.length / size).toFixed(0);
    let item = +currentPage + 1;
    await getUserNFTs(item);
    ev.target.complete();
  };

  useEffect(() => {
    const init = async () => {
      await getUserNFTs();
    };
    init();
  }, []);

  // useIonViewWillEnter(() => {
  //   // 处理tab1白屏问题
  //   let errClassStr = "ion-page-invisible";
  //   let ele: any = document.querySelector(".member-profile-modal-page");
  //   if (ele && ele.className) {
  //     let str = ele.className;
  //     let index = str.indexOf(errClassStr);
  //     if (index > -1) {
  //       ele.className = str.replace(errClassStr, "");
  //     }
  //   }
  // });

  const RenderAccountsList = useCallback(() => {
    const loginUserInfo = store.loginUserInfo;
    let twitterHandle = "";
    if (userInfo.attributes && userInfo.attributes.length > 0) {
      let twitterInfo = userInfo.attributes.find(
        (item: any) => item.key === "twitter"
      );
      if (twitterInfo) {
        twitterHandle = twitterInfo.value;
      }
    }

    return (
      <div className={ss.walletsListContent}>
        <div className={ss.walletsList}>
          <img
            style={{ width: "24px", height: "auto", borderRadius: "0" }}
            src={phoneIcon}
          />
          <div className={ss.profileItemLabel}>
            <div className={ss.itemLabelAccountTitle}>Phone</div>
            <div className={ss.itemLabelText}>
              {store.userPhone || "Coming Soon"}
            </div>
            {loginUserInfo &&
            userInfo.ownedBy === loginUserInfo.ownedBy &&
            !store.userPhone ? (
              <div
                className={ss.connectAccountIcon}
                onClick={async () => {
                  if (!store.client) {
                    store.setShowModal(true);
                    await loginWeb3MQ();
                    await store.setUserDid();
                    store.setShowModal(false);
                  } else {
                    setShowModal(true);
                    setPageType(ACCOUNT_CONNECT_TYPE.PHONE);
                  }
                }}
              >
                <img
                  style={{ width: "20px", height: "20px" }}
                  src={connectMoreAccountIcon}
                  alt=""
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className={ss.walletsList}>
          <img
            style={{ width: "24px", height: "auto", borderRadius: "0" }}
            src={emailIcon}
          />
          <div className={ss.profileItemLabel}>
            <div className={ss.itemLabelAccountTitle}>Email</div>
            <div className={ss.itemLabelText}>
              {store.userEmail || "Coming Soon"}
            </div>
            {loginUserInfo &&
            userInfo.ownedBy === loginUserInfo.ownedBy &&
            !store.userEmail ? (
              <div
                className={ss.connectAccountIcon}
                onClick={async () => {
                  if (!store.client) {
                    await loginWeb3MQ();
                    await store.setUserDid();
                  } else {
                    setShowModal(true);
                    setPageType(ACCOUNT_CONNECT_TYPE.EMAIL);
                  }
                }}
              >
                <img
                  style={{ width: "20px", height: "20px" }}
                  src={connectMoreAccountIcon}
                  alt=""
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={ss.walletsList}>
          <img
            src="https://web3mq-docs.pages.dev/images/web3mq.logo.png"
            alt=""
          />
          <div className={ss.profileItemLabel}>
            <div className={ss.itemLabelTitle}>Web3MQ</div>
            {loginUserInfo &&
            userInfo.ownedBy === loginUserInfo.ownedBy &&
            loginUserInfo?.web3mqUserInfo?.userid ? (
              <div className={ss.itemLabelText}>
                {getShortAddressByAddress(
                  store.loginUserInfo.web3mqUserInfo.userid,
                  10
                )}
              </div>
            ) : (
              <div>Coming Soon</div>
            )}

            {loginUserInfo &&
            userInfo.ownedBy === loginUserInfo.ownedBy &&
            !store.client ? (
              <div
                className={ss.connectAccountIcon}
                onClick={async () => {
                  store.setShowLoading(true);
                  await loginWeb3MQ();
                  await store.setUserDid();
                  store.setShowLoading(false);
                }}
              >
                <img
                  style={{ width: "20px", height: "20px" }}
                  src={connectMoreAccountIcon}
                  alt=""
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={ss.walletsList}>
          <img src={profileENSIcon} alt="" />
          <div className={ss.profileItemLabel}>
            <div className={ss.itemLabelTitle}>ENS</div>
            {userInfo?.onChainIdentity?.ens?.name && (
              <div className={ss.itemLabelText}>
                {userInfo?.onChainIdentity?.ens?.name}
              </div>
            )}
          </div>
        </div>
        {twitterHandle && (
          <div className={ss.walletsList}>
            <img src={twitterIcon} alt="" />
            <div className={ss.profileItemLabel}>
              <div className={ss.itemLabelAccountTitle}>Twitter</div>
              <div className={ss.itemLabelText}>
                {twitterHandle ? `@${twitterHandle}` : "Coming Soon"}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [
    userInfo,
    store.userEmail,
    store.loginUserInfo,
    store.userPhone,
    store.client,
  ]);

  const RenderUserInfo = useCallback(() => {
    return (
      <div
        className={cx(ss.userInfoBox, {
          [ss.mobileUserInfoBox]: isMobile,
        })}
      >
        <div style={{ zIndex: 999 }} className={ss.avatarBox}>
          <img
            className={ss.avatarImg}
            src={
              imageProxy(
                getIPFSLink(userInfo?.picture?.original?.url),
                COVER
              ) || userIcon
            }
            alt=""
          />
        </div>
        <div className={ss.usernameBox}>
          {needName ? (
            <>
              <div className={ss.handle}>
                {userInfo.name || userInfo.handle}
                {/*{userInfo.is_business_user && (*/}
                <img src={isBusinessUserIcon} alt="" />
                {/*)}*/}
              </div>
              <div
                className={cx(ss.username, {
                  [ss.lensUserName]: isLensStyle,
                })}
              >
                @{userInfo.handle}
              </div>
              <div
                className={cx(ss.username, {
                  [ss.lensUserName]: isLensStyle,
                })}
              >
                #{userInfo.id}
              </div>
            </>
          ) : null}
          <div
            className={cx(ss.walletBox, {
              [ss.lensWalletBox]: isLensStyle,
            })}
          >
            <div className={ss.wallet}>
              {getShortAddressByAddress(userInfo.ownedBy)}
              <img
                src={isLensStyle ? lensCopyIcon : copyIcon}
                onClick={() => {
                  copy(userInfo.ownedBy);
                  present("Copied", 1000);
                }}
                className={ss.copyIcon}
                alt=""
              />
            </div>
          </div>
          <div className={ss.followInfoBox} onClick={async () => {
            store.setShowModal(true);
            store.setPageType(PAGE_TYPE.SUBSCRIBERS);
            if (store.contacts.length <= 0 || store.followers.length <= 0) {
              await store.getContacts(userInfo.ownedBy);
              await store.getFollowers(userInfo.id);
            }
          }}>
            <div className={ss.followNumBox}>
              <div
                className={ss.number}
                style={
                  +userInfo.stats.totalFollowing === 0
                    ? { color: "rgb(113, 113, 122)" }
                    : {}
                }
              >
                {userInfo.stats.totalFollowing}
              </div>
              <div className={ss.text}>Following</div>
            </div>
            <div className={ss.followNumBox}>
              <div
                className={ss.number}
                style={
                  +userInfo.stats.totalFollowers === 0
                    ? { color: "rgb(113, 113, 122)" }
                    : {}
                }
              >
                {userInfo.stats.totalFollowers}
              </div>
              <div className={ss.text}>Followers</div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isMobile, userInfo]);

  const handleFollow = async () => {
    //testnet.lenster.xyz/u/ramtest.test
    window.open(`https://testnet.lenster.xyz/u/${store.userInfo.handle}`);
    // store.setShowLoading(true);
    // if (store.loginUserInfo.followModule) {
    //   const followRes = await follow(store.userInfo.id);
    //   console.log(followRes, "followRes");
    // } else {
    //   let res = null;
    //   try {
    //     res = await proxyActionFreeFollow();
    //   } catch (e) {
    //     console.log(e);
    //   }
    //   if (!res || !res.data.proxyAction) {
    //     const followRes = await follow(store.userInfo.id);
    //     console.log(followRes, "followRes");
    //   }
    // }
    // store.setShowLoading(false);
  };
  const handleSendMessage = async () => {
    // window.open("https://c.web3messaging.online/");
    // if (store.client) {
    //   //@ts-ignore
    //   const { result = [] } = await store.client.user.searchUsers(userInfo.ownedBy)
    //   if (result && result.length > 0) {
    //     const user = result[0]
    //     await store.client.message.sendMessage('hello', user.userid)
    //   }
    //   // store.setShowChat(true)
    // }
    store.setShowChat(true);
  };

  const RenderAuditBox = useCallback(() => {
    if (!store.isLogin()) {
      return null;
    }
    if (
      store.loginUserInfo &&
      store.loginUserInfo.ownedBy === store.userInfo.ownedBy
    ) {
      return null;
    }
    return (
      <div
        className={cx(ss.profileAuditButtonBox, {
          [ss.lensProfileAuditButtonBox]: isLensStyle,
        })}
      >
        <IonButton
          className={ss.followButton}
          expand="block"
          onClick={handleFollow}
          disabled={store.isFollowed}
        >
          <img src={followIcon} alt="" />
          {store.isFollowed ? "Followed" : "Follow"}
        </IonButton>
        <IonButton
          className={ss.messageButton}
          expand="block"
          onClick={handleSendMessage}
          disabled={!store.client}
        >
          <img src={sendMessageIcon} alt="" />
          Messages
        </IonButton>
      </div>
    );
  }, [userInfo, store.loginUserInfo, store.isFollowed]);

  return (
    <div className={ss.content}>
      <RenderUserInfo />
      <RenderAuditBox />

      <div
        className={cx(ss.tabs, {
          [ss.mobileTabs]: isMobile,
        })}
      >
        <div
          className={cx(ss.tabsItem, {
            [ss.tabsItemChecked]: segmentValue === "1",
            [ss.lensTabsItemChecked]: segmentValue === "1" && isLensStyle,
          })}
          onClick={() => {
            setSegmentValue("1");
          }}
        >
          Feed
        </div>
        <div
          className={cx(ss.tabsItem, {
            [ss.tabsItemChecked]: segmentValue === "2",
            [ss.lensTabsItemChecked]: segmentValue === "2" && isLensStyle,
          })}
          onClick={() => {
            setSegmentValue("2");
          }}
        >
          DIDs
        </div>
      </div>
      <div className={ss.segmentContentBox}>
        {segmentValue === "1" && (
          <>
            {needName ? (
              <div className={ss.emptyFeedBox}>
                <div className={ss.emptyEmoji}>🗒</div>
                <div className={ss.emptyTextBox}>
                  <p
                    className={ss.bigText}
                  >{`@${userInfo.handle} hasn't posted anything yet!`}</p>
                </div>
              </div>
            ) : null}
          </>
        )}
        {segmentValue === "2" && <RenderAccountsList />}
      </div>

      <IonModal
        isOpen={showModal}
        //@ts-ignore
        cssClass={ss.modal}
        onDidDismiss={() => {
          setShowModal(false);
        }}
      >
        <ConnectAccountModal type={pageType} closeModal={setShowModal} />
      </IonModal>
    </div>
  );
});
export default MemberProfileModal;
