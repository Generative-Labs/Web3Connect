package lens

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	jsoniter "github.com/json-iterator/go"
	"io/ioutil"
	"net/http"
	"time"
)

const DidTypeLens = "lens.xyz"

type CallProviderReqData struct {
	UserID    string `json:"userid" validate:"userid,required"`
	DidType   string `json:"did_type" validate:"did_type,required"`
	DidValue  string `json:"did_value" validate:"did_value,required"`
	Action    string `json:"action" validate:"action,required"`
	Timestamp uint64 `json:"timestamp" validate:"timestamp,required"`
}

type ProviderCallbackReqData struct {
	UserID     string                 `json:"userid" validate:"userid,required"`
	ProviderID string                 `json:"provider_id" validate:"provider_id,required"`
	DidType    string                 `json:"did_type" validate:"did_type,required"`
	DidValue   string                 `json:"did_value" validate:"did_value,required"`
	Metadata   map[string]interface{} `json:"metadata" validate:"metadata,required"`
	Timestamp  uint64                 `json:"timestamp" validate:"timestamp,required"`
	Signature  string                 `json:"provider_signature" validate:"provider_signature,required"`
}

func LensOwnerAPI(w http.ResponseWriter, request *http.Request) {
	respData := &HttpCommonRespose{Code: 0, Msg: "Ok"}

	if request.Method != "POST" {
		respData.Code = 405
		respData.Msg = "Method not allowed"
		JsonResponse(w, respData)
		return
	}
	decoder := json.NewDecoder(request.Body)
	var reqData CallProviderReqData
	err := decoder.Decode(&reqData)
	if err != nil || reqData.DidType != DidTypeLens {
		respData.Code = 400
		respData.Msg = "Invalid request params"
		JsonResponse(w, respData)
		return
	}

	fmt.Println("LensOwnerAPI: ", reqData.DidValue, " reqData", reqData)
	address, err := GetLensOwnerAddress(reqData.DidValue)
	if err != nil {
		respData.Code = 400
		respData.Msg = err.Error()
		JsonResponse(w, respData)
		return
	}

	go CallBackWeb3Mq(address, reqData)

	respData.Code = 0
	JsonResponse(w, respData)
}

func CallBackWeb3Mq(address string, reqData CallProviderReqData) bool {
	metadata := make(map[string]interface{})
	metadata["address"] = address

	timestamp := uint64(time.Now().UnixNano()) / uint64(time.Millisecond)

	// signContent := fmt.Sprint(ProviderId, reqData.UserID, metadata, timestamp)
	signContent := fmt.Sprint(
		ProviderId,
		reqData.UserID,
		reqData.DidType,
		reqData.DidValue,
		timestamp,
	)

	signature, err := PrivKey.Sign([]byte(signContent))
	encodeSignature := base64.StdEncoding.EncodeToString(signature)
	if err != nil {
		return false
	}

	callBackReqData := &ProviderCallbackReqData{
		UserID:     reqData.UserID,
		ProviderID: ProviderId,
		DidType:    reqData.DidType,
		DidValue:   reqData.DidValue,
		Timestamp:  timestamp,
		Metadata:   metadata,
		Signature:  encodeSignature,
	}

	callBackReqDataBytes, _ := json.Marshal(callBackReqData)

	req, err := http.NewRequest("POST", Web3MqNode+"/api/provider_callback/", bytes.NewBuffer(callBackReqDataBytes))
	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(">>>CallBackWeb3Mq ", err.Error())
		return false
	} else {
		body, err := ioutil.ReadAll(resp.Body)
		if err == nil {
			fmt.Println(">>>CallBackWeb3Mq ioutil.ReadAll", string(body))
		} else {
			fmt.Println(">>>CallBackWeb3Mq ioutil.ReadAll", err.Error())
		}

	}
	return false
}

type UserWallet struct {
	UserId        string `json:"userid"`
	WalletAddress string `json:"wallet_address"`
	WalletType    string `json:"wallet_type"`
	Timestamp     uint64 `json:"timestamp" validate:"timestamp,required"`
}

