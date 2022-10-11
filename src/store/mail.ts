import { IPersonItem } from '@/pages/home/interfaces';
import { deleteStorage, getStorage, updateStorage } from '@/utils/storage';

const TempMailStoreKey = 'MetaMailTemporalContent';

interface IMailContent {
  subject?: string;
  mail_from?: IPersonItem;
  mail_to?: IPersonItem[];
  part_html?: string;
}

export const setMailContent = (mail: IMailContent) => {
  updateStorage(TempMailStoreKey, mail);
};

export const clearMailContent = () => {
  deleteStorage(TempMailStoreKey);
};

export const getMailContent = () => {
  return getStorage(TempMailStoreKey);
};
