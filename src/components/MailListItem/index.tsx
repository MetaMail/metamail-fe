import styles from './index.less';
import React from 'react';
import cn from 'classnames';
import moment, { Moment } from 'moment';
import {
  IPersonItem,
  MarkTypeEn,
  MetaMailTypeEn,
  MailTypeIconMap,
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
  metaType?: MetaMailTypeEn;
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
  metaType,
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
        {metaType != undefined && metaType != MetaMailTypeEn.Plain && (
          <Popover
            title={null}
            content={
              <div>
                This email is{' '}
                {metaType == MetaMailTypeEn.Signed ? 'signed' : 'encrypted'}{' '}
                {'by ' + from?.address}
              </div>
            }
          >
            <span>
              <Icon url={MailTypeIconMap?.[metaType]} />
            </span>
          </Popover>
        )}
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
            <div className={styles.abstract}>
              {metaType == MetaMailTypeEn.Encrypted
                ? '*'.repeat(abstract?.length ?? 1)
                : abstract}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.date}>
            {moment(date).calendar(null, {
              sameDay: 'LT',
              lastDay: '[Yesterday] LT',
              lastWeek: 'LL',
              sameElse: 'LL',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
