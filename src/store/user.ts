import { deleteStorage, getStorage, updateStorage } from '@/utils/storage';

const UserInfoStoreKey = 'MetaMailUserInfo';
const ShowNameKey = 'MetaMailShowName';
const randomBitsKey = 'MetamailRandomBits';

interface IUserInfo {
  publicKey?: string;
  ensName?: string;
  address?: string;
}

interface IAllUserInfo extends IUserInfo {
  showName?: string;
}

export const saveUserInfo = (value: IUserInfo) => {
  updateStorage(UserInfoStoreKey, {
    ...getStorage(UserInfoStoreKey),
    ...value,
  });

  const { ensName, address } = value;
  updateStorage(ShowNameKey, ensName ?? address);
};

export const getPublicKeyFromLocal = () => {
  return getStorage(UserInfoStoreKey, null)?.publicKey;
};

export const getWalletAddress = () => {
  return getStorage(UserInfoStoreKey, null)?.address;
};

export const getEnsName = () => {
  return getStorage(UserInfoStoreKey, null)?.ensName;
};

export const getUserInfo = () => {
  const basic = getStorage(UserInfoStoreKey, null);

  return (
    basic
      ? {
          ...basic,
          showName: getShowName(),
        }
      : {
          showName: getShowName(),
        }
  ) as IAllUserInfo;
};

export const clearUserInfo = () => {
  deleteStorage(UserInfoStoreKey);
};

export const getShowName = () => {
  return getStorage(ShowNameKey);
};

export const saveShowName = (name: string) => {
  updateStorage(ShowNameKey, name);
};

export const getRandomBits = () => {
  return getStorage(randomBitsKey);
};

export const setRandomBits = (name?: string) => {
  updateStorage(randomBitsKey, name);
};
