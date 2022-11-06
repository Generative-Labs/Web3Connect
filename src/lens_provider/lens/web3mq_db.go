package lens

import (
	"fmt"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	"log"
	"time"
)

const (
	RequestPageSize = 20
)

func SyncWeb3UserWallets(interval int64) {
	page, err := db.GetUserWalletsPage()
	if err != nil {
		log.Fatalf("SyncWeb3UserWallets page get error:%v", err)
	}
	ticker := time.NewTicker(time.Duration(interval) * time.Second)
	for range ticker.C {
		for ; ; page++ {
			if !SyncPage(page) {
				break
			}
			err = db.UpdateUserWalletPage(page)
			if err != nil {
				log.Fatalf("SyncWeb3UserWallets update page error:%v", err)
			}
		}
	}
}

func SyncPage(page uint64) bool {
	wallets, err := GetWeb3UserWallets(page, RequestPageSize)
	if err != nil {
		log.Fatalf("SyncWeb3UserWallets GetWeb3UserWallets error:%v", err)
	}
	for _, wallet := range wallets {
		err := db.SetNxUserWallet(wallet.WalletAddress, wallet.UserId)
		if err != nil {
			fmt.Println("SyncWeb3UserWallets SetUserWallet error:", err.Error())
		}
	}
	if len(wallets) == RequestPageSize {
		return true
	}
	return false
}
