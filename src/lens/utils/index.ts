import {IMGPROXY_URL, IPFS_GATEWAY} from "../../constant";



export const imageProxy = (url: string, name?: string): string => {
    return name
        ? `${IMGPROXY_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
        : `${IMGPROXY_URL}/tr:di-placeholder.webp/${url}`;
};

export const getIPFSLink = (hash: string): string => {
    const gateway = IPFS_GATEWAY;

    return hash
        .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
        .replace('https://ipfs.io/ipfs/', gateway)
        .replace('ipfs://', gateway);
};
