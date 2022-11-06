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
import useLogin from "../../hooks/useLogin";
import { useHistory } from "react-router-dom";
import {useStore} from "../../services/mobx/service";
import {observer} from "mobx-react-lite";

const Web3MQChat: React.FC = () => {
  const history = useHistory();
  const store = useStore()
  const { keys, init } = useLogin();
  useEffect(() => {
    const initRender = async () => {
      await init()
      if (!keys) {
        history.push('/auth')
        return null
      }
      store.setClient(Client.getInstance(keys))
    }

    initRender()
  }, []);
  if (!store.client) {
    return null
  }

  return (
      <Chat
          client={store.client}
          appType={AppTypeEnum["pc"]}
          logout={() => {

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
  );
};

export default observer(Web3MQChat);
