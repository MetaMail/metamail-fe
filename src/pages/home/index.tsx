import React, { useState, useEffect } from 'react';
import { Alert, Layout, List, Menu, notification } from 'antd';
import styles from './index.less';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logo from '../../assets/logo/favicon-96x96.png';
import { ContactSubMenuItems, MenuItems } from './constants';
import { getMailDetailByID, getMailList } from '@/services';
import MailListItem from '@/components/MailListItem';
import {
  FilterTypeEn,
  IMailContentItem,
  IMailItem,
  ReadStatusTypeEn,
  SiderFilterMap,
} from './interfaces';
import Modal from 'antd/lib/modal/Modal';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderWidth = 180;

export default function Home() {
  const [list, setList] = useState<IMailItem[]>();
  const [filter, setFilter] = useState(FilterTypeEn.Inbox);
  const [loading, setLoading] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [currMail, setCurrMail] = useState<IMailContentItem>();

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
      <Layout className={styles.container}>
        <Sider breakpoint="lg" collapsedWidth="0" width={SiderWidth}>
          <Menu
            style={{ width: SiderWidth }}
            defaultSelectedKeys={[SiderFilterMap[FilterTypeEn.Inbox]]}
            defaultOpenKeys={[MenuItems.mailbox.key]}
            mode="inline"
            onClick={(event) => {
              const filterKey = Number(event.key);
              !Number.isNaN(filterKey) && setFilter(Number(event.key));
            }}
          >
            <SubMenu
              key={MenuItems.mailbox.key}
              icon={<MailOutlined />}
              title={MenuItems.mailbox.title}
            >
              {Object.keys(SiderFilterMap).map((key: string) => {
                return (
                  <Menu.Item key={Number(key)}>
                    {SiderFilterMap?.[Number(key) as FilterTypeEn]}
                  </Menu.Item>
                );
              })}
            </SubMenu>
            <SubMenu
              key={MenuItems.contacts.key}
              icon={<AppstoreOutlined />}
              title={MenuItems.contacts.title}
            >
              <Menu.Item key={ContactSubMenuItems.allow.key}>
                {ContactSubMenuItems.allow.title}
              </Menu.Item>
              <Menu.Item key={ContactSubMenuItems.block.key}>
                {ContactSubMenuItems.block.title}
              </Menu.Item>
            </SubMenu>
            <Menu.Item key={MenuItems.settings.key} icon={<SettingOutlined />}>
              {MenuItems.settings.title}
            </Menu.Item>
          </Menu>
        </Sider>

        <Content>
          <div>
            <List
              size="large"
              header={<div>工具栏</div>}
              footer={<div>分页器</div>}
              bordered
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
    </Layout>
  );
}

// function mapStateToProps(state: IUserStateProps) {
//   const { address } = state;
//   return {
//     address,
//   };
// }

// // export default Products;
// export default connect(mapStateToProps)(Home);
