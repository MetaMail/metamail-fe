import { pkEncrypt } from '@/layouts/SideMenu/utils';
import { getUserInfos } from '@/services/user';
import { PostfixOfAddress } from '@/utils/constants';
import { IPersonItem } from '../home/interfaces';

const concatAddress = (item: IPersonItem) =>
  (item?.name ?? '') + ' ' + '<' + item.address + '>';

export const handleGetReceiversInfos = async (to: IPersonItem[]) => {
  const { data } = await getUserInfos(
    to?.map((item) => item.address.split('@')[0]),
  );

  return data;
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
    name,
    keys,
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

  if (Array.isArray(keys) && keys.length > 0) {
    parts.push('Keys: ' + keys.join(' '));
  }

  // return await handleGetReceiversInfos(to).then((res) => {
  //   if (res && Object.keys(res).length > 0) {
  //     keys = [pkEncrypt(myKey, randoms)];
  //     Object.keys(res).forEach((key) => {
  //       // keys.push(res?.[key]?.public_key?.public_key);
  //       keys.push(
  //         pkEncrypt(res?.[key]?.public_key?.public_key, randoms),
  //       );
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
