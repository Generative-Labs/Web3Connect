package lens

import (
	"crypto/ed25519"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"

	libp2pcrypto "github.com/libp2p/go-libp2p-core/crypto"
)

var PrivKey libp2pcrypto.PrivKey

func PrivKeyInit() {
	PrivKey, _ = LoadEd25519PrivateKey(ProviderKeyHex)

	signature, err := PrivKey.Sign([]byte("signContent"))
	if err != nil {
		panic(err)
	}
	encodeSignature := base64.StdEncoding.EncodeToString(signature)
	fmt.Println("encodeSignature: ", encodeSignature)
}

func GenerateEd25519Key() (libp2pcrypto.PrivKey, error) {
	private, _, err := libp2pcrypto.GenerateEd25519Key(nil)

	return private, err
}

func LoadEd25519PrivateKey(hexStr string) (libp2pcrypto.PrivKey, error) {
	privb, err := hex.DecodeString(hexStr)
	if err != nil {
		return nil, err
	}

	pvk, err := libp2pcrypto.UnmarshalEd25519PrivateKey(privb)

	return pvk, err
}

func Ed25519Verify(pubKeyStr string, msg string, signatureStr string) (bool, error) {
	msgByte := []byte(msg)

	if pubKeyStr == "" {
		return false, errors.New("invalid user pubkey")
	}

	pubKey, err := hex.DecodeString(pubKeyStr)
	if err != nil {
		return false, err
	}

	// signature, err := hex.DecodeString(signatureStr)
	// if err != nil {
	// 	return false, err
	// }

	signature, err := base64.StdEncoding.DecodeString(signatureStr)
	if err != nil {
		return false, err
	}
	// fmt.Println(">>>", pubKeyStr)

	isValid := ed25519.Verify(pubKey, msgByte, signature)
	return isValid, nil
}
