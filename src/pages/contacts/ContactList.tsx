import { Empty } from 'antd';
import React from 'react';
import ContactCard, { IConnectItem } from './ContactCard';
import styles from './index.less';
interface IContactListProps {
  data: IConnectItem[];
}

export default function ContactList({ data }: IContactListProps) {
  return data.length > 0 ? (
    <div className={styles.listWrapper}>
      {data?.map((item) => {
        return <ContactCard {...item} />;
      })}
    </div>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<span>No Contacts Found</span>}
    />
  );
}
