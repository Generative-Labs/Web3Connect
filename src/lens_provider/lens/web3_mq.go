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
		userId := db.GetUserIdByNftContract(nftContract)
		if userId == "" {
			continue
		}
		lensAccount := db.GetLensAccountByNftContract(nftContract)
		followerAccount := db.GetLensAccountByWallet(followerAddresses[0])
		if followerAccount == "" {
			profile, err := GetProfileIdByIndex(followerAddresses[0], 0)
			followerAccount, err = GetHandleByProfileId(profile)
			if err != nil {
				fmt.Println(fmt.Sprintf(">>>>PushFollowEventsToWen3Mq:%v", err))
				continue
			}
		}
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
			//if userId == "" {
			//	continue
			//}
			followerLensAccount := db.GetLensAccountByWallet(follower)
			add := fmt.Sprintf(`{"notificationUser":"%v",`, followerLensAccount)
			content = add + content[1:]
			NotifyWeb3Mq(db.EventPostCreated, userId, lensAccount, "", content)
			fmt.Println(fmt.Sprintf(">>>>PushFollowEventsToWen3Mq:%v", content))
		}
	}
}
