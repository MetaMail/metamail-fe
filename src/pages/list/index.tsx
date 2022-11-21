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
  //const fetchIndex = sessionStorage.getItem('pageIdx')
  //  ? Number(sessionStorage.getItem('pageIdx'))
  //  : 1;
  const [pageIdx, setPageIdx] = useState(
    props?.pageIndex?.currentIndex ? props?.pageIndex?.currentIndex : 1,
  );
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
    //console.log('in');
    //console.log(props?.pageIndex?.totalIndex);
    if (props?.pageIndex && typeof props?.pageIndex?.totalIndex == 'undefined')
      setPageIdx(1); //undefined就证明是sidemenu传的state，代表了初次渲染时点击了别的inbox，因此返回第一页
    //if (pageNum==0) {setPageIdx(0);
    //setPageIdx(1);};
    try {
      //console.log(props?.data);
      //props.setUnreadCount({
      //  unread: 3,
      //  total: 3,
      //});
      //console.log("page1 "+props.pageIndex.currentIndex);
      //console.log("total1 "+props.pageIndex.totalIndex);
      //console.log('try');
      //console.log(props?.data?.pageIndex);
      //console.log(props?.data?.inboxType);
      //console.log(props?.data?.content);
      if (
        props?.data &&
        props?.data?.pageIndex == pageIdx &&
        props?.data?.inboxType == queryRef.current
      ) {
        console.log('shi');
        setList(props?.data?.mailList);
        //setPageIdx(data?.page_index);
        setPageNum(props?.data?.totalPage);
      } else {
        const { data } = await getMailList({
          filter: queryRef.current,
          page_index: pageIdx,
        });
        //console.log('this');
        //props.setPageIndex({
        //  currentIndex: pageIdx,
        //  totalIndex: data?.page_num,
        //})
        //console.log('this');
        //console.log(pageIdx);
        //console.log(data?.page_num);

        props.setPageIndex({
          currentIndex: pageIdx,
          totalIndex: data?.page_num,
        });
        //console.log("page1 "+props.pageIndex.currentIndex);
        //console.log("total1 "+props.pageIndex.totalIndex);
        setList(data?.mails ?? []);
        //setPageIdx(data?.page_index);
        setPageNum(data?.page_num);
        props.setUnreadCount({
          unread: data?.unread,
          total: data?.total,
        });
      }
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
    console.log('finally');
    console.log(list);
    console.log(pageNum);
    //因为缓存的时候每次读data，所以如果old data有数据证明old data是下一次返回要用的，把old data变成data，现在这一页存进old data里
    props.setDataList({
      pageIndex: props?.data?.oldPageIndex ? props.data.oldPageIndex : pageIdx,
      inboxType: props?.data?.oldInboxType
        ? props.data.oldInboxType
        : queryRef.current,
      //mailList: props?.data?.oldMailList ? props.data.oldMailList : list,
      //totalPage: props?.data?.oldTotalPage ? props.data.oldTotalPage : pageNum,
      mailList: list, //这里的list和pagenum实际上就是old data的state，由于在这个阶段未更新所以可以直接用
      totalPage: pageNum,
      oldPageIndex: pageIdx,
      oldInboxType: queryRef.current,
    });
  };

  useEffect(() => {
    //if (props?.pageIndex?.currentIndex && props?.pageIndex?.currentIndex!=pageIdx)
    //setPageIdx(props.pageIndex.currentIndex);
    props.setPageIndex({
      currentIndex: pageIdx,
      totalIndex: pageNum,
    });
    queryRef.current = location?.query?.filter
      ? Number(location?.query?.filter)
      : 0;
    //if (!sessionStorage.getItem('pageIdx')) setPageIdx(1);
    setinboxType(queryRef.current);
    fetchMailList();
  }, [pageIdx, location?.query]);
  const handleChangeSelectList = (item: IMailItem, isSelect?: boolean) => {
    if (isSelect) {
      const nextList = selectList.slice();
      nextList.push(item);
      setSelectList(nextList);
    } else {
      const nextList = selectList.filter(
        (i) => i.message_id !== item.message_id && i.mailbox !== item.mailbox,
      );
      setSelectList(nextList);
    }
  };

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
    //sessionStorage.setItem('pageIdx', String(pageIdx));
    //sessionStorage.setItem('inboxType', String(inboxType));
    //setinboxType(inboxType);
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
                //props.minusPageIdx();
                //sessionStorage.setItem('pageIdx', String(pageIdx));
                //console.log(pageIdx);
                //props.setPageIndex({
                //  currentIndex: pageIdx,
                //  totalIndex: pageNum,
                //});
                //console.log("page2 "+props.pageIndex.currentIndex);
                //console.log("total2 "+props.pageIndex.totalIndex);
                //history.push({
                //  pathname: '/home/list',
                //  query: {
                //    filter: inboxType,
                //  },
                //  state: {
                //    pageIdx,
                //  },
                //});
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
                //console.log('xian1');
                //props.setPageIndex({
                //  currentIndex: pageIdx,
                //  totalIndex: pageNum,
                //});
                //props.addPageIdx();
                //sessionStorage.setItem('pageIdx', String(pageIdx));
                //console.log(pageIdx);
                //console.log("page3 "+props.pageIndex.currentIndex);
                //console.log("total3 "+props.pageIndex.totalIndex);
                //history.push({
                //  pathname: '/home/list',
                //  query: {
                //    filter: inboxType,
                //  },
                //  state: {
                //    pageIdx,
                //  },
                //});
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
              props.setDataList({
                //点击了邮件那肯定是需要返回最新的一页，因此重新把store更新
                pageIndex: pageIdx,
                inboxType: queryRef.current,
                mailList: list,
                totalPage: pageNum,
              });
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
              handleChangeSelectList(item, isSelect);
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

//const mapIndexStateToProps = (state: any) => {
//  return state.pageIndex ?? {};
//};

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setUnreadCount: (data: any) =>
    dispatch({
      type: 'user/setUnreadCount',
      payload: data,
    }),
  setPageIndex: (data: any) =>
    dispatch({
      type: 'user/setPageIndex',
      payload: data,
    }),
  setDataList: (data: any) =>
    dispatch({
      type: 'user/setDataList',
      payload: data,
    }),
  //setIndoxType: (data: any) =>
  //  dispatch({
  //    type: 'user/setIndoxType',
  //    payload: data,
  //  }),
  //addPageIdx: (data: any) =>
  //  dispatch({
  //    type: 'page/addPageIdx',
  //    payload: data,
  ////  }),
  //minusPageIdx: (data: any) =>
  //  dispatch({
  //    type: 'page/minusPageIdx',
  //    payload: data,
  //  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MailList);
