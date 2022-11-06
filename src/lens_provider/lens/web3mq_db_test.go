package lens

import (
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	"testing"
)

func init() {
	ConfigInit("../config.json")
	PrivKeyInit()
	db.InitRedis()
}

func TestSyncPage(t *testing.T) {
	SyncPage(1)
}

func TestSyncWeb3UserWallets(t *testing.T) {
	SyncWeb3UserWallets(10)
}
