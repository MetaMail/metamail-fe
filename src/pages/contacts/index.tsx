import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { notification, Tabs } from 'antd';
import { GraphQLClient } from 'graphql-request';
import { GET_CONNECTIONS } from '@/queries/connection';
import { IConnectItem } from './ContactCard';
import ContactList from './ContactList';
import { getWalletAddress } from '@/store/user';

const { TabPane } = Tabs;

enum ContactTypeEn {
  Friend = 0,
  Following,
  Follower,
}

const client = new GraphQLClient('https://api.cybertino.io/connect/');

// 0x148d59faf10b52063071eddf4aaf63a395f2d41c

export default function Contacts() {
  const [tabKey, setTabKey] = useState(ContactTypeEn.Friend);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<IConnectItem[]>([]);
  const [followings, setFollowings] = useState<IConnectItem[]>([]);
  const [friends, setFriends] = useState<IConnectItem[]>([]);

  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    client
      .request(GET_CONNECTIONS, {
        address: getWalletAddress(), // '0x148d59faf10b52063071eddf4aaf63a395f2d41c',
        type: 'followings',
      })
      .then((res) => {
        setLoading(false);
        setFollowers(res?.identity?.followers?.list);
        setFollowings(res?.identity?.followings?.list);
        setFriends(res?.identity?.friends?.list);
      })
      .catch((e) => {
        setLoading(false);
        notification.error({
          message: 'Failed to get contacts',
          description: 'Sorry, please try again later.',
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h3>CyberConnect Relations</h3>
      <Tabs key={tabKey} onChange={onChange}>
        <TabPane tab="Friends" key={ContactTypeEn.Friend}>
          <ContactList data={friends} />
        </TabPane>
        <TabPane tab="Following" key={ContactTypeEn.Following}>
          <ContactList data={followings} />
        </TabPane>
        <TabPane tab="Followers" key={ContactTypeEn.Follower}>
          <ContactList data={followers} />
        </TabPane>
      </Tabs>
    </div>
  );
}
