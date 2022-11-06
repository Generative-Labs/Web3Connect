import React, { useEffect, useState } from "react";
import { Client } from "web3-mq";
import {
  Chat,
  Channel,
  Main,
  DashBoard,
  AppTypeEnum,
  Window,
  MessageHeader,
  MessageList,
  MessageInput,
} from "web3-mq-react";
import "web3-mq-react/dist/css/index.css";
import MsgInput from "../MsgInput";
import { useStore } from "../../services/mobx/service";
import ss from "./index.module.css";
import {closeOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";

const Web3MQChat: React.FC = () => {
  const store = useStore();

  if (!store.client) {
    return null;
  }
  return (
    <div className={ss.chatBox}  >
      <div className={ss.chatHeader}>
        <img
          className={ss.homeIcon}
          src='https://web3mq-docs.pages.dev/images/web3mq.logo.png'
          alt=""
        />
        <IonIcon
            style={{ color: "#000", fontSize: '16px' }}
            slot="icon-only"
            icon={closeOutline}
        />
      </div>
      <div className={ss.chatContent} style={{ height: '600px' }}>
        <Chat
            client={store.client}
            appType={AppTypeEnum["h5"]}
            logout={() => {
              console.log(123, "123");
            }}
            style={{
              width: "400px",
              height: "600px",
            }}
        >
          <DashBoard />
          <Main />
          <Channel>
            <Window>
              <MessageHeader avatarSize={40} />
              <MessageList />
              <MessageInput Input={MsgInput} />
            </Window>
            {/* <Thread />
        <AllThreadList /> */}
          </Channel>
        </Chat>

      </div>


    </div>
  );
};

export default Web3MQChat;
