package db

import (
	"fmt"
	"github.com/go-redis/redis"
	"github.com/spf13/viper"
	"strings"
)

var RedisConfigs map[string]*redis.Client

const (
	LensProfileInitHeight = 28384641

	PushToWeb3            = "push_to_web3"
	ContractProfile       = "contract_profile"
	Follower              = "follower"
	Post                  = "post"
	Lens                  = "lens"
	PolygonSyncHeight     = "polygon_sync_height"
	Web3MqUserWallets     = "web3_mq_user_wallet"
	Web3MqUserWalletsPage = "web3_mq_user_wallet_page"
	PushToWeb3Db          = 0
	ContractProfileDb     = 1
	FollowerDb            = 2
	PolygonSyncHeightDb   = 3
	Web3MqUserWalletsDb   = 4
	PostDb                = 5
	LensDb                = 6

	EventFollow         = "Follow"
	EventPost           = "Post"
	EventProfileCreator = "ProfileCreator"
	EventCollect        = "Collect"
	EventPostCreated    = "PostCreated"
	EventCommentCreated = "CommentCreated"
	EventMirrorCreated  = "MirrorCreated"

	ProfileId     = "ProfileId"
	LensAccount   = "LensAccount"
	WalletAddress = "WalletAddress"
)

func InitRedis() {
	option, err := redis.ParseURL(viper.GetString("db_config_redis"))
	if err != nil {
		fmt.Println(err)
	}
	RedisConfigs = make(map[string]*redis.Client)

	option0 := *option
	option0.DB = PushToWeb3Db
	redisdb0 := redis.NewClient(&option0)
	RedisConfigs[PushToWeb3] = redisdb0

	option1 := *option
	option1.DB = ContractProfileDb
	redisdb1 := redis.NewClient(&option1)
	RedisConfigs[ContractProfile] = redisdb1

	option2 := *option
	option2.DB = FollowerDb
	redisdb2 := redis.NewClient(&option2)
	RedisConfigs[Follower] = redisdb2

	option3 := *option
	option3.DB = PolygonSyncHeightDb
	redisdb3 := redis.NewClient(&option3)
	RedisConfigs[PolygonSyncHeight] = redisdb3

	option4 := *option
	option4.DB = Web3MqUserWalletsDb
	redisdb4 := redis.NewClient(&option4)
	RedisConfigs[Web3MqUserWallets] = redisdb4

	option5 := *option
	option5.DB = PostDb
	redisdb5 := redis.NewClient(&option5)
	RedisConfigs[Post] = redisdb5

	option6 := *option
	option6.DB = LensDb
	redisdb6 := redis.NewClient(&option6)
	RedisConfigs[Lens] = redisdb6

	fmt.Printf("init redis config:%v", RedisConfigs)
	_, err = redisdb0.Ping().Result()
	if err != nil {
		fmt.Println(err)
	}
	return
}

func GetPolygonSyncHeight() (uint64, error) {
	redisdb := RedisConfigs[PolygonSyncHeight]
	result := redisdb.Get(PolygonSyncHeight)
	if result.Val() == "" {
		redisdb.SetNX(PolygonSyncHeight, LensProfileInitHeight, 0)
		return LensProfileInitHeight, nil
	}
	height, err := result.Uint64()
	return height, err
}
func UpdateSyncHeight(height uint64) error {
	redisdb := RedisConfigs[PolygonSyncHeight]
	return redisdb.Set(PolygonSyncHeight, height, 0).Err()
}

func Set(db, key, value string) error {
	redisdb := RedisConfigs[db]
	set := redisdb.Set(key, value, 0)
	return set.Err()
}

func SetPushAndFollower(key, value string) error {
	key = fmt.Sprintf("%v:%v", EventFollow, key)
	pushDb := RedisConfigs[PushToWeb3]
	followerDb := RedisConfigs[Follower]
	set := pushDb.LPush(key, value)
	set = followerDb.LPush(key, value)
	return set.Err()
}

func SetContractProfile(key, value string) error {
	key = fmt.Sprintf("%v:%v", EventProfileCreator, key)
	pushDb := RedisConfigs[PushToWeb3]
	redisdb := RedisConfigs[ContractProfile]
	set := pushDb.Set(key, value, 0)
	set = redisdb.Set(key, value, 0)
	return set.Err()
}

func SetLensAccountToFollowContract(key, value string) error {
	key = fmt.Sprintf("%v%v:%v", LensAccount, EventFollow, key)
	redisdb := RedisConfigs[ContractProfile]
	set := redisdb.Set(key, value, 0)
	return set.Err()
}

func GetFollowContractByLensAccount(lensAccount string) string {
	key := fmt.Sprintf("%v%v:%v", LensAccount, EventFollow, lensAccount)
	redisdb := RedisConfigs[ContractProfile]
	return redisdb.Get(key).Val()
}

func GetFollowersByLensAccount(lensAccount string) []string {
	contractAddress := GetFollowContractByLensAccount(lensAccount)
	key := fmt.Sprintf("%v:%v", EventFollow, contractAddress)
	followerDb := RedisConfigs[Follower]
	set := followerDb.LRange(key, 0, -1).Val()
	return set
}

func GetProfileIdByNftContract(nftContract string) string {
	redisdb := RedisConfigs[ContractProfile]
	key := fmt.Sprintf("%v:%v", EventProfileCreator, nftContract)
	profileIndex := redisdb.Get(key).Val()
	return profileIndex
}

func GetUserIdByNftContract(key string) string {
	redisdb := RedisConfigs[ContractProfile]
	profileIndex := GetProfileIdByNftContract(key)
	profileIdKey := fmt.Sprintf("%vAddress:%v", ProfileId, profileIndex)
	address := redisdb.Get(profileIdKey).Val()
	userId := GetUserIdByWallet(address)
	return userId
}

