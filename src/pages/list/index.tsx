import MailListItem from '@/components/MailListItem';
import { List, notification } from 'antd';
import { useState, useEffect, useRef } from 'react';
import {
  FilterTypeEn,
  getMailBoxType,
  IMailItem,
  MarkTypeEn,
  ReadStatusTypeEn,
} from '../home/interfaces';
import { changeMailStatus, getMailList, IMailChangeParams } from '@/services';
import styles from './index.less';
import Icon from '@/components/Icon';
import {
  checkbox,
  markFavorite,
  selected,
  favorite,
  trash,
  read,
  leftArrow,
  rightArrow,
} from '@/assets';
import { connect } from 'umi';

function MailList(props: any) {
  const {
    location: { query },
    history,
  } = props;

  const filter = query?.filter ? Number(query.filter) : 0;
  const mailBox = getMailBoxType(filter);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IMailItem[]>();
  const [pageIdx, setPageIdx] = useState(1);
  const [pageNum, setPageNum] = useState(0);
  const [selectList, setSelectList] = useState<Set<string>>(new Set());
  const [isAll, setIsAll] = useState(false);
  const [isAllFavorite, setIsAllFavorite] = useState(false);

  const getMails = () => {
    const res: IMailChangeParams[] = [];

    selectList?.forEach((item) => {
      res.push({
        message_id: item,
        mailbox: mailBox,
      });
    });

    return res;
  };

  const fetchMailList = async () => {
    setLoading(true);
    try {
      const { data } = await getMailList({
        filter,
        page_index: pageIdx,
      });

      setList(data?.mails ?? []);
      setPageIdx(data?.page_index);
      setPageNum(data?.page_num);
      props.setUnreadCount({
        unread: data?.unread,
        total: data?.total,
      });
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
  }, [query]);

  const handleChangeMailStatus = async (
    inputMails?: IMailChangeParams[],
    mark?: MarkTypeEn,
    read?: ReadStatusTypeEn,
  ) => {
    const mails = inputMails ?? getMails();
    try {
      await changeMailStatus(mails, mark, read);
    } catch {
      notification.error({
        message: 'Failed',
        description: 'Sorry, network problem.',
      });
    } finally {
      fetchMailList();
    }
  };
  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon
            url={checkbox}
            checkedUrl={selected}
            onClick={(res: boolean) => {
              setSelectList(() => {
                return new Set(res ? list?.map((item) => item.message_id) : []);
              });
              setIsAll(res);
            }}
            select={isAll}
            style={{
              marginRight: '12px',
            }}
          />
          <Icon
            url={favorite}
            select={isAllFavorite}
            checkedUrl={markFavorite}
            style={{
              marginRight: '8px',
            }}
            onClick={(res) => {
              handleChangeMailStatus(
                undefined,
                res ? MarkTypeEn.Starred : MarkTypeEn.Normal,
              );
              setIsAllFavorite(res);
            }}
          />
          <Icon
            url={trash}
            style={{
              marginRight: '8px',
            }}
            onClick={() => {
              handleChangeMailStatus(undefined, MarkTypeEn.Trash);
            }}
          />
          <Icon
            url={read}
            style={{
              marginRight: '8px',
            }}
            onClick={() => {
              handleChangeMailStatus(
                undefined,
                undefined,
                ReadStatusTypeEn.read,
              );
            }}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.pageIndicator}>
            <span>
              {pageIdx ?? '-'} /{pageNum ?? '-'}
            </span>

            <span style={{ marginLeft: '8px' }}>Go</span>
          </div>
          <div className={styles.pageController}>
            <Icon
              url={leftArrow}
              style={{ marginRight: '40px' }}
              onClick={() => {
                setPageIdx((prev) => {
                  if (prev - 1 > 0) {
                    return prev - 1;
                  } else return prev;
                });
              }}
            />
            <Icon
              url={rightArrow}
              onClick={() => {
                setPageIdx((prev) => {
                  if (prev + 1 <= pageNum) {
                    return prev + 1;
                  } else return prev;
                });
              }}
            />
          </div>
        </div>
      </div>
      <List
        size="large"
        bordered
        dataSource={list}
        loading={loading}
        renderItem={(item) => (
          <MailListItem
            mark={item?.mark}
            from={item.mail_from}
            subject={item.subject}
            date={item.mail_date}
            isRead={item.read === ReadStatusTypeEn.read}
            onClick={() => {
              history.push('/home/mail', {
                id: item?.message_id,
              });
            }}
            select={selectList.has(item.message_id)}
            onFavorite={(isSelect: boolean) => {
              handleChangeMailStatus(
                [
                  {
                    message_id: item?.message_id,
                    mailbox: mailBox,
                  },
                ],
                isSelect ? MarkTypeEn.Starred : MarkTypeEn.Normal,
              );
            }}
            onSelect={(isSelect) => {
              setSelectList((prev) => {
                if (isSelect) {
                  prev.add(item?.message_id);
                } else {
                  prev.delete(item?.message_id);
                }

                return new Set(prev);
              });
            }}
          />
        )}
      />
    </div>
  );
}

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setUnreadCount: (data: any) =>
    dispatch({
      type: 'user/setUnreadCount',
      payload: data,
    }),
});

export default connect(undefined, mapDispatchToProps)(MailList);