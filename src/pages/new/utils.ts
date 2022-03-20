import { getUserInfos } from '@/services/user';
import { PostfixOfAddress } from '@/utils/constants';
import { IPersonItem } from '../home/interfaces';

const concatAddress = (item: IPersonItem) =>
  (item?.name ?? '') + ' ' + '<' + item.address + '>';

const handleGetReceiversInfos = async (to: IPersonItem[]) => {
  try {
    const { data } = await getUserInfos(
      to?.map((item) => item.address.split('@')[0]),
    );

    return data;
  } catch (err) {}
};

export const metaPack = async (data: {
  from: string;
  to: IPersonItem[];
  cc?: IPersonItem[];
  date?: string;
  subject?: string;
  text_hash: string;
  html_hash: string;
  attachments_hash?: string[];
  name?: string;
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
    name,
  } = data;

  let parts = [
    'From: ' +
      concatAddress({
        address: from + PostfixOfAddress,
        name: name ?? '',
      }),
    'To: ' + to.map(concatAddress).join(', '),
  ];
  if (cc && cc?.length >= 1) {
    parts.push('Cc: ' + cc?.map(concatAddress).join(', '));
  }
  parts = parts.concat([
    'Date: ' + date,
    'Subject: ' + subject,
    'Content-Hash: ' + text_hash + ' ' + html_hash,
    'Attachments-Hash: ' + attachments_hash?.join(' '),
  ]);

  // let keys: string[];

  // return await handleGetReceiversInfos(to).then((res) => {
  //   if (res && Object.keys(res).length > 0) {
  //     keys = [];
  //     Object.keys(res).forEach((key) => {
  //       keys.push(res[key].public_key);
  //     });

  //     parts.push('Keys: ' + keys.join(' '));
  //   }

  //   return Promise.resolve({
  //     packedResult: parts.join('\n'),
  //     keys,
  //   });
  // });

  return Promise.resolve({
    packedResult: parts.join('\n'),
  });
};

export enum AttachmentRelatedTypeEn {
  Embedded = '1',
  Outside = '0',
}
