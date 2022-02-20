import { IPersonItem } from '../home/interfaces';

const concatAddress = (item: IPersonItem) =>
  (item?.name ?? '') + ' ' + '<' + item.address + '>';

export const metaPack = (data: {
  from: IPersonItem;
  to: IPersonItem[];
  cc?: IPersonItem[];
  date: Date;
  subject?: string;
  text_hash: string;
  html_hash: string;
  attachments_hash?: string[];
  keys?: string[];
}) => {
  const {
    from,
    to,
    cc,
    date,
    subject,
    text_hash,
    html_hash,
    attachments_hash,
    keys,
  } = data;
  let parts = [
    'From: ' + concatAddress(from),
    'To: ' + to.map(concatAddress).join(', '),
  ];
  if (cc && cc?.length >= 1) {
    parts.push('Cc: ' + cc?.map(concatAddress).join(', '));
  }
  parts = parts.concat([
    'Date: ' + date.toISOString(),
    'Subject: ' + subject,
    'Content-Hash: ' + text_hash + ' ' + html_hash,
    'Attachments-Hash: ' + attachments_hash?.join(' '),
  ]);
  if (keys) {
    parts.push('Keys: ' + keys.join(' '));
  }
  return parts.join('\n');
};
