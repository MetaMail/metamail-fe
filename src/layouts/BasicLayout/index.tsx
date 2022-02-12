import { Layout, Menu, List } from 'antd';
import styles from './index.less';
import SideMenu from '@/layouts/SideMenu';
import logo from '../../assets/logo/favicon-96x96.png';

const { Header, Content } = Layout;

export default function BasicLayout() {
  return (
    <div>
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
              // !Number.isNaN(filterKey) && setFilter(Number(event.key));
            }}
          />

          <Content>{/* {render } */}</Content>
        </Layout>
      </Layout>
    </div>
  );
}
