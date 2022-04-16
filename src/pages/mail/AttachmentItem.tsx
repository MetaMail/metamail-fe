import styles from './index.less';
import { DownloadOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import { message } from 'antd';
import { useRef } from 'react';

function convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) {
  var arrayOfWords = wordArray.hasOwnProperty('words') ? wordArray.words : [];
  var length = wordArray.hasOwnProperty('sigBytes')
    ? wordArray.sigBytes
    : arrayOfWords.length * 4;
  var uInt8Array = new Uint8Array(length),
    index = 0,
    word,
    i;
  for (i = 0; i < length; i++) {
    word = arrayOfWords[i];
    uInt8Array[index++] = word >> 24;
    uInt8Array[index++] = (word >> 16) & 0xff;
    uInt8Array[index++] = (word >> 8) & 0xff;
    uInt8Array[index++] = word & 0xff;
  }
  return uInt8Array;
}

export default function AttachmentItem({
  url,
  name,
  idx,
  randomBits,
}: {
  url: string;
  name: string;
  idx: number;
  randomBits: string;
}) {
  const key = url;
  const decrypting = useRef(false);
  return (
    <div
      className={styles.item}
      onClick={() => {
        if (!url) return;
        if (!randomBits) {
          window.open(url);
        } else {
          if (decrypting.current) return;
          decrypting.current = true;
          message.loading({ content: 'Decrypting...', key });
          fetch(url)
            .then((response) => response.text())
            .then((text) => {
              const decrypted = CryptoJS.AES.decrypt(text, randomBits); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
              const typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array
              const fileDec = new Blob([typedArray]); // Create blob from typed array
              const a = document.createElement('a');
              const tmpUrl = window.URL.createObjectURL(fileDec);
              a.href = tmpUrl;
              a.download = name;
              a.click();
              window.URL.revokeObjectURL(tmpUrl);
              message.success({ content: 'Decrypted', key, duration: 2 });
            })
            .catch((err) => {
              console.log(err);
              message.error({ content: 'Decrypt failed', key, duration: 2 });
            })
            .finally(() => (decrypting.current = false));
        }
      }}
    >
      <div className={styles.name}>{name ?? `attachment${idx}`}</div>
      <DownloadOutlined />
    </div>
  );
}
