import { useState } from 'react';
import { connect, history } from 'umi';
import { Dropdown, Layout, message, notification } from 'antd';
import styles from './index.less';
import logo from '@/assets/logo/logo.svg';
import { clipboard, logout } from '@/assets/icons';
import SideMenu from '@/layouts/SideMenu';
import { default as MailList } from '../list';
import { PostfixOfAddress } from '@/utils/constants';
import Icon from '@/components/Icon';
import { getLogout } from '@/services';
import { clearUserInfo, getUserInfo, saveShowName } from '@/store/user';

const { Header, Content } = Layout;

function Home(props: any) {
  const { children } = props;
  const { address, showName, ensName } = getUserInfo();
  const [activeName, setActiveName] = useState(showName);

  const DropItem = ({ name }: { name?: string }) => {
    return name ? (
      <div
        className={styles.item}
        onClick={() => {
          saveShowName(name);
          setActiveName(name);
        }}
      >
        <div id="name" style={{ minWidth: '200px', marginRight: '8px' }}>
          {name + PostfixOfAddress}
        </div>
        <Icon
          url={clipboard}
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(name + PostfixOfAddress);
              message.success('Copied!');
            }
          }}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <Layout>
        <Header className={styles.header}>
          <a href="/">
            <div className={styles.left}>
              <img src={logo} className={styles.logo} />
              <div className={styles.brandBar}>
                <div className={styles.brand}>MetaMail</div>
                <div className={styles.version}>Beta</div>
              </div>
            </div>
          </a>
          <div className={styles.right}>
            <Dropdown
              overlay={
                <div className={styles.dropMenu}>
                  <DropItem name={address} />
                  <DropItem name={ensName} />

                  <div
                    className={styles.item}
                    onClick={() => {
                      try {
                        getLogout();
                        clearUserInfo();

                        history.push({
                          pathname: '/login',
                        });
                      } catch {
                        notification.error({
                          message: 'Logout Failed',
                          description: 'Sorry, network problem.',
                        });
                      }
                    }}
                  >
                    <div id="name">Logout</div>
                    <Icon url={logout} />
                  </div>
                </div>
              }
            >
              <div className={styles.addressBar}>
                {activeName ? activeName + PostfixOfAddress : ''}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Layout className={styles.contentWrapper}>
          <SideMenu />

          <Content style={{ backgroundColor: '#fff' }}>
            {children ?? <MailList />}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Home;
