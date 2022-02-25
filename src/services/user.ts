import request from '../utils/request';

const APIs = {
  getUserInfos: '/users/find', // 获取随机字符串，用户需要对这个字符串签名
  getMyProfile: '/users/profile', // 上传签名后的字符串，获取jwt token
};

export function getUserInfos(data: string[]) {
  return request(APIs.getUserInfos).post({
    data,
  });
}

export function getMyProfile() {
  return request(APIs.getMyProfile).get();
}
