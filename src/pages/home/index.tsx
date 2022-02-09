import React, { useState, useEffect } from 'react';
import { Alert, Layout, List, Menu, notification } from 'antd';
import styles from './index.less';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logo from '../../assets/logo/favicon-96x96.png';
import { MenuMap } from './constants';
import { getMailList } from '@/services';
import MailListItem from '@/components/MailListItem';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderWidth = 180;

export default function Home() {
  const [list, setList] = useState();
  const [readStatus, setReadStatus] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMailList = async () => {
    setLoading(true);
    try {
      const { data } = await getMailList({
        filter: {
          mailbox: 0,
          read: readStatus,
          meta_type: 0,
        },
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

  const handleClickMail = async () => {};

  useEffect(() => {
    fetchMailList();
  }, [readStatus]);

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <img src={logo} className={styles.logo} />
          <span className={styles.brand}>MetaMail</span>
        </div>
        <div className={styles.right}>
          <div>address ?? '-''</div>
        </div>
      </Header>
      <Layout className={styles.container}>
        <Sider breakpoint="lg" collapsedWidth="0" width={SiderWidth}>
          <Menu
            style={{ width: SiderWidth }}
            defaultSelectedKeys={[MenuMap.all.key]}
            defaultOpenKeys={[MenuMap.inbox.key, MenuMap.contacts.key]}
            mode="inline"
            onClick={(event) => {
              if (event.key === MenuMap.read.key) {
                setReadStatus(1);
              } else if (event.key === MenuMap.unread.key) {
                setReadStatus(0);
              }
            }}
          >
            <SubMenu
              key={MenuMap.inbox.key}
              icon={<MailOutlined />}
              title={MenuMap.inbox.title}
            >
              <Menu.Item key={MenuMap.all.key}>{MenuMap.all.title}</Menu.Item>
              <Menu.Item key={MenuMap.unread.key}>
                {MenuMap.unread.title}
              </Menu.Item>
              <Menu.Item key={MenuMap.read.key}>{MenuMap.read.title}</Menu.Item>
              <Menu.Item key={MenuMap.draft.key}>
                {MenuMap.draft.title}
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key={MenuMap.contacts.key}
              icon={<AppstoreOutlined />}
              title={MenuMap.contacts.title}
            >
              <Menu.Item key={MenuMap.allow.key}>{MenuMap.all.title}</Menu.Item>
              <Menu.Item key={MenuMap.block.key}>
                {MenuMap.block.title}
              </Menu.Item>
            </SubMenu>
            <Menu.Item key={MenuMap.settings.key} icon={<SettingOutlined />}>
              {MenuMap.settings.title}
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
                  isRead={item.read === 1}
                  onClick={handleClickMail}
                />
              )}
            />
          </div>
        </Content>
      </Layout>
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
