package lens

import (
	"fmt"
	"testing"
)

func init() {
	ConfigInit("../config.json")
	PrivKeyInit()
}

func TestGetUserWallets(t *testing.T) {
	wallets, err := GetWeb3UserWallets(1, 20)
	fmt.Println(wallets)
	fmt.Println(wallets[0].UserId)
	fmt.Println(err)
}
