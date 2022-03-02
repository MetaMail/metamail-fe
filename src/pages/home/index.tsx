import {
  useState,
  useEffect,
  useRef,
  ReactChild,
  ReactFragment,
  ReactPortal,
} from 'react';
import { history } from 'umi';
import { Button, Layout } from 'antd';
import styles from './index.less';
import logo from '@/assets/logo/logo.svg';
import SideMenu from '@/layouts/SideMenu';
import { default as MailList } from '../list';

const { Header, Content } = Layout;

export default function Home(props: {
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) {
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
          <SideMenu />

          <Content style={{ backgroundColor: '#fff' }}>
            {props.children ?? <MailList />}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
