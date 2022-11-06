package main

import (
	"fmt"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/lens"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
	"log"
	"net/http"
)

var (
	cfg  = pflag.StringP("config", "c", "", "config file path.")
	port = pflag.StringP("port", "p", "8080", "http port.")
)

func init() {
	pflag.Parse()
	lens.ConfigInit(*cfg)
	lens.PrivKeyInit()
	db.InitRedis()
}

func main() {
	// sync all web3 user wallets first
	// lens.SyncWeb3UserWallets(viper.GetInt64("sync_web3mq_interval"))

	go lens.SyncWeb3UserWallets(viper.GetInt64("sync_web3mq_interval"))
	go lens.SyncBlockTicker(viper.GetInt64("sync_polygon_interval"))
	go lens.PushWeb3Ticker(viper.GetInt64("push_web3mq_interval"))
	http.HandleFunc("/lens/owner", lens.LensOwnerAPI)
	fmt.Println("Listening on port:", *port)
	err := http.ListenAndServe(fmt.Sprint(":", *port), nil)
	if err != nil {
		log.Fatal(err)
	}
}
