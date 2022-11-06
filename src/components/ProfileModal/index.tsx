import React, { useCallback, useEffect, useState } from "react";
import ss from "./index.module.scss";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonToolbar,
} from "@ionic/react";
import { useStore } from "src/services/mobx/service";
import { observer } from "mobx-react-lite";
import cx from "classnames";
import userIcon from "../../assert/svg/user.svg";
import { PAGE_TYPE } from "../../constant/enum";
import { useHistory } from "react-router-dom";
import { closeOutline } from "ionicons/icons";
import {getIPFSLink, imageProxy} from "../../lens/utils";
import {COVER} from "../../constant";

const size = 20;

enum TAB_TYPE {
  CONTACTS = "contacts",
  FOLLOWERS = "followers",
  SEND_METHOD = "send_method",
  SEND_AUTH = "send_auth",
}

const tabConfig = {
  [PAGE_TYPE.SUBSCRIBERS]: {
    title: "Follow",
    value: PAGE_TYPE.SUBSCRIBERS,
  },
  [PAGE_TYPE.SETTING]: {
    title: "Setting",
    value: PAGE_TYPE.SETTING,
  },
  [PAGE_TYPE.PROFILE]: {
    title: "Profile",
    value: PAGE_TYPE.PROFILE,
  },
};

const pageTabConfig = {
  [PAGE_TYPE.SETTING]: [
    {
      title: "Send Method",
      value: TAB_TYPE.SEND_METHOD,
    },
    {
      title: "Send Auth",
      value: TAB_TYPE.SEND_AUTH,
    },
  ],
  [PAGE_TYPE.SUBSCRIBERS]: [
    {
      title: "Followers",
      value: TAB_TYPE.FOLLOWERS,
    },
    {
      title: "Following",
      value: TAB_TYPE.CONTACTS,
    },
  ],
  [PAGE_TYPE.PROFILE]: [],
};

const ProfileModal: React.FC = observer(() => {
  const store = useStore();
  const history = useHistory();
  const [tabType, setTabType] = useState<TAB_TYPE>();

  useEffect(() => {
    if (store.pageType === PAGE_TYPE.SUBSCRIBERS) {
      setTabType(TAB_TYPE.FOLLOWERS);
    } else {
      setTabType(TAB_TYPE.SEND_METHOD);
    }
  }, []);


  const RenderSubscribers = useCallback(() => {
    const users =
      tabType === TAB_TYPE.FOLLOWERS ? store.followers : store.contacts;
    return (
      <IonContent className={ss.contactsList}>
        {users.length > 0 &&
          users.map((user: any, index) => (
            <div
              key={index}
              className={ss.contactItem}
              onClick={async () => {
                if (user.ownedBy) {
                  history.push(`/home/${user.handle}`);
                  // store.emptyUserInfo();
                  await store.getUserInfo(user.ownedBy);
                  store.setShowModal(false);
                  store.setPageType(PAGE_TYPE.PROFILE);
                }
              }}
            >
              <img
                className={ss.avatar}
                src={
                    imageProxy(
                        getIPFSLink(user?.picture?.original?.url),
                        COVER
                    ) || userIcon}
                alt=""
              />
              <div className={ss.name}>{user.handle}</div>
            </div>
          ))}
      </IonContent>
    );
  }, [tabType, store.followers, store.contacts]);


  return (
    <div className={ss.body}>
      <IonHeader className={ss.header}>
        <IonToolbar>
          <div className={ss.headerTitle}>
            {tabConfig[store.pageType].title}
          </div>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                store.setShowModal(false);
                store.setPageType(PAGE_TYPE.PROFILE);
              }}
            >
              <IonIcon
                style={{ color: "#000" }}
                slot="icon-only"
                icon={closeOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className={ss.content}>
        <div className={ss.subscribersBox}>
          <div className={ss.tabs}>
            {pageTabConfig[store.pageType].map((item, index) => {
              return (
                <div
                  key={index}
                  className={cx(ss.tabsItem, {
                    [ss.tabsItemChecked]: tabType === item.value,
                  })}
                  onClick={() => {
                    setTabType(item.value);
                  }}
                >
                  {item.title}
                </div>
              );
            })}
          </div>

          <div className={ss.pageCommonContent}>
            {store.pageType === PAGE_TYPE.SUBSCRIBERS && <RenderSubscribers />}
          </div>
        </div>
      </div>
    </div>
  );
});
export default ProfileModal;
