package lens

import (
	"fmt"
	"github.com/Generative-Labs/Web3Connect/src/lens_provider/db"
	jsoniter "github.com/json-iterator/go"
	"strings"
	"time"
)

func PushWeb3Ticker(interval int64) {
	ticker := time.NewTicker(time.Duration(interval) * time.Second)
	for range ticker.C {
		go PushFollowEventsToWen3Mq()
		go PushPostEventsToWen3Mq()
	}
}

func PushFollowEventsToWen3Mq() {
	events := db.GetPendingFollowEvents()
	for nftContract, followerAddresses := range events {
		profileId := db.GetProfileIdByNftContract(nftContract)
		address := db.GetAddressByProfileId(profileId)
		userIdExist := db.GetUserIdByWallet(address)
		if userIdExist == "" {
			continue
		}
		userId := db.GetUserIdByNftContract(nftContract)
		lensAccount := db.GetLensAccountByProfileId(profileId)
		followers := strings.Join(followerAddresses, ",")
		followerAccount := db.GetLensAccountByWallet(followers)
		title := "New Follow Event"
		// todo notify follower at the sametime
		NotifyWeb3Mq(db.EventFollow, userId, lensAccount, title, followerAccount)
		fmt.Println(fmt.Sprintf(">>>>PushFollowEventsToWen3Mq: \n"+
			"UserId:%v\n "+
			"LensAccount:%v\n "+
			"Title:%v\n"+
			"Content:%v", userId, lensAccount, title, followerAccount))

	}
}

func PushPostEventsToWen3Mq() {
	events := db.GetPendingPostEvents()
	for _, content := range events {
		name := jsoniter.Get([]byte(content), "name").ToString()
		split := strings.Split(name, " by ")
		_, lensAccount := split[0], split[1]
		followers := db.GetFollowersByLensAccount(lensAccount)
		for _, follower := range followers {
			userId := db.GetUserIdByWallet(follower)
			userIdExist := db.GetUserIdByWallet(follower)
			if userIdExist == "" {
				continue
			}
			followerLensAccount := db.GetLensAccountByWallet(follower)
			add := fmt.Sprintf(`{"notificationUser":"%v",`, followerLensAccount)
			content = add + content[1:]
			NotifyWeb3Mq(db.EventPostCreated, userId, lensAccount, "", content)
		}
	}
}
