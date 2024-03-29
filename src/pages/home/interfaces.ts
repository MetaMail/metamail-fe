import { encryptedMail, signedMail } from '@/assets';

export enum AccountStatusTypeEn {
  Normal = 0,
  Locked,
}

export enum MailBoxTypeEn {
  Inbox = 0,
  Send,
  Draft,
}

export enum MarkTypeEn {
  Normal = 0,
  Starred,
  Trash,
  Spam,
  Deleted,
}

export enum ReadStatusTypeEn {
  read = 1,
  unread = 0,
}

export enum MetaMailTypeEn {
  Plain = 0,
  Signed = 1,
  Encrypted = 2,
}

export const MailTypeIconMap = {
  [MetaMailTypeEn.Signed]: signedMail,
  [MetaMailTypeEn.Encrypted]: encryptedMail,
  [MetaMailTypeEn.Plain]: undefined,
};

export const getMailBoxType = (filter: FilterTypeEn) => {
  switch (filter) {
    case FilterTypeEn.Draft:
      return MailBoxTypeEn.Draft;
    case FilterTypeEn.Sent:
      return MailBoxTypeEn.Send;
    default:
      return MailBoxTypeEn.Inbox;
  }
};

export enum FilterTypeEn {
  Inbox = 0,
  Encrypted,
  Sent,
  Trash,
  Draft,

  Starred,
  Spam,

  //Read,
  Unread = 8,
}

export interface IPersonItem {
  address: string;
  name?: string;
}

export interface IMailItem {
  digest: string;
  in_reply_to?: string;
  mail_bcc: string[];
  mail_cc: string[];
  mail_date: string;
  mail_from: IPersonItem;
  mail_reference: string[];
  mail_to: string[];
  mailbox: number;
  mark: number;
  message_id: string;
  meta_type: MetaMailTypeEn;
  metamail_headers: any;
  read: number;
  reply_to?: string;
  subject: string;
  meta_header: {
    addr: string;
    date: string;
    data: string;
    keys: string[];
    signature: string;
  };
}

export interface IMailContentItem {
  message_id: string;
  meta_type: MetaMailTypeEn;
  metamail_headers: any;
  subject: string;
  mail_from: IPersonItem;
  mail_to: IPersonItem[];
  mail_cc: IPersonItem[];
  mail_bcc: IPersonItem[];
  mail_date: string;
  download: {
    expire_at: string;
    url: string;
  };
  in_reply_to?: IPersonItem;
  reply_to?: IPersonItem;
  mail_reference: [];
  digest: string;
  part_text: string;
  part_html?: string;
  attachments: {
    attachment_id: string;
    size: number;
    sha256: string;
    filename: string;
    content_type: string;
    download: {
      expire_at: string;
      url: string;
    };
  }[];
  meta_header: {
    addr: string;
    date: string;
    data: string;
    keys: string[];
    signature: string;
  };
}
