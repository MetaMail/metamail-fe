import { Button } from 'antd';
import styles from './index.less';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import logo from '@/assets/logo/logo.svg';

export default function Notification() {
  const [link, setLink] = useState<string>();
  useEffect(() => {
    let jumpTo = window?.location.href?.split('?link=')?.[1];

    if (jumpTo && jumpTo.length > 0) {
      setLink(jumpTo);
    }
  }, [window.location]);

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <img src={logo} className={styles.logo} />
        <div className={styles.brandBar}>
          <div className={styles.brand}>MetaMail</div>
          <div className={styles.version}>Beta</div>
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.tip}>
          About to leave the MetaMail, please pay attention to your account
          property security.
        </div>
        <div className={styles.link}>{link}</div>
        <div className={styles.btnBar}>
          <Button
            onClick={() => {
              window.open(
                link?.startsWith('http') ? link : 'https://' + link,
                '_self',
                'noreferrer,noopener',
              );
            }}
            type="primary"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
