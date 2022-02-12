import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Layout, List, Menu, notification } from 'antd';
import styles from './index.less';
import logo from '../../assets/logo/favicon-96x96.png';
import { getMailDetailByID, getMailList, createDraft } from '@/services';
import MailListItem from '@/components/MailListItem';
import {
  FilterTypeEn,
  IMailContentItem,
  IMailItem,
  ReadStatusTypeEn,
} from './interfaces';
import NewModal, { INewModalHandles } from '../new';
import SideMenu from '@/layouts/SideMenu';
import MailList from '../list';
import Mail from '../mail';

const { Header, Content } = Layout;

export default function Home() {
  const [filter, setFilter] = useState(FilterTypeEn.Inbox);

  const [isContentVisible, setIsContentVisible] = useState(false);
  const [currMail, setCurrMail] = useState<IMailContentItem>();
  const newModalRef = useRef<INewModalHandles>(null);

  const closeMailContentModal = () => {
    setIsContentVisible(false);
    setCurrMail(undefined);
  };

  const handleClickNewMail = async (type: number = 0) => {
    if (!newModalRef.current) return;

    try {
      if (!newModalRef.current.hasDraft()) {
        const { data } = await createDraft(type);

        if (data && data?.message_id) {
          newModalRef.current.open(data.message_id);
        }
      } else {
        newModalRef.current.open();
      }
    } catch {
      notification.error({
        message: 'Network Error',
        description: 'Can NOT create a new e-mail for now.',
      });
    }
  };

  const handleClickMail = async (id: string) => {
    try {
      const { data } = await getMailDetailByID(id);

      if (data) {
        setCurrMail(data);
      }
    } catch {
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch detail info of this e-mail for now.',
      });
      setCurrMail(undefined);
    }
  };

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
              setCurrMail(undefined);
              const filterKey = Number(event.key);
              !Number.isNaN(filterKey) && setFilter(Number(event.key));
            }}
          />

          <Content>
            {currMail ? (
              <Mail
                {...currMail}
                handleBack={() => setCurrMail(undefined)}
              ></Mail>
            ) : (
              <MailList filter={filter} onClickMailItem={handleClickMail} />
            )}
          </Content>
        </Layout>
      </Layout>

      <Button
        className={styles.composeBtn}
        onClick={() => {
          handleClickNewMail(1);
        }}
      >
        New
      </Button>
      <NewModal ref={newModalRef} />
    </div>
  );
}
