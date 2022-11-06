

export function getUserInfoByJWT() {
  let accessToken = tokenMgr().getToken(TOKEN_KEY.LENS_ACCESS);
  if (accessToken) {
    let jwtToken = accessToken.substring(7);
    let tokenArr = jwtToken.split(".");
    return parseJwt(tokenArr[1]);
  }
  return null;
}

export function getShortAddressByAddress(address: string, num: number = 5) {
  let strLength = address.length;
  return (
    address.substring(0, num) +
    "..." +
    address.substring(strLength - 4, strLength)
  );
}

export function parseJwt(str: string) {
  return JSON.parse(
    decodeURIComponent(
      escape(window.atob(str.replace(/-/g, "+").replace(/_/g, "/")))
    )
  );
}


export enum TOKEN_KEY {
  ACCESS = "access",
  LENS_ACCESS = "lens_access",
}
export function tokenMgr() {
  return {
    getToken: (type: TOKEN_KEY = TOKEN_KEY.ACCESS) => {
      let accessToken = localStorage.getItem(type);
      return accessToken ? accessToken : "";
    },
    setToken: (v: string, type: TOKEN_KEY = TOKEN_KEY.ACCESS) => {
      if (v) {
        localStorage.setItem(type, `Bearer ${v}`);
      } else {
        localStorage.setItem(type, "");
      }
    },
  };
}