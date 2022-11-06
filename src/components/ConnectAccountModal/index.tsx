import React, { useMemo, useState } from "react";
import ss from "./index.module.scss";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar, useIonLoading,
  useIonToast,
} from "@ionic/react";
import { observer } from "mobx-react-lite";
import { closeOutline } from "ionicons/icons";

import successIcon from "../../assert/svg/bindAccountSuccessIcon.svg";
import { useStore } from "../../services/mobx/service";
import { TextFieldTypes } from "@ionic/core";
import { PROVIDER_ID_CONFIG } from "../../constant";
import { WEB3_MQ_DID_TYPE } from "../../constant/enum";

export enum ACCOUNT_CONNECT_TYPE {
  PHONE = "phone",
  EMAIL = "email",
}

interface IAppProps {
  type: ACCOUNT_CONNECT_TYPE;
  closeModal: any;
}

const pageConfig = {
  [ACCOUNT_CONNECT_TYPE.EMAIL]: {
    headerTitle: "Connect to your email",
    placeholder: "Input your email",
    inputType: "email",
    contentTitle:
      "We’ll send you a one-time verification code to comfirm your email.",
    stepTwoContentTitle: "Please enter 6-digit code sent to you email",
    successTitle: "Send success",
    successSubTitle: "Please check your email",
  },
  [ACCOUNT_CONNECT_TYPE.PHONE]: {
    headerTitle: "Connect to your phone number",
    placeholder: "Input your phone",
    inputType: "tel",
    contentTitle:
      "We’ll text you a one-time verification code to comfirm your number.",
    stepTwoContentTitle: "Please enter 6-digit code sent to you phone",
    successTitle: "Your phone is verified",
    successSubTitle:
      "Congratulation! Your phone number successfully links to your Web3MQ.",
  },
};

const ConnectAccountModal: React.FC<IAppProps> = observer((props) => {
  const { type, closeModal } = props;
  const store = useStore();
  const [openToast] = useIonToast();
  const [openLoading, closeLoading] = useIonLoading();

  const [step, setStep] = useState<number>(1);
  const [inputValue, setInputValue] = useState(
    type === ACCOUNT_CONNECT_TYPE.PHONE ? "+1" : ""
  );
  const [codeValue, setCodeValue] = useState("");

  const sendAccountConnectCode = async () => {
    if (store.client) {
      await openLoading('Loading');
      const res = await store.client.user.userBindDid({
        provider_id:
          type === ACCOUNT_CONNECT_TYPE.PHONE
            ? PROVIDER_ID_CONFIG.sms
            : PROVIDER_ID_CONFIG.email,
        did_type:
          type === ACCOUNT_CONNECT_TYPE.EMAIL
            ? WEB3_MQ_DID_TYPE.EMAIL
            : WEB3_MQ_DID_TYPE.PHONE,
        did_value: inputValue,
      });
      console.log(res, "res");
      await closeLoading();
      if (res.code === 0) {
        await openToast(res.msg, 3000);
        if (type === ACCOUNT_CONNECT_TYPE.EMAIL) {
          setStep(3);
        } else {
          if (res.data && res.data.verification_key) {
            localStorage.setItem(
              "sms_verification_key",
              res.data.verification_key
            );
          }
          setStep(2);
        }
      }
    }
  };
  const verifyAccountConnect = async () => {
    if (store.client) {
      const res = await store.client.user.userBindDid({
        provider_id: PROVIDER_ID_CONFIG.sms,
        did_type: WEB3_MQ_DID_TYPE.PHONE,
        did_value: inputValue,
        did_content: `${localStorage.getItem(
          "sms_verification_key"
        )}@${codeValue}`,
        did_action: "verification",
      });
      console.log(res, "res");
    }

    setStep(3);
  };

  const handleConnectSuccess = async () => {
    if (store.client) {
      await openLoading('Loading');
      const dids = await store.client.user.getUserBindDids();
      await closeLoading();
      if (dids.length > 0) {
        let didInfo = null;
        if (type === ACCOUNT_CONNECT_TYPE.EMAIL) {
          didInfo = dids.find(
            (item: any) => item.did_type === WEB3_MQ_DID_TYPE.EMAIL
          );
          if (didInfo) {
            store.setUserEmail(didInfo.did_value);
            closeModal();
          }
        } else {
          didInfo = dids.find(
            (item: any) => item.did_type === WEB3_MQ_DID_TYPE.PHONE
          );
          if (didInfo) {
            store.setUserPhone(didInfo.did_value);
            closeModal();
          }
        }
      } else {
        closeModal();
      }
    }
  };

  const isEmail = useMemo(() => {
    return /^[a-zA-Z0-9_.-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
      inputValue
    );
  }, [inputValue]);

  return (
    <IonPage className={ss.page}>
      <IonHeader className={ss.header}>
        <IonToolbar>
          <IonTitle>{pageConfig[type].headerTitle}</IonTitle>
          <IonButtons slot="end" className="ion-close-icon done-button">
            <IonButton onClick={closeModal}>
              <IonIcon
                style={{ color: "#000" }}
                slot="icon-only"
                icon={closeOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={ss.content}>
        {step === 1 && (
          <div className={ss.contentBox}>
            <div className={ss.contentTitle}>
              {pageConfig[type].contentTitle}
            </div>
            <div className={ss.inputBox}>
              <div className={ss.inputHeader}>{type}</div>
              <IonInput
                className={ss.input}
                value={inputValue}
                onIonChange={(e) => {
                  let value = e.detail.value!;
                  setInputValue(value);
                }}
                placeholder={pageConfig[type].placeholder}
                type={pageConfig[type].inputType as TextFieldTypes}
                onIonBlur={() => {}}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={ss.contentBox}>
            <div className={ss.contentTitle}>
              {pageConfig[type].stepTwoContentTitle}
            </div>
            <div className={ss.inputBox}>
              <div className={ss.inputHeader}>Code</div>
              <IonInput
                className={ss.input}
                value={codeValue}
                onIonChange={(e) => {
                  let value = e.detail.value!;
                  setCodeValue(value);
                }}
                placeholder="000-000"
              />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={ss.contentBox}>
            <div className={ss.successBox}>
              <img src={successIcon} alt="" />
              <div className={ss.successTitle}>
                {pageConfig[type].successTitle}
              </div>
              <div className={ss.successSubTitle}>
                {pageConfig[type].successSubTitle}
              </div>
            </div>
          </div>
        )}
      </IonContent>
      <IonFooter className={ss.footer}>
        {step === 1 && (
          <IonButton
            className={ss.actionButton}
            expand="block"
            disabled={
              type === ACCOUNT_CONNECT_TYPE.EMAIL ? !isEmail : !inputValue
            }
            onClick={sendAccountConnectCode}
          >
            Next
          </IonButton>
        )}
        {step === 2 && (
          <IonButton
            className={ss.actionButton}
            expand="block"
            disabled={!codeValue}
            onClick={verifyAccountConnect}
          >
            Verify
          </IonButton>
        )}
        {step === 3 && (
          <IonButton
            className={ss.actionButton}
            expand="block"
            onClick={handleConnectSuccess}
          >
            Great
          </IonButton>
        )}
      </IonFooter>
    </IonPage>
  );
});
export default ConnectAccountModal;
