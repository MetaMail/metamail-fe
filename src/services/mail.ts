import { MetaMailTypeEn } from '@/pages/home/interfaces';
import request from '../utils/request';

const APIs = {
  createDraft: '/mails/draft', // 新建草稿
  updateMail: '/mails/{mail_id}', // patch方法，更新邮件内容
  sendMail: '/mails/{mail_id}/send', // 发送邮件
};

export function createDraft(type: MetaMailTypeEn) {
  return request(APIs.createDraft).post({
    meta_type: type,
  });
}

export function updateMail() {
  return request(APIs.updateMail).patch();
}

export function sendMail() {
  return request(APIs.sendMail).post();
}
