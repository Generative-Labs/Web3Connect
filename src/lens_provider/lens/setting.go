package lens

import (
	"fmt"
	"github.com/spf13/viper"
	"log"
	"strings"
)

var (
	ProviderKeyHex       string
	ProviderId           string
	Web3MqNode           string
	LensContractAddress  string
	ProfileCreationProxy string
	PolygonRpc           string
)

func ConfigInit(cfg string) {
	if cfg != "" {
		fmt.Println("配置文件:", cfg)
		viper.SetConfigFile(cfg)
	} else {
		viper.AddConfigPath("./")
		viper.SetConfigName("config.json")
	}
	viper.SetConfigType("json")
	viper.AutomaticEnv()
	viper.SetEnvPrefix("Lens")
	replacer := strings.NewReplacer(".", "_")
	viper.SetEnvKeyReplacer(replacer)
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("setting.Setup err: %v", err)
	}
	ProviderKeyHex = viper.GetString("provider_key")
	ProviderId = viper.GetString("provider_id")
	Web3MqNode = viper.GetString("web3mq_node")
	LensContractAddress = viper.GetString("lens.profile_contract_address")
	ProfileCreationProxy = viper.GetString("lens.profile_creation_address")
	PolygonRpc = viper.GetString("rpc_node")

	ContractSet = make(map[string]interface{})
	ContractSet[LensContractAddress] = ""
	ContractSet[ProfileCreationProxy] = ""
}