func SetProfileIdToLensAccount(profileId, lensAccount string) error {
	profileIdKey := fmt.Sprintf("%v%v:%v", ProfileId, LensAccount, profileId)
	lensAccountKey := fmt.Sprintf("%v%v:%v", LensAccount, ProfileId, lensAccount)
	redisdb := RedisConfigs[ContractProfile]
	set := redisdb.Set(profileIdKey, lensAccount, 0)
	set = redisdb.Set(lensAccountKey, profileId, 0)
	return set.Err()
}

func GetLensAccountByNftContract(nftContract string) string {
	profileId := GetProfileIdByNftContract(nftContract)
	lensAccount := GetLensAccountByProfileId(profileId)
	return lensAccount
}

func GetLensAccountByProfileId(profileId string) string {
	profileIdKey := fmt.Sprintf("%v%v:%v", ProfileId, LensAccount, profileId)
	redisdb := RedisConfigs[ContractProfile]
	lensAccount := redisdb.Get(profileIdKey).Val()
	return lensAccount
}

func SetProfileIdToAddress(profileId, address string) error {
	profileIdKey := fmt.Sprintf("%vAddress:%v", ProfileId, profileId)
	addressKey := fmt.Sprintf("Address%v:%v", ProfileId, address)
	redisdb := RedisConfigs[ContractProfile]
	set := redisdb.Set(profileIdKey, address, 0)
	set = redisdb.Set(addressKey, address, 0)
	return set.Err()
}

func GetProfileIdByWalletAddress(address string) string {
	redisdb := RedisConfigs[ContractProfile]
	addressKey := fmt.Sprintf("Address%v:%v", ProfileId, address)
	walletAddress := redisdb.Get(addressKey).Val()
	return walletAddress
}

func GetAddressByProfileId(profileId string) string {
	profileIdKey := fmt.Sprintf("%vAddress:%v", ProfileId, profileId)
	redisdb := RedisConfigs[ContractProfile]
	address := redisdb.Get(profileIdKey).Val()
	return address
}
func GetProfileIdByLensAccount(lensAccount string) string {
	lensAccountKey := fmt.Sprintf("%v%v:%v", LensAccount, ProfileId, lensAccount)
	redisdb := RedisConfigs[ContractProfile]
	profileId := redisdb.Get(lensAccountKey).String()
	return profileId
}

func GetAddressByLensAccount(lensAccount string) string {
	profileId := GetProfileIdByLensAccount(lensAccount)
	address := GetAddressByProfileId(profileId)
	return address
}
func GetUserIdByLensAccount(lensAccount string) string {
	address := GetAddressByLensAccount(lensAccount)
	userId := GetUserIdByWallet(address)
	return userId
}

func GetPendingFollowEvents() map[string][]string {
	profileFollowers := make(map[string][]string)
	redisdb := RedisConfigs[PushToWeb3]
	all := redisdb.Keys(EventFollow + "*").Val()
	for _, key := range all {
		followerAddresses := redisdb.LRange(key, 0, -1).Val()
		split := strings.Split(key, ":")
		profileFollowers[split[1]] = followerAddresses
		redisdb.Del(key)
	}
	return profileFollowers
}

func GetPendingPostEvents() []string {
	var postEvents []string
	redisdb := RedisConfigs[PushToWeb3]
	all := redisdb.Keys(EventPost + "*").Val()
	for _, key := range all {
		postUrl := redisdb.Get(key).Val()
		postEvents = append(postEvents, postUrl)
		redisdb.Del(key)
	}
	return postEvents
}

func GetUserWalletsPage() (uint64, error) {
	redisdb := RedisConfigs[Web3MqUserWallets]
	page, err := redisdb.Get(Web3MqUserWalletsPage).Uint64()
	if err != nil {
		redisdb.SetNX(Web3MqUserWalletsPage, 0, 0)
		return 0, nil
	}
	return page, err
}

func UpdateUserWalletPage(page uint64) error {
	redisdb := RedisConfigs[Web3MqUserWallets]
	return redisdb.Set(Web3MqUserWalletsPage, page, 0).Err()
}

func SetNxUserWallet(key, value string) error {
	redisdb := RedisConfigs[Web3MqUserWallets]
	set := redisdb.SetNX(key, value, 0)
	return set.Err()
}

func GetUserIdByWallet(address string) string {
	redisdb := RedisConfigs[Web3MqUserWallets]
	userId := redisdb.Get(address).Val()
	return userId
}

func GetLensAccountByWallet(address string) string {
	profileId := GetProfileIdByWalletAddress(address)
	lensAccount := GetLensAccountByProfileId(profileId)
	return lensAccount
}

func SetWalletToLensAccount(key, value string) error {
	key = fmt.Sprintf("%v%v:%v", WalletAddress, LensAccount, key)
	redisdb := RedisConfigs[Lens]
	set := redisdb.Set(key, value, 0)
	return set.Err()
}

func SetWalletToProfileId(key, value string) error {
	key = fmt.Sprintf("%v%v:%v", WalletAddress, ProfileId, key)
	redisdb := RedisConfigs[Lens]
	set := redisdb.Set(key, value, 0)
	return set.Err()
}

func SetTxHashPostContent(key, value string) error {
	key = fmt.Sprintf("%vContent:%v", EventPost, key)
	pushDb := RedisConfigs[PushToWeb3]
	postdb := RedisConfigs[Post]
	set := pushDb.Set(key, value, 0)
	set = postdb.Set(key, value, 0)
	return set.Err()
}

func SetTxHashPost(key, value string) error {
	key = fmt.Sprintf("%v:%v", EventPost, key)
	postdb := RedisConfigs[Post]
	set := postdb.Set(key, value, 0)
	return set.Err()
}
