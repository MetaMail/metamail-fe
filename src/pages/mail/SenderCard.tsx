import { mergeUrlWithParams } from '@/utils/url';
import { Popover } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { TwitterCircleFilled } from '@ant-design/icons';

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

const SenderInfo = ({ name, address }: ISenderInfo) => {
  return (
    <span className={styles.info}>
      {name ?? 'Unknown'} {address ? '<' + address + '>' : null}
    </span>
  );
};

export default function SenderCard({ name, address }: ISenderInfo) {
  const [twitter, setTwitter] = useState<string>();

  const getTwitterAccount = async () => {
    const res = await axios
      .create({
        baseURL: 'https://proof-service.next.id',
        withCredentials: false,
        timeout: 5000,
      })
      .get(
        mergeUrlWithParams('/v1/proof', {
          platform: 'ethereum',
          identity: address?.split('@')[0], //'0x0da0ee86269797618032e56a69b1aad095c581fc',
        }),
      );

    if (res && (res?.status === 200 || res?.status === 304)) {
      setTwitter(processData(res?.data?.ids));
    }
  };

  useEffect(() => {
    if (address && address?.length > 0) {
      getTwitterAccount();
    }
  }, [address]);

  return (
    <span className={styles.info}>
      {name ?? 'Unknown'} {address ? '<' + address + '>' : null}
      {twitter && twitter?.length > 0 ? (
        <Popover
          content={
            <div>
              <div>
                Twitter Account:{' '}
                <a href={'https://twitter.com/' + twitter} target="_blank">
                  {twitter}
                </a>
              </div>
              <div style={{ color: '#aaa' }}>
                Identity information from{' '}
                <a href="https://next.id/" target="_blank">
                  Next.ID
                </a>{' '}
              </div>
            </div>
          }
        >
          <TwitterCircleFilled
            style={{
              marginLeft: '8px',
            }}
            onClick={() => {
              window.open(`https://twitter.com/${twitter}`);
            }}
          />
        </Popover>
      ) : null}
    </span>
  );
  // return twitter && twitter?.length > 0 ? (
  //   <Popover
  //     title="See more about the sender"
  //     content={<TwitterCircleFilled />}
  //   >
  //     {console.log('-----???')}
  //     <SenderInfo name={name} address={address} />
  //   </Popover>
  // ) : (
  //   <SenderInfo name={name} address={address} />
  // );
}
