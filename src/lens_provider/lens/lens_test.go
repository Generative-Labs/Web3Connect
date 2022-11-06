package lens

import (
	"fmt"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"testing"
)

func init() {
	ConfigInit("../configTest.json")
	PrivKeyInit()
	db.InitRedis()
}

func TestLens(t *testing.T) {
	bytes, err := hexutil.Decode("0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000116c656e7370726f746f636f6c2e74657374000000000000000000000000000000")
	fmt.Println(string(bytes))
	fmt.Println(err)
}

func TestSyncBlock(t *testing.T) {
	SyncBlock()
}

func TestGetLatestHeight(t *testing.T) {
	height, err := GetLatestHeight()
	fmt.Println(height)
	fmt.Println(err)
}

func TestGetPolygonSyncHeight(t *testing.T) {
	height, err := db.GetPolygonSyncHeight()
	fmt.Println(height)
	fmt.Println(err)
}

func TestGetDeletePendingEvent(t *testing.T) {
	events := db.GetPendingFollowEvents()
	fmt.Println(events)
}

func TestDecodeHex(t *testing.T) {
	s := "0x000000000000000000000000000000000000000000000000000000000000966b"
	decodeUint64, err := hexutil.Decode(s)
	encode := hexutil.Encode(decodeUint64)
	fmt.Println(decodeUint64)
	fmt.Println(encode)
	fmt.Println(err)
}

func TestGetHandleByProfileId(t *testing.T) {
	id, err := GetHandleByProfileId("0x67ee")
	fmt.Println(id)
	fmt.Println(err)
}

func TestGetLensOwnerAddress(t *testing.T) {
	address, err := GetLensOwnerAddress("web3mqwei.test")
	fmt.Println(address)
	fmt.Println(err)
}

func TestParseBlockTransactions(t *testing.T) {
	ParseBlockTransactions(35229823)
}

func TestPushPostEventsToWen3Mq(t *testing.T) {
	PushPostEventsToWen3Mq()
}

func TestPushFollowEventsToWen3Mq(t *testing.T) {
	PushFollowEventsToWen3Mq()
}
func TestGetOwnerOfProfileId(t *testing.T) {
	id, err := GetOwnerOfProfileId("0x00000000000000000000000000000000000000000000000000000000000050fe")
	fmt.Println(id)
	fmt.Println(err)
}

func TestGetProfileIdByHandle(t *testing.T) {
	handle, err := GetProfileIdByHandle("web3mquser.test")
	fmt.Println(handle)
	fmt.Println(err)
}

func TestGetUserIdByNftContract(t *testing.T) {
	fmt.Println(db.GetUserIdByNftContract("0x5c6bda17c9a89c83934a01ef8e5bf4de2a7fc811"))
}

func TestGetProfileIdByNftContract(t *testing.T) {
	contract := db.GetProfileIdByNftContract("0x5c6bda17c9a89c83934a01ef8e5bf4de2a7fc811")
	fmt.Println(contract)
}

func TestGetContractName(t *testing.T) {
	name, err := GetContractLensAccount("0xb1a3dD1b4203b85Ad9947ADBcA111193750cC6E5")
	fmt.Println(name)
	fmt.Println(err)
}
