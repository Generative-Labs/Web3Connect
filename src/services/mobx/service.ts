import { action, makeAutoObservable, observable } from "mobx";
import React from "react";
import {PAGE_TYPE, WEB3_MQ_DID_TYPE} from "../../constant/enum";
import { Client } from "web3-mq";
import {getProfileRequest, getProfilesRequest} from "../../lens/lens/get-profile";
import { PROVIDER_ID_CONFIG } from "../../constant";
import {followers, following} from "../../lens/lens/follow";

export default class AppStore {
  @observable isMobile: boolean = window.innerWidth <= 600;
  @observable showLoading: boolean = false;
  @observable userInfo: any | null = null;
  @observable loginUserInfo: any | null = null;
  @observable pageType: PAGE_TYPE = PAGE_TYPE.PROFILE;
  @observable contacts: any[] = [];
  @observable currentContactsCount: number = 0;
  @observable followers: any[] = [];
  @observable currentFollowersCount: number = 0;
  @observable showModal: boolean = false;
  @observable userEmail: string = "";
  @observable userPhone: string = "";
  @observable isFollowed: boolean = false;
  @observable showChat: boolean = false;
  @observable client: Client | null = null;

  @action setShowModal(data: boolean) {
    this.showModal = data;
  }
  @action setShowChat(data: boolean) {
    this.showChat = data;
  }

  @action setIsMobile(data: boolean) {
    this.isMobile = data;
  }

  @action setShowLoading(data: boolean) {
    this.showLoading = data;
  }

  @action setUserPhone(data: string) {
    this.userPhone = data;
  }

  @action setUserEmail(data: string) {
    this.userEmail = data;
  }

  @action setPageType(data: PAGE_TYPE) {
    this.pageType = data;
  }

  @action setClient(data: Client) {
    this.client = data;
    this.client.on("contact.getList", this.handleEvent);
    this.client.on("message.delivered", this.handleEvent);
    this.client.on("message.getList", this.handleEvent);
  }

  handleEvent(event: any) {
    console.log(event, "event");
  }

  @action
  async getUserInfo(handle: string) {
    this.setShowLoading(true);
    try {
      this.userInfo = await getProfileRequest({
        handle,
      });
      this.setShowLoading(false);
    } catch (e) {
      this.setShowLoading(false);
    }
  }

  @action
  async setUserDid() {
    if (this.client) {
      this.setShowLoading(true);
      if (this.loginUserInfo.handle) {
        console.log("bind lens");
        await this.client.user
          .userBindDid({
            did_type: WEB3_MQ_DID_TYPE.LENS,
            did_value: this.loginUserInfo.handle,
            provider_id: PROVIDER_ID_CONFIG.lens,
          })
          .catch((e) => {
            console.log(e, "e");
          });
      }
      const myProfile = await this.client.user.getMyProfile().catch((e) => {
        console.log(e);
      });
      this.loginUserInfo.web3mqUserInfo = myProfile;
      console.log(myProfile, "myProfile");

      const dids = await this.client.user.getUserBindDids();
      console.log(dids, "dids");
      this.loginUserInfo.web3mq_dids = dids;
      if (dids && dids.length > 0) {
        let emailInfo = dids.find((item: any) => item.did_type === WEB3_MQ_DID_TYPE.EMAIL);
        if (emailInfo) {
          this.userEmail = emailInfo.did_value;
        }
        let phoneInfo = dids.find((item: any) => item.did_type === WEB3_MQ_DID_TYPE.PHONE);
        if (phoneInfo) {
          this.userPhone = phoneInfo.did_value;
        }
      }
      this.setShowLoading(false);
    }
  }

  @action
  async getContacts(address: string) {
    this.setShowLoading(true);
    const res = await following(address);
    if (res.items) {
      this.contacts = res.items.map(item => {
        return item.profile
      })
    } else {
      this.contacts = []
    }
    console.log(res, 'following')
    // this.contacts = [...oriChatData, ...data];
    this.setShowLoading(false);
  }

  @action
  async getFollowers(profileId: string) {
    this.setShowLoading(true);
    try {
      const res = await followers(profileId);
      console.log(res, "res");
      if (res.items) {
        let users = []
        for (let i = 0; i < res.items.length; i++) {
          let item = res.items[i]
          if (item.wallet.address) {
            const profile = await getProfilesRequest({
              ownedBy: item.wallet.address,
            });
            let userInfo = {}
            if (profile && profile.items && profile.items.length > 0) {
              userInfo = profile.items[0]
              users.push({
                address: item.wallet.address,
                ...userInfo
              })
            }
          }
        }
        this.followers = users
      }

      this.setShowLoading(false);
    } catch (e) {
      console.log(e, 'follow - e')
      this.setShowLoading(false);
    }
  }

  @action logout() {
    localStorage.clear();
    this.showLoading = false;
    this.loginUserInfo = null;
  }

  @action
  async setLoginUserInfo(lensProfile: any) {
    this.loginUserInfo = lensProfile;
    if (this.client) {
      this.setShowLoading(true);
      await this.setUserDid();
      this.setShowLoading(false);
    }
  }

  @action isLogin() {
    return !!this.loginUserInfo;
  }

  constructor() {
    makeAutoObservable(this); //even though this isn't required in some examples, this seems key line to making mobx work
  }
}

export const StoreContext = React.createContext(new AppStore());
export const StoreProvider = StoreContext.Provider;
export const useStore = () => React.useContext(StoreContext);
