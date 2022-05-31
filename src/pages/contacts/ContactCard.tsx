import { createMail } from '@/layouts/SideMenu/utils';
import { setReceivers } from '@/store/mail';
import { Avatar, Button, Image } from 'antd';
import React from 'react';
import { MetaMailTypeEn } from '../home/interfaces';
import styles from './index.less';

export interface IConnectItem {
  address: string;
  avatar: string;
  domain: string;
}

export default function ContactCard({ address, avatar, domain }: IConnectItem) {
  const handleSendMail = () => {
    setReceivers([
      {
        address: `${domain?.length > 0 ? domain : address}@mmail.ink`,
        name: domain,
      },
    ]);
    createMail(MetaMailTypeEn.Signed);
  };
  return (
    <div className={styles.cardWrapper}>
      <Avatar
        src={
          <Image
            src={
              avatar?.length > 0
                ? avatar
                : 'https://www.pngitem.com/pimgs/m/421-4213053_default-avatar-icon-hd-png-download.png'
            }
            style={{ width: 32 }}
          />
        }
      />
      <div className={styles.infoSection}>
        <div className={styles.domain}>
          {domain?.length > 0 ? domain : '-'}
          <Button type="link" onClick={handleSendMail}>
            Send
          </Button>
        </div>
        <div>{address}</div>
      </div>
    </div>
  );
}
