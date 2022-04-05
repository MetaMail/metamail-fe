import { postPublicKey } from '@/services/user';
import { getPublicKey, pkPack } from '@/utils/publicKey';
import { getPersonalSign } from '@/utils/sign';
import { notification } from 'antd';
import CryptoJS from 'crypto-js';

export const updatePublicKey = async (address: string) => {
  try {
    // @ts-ignore
    const key = await getPublicKey(address);
    if (key && key?.length > 0) {
      const data = {
        addr: address,
        date: new Date().toISOString(), //当前的时间
        version: 'x25519-xsalsa20-poly1305', //metamask默认支持的KEY格式
        public_key: key,
      };

      getPersonalSign(address, pkPack(data)).then((signature) => {
        postPublicKey({
          ...data,
          signature,
        });
      });
    }

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

export function generateRandom256Bits(key: string) {
  let res = '';

  const temp = new Uint32Array(8);

  crypto.getRandomValues(temp);

  temp.forEach((item) => {
    res += `${item}`;
  });

  return {
    random: res,
    encrypted: CryptoJS.AES.encrypt(res, key).toString(),
  };
}
