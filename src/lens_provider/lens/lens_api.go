package lens

import (
	"bytes"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/json-iterator/go"
	"io/ioutil"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

const (
	EthCall                  = "eth_call"
	EthGetBlockByNumber      = "eth_getBlockByNumber"
	EthGetTransactionReceipt = "eth_getTransactionReceipt"

	ZeroFillAddress = "0x0000000000000000000000000000000000000000"
	JsonRpcData     = `{"jsonrpc":"2.0","id":"1","method":"%s","params":[%s]}`
	TxData          = `{"from":"%v", "to":"%v", "data":"%v"}`
)

func GetProfileIdByHandle(lensAccount string) (string, error) {
	length := len(lensAccount)
	lengthHex := hexutil.EncodeUint64(uint64(length))[2:]
	lensLengthHexFill := fmt.Sprintf("%064s", lengthHex)

	lensAccountHex := hexutil.Encode([]byte(lensAccount))[2:]
	lensAccountHexFill := fmt.Sprintf(lensAccountHex+"%0"+strconv.Itoa(64-len(lensAccountHex))+"s", "")

	data := ABIGetProfileIdByHandle + lensLengthHexFill + lensAccountHexFill
	transaction := fmt.Sprintf(TxData, ZeroFillAddress, LensContractAddress, data)
	postResult, err := JsonRpcPost(PolygonRpc, EthCall, transaction, "latest")
	if err != nil {
		return "", err
	}
	tokenId := jsoniter.Get(postResult, "result").ToString()
	if len(tokenId) <= 2 {
		return "", errors.New("this lens account not found")
	}
	return tokenId, nil
}

func GetLensOwnerAddress(lensAccount string) (string, error) {
	profileId, err := GetProfileIdByHandle(lensAccount)
	if err != nil {
		return "", err
	}
	address, err := GetOwnerOfProfileId(profileId)
	return address, err
}

func GetHandleByProfileId(profileId string) (string, error) {
	HexFill := fmt.Sprintf("%064"+"s", profileId[2:])
	transaction := fmt.Sprintf(TxData, ZeroFillAddress, LensContractAddress, ABIGetHandle+HexFill)
	postResult, err := JsonRpcPost(PolygonRpc, EthCall, transaction, "latest")
	if err != nil {
		return "", err
	}
	lensAccount := jsoniter.Get(postResult, "result").ToString()
	if len(lensAccount) != 194 {
		return "", errors.New("the profile id not found")
	}
	accountHex := strings.TrimRight(lensAccount[130:], "0")
	account, err := hex.DecodeString(accountHex)
	return string(account), err
}

func GetOwnerOfProfileId(tokenId string) (string, error) {
	transaction := fmt.Sprintf(TxData, ZeroFillAddress, LensContractAddress, ABIGetOwnerOfProfileId+tokenId[2:])
	postResult, err := JsonRpcPost(PolygonRpc, EthCall, transaction, "latest")
	if err != nil {
		return "", err
	}
	owner := jsoniter.Get(postResult, "result").ToString()
	if len(owner) != 66 {
		return "", errors.New("the profile id not has owner")
	}
	return owner[:2] + owner[26:], nil
}

func GetLatestHeight() (uint64, error) {
	postResult, err := JsonRpcPost(PolygonRpc, "eth_blockNumber")
	if err != nil {
		return 0, err
	}
	heightHex := jsoniter.Get(postResult, "result").ToString()
	decodeUint64, err := hexutil.DecodeUint64(heightHex)
	if err != nil {
		return 0, err
	}
	return decodeUint64, nil
}

func GetContractLensAccount(contractAddress string) (string, error) {
	transaction := fmt.Sprintf(TxData, ZeroFillAddress, contractAddress, ABIName)
	postResult, err := JsonRpcPost(PolygonRpc, "eth_call", transaction, "latest")
	if err != nil {
		return "", err
	}
	contractName := jsoniter.Get(postResult, "result").ToString()
	nameHex := strings.TrimRight(contractName[130:], "0")
	nameByte, err := hex.DecodeString(nameHex)
	name := string(nameByte)
	return name[:len(name)-len("-Follower")], err
}

func JsonRpcPost(url, method string, RPCParams ...string) ([]byte, error) {
	for i, str := range RPCParams {
		if str == "true" || str == "null" || str == "false" {
			continue
		}
		if quote, err := regexp.MatchString(`^\d+(\.\d+)?$`, str); err == nil && quote {
			continue
		}
		if quote, err := regexp.MatchString(`^[a-zA-Z0-9*-]+$`, str); err == nil && quote {
			RPCParams[i] = fmt.Sprintf(`"%s"`, RPCParams[i])
		}
	}
	params := strings.Join(RPCParams, `,`)
	postString := fmt.Sprintf(JsonRpcData, method, params)
	req, err := http.NewRequest("POST", url, bytes.NewBufferString(postString))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return []byte(""), err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err == nil {
		errorMsg := jsoniter.Get(body, "error").ToString()
		if errorMsg != "" {
			err = errors.New(errorMsg)
		}
	}
	return body, err
}

func Get(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return []byte(""), err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err == nil {
		errorMsg := jsoniter.Get(body, "error").ToString()
		if errorMsg != "" {
			err = errors.New(errorMsg)
		}
	}
	return body, err
}
