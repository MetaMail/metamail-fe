import { postPublicKey } from '@/services/user';
import { getPublicKey, pkPack } from '@/utils/publicKey';
import { getPersonalSign } from '@/utils/sign';
import { notification } from 'antd';
import CryptoJS from 'crypto-js';
import { encrypt } from '@metamask/eth-sig-util';
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
    ': ' +
    rb.toString(CryptoJS.enc.Base64)
  );
}
