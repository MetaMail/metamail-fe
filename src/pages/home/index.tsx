import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Layout, List, Menu, notification } from 'antd';
import styles from './index.less';
import logo from '../../assets/logo/favicon-96x96.png';
import { getMailDetailByID, getMailList } from '@/services';
import MailListItem from '@/components/MailListItem';
import {
  FilterTypeEn,
  IMailContentItem,
  IMailItem,
  ReadStatusTypeEn,
} from './interfaces';
import NewModal, { INewModalHandles } from '../new';
import SideMenu from '@/components/SideMenu';

const { Header, Content } = Layout;

export default function Home() {
  const [list, setList] = useState<IMailItem[]>();
  const [filter, setFilter] = useState(FilterTypeEn.Inbox);
  const [loading, setLoading] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [currMail, setCurrMail] = useState<IMailContentItem>();
  const newModalRef = useRef<INewModalHandles>(null);

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

  const handleClickMail = async (id: string) => {
    try {
      const { data } = await getMailDetailByID(id);

      if (data) {
        setCurrMail(data);
        setIsContentVisible(true);
      }
    } catch {
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch detail info of this e-mail for now.',
      });
      setIsContentVisible(false);
      setCurrMail(undefined);
    }
  };

  const closeMailContentModal = () => {
    setIsContentVisible(false);
    setCurrMail(undefined);
  };
  useEffect(() => {
    fetchMailList();
  }, [filter]);

  return (
    <div className={styles.container}>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.left}>
            <img src={logo} className={styles.logo} />
            <span className={styles.brand}>MetaMail</span>
          </div>
          <div className={styles.right}>
            <div>TODO: 个人中心</div>
          </div>
        </Header>
        <Layout className={styles.contentWrapper}>
          <SideMenu
            handleClickMenuItem={(event) => {
              const filterKey = Number(event.key);
              !Number.isNaN(filterKey) && setFilter(Number(event.key));
            }}
          />

          <Content>
            <div>
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
                    onClick={() => {
                      handleClickMail(item.message_id);
                    }}
                  />
                )}
              />
            </div>
          </Content>
        </Layout>
      </Layout>

      <Modal
        visible={currMail && isContentVisible}
        title={currMail?.subject}
        okText={'Reply'}
        cancelText={'Ok'}
        onCancel={closeMailContentModal}
        onOk={closeMailContentModal}
      >
        <div>
          {currMail?.part_txt}
          {currMail?.part_html}
        </div>
      </Modal>

      <Button
        className={styles.composeBtn}
        onClick={() => {
          newModalRef.current && newModalRef.current.open();
        }}
      >
        New
      </Button>
      <NewModal ref={newModalRef} />
    </div>
  );
}
