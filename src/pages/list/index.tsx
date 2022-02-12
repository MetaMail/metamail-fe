import MailListItem from '@/components/MailListItem';
import { getMailDetailByID, getMailList } from '@/services';
import { List, notification } from 'antd';
import { useState, useEffect } from 'react';
import { FilterTypeEn, IMailItem, ReadStatusTypeEn } from '../home/interfaces';

interface IMailListProps {
  filter: FilterTypeEn;
  onClickMailItem: (id: string) => void;
}

export default function MailList({ filter, onClickMailItem }: IMailListProps) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IMailItem[]>();

  const fetchMailList = async () => {
    setLoading(true);
    try {
      const { data } = await getMailList({
        filter,
      });

      setList(data ?? []);
    } catch {
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch mail list for now.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailList();
  }, [filter]);

  return (
    <div>
      {
        <List
          size="large"
          header={<div>工具栏</div>}
          footer={<div>分页器</div>}
          bordered
          // pagination={{
          //   current:
          // }}
          dataSource={list}
          loading={loading}
          renderItem={(item) => (
            <MailListItem
              from={item.mail_from}
              subject={item.subject}
              date={item.mail_date}
              isRead={item.read === ReadStatusTypeEn.read}
              onClick={() => onClickMailItem(item?.message_id)}
            />
          )}
        />
      }
    </div>
  );
}
