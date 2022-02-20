import { IPersonItem, MetaMailTypeEn } from '@/pages/home/interfaces';
import request from '../utils/request';

const APIs = {
  createDraft: '/mails/draft', // 新建草稿
  updateMail: '/mails/{mail_id}', // patch方法，更新邮件内容
  sendMail: '/mails/{mail_id}/send', // 发送邮件
  getAttachmentSlots: '/mails/{mail_id}/attachment_slots', //
  uploadAttachment: '/mail/{mail_id}/attachments/{attachment_id}', //上传附件
};

export function createDraft(type: MetaMailTypeEn, key?: string) {
  return request(APIs.createDraft).post({
    meta_type: type,
    key,
  });
}

interface IMailUpdateParams {
  subject: string;
  mail_from?: IPersonItem;
  mail_to: IPersonItem[];
  mail_cc?: IPersonItem[];
  mail_bcc?: IPersonItem[];
  in_reply_to?: string;
  part_text?: string;
  part_html?: string;
}

export function updateMail(mailId: string, params: IMailUpdateParams) {
  return request(
    APIs.updateMail.replace('{mail_id}', window.btoa(mailId)),
  ).patch(params);
}

export function sendMail(mailId: string) {
  return request(
    APIs.sendMail.replace('{mail_id}', window.btoa(mailId)),
  ).post();
}
