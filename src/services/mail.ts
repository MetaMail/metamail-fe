import { IPersonItem, MetaMailTypeEn } from '@/pages/home/interfaces';
import request from '../utils/request';

const APIs = {
  createDraft: '/mails/draft', // 新建草稿
  updateMail: '/mails/{mail_id}', // patch方法，更新邮件内容
  sendMail: '/mails/{mail_id}/send', // 发送邮件
  uploadAttachment: '/mails/{mail_id}/attachments', //上传附件
  deleteAttachment: '/mails/{mail_id}/attachments/{attachment_id} ',
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

export function sendMail(mailId: string, props: Record<string, any>) {
  return request(APIs.sendMail.replace('{mail_id}', window.btoa(mailId))).post(
    props,
  );
}

export function uploadAttachment(mailId: string, data: FormData) {
  return request(
    APIs.uploadAttachment.replace('{mail_id}', window.btoa(mailId)),
  ).post(data, {
    timeout: 60000,
  });
}

export function deleteAttachment(mailId: string, attachmentId: string) {
  return request(
    APIs.deleteAttachment
      .replace('{mail_id}', window.btoa(mailId))
      .replace('{attachment_id}', attachmentId),
  ).delete();
}
