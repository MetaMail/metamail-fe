import Icon from '@/components/Icon';
import { GET_RECOMMENDATIONS } from '@/queries/knn';
import { getWalletAddress } from '@/store/user';
import { Empty, notification, Spin } from 'antd';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';
import DiscoverCard from './DiscoverCard';
import styles from './index.less';
import { knn3 } from '@/assets/icons';

interface IRecommendationItem {
  address: string;
}

function About() {
  const [list, setList] = useState<IRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const client = new GraphQLClient('https://openai.graphql.knn3.xyz/graphql');

  useEffect(() => {
    client
      .request(GET_RECOMMENDATIONS, {
        address: '0xdeec9c0d7e9ff781adb13634728e8903a0150690', //getWalletAddress(), // '0xdeec9c0d7e9ff781adb13634728e8903a0150690',
      })
      .then((res) => {
        setList(res?.JACCARD?.data ?? []);
      })
      .catch((e) => {
        notification.error({
          message: 'Failed to discover recommendation contacts',
          description: 'Sorry, please try again later.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h3>
        Contacts Recommended by{' '}
        <Icon style={{ display: 'inline' }} url={knn3}></Icon> KNN3
      </h3>
      <Spin spinning={loading}>
        {list?.length > 0 || loading ? (
          <div className={styles.listWrapper}>
            {list?.slice(0, 5).map((item) => (
              <DiscoverCard {...item} key={item.address} />
            ))}
          </div>
        ) : (
          <Empty
            description="No Recommendations Found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </div>
  );
}

export default About;
