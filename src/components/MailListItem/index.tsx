import styles from './index.less';
import React from 'react';
import cn from 'classnames';
import moment, { Moment } from 'moment';
import {
  MailTypeIconMap,
  IPersonItem,
  MarkTypeEn,
  MetaMailTypeEn,
  ReadStatusTypeEn,
} from '@/pages/home/interfaces';
import { Popover } from 'antd';
import Icon from '../Icon';
import { checkbox, favorite, markFavorite, selected } from '@/assets/icons';

interface IMailItemProps {
  subject: string;
  from: IPersonItem;
  date: string;
  isRead: boolean;
  select?: boolean;
  mark?: MarkTypeEn;
  typeIcon?: string;
  abstract?: string;
  onClick: () => void;
  onSelect: (isSelected: boolean) => void;
  onFavorite: (isSelected: boolean) => void;
}

export default function MailListItem({
  subject,
  from,
  date,
  isRead,
  onClick,
  onSelect,
  onFavorite,
  select,
  mark,
  typeIcon,
  abstract,
}: IMailItemProps) {
  return (
    <div className={styles.itemWrapper}>
      <div className={styles.markBar}>
        <Icon
          url={checkbox}
          checkedUrl={selected}
          onClick={onSelect}
          select={select}
        />
        <Icon
          url={favorite}
          checkedUrl={markFavorite}
          onClick={onFavorite}
          select={mark === MarkTypeEn.Starred}
        />
        {typeIcon && <Icon url={typeIcon} />}
      </div>
      <div className={styles.detail} onClick={onClick}>
        <div className={cn(styles.left, isRead ? null : styles.unread)}>
          <div className={styles.infoBar}>
            <Popover
              title={null}
              content={
                <div>
                  {from?.name} {'<' + (from?.address ?? '') + '>'}
                </div>
              }
            >
              <span className={styles.from}>
                {from?.name && from.name.length > 0 ? from.name : from.address}
              </span>
            </Popover>
            <div className={styles.subject}>{subject}</div>
            <div className={styles.abstract}>{abstract}</div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.date}>{moment(date).format('YYYY/MM/DD')}</div>
        </div>
      </div>
    </div>
  );
}
