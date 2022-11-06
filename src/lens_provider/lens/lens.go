package lens

import (
	"bytes"
	"encoding/hex"
	"errors"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	"github.com/ethereum/go-ethereum/common/hexutil"
	jsoniter "github.com/json-iterator/go"
	"log"
	"strings"
	"time"
)

const (
	TopicFollow            = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
	TopicFollowNFTDeployed = "0x44403e38baed5e40df7f64ff8708b076c75a0dfda8380e75df5c36f11a476743"
	TopicPostCreated       = "0xc672c38b4d26c3c978228e99164105280410b144af24dd3ed8e4f9d211d96a50"
	LPPMint                = "0x4e14f57cff7910416f2ef43cf05019b5a97a313de71fec9344be11b9b88fed12"

	ABIGetProfileIdByHandle = "0x20fa728a" + "0000000000000000000000000000000000000000000000000000000000000020"
	ABIGetOwnerOfProfileId  = "0x6352211e"
	ABIDefaultProfile       = "0x92254a62"
	ABIOwnerOfIndex         = "0x2f745c59"
	ABIName                 = "0x06fdde03"
	ABIGetHandle            = "0xec81d194"
	ABIFollow               = "0xfb78ae6c"
	ABIFollowWithSign       = "0x8e4fd6a9"
	ABIPost                 = "0x963ff141"
	//ABIPostWithSign         = "0x963ff141"
	ABIProxyCreateProfile = "0x07e5f948"
)

var ABISet map[string]interface{}
var ContractSet map[string]interface{}

func init() {
	ABISet = make(map[string]interface{})
	ABISet[ABIFollow] = ""
	ABISet[ABIFollowWithSign] = ""
	ABISet[ABIPost] = ""
	ABISet[ABIProxyCreateProfile] = ""

}

func SyncBlockTicker(interval int64) {
	ticker := time.NewTicker(time.Duration(interval) * time.Second)
	log.Printf("SyncBlock second %v", interval)
	for range ticker.C {
		SyncBlock()
	}
}

func SyncBlock() {
	height, err := db.GetPolygonSyncHeight()
	if err != nil {
		log.Printf("SyncBlock GetPolygonSyncHeight err: %v", err)
		return
	}
	latestHeight, err := GetLatestHeight()
	if err != nil {
		log.Printf("SyncBlock GetLatestHeight err: %v", err)
		return
	}
	if latestHeight < height {
		return
	}
	for i := height + 1; i < latestHeight; i++ {
		result := ParseBlockTransactions(i)
		if !result {
			log.Printf("SyncBlock ParseBlockTransactions false:%v", i)
			return
		}
		err = db.UpdateSyncHeight(i)
		if err != nil {
			log.Printf("SyncBlock UpdateSyncHeight error:%v", err)
			return
		}
	}

}

func ParseBlockTransactions(blockNumber uint64) bool {
	// fmt.Println("ParseBlockTransactions height  ", blockNumber)

	blockNumberHex := hexutil.EncodeUint64(blockNumber)
	result, err := JsonRpcPost(PolygonRpc, EthGetBlockByNumber, blockNumberHex, "true")
	if err != nil || bytes.Equal(result, []byte{}) || jsoniter.Get(result, "error").ToString() != "" {
		errorMsg := string(result)
		if errorMsg == "" {
			errorMsg = "result is none"
		}
		log.Printf("ParseBlockTransactions err: %v", errorMsg)
		return false
	}
	block := jsoniter.Get(result, "result")
	txIDs := block.Get("transactions")
	if block.Get("transactions").Size() == 0 && block.Get("difficulty").ToString() != "0x0" {
		return false
	}
	err = ParseTransactions(txIDs)
	if err != nil {
		return false
	}
	return true
}

