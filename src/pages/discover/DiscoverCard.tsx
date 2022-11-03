import { createMail } from '@/layouts/SideMenu/utils';
import { setMailContent } from '@/store/mail';
import { Button } from 'antd';
import { MetaMailTypeEn } from '../home/interfaces';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';
import ContactCard from '../contacts/ContactCard';

export default function DiscoverCard({ address }: { address: string }) {
  const handleSendMail = () => {
    setMailContent({
      mail_to: [
        {
          address: `${address}@mmail.ink`,
        },
      ],
    });
    createMail(MetaMailTypeEn.Signed);
  };

  return (
    <div className={styles.cardWrapper}>
      <ContactCard address={address} domain="" avatar="" />
    </div>
  );
}
