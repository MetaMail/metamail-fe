import { GET_RECOMMENDATIONS } from '@/queries/knn';
import { getWalletAddress } from '@/store/user';
import { Empty, notification, Spin } from 'antd';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';
import DiscoverCard from './DiscoverCard';
import styles from './index.less';

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
        address: getWalletAddress(), //'0xdeec9c0d7e9ff781adb13634728e8903a0150690',
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
      <h3>Here are some contacts recommended by KNN3</h3>
      <Spin spinning={loading}>
        {list?.length > 0 || loading ? (
          <div className={styles.listWrapper}>
            {list?.map((item) => (
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
