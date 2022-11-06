import React, { useEffect } from "react";

import ss from "./index.module.scss";
import {IonLoading, IonModal, useIonLoading, useIonToast} from "@ionic/react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../services/mobx/service";
import { RouteComponentProps } from "react-router";
import MemberProfileModal from "../../components/MemberProfileModal";
import ProfileModal from "../../components/ProfileModal";
import Header from "../Header";
import HomePageSkeleton from "../../components/Skeletons/HomePageSkeleton/HomePageSkeleton";
import { PAGE_TYPE } from "../../constant/enum";
import { Client } from "web3-mq";
import useLogin from "../../hooks/useLogin";
import { getUserInfoByJWT, TOKEN_KEY, tokenMgr } from "../../constant/utils";
import Web3MQChat from "../../components/Web3MQChat";
import { useHistory } from "react-router-dom";
import {getProfiles} from "../../lens/api";

interface MatchParams {
  handle: string;
}

const Home: React.FC<RouteComponentProps<MatchParams>> = observer((props) => {
  const lensHandle = props.match.params.handle;
  const store = useStore();
  const history = useHistory();
  const [open] = useIonToast();
  const [openLoading, closeLoading] = useIonLoading();
  const { keys, init, signMetaMask, lensToken } = useLogin();

  if (!keys || !lensToken) {
    history.push("/auth");
    return null;
  }
  useEffect(() => {
    // if (!store.userInfo) {
    console.log(lensHandle, "set lens user info");
    store.getUserInfo(lensHandle).then();
    // }
  }, [lensHandle]);
  const initRender = async () => {
    if (!store.loginUserInfo) {
      await openLoading('Loading');
      await init();
      store.setClient(Client.getInstance(keys));
      let address = getUserInfoByJWT().id;
      const profile = await getProfiles(address)
      if (profile && profile.items && profile.items.length > 0) {
        await store.setLoginUserInfo(profile.items[0]);
      }
      // history.push(`/home/${store.loginUserInfo.handle}`);
      await closeLoading();
    }
  };

  useEffect(() => {
    // 保证事件只挂载一次  避免重复render
    window.addEventListener("resize", () => {
      store.setIsMobile(window.innerWidth <= 600);
    });
    initRender();
  }, []);
  return (
    <div className={ss.profileContainer}>
      <Header isMobile={store.isMobile} isLensStyle={true} />
      <div className={ss.profileContentBox}>
        <div className={ss.profileContent}>
          {!store.userInfo ? (
            <HomePageSkeleton />
          ) : (
            <MemberProfileModal
              isLensStyle={true}
              userInfo={store.userInfo}
              isMobile={store.isMobile}
            />
          )}
        </div>
      </div>
      {store.showChat && store.client && <Web3MQChat />}
      <IonModal
        isOpen={store.showModal}
        //@ts-ignore
        cssClass={ss.modal}
        onDidDismiss={() => {
          store.setShowModal(false);
          store.setPageType(PAGE_TYPE.PROFILE);
        }}
      >
        <ProfileModal />
      </IonModal>
    </div>
  );
});
export default Home;
