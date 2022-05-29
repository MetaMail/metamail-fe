import { IPersonItem } from '@/pages/home/interfaces';
import { deleteStorage, getStorage, updateStorage } from '@/utils/storage';

const ReceiversStoreKey = 'MetaMailReceivers';

export const setReceivers = (value: IPersonItem[]) => {
  updateStorage(ReceiversStoreKey, value);
};

export const clearReceivers = () => {
  deleteStorage(ReceiversStoreKey);
};

export const getReceivers = () => {
  return getStorage(ReceiversStoreKey, []);
};
