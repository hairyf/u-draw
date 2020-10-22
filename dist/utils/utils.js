export const isBaseUrl = (str) => {
    return /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(str);
};
export const isTmpUrl = (str) => {
    return /http:\/\/temp\/wx/.test(str);
};
