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
  deleted,
}

export enum ReadStatusTypeEn {
  read = 0,
  unread,
}

export enum MetaMailTypeEn {
  Plain = 0,
  Signed,
  Encrypted,
}

export enum FilterTypeEn {
  Inbox = 0,
  Encrypted,
  Sent,
  Trash,
  Draft,

  Starred,
  Spam,

  Read,
  Unread,
}

export const SiderFilterMap = {
  [FilterTypeEn.Inbox]: 'Inbox',
  [FilterTypeEn.Encrypted]: 'Encrypted',
  [FilterTypeEn.Read]: 'Read',
  [FilterTypeEn.Unread]: 'Unread',
  [FilterTypeEn.Starred]: 'Starred',
  [FilterTypeEn.Sent]: 'Sent',
  [FilterTypeEn.Trash]: 'Trash',
  [FilterTypeEn.Draft]: 'Drafts',
  [FilterTypeEn.Spam]: 'Spam',
};

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
  mail_from: {
    address: string;
    name?: string;
  };
  mail_reference: string[];
  mail_to: string[];
  mailbox: number;
  mark: number;
  message_id: string;
  meta_type: number;
  metamail_headers: any;
  read: number;
  reply_to?: string;
  subject: string;
}

export interface IMailContentItem {
  message_id: string;
  meta_type: 0;
  metamail_headers: any;
  subject: string;
  mail_from: IPersonItem;
  mail_to: IPersonItem;
  mail_cc: IPersonItem[];
  mail_bcc: IPersonItem[];
  mail_date: string;
  in_reply_to?: IPersonItem;
  reply_to?: IPersonItem;
  mail_reference: [];
  digest: string;
  part_txt: string;
  part_html?: string;
  attachments: {
    part_id_0: {
      size: number;
      sha256: string;
      file_name: string;
      content_type: string;
    };
  };
}
