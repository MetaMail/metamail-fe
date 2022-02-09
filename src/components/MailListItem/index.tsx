import styles from './index.less';
import React from 'react';
import cn from 'classnames';
import moment, { Moment } from 'moment';

interface IMailItemProps {
  subject: string;
  from: string;
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
        <span className={styles.from}>{from}</span>
        <span className={styles.subject}>{subject}</span>
      </div>
      <div className={styles.right}>
        {moment(date).format('YYYY/MM/DD HH:mm:ss')}
      </div>
    </div>
  );
}