type CallWeb3MqUserWalletReqData struct {
	ProviderID string `json:"provider_id" validate:"provider_id,required"`
	Timestamp  uint64 `json:"timestamp" validate:"timestamp,required"`
	Page       uint64 `json:"page" validate:"page,required"`
	Size       uint64 `json:"size" validate:"size,required"`
	Signature  string `json:"provider_signature" validate:"provider_signature,required"`
}

func GetWeb3UserWallets(page, size uint64) ([]UserWallet, error) {
	var userWallets []UserWallet
	url := Web3MqNode + "/api/provider/get_user_wallets/"
	timestamp := uint64(time.Now().UnixNano()) / uint64(time.Millisecond)
	signContent := fmt.Sprint(
		ProviderId,
		timestamp,
	)

	signature, err := PrivKey.Sign([]byte(signContent))
	encodeSignature := base64.StdEncoding.EncodeToString(signature)
	if err != nil {
		return nil, err
	}
	reqData := CallWeb3MqUserWalletReqData{
		ProviderID: ProviderId,
		Timestamp:  timestamp,
		Page:       page,
		Size:       size,
		Signature:  encodeSignature,
	}

	callWeb3MqData, _ := json.Marshal(reqData)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(callWeb3MqData))
	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(">>>GetWeb3UserWallets ", err.Error())
		return nil, err
	} else {
		body, err := ioutil.ReadAll(resp.Body)
		// fmt.Println(string(body))
		if err != nil {
			fmt.Println(">>>GetWeb3UserWallets ioutil.ReadAll", err.Error())
			return nil, err
		}
		code := jsoniter.Get(body, "code").ToInt()
		if code != 0 {
			fmt.Println(">>>GetWeb3UserWallets code error", string(body))
			return nil, err
		}
		data := jsoniter.Get(body, "data", "user_list").ToString()

		err = json.Unmarshal([]byte(data), &userWallets)
		if err != nil {
			fmt.Println(">>>GetWeb3UserWallets userWallets Unmarshal", err.Error())
			return nil, err
		}
		return userWallets, nil
	}
}

type CallWeb3MqNotifyReqData struct {
	ProviderID string `json:"provider_id" validate:"provider_id,required"`
	UserID     string `json:"userid" validate:"userid,required"`
	DidType    string `json:"did_type" validate:"did_type,required"`
	DidValue   string `json:"did_value" validate:"did_value,required"`
	EventType  string `json:"event_type" validate:"event_type,required"`
	Title      string `json:"title" validate:"title,required"`
	Content    string `json:"content" validate:"content,required"`
	Timestamp  uint64 `json:"timestamp" validate:"timestamp,required"`
	Signature  string `json:"web3mq_signature" validate:"web3mq_signature,required"`
}

func NotifyWeb3Mq(eventType, userid, lensAccount, title, content string) (bool, error) {

	url := Web3MqNode + "/api/provider_notification/"
	timestamp := uint64(time.Now().UnixNano()) / uint64(time.Millisecond)
	signContent := fmt.Sprint(
		ProviderId,
		userid,
		lensAccount,
		timestamp,
	)
	signature, err := PrivKey.Sign([]byte(signContent))
	encodeSignature := base64.StdEncoding.EncodeToString(signature)
	if err != nil {
		return false, err
	}

	reqData := CallWeb3MqNotifyReqData{
		ProviderID: ProviderId,
		UserID:     userid,
		DidType:    DidTypeLens,
		DidValue:   lensAccount,
		EventType:  eventType,
		Title:      title,
		Content:    content,
		Timestamp:  timestamp,
		Signature:  encodeSignature,
	}

	callWeb3MqData, _ := json.Marshal(reqData)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(callWeb3MqData))
	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(">>>NotifyWeb3Mq ", err.Error())
		return false, err
	} else {
		body, err := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))
		if err != nil {
			fmt.Println(">>>NotifyWeb3Mq ioutil.ReadAll", err.Error())
			return false, err
		}
		code := jsoniter.Get(body, "code").ToInt()
		if code != 0 {
			fmt.Println(">>>NotifyWeb3Mq code error", string(body))
			return false, err
		}
		return true, nil
	}

}
