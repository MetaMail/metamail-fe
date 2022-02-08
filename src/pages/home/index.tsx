import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Layout, Menu } from 'antd';
import styles from './index.less';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logo from '../../assets/logo/favicon-96x96.png';
import { MenuMap } from './constants';
import { getMailList } from '@/services';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderWidth = 180;

export default function Home() {
  const [state, setState] = useState({ value: null });

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <img src={logo} className={styles.logo} />
          <span className={styles.brand}>MetaMail</span>
        </div>
        <div className={styles.right}>
          <div>test</div>
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
              console.log(event, '===test');

              if (event.key === MenuMap.read.key) {
                getMailList({
                  read_status: 1,
                });
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
      </Layout>
    </Layout>
  );
}
