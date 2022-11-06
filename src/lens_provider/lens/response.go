package lens

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type HttpCommonRespose struct {
	Msg  string      `json:"msg"`
	Code int         `json:"code"`
	Data interface{} `json:"data,omitempty"`
}

func JsonResponse(w http.ResponseWriter, respData interface{}) {
	jsonResp, err := json.Marshal(respData)
	if err != nil {
		Logger().Error(fmt.Sprintf("Error happened in JSON marshal. Err: %s", err))
	}

	w.Write(jsonResp)
}
