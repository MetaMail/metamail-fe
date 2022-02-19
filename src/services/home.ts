import request from '../utils/request';

const APIs = {
  getMailList: '/mails/filter', // 获取随机字符串，用户需要对这个字符串签名
  getMailDetail: '/mails/', // 上传签名后的字符串，获取jwt token
};

export function getMailDetailByID(id: string) {
  return request(`${APIs.getMailDetail}${id}`).get();
}

export function getMailList(params: Record<string, any>) {
  return request(APIs.getMailList).post({
    limit: 20,
    ...params,
  });
}
