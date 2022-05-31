import { createMail } from '@/layouts/SideMenu/utils';
import { setReceivers } from '@/store/mail';
import { Button } from 'antd';
import React from 'react';
import { MetaMailTypeEn } from '../home/interfaces';
import styles from './index.less';

export default function DiscoverCard({ address }: { address: string }) {
  const handleSendMail = () => {
    setReceivers([
      {
        address: `${address}@mmail.ink`,
      },
    ]);
    createMail(MetaMailTypeEn.Signed);
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.address}>{address}</div>
      <Button type="link" onClick={handleSendMail}>
        Send
      </Button>
    </div>
  );
}
