import request from '../utils/request';

const APIs = {
  getRandomString: '/auth/random', // 获取随机字符串，用户需要对这个字符串签名
  getAuthToken: '/auth/token', // 上传签名后的字符串，获取jwt token
};

export function getRandomStrToSign(addr: string) {
  return request(APIs.getRandomString).post({
    addr,
  });
}

export function getJwtToken(params: Record<string, any>) {
  return request(APIs.getAuthToken).post(params);
}

export function getLogout() {
  return request(APIs.getAuthToken).delete();
}
