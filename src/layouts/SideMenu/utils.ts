import { postPublicKey } from '@/services/user';
import { getPublicKey, pkPack } from '@/utils/publicKey';
import { getPersonalSign } from '@/utils/sign';
import { Modal, notification } from 'antd';
import CryptoJS from 'crypto-js';
import { encrypt } from '@metamask/eth-sig-util';
import { MetaMailTypeEn } from '@/pages/home/interfaces';
import { getUserInfo, saveUserInfo, setRandomBits } from '@/store/user';
import { createDraft } from '@/services';
import { history } from 'umi';
export const ETHVersion = 'x25519-xsalsa20-poly1305';

export const pkEncrypt = (pk: string, data: string) => {
  return Buffer.from(
    JSON.stringify(
      encrypt({
        publicKey: pk,
        data: data,
        version: ETHVersion,
      }),
    ),
  ).toString('base64');
};

export const updatePublicKey = async (address: string) => {
  try {
    // @ts-ignore
    const key = await getPublicKey(address);
    if (!key || key.length == 0) return null;

    const data = {
      addr: address,
      date: new Date().toISOString(), //当前的时间
      version: ETHVersion, //metamask默认支持的KEY格式
      public_key: key,
    };
    const signature = await getPersonalSign(address, pkPack(data));
    if (!signature) return null;
    const result = await postPublicKey({
      ...data,
      signature,
    });
    if (!result) return null;
    return key;
  } catch (error: any) {
    if (error?.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn("We can't encrypt anything without the key.");
    } else {
      console.error(error);
    }

    return null;
  }
};

export function generateRandom256Bits(address: string) {
  const rb = CryptoJS.lib.WordArray.random(256 / 8);
  return (
    'Encryption key of this mail from ' +
    address +
    ' is ' +
    rb.toString(CryptoJS.enc.Base64)
  );
}

export const createMail = async (type: MetaMailTypeEn) => {
  let key;
  if (type === MetaMailTypeEn.Encrypted) {
    const { publicKey, address } = getUserInfo();
    if (!address) {
      console.warn('No address of current user, please check');
      return;
    }
    let pKey = publicKey;
    if (!pKey || pKey?.length === 0) {
      Modal.confirm({
        title: 'Enable Encrypted Mail',
        content:
          'You are creating encrypted for the first time. You need to provide your public key for p2p encryption—no gas fee.',
        okText: 'Confirm',
        cancelText: 'Not now',
        onOk: async () => {
          pKey = await updatePublicKey(address);
          if (!pKey) {
            notification.error({
              message: 'Permission denied',
              description: 'Failed to get your public key',
            });
            return;
          }
          saveUserInfo({
            publicKey: pKey,
          });
          notification.success({
            message: 'Success',
            description: 'You can send and receive encrypted mail now.',
          });
        },
      });
      return;
    }
    const randomBits = generateRandom256Bits(address);
    key = pkEncrypt(pKey, randomBits);
    randomBits;
  } else {
    setRandomBits(undefined);
  }
  if (type === MetaMailTypeEn.Encrypted && (!key || key?.length === 0)) {
    return;
  }
  const { data } = await createDraft(type, key);

  if (data && data?.message_id) {
    history.push({
      pathname: '/home/new',
      query: {
        id: data.message_id,
        type: type + '',
      },
    });
  }
};
