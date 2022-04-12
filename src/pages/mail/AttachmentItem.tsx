import styles from './index.less';
import { DownloadOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';

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
  return (
    <div
      className={styles.item}
      onClick={() => {
        if (!url) return;
        if (!randomBits) {
          window.open(url);
        } else {
          fetch(url)
            .then((response) => response.text())
            .then((text) => {
              var decrypted = CryptoJS.AES.decrypt(text, randomBits); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
              var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array
              var fileDec = new Blob([typedArray]); // Create blob from typed array
              var a = document.createElement('a');
              var url = window.URL.createObjectURL(fileDec);
              a.href = url;
              a.download = name;
              a.click();
              window.URL.revokeObjectURL(url);
            });
        }
      }}
    >
      <div className={styles.name}>{name ?? `attachment${idx}`}</div>
      <DownloadOutlined />
    </div>
  );
}
