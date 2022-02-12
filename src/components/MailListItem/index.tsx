import styles from './index.less';
import React from 'react';
import cn from 'classnames';
import moment, { Moment } from 'moment';
import { IPersonItem } from '@/pages/home/interfaces';
import { Divider, Popover } from 'antd';

interface IMailItemProps {
  subject: string;
  from: IPersonItem;
  date: string;
  isRead: boolean;
  onClick: () => void;
}

export default function MailListItem({
  subject,
  from,
  date,
  isRead,
  onClick,
}: IMailItemProps) {
  return (
    <div className={styles.itemWrapper} onClick={onClick}>
      <div className={cn(styles.left, isRead ? styles.read : null)}>
        <Popover
          title={null}
          content={
            <div>
              {from?.name} {'<' + from?.address ?? '' + '>'}
            </div>
          }
        >
          <span className={styles.from}>{from?.name ?? from.address}</span>
        </Popover>
        <span className={styles.subject}>{subject}</span>
      </div>
      <div className={styles.right}>{moment(date).format('YYYY/MM/DD')}</div>
    </div>
  );
}
