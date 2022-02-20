import {
  MailBoxTypeEn,
  MarkTypeEn,
  ReadStatusTypeEn,
} from '@/pages/home/interfaces';
import request from '../utils/request';

const APIs = {
  getMailList: '/mails/filter', //
  mailDetail: '/mails/', //
};

export function getMailDetailByID(id: string) {
  return request(`${APIs.mailDetail}${id}`).get();
}

export function getMailList(params: Record<string, any>) {
  return request(APIs.getMailList).post({
    limit: 20,
    ...params,
  });
}

export interface IMailChangeParams {
  message_id: string;
  mailbox?: MailBoxTypeEn;
}

export const changeMailStatus = (
  mails: IMailChangeParams[],
  mark?: MarkTypeEn,
  read?: ReadStatusTypeEn,
) => {
  return request(`${APIs.mailDetail}`).post({
    mails,
    mark,
    read,
  });
};
