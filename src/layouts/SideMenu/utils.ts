import { notification } from 'antd';
import CryptoJS from 'crypto-js';

export function generateRandom256Bits(key: string) {
  if (!key || key.length === 0) {
    notification.error({
      message: 'Failed',
      description: "We did'nt get your public key, please try login again.",
    });
    return ;
  }
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
