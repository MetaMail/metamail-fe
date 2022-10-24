import MailListItem from '@/components/MailListItem';
import { List, notification } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  FilterTypeEn,
  getMailBoxType,
  IMailItem,
  MailBoxTypeEn,
  MarkTypeEn,
  MetaMailTypeEn,
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
} from '@/assets/icons';
import { connect, history } from 'umi';
import { setRandomBits } from '@/store/user';

function MailList(props: any) {
  const { location = useLocation() } = props;
  const queryRef = useRef(0);
  const history = useHistory();
  const mailBox = getMailBoxType(queryRef.current);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IMailItem[]>([]);
  const fetchIndex = sessionStorage.getItem('pageIdx')
    ? Number(sessionStorage.getItem('pageIdx'))
    : 1;
  const [pageIdx, setPageIdx] = useState(fetchIndex);
  const [pageNum, setPageNum] = useState(0);
  const [inboxType, setinboxType] = useState(Number(mailBox));
  const [selectList, setSelectList] = useState<IMailItem[]>([]);
  const [isAll, setIsAll] = useState(false);
  const [isAllFavorite, setIsAllFavorite] = useState(false);
  //const [hover, setHover] = useState<string | undefined>(undefined);

  const getMails = () => {
    const res: IMailChangeParams[] = [];

    selectList?.forEach((item) => {
      res.push({
        message_id: item.message_id,
        mailbox: item.mailbox,
      });
    });

    return res;
  };

  const fetchMailList = async (showLoading = true) => {
    //console.log('pageindx: '+sessionStorage.getItem("pageIdx"));
    //console.log('inbox: '+queryRef.current);
    //console.log('pageindxstate: '+pageIdx);
    //console.log('end');
    if (showLoading) {
      setLoading(true);
    }
    try {
      const { data } = await getMailList({
        filter: queryRef.current,
        page_index: pageIdx,
      });

      setList(data?.mails ?? []);
      //setPageIdx(data?.page_index);
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
      if (showLoading) {
        setLoading(false);
      }
      //setPageIdx(fetchIndex);
    }
  };

  useEffect(() => {
    queryRef.current = location?.query?.filter
      ? Number(location?.query?.filter)
      : 0;
    if (!sessionStorage.getItem('pageIdx')) setPageIdx(1);

    setinboxType(queryRef.current);
    fetchMailList();
  }, [pageIdx, location?.query]);

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
      fetchMailList(false);
    }
  };

  const handleClickMail = (
    id: string,
    type: MetaMailTypeEn,
    mailbox: MailBoxTypeEn,
    read: number,
  ) => {
    const pathname =
      queryRef.current === FilterTypeEn.Draft ? '/home/new' : '/home/mail';
    setRandomBits(undefined); // clear random bits
    if (!read) {
      const mails = [{ message_id: id, mailbox: Number(mailbox) }];
      changeMailStatus(mails, undefined, ReadStatusTypeEn.read);
    }
    //history.replace({
    //pathname: location.pathname,
    //state: { pageIdx },
    //});
    //setPageIdx(fetchIndex);
    sessionStorage.setItem('pageIdx', String(pageIdx));
    sessionStorage.setItem('inboxType', String(inboxType));
    history.push({
      pathname,
      query: {
        id,
        type: type + '',
      },
      //  state: { pageIdx, inboxType },
    });
  };
  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon
            url={checkbox}
            checkedUrl={selected}
            onClick={(res: boolean) => {
              setSelectList(res ? list?.map((item) => item) : []);
              setIsAll(res);
            }}
            select={isAll}
            style={{
              marginRight: '12px',
            }}
            tip={'select all'}
          ></Icon>
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
            tip={'star'}
          />
          <Icon
            url={trash}
            style={{
              marginRight: '8px',
            }}
            onClick={() => {
              handleChangeMailStatus(
                undefined,
                queryRef.current == 3 ? MarkTypeEn.Deleted : MarkTypeEn.Trash,
              );
            }}
            tip={'delete'}
          />
          <Icon
            url={read}
            style={{
              marginRight: '8px',
            }}
            data-tip="marked read"
            onClick={() => {
              handleChangeMailStatus(
                undefined,
                undefined,
                ReadStatusTypeEn.read,
              );
            }}
            tip={'mark read'}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.pageIndicator}>
            <span>
              {pageIdx ?? '-'} /{pageNum ?? '-'}
            </span>

            {/* <span style={{ marginLeft: '8px' }}>Go</span> */}
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
                sessionStorage.setItem('pageIdx', String(pageIdx));
                console.log(pageIdx);
                history.push({
                  pathname: '/home/list',
                  query: {
                    filter: inboxType,
                  },
                  //  state: {
                  //    pageIdx,
                  //  },
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
                sessionStorage.setItem('pageIdx', String(pageIdx));
                console.log(pageIdx);
                history.push({
                  pathname: '/home/list',
                  query: {
                    filter: inboxType,
                  },
                  //  state: {
                  //    pageIdx,
                  //  },
                });
              }}
            />
          </div>
        </div>
      </div>
      <List
        className={styles.list}
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
            metaType={item.meta_type as MetaMailTypeEn}
            isRead={item.read == ReadStatusTypeEn.read}
            abstract={item?.digest}
            onClick={() => {
              handleClickMail(
                item.message_id,
                item.meta_type,
                item.mailbox,
                item.read,
              );
            }}
            select={
              selectList.findIndex(
                (i) =>
                  i.message_id === item.message_id &&
                  i.mailbox === item.mailbox,
              ) >= 0
            }
            onFavorite={(isSelect: boolean) => {
              handleChangeMailStatus(
                [
                  {
                    message_id: item?.message_id,
                    mailbox: item?.mailbox,
                  },
                ],
                isSelect ? MarkTypeEn.Starred : MarkTypeEn.Normal,
              );
            }}
            onSelect={(isSelect) => {
              if (isSelect) {
                const nextList = selectList.slice();
                nextList.push(item);
                setSelectList(nextList);
              } else {
                const nextList = selectList.filter(
                  (i) =>
                    i.message_id !== item.message_id &&
                    i.mailbox !== item.mailbox,
                );
                setSelectList(nextList);
              }
            }}
          />
        )}
      />
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setUnreadCount: (data: any) =>
    dispatch({
      type: 'user/setUnreadCount',
      payload: data,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MailList);