func ParseTransactions(txIDs jsoniter.Any) error {
	for transactionIndex := 0; transactionIndex < txIDs.Size(); transactionIndex++ {
		txId := txIDs.Get(transactionIndex, "hash").ToString()
		toAddress := txIDs.Get(transactionIndex, "to").ToString()
		fromAddress := txIDs.Get(transactionIndex, "from").ToString()
		if toAddress == "" || fromAddress == "" {
			continue
		}
		if _, ok := ContractSet[toAddress]; !ok {
			continue
		}
		data := txIDs.Get(transactionIndex, "input").ToString()
		if _, ok := ABISet[data[:10]]; !ok {
			continue
		}
		logs, err := GetTransactionReceipt(txId)
		if err != nil {
			continue
		}
		for logIndex := 0; logIndex < logs.Size(); logIndex++ {
			topic := logs.Get(logIndex, "topics", 0).ToString()
			if topic == TopicFollow {
				err := EventLogDealFollow(logs, logIndex)
				if err != nil {
					return err
				}
			} else if topic == TopicFollowNFTDeployed {
				err := EventLogProfileDeploy(logs, logIndex)
				if err != nil {
					return err
				}
			} else if topic == TopicPostCreated {
				err := EventLogPostCreated(logs, logIndex)
				if err != nil {
					return err
				}
			} else if topic == LPPMint {
				err := EventLogMintLpp(logs, logIndex)
				if err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func EventLogProfileDeploy(logs jsoniter.Any, logIndex int) error {
	profileIdHex := logs.Get(logIndex, "topics", 1).ToString()
	followerNFTContract := logs.Get(logIndex, "topics", 2).ToString()
	followerNftAddress := "0x" + followerNFTContract[26:]
	lensAccount, err := GetHandleByProfileId(profileIdHex)
	address, err := GetOwnerOfProfileId(profileIdHex)
	err = db.SetProfileIdToLensAccount(profileIdHex, lensAccount)
	err = db.SetProfileIdToAddress(profileIdHex, address)
	err = db.SetContractProfile(followerNftAddress, profileIdHex)
	err = db.SetLensAccountToFollowContract(lensAccount, followerNftAddress)

	if err != nil {
		log.Printf("ParseBlockTransactions redis SetContractProfile err:%v", err)
		return err
	}
	return nil
}

func EventLogDealFollow(logs jsoniter.Any, logIndex int) error {
	followerNftAddress := logs.Get(logIndex, "address").ToString()
	follower := logs.Get(logIndex, "topics", 2).ToString()
	followerAddress := "0x" + follower[26:]
	err := db.SetPushAndFollower(followerNftAddress, followerAddress)
	if err != nil {
		log.Printf("ParseBlockTransactions redis SetPushAndFollower err:%v", err)
		return err
	}
	return nil
}

func EventLogMintLpp(logs jsoniter.Any, logIndex int) error {
	profileId := logs.Get(logIndex, "topics", 1).ToString()
	owner := logs.Get(logIndex, "topics", 3).ToString()
	ownerAddress := "0x" + owner[26:]
	err := db.SetWalletToProfileId(ownerAddress, profileId)
	if err != nil {
		log.Printf("ParseBlockTransactions redis SetPushAndFollower err:%v", err)
		return err
	}
	return nil
}

func EventLogPostCreated(logs jsoniter.Any, logIndex int) error {
	data := logs.Get(logIndex, "data").ToString()
	transactionHash := logs.Get(logIndex, "transactionHash").ToString()
	if len(data) < 64*8 {
		return errors.New("data is not long enough")
	}
	urlLength, err := hexutil.DecodeUint64("0x" + strings.TrimLeft(data[386:450], "0"))
	if err != nil {
		return err
	}
	urlHex := data[450 : 450+urlLength*2]
	postUrl, err := hex.DecodeString(urlHex)
	if err != nil {
		return err
	}
	postContent, err := Get(string(postUrl))
	if err != nil {
		return err
	}
	err = db.SetTxHashPostContent(transactionHash, string(postContent))
	err = db.SetTxHashPost(transactionHash, string(postUrl))
	return err
}

func GetTransactionReceipt(txHash string) (jsoniter.Any, error) {
	result, err := JsonRpcPost(PolygonRpc, EthGetTransactionReceipt, txHash)
	if err != nil {
		return nil, err
	}
	logs := jsoniter.Get(result, "result", "logs")
	return logs, nil
}
