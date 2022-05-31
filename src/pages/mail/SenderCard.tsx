import request from '@/utils/request';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface ISenderInfo {
  name?: string;
  address?: string;
}

const processData = (data: any) => {
  if (!data?.length) return '';

  for (let i = 0; i < data.length; i++) {
    const proofs = data[i]?.proofs;

    for (let j = 0; j < proofs?.length; j++) {
      if (proofs[j]?.platform === 'twitter') {
        return proofs[j]?.identity;
      }
    }
  }

  return '';
};

export default function SenderCard({ name, address }: ISenderInfo) {
  const [twitter, setTwitter] = useState<string>();

  const getTwitterAccount = async () => {
    const res = await request('https://proof-service.nextnext.id/v1/proof').get(
      {
        platform: 'ethereum',
        identity: '0x0da0ee86269797618032e56a69b1aad095c581fc',
      },
    );

    setTwitter(processData(res?.ids));
  };

  useEffect(() => {
    if (address && address?.length > 0) {
      getTwitterAccount();
    }
  }, [address]);

  return (
    <span className={styles.info}>
      {name ?? 'Unknown'} {address ? '<' + address + '>' : null}
      <div>{twitter}</div>
    </span>
  );
}
