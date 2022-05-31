import { createMail } from '@/layouts/SideMenu/utils';
import { setReceivers } from '@/store/mail';
import { Button } from 'antd';
import { MetaMailTypeEn } from '../home/interfaces';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';

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
      <UserOutlined
        style={{ fontSize: '14px', color: '#2E82E5', lineHeight: '32px' }}
      />
      <div className={styles.address}>{address}</div>
      <Button type="link" onClick={handleSendMail}>
        Send
      </Button>
    </div>
  );
}
