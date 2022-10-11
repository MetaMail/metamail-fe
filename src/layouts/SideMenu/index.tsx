import { MailMenuItems } from '@/layouts/SideMenu/constants';
import { FilterTypeEn, MetaMailTypeEn } from '@/pages/home/interfaces';
import { Layout, Menu, notification } from 'antd';
import Icon from '@/components/Icon';
import styles from './index.less';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import { connect, history, useHistory } from 'umi';
import { createMail } from './utils';
import { contacts } from '@/assets';
import { useLocation } from 'react-router-dom';
const { Sider } = Layout;

const SiderWidth = 200;

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

interface ISiderMenuProps {
  [K: string]: any;
}

function SideMenu({ unreadCount }: ISiderMenuProps) {
  const location = useLocation();
  const [mailType, setMailType] = useState<MetaMailTypeEn | undefined>(
    undefined,
  );
  const [hover, setHover] = useState<MetaMailTypeEn | undefined>(undefined);
  const history = useHistory();
  const [pageIdx, setPageIdx] = useState(1);
  useEffect(() => {
    if (history.location.state && history.location.state.pageIdx) {
      setPageIdx(history.location.state.pageIdx);
    }
  }, []);
  const handleClickNewMail = async (type: MetaMailTypeEn) => {
    setMailType(type);
    createMail(type).catch(() => {
      notification.error({
        message: 'Network Error',
        description: 'Can NOT create a new e-mail for now.',
      });
      setMailType(undefined);
    });
  };

  const handleClickMenuItem = (filter: string) => {
    const filterNum = Number(filter);

    if (!Number.isNaN(filterNum)) {
      history.replace({
        pathname: location.pathname,
        state: {
          pageIdx,
        },
      });
      history.push({
        pathname: '/home/list',
        query: {
          filter,
        },
        state: {
          pageIdx,
        },
      });
    } else {
      history.push({
        pathname: `/home/${filter}`,
      });
    }

    setMailType(undefined);
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      width={SiderWidth}
      className={styles.sider}
    >
      <div className={styles.createWrapper}>
        <div
          className={cn(
            styles.btn,
            styles.plain,
            mailType === MetaMailTypeEn.Signed
              ? styles.on
              : mailType === MetaMailTypeEn.Encrypted
              ? styles.off
              : hover === MetaMailTypeEn.Signed
              ? styles.on
              : hover === MetaMailTypeEn.Encrypted && styles.off,
          )}
          onClick={() => {
            if (!mailType) handleClickNewMail(MetaMailTypeEn.Signed);
          }}
          onMouseEnter={() => setHover(MetaMailTypeEn.Signed)}
          onMouseLeave={() => setHover(undefined)}
        >
          New Mail
        </div>
        <div
          className={cn(
            styles.btn,
            styles.encrypted,
            mailType === MetaMailTypeEn.Encrypted
              ? styles.on
              : mailType === MetaMailTypeEn.Signed
              ? styles.off
              : hover === MetaMailTypeEn.Encrypted
              ? styles.on
              : hover === MetaMailTypeEn.Signed && styles.off,
          )}
          onClick={() => {
            if (!mailType) handleClickNewMail(MetaMailTypeEn.Encrypted);
          }}
          onMouseEnter={() => setHover(MetaMailTypeEn.Encrypted)}
          onMouseLeave={() => setHover(undefined)}
        >
          Encrypted
        </div>
        {/* <img
          src={write}
          className={cn(
            styles.icon,
            mailType !== undefined ? styles.onIcon : null,
          )}
        /> */}
      </div>
      <Menu
        style={{ width: SiderWidth }}
        defaultSelectedKeys={[FilterTypeEn.Inbox.toString()]}
        mode="inline"
        onClick={(e) => {
          handleClickMenuItem(e.key);
        }}
      >
        {MailMenuItems.map((item) => {
          return (
            <Menu.Item
              className={styles.menuItem}
              key={Number(item.key)}
              icon={<Icon url={item.logo} />}
            >
              <div
                className={styles.menuItemWrapper}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <span className={styles.title}> {item.title}</span>
                {item.title === 'Inbox' ? (
                  <span className={styles.unreadBubble}>
                    {unreadCount?.unread}
                  </span>
                ) : null}
              </div>
            </Menu.Item>
          );
        })}
        <Menu.Item key={'contacts'} icon={<Icon url={contacts} />}>
          Contacts
        </Menu.Item>
        <Menu.Item key={'discover'} icon={<Icon url={contacts} />}>
          Discover
        </Menu.Item>
        {/*
        <SubMenu
          key={MenuItems.contacts.key}
          icon={<Icon url={contacts} />}
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
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
}

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

export default connect(mapStateToProps)(SideMenu);
