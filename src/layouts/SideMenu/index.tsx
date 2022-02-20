import {
  ContactSubMenuItems,
  MailMenuItems,
  MenuItems,
  SiderFilterMap,
} from '@/layouts/SideMenu/constants';
import { FilterTypeEn, MetaMailTypeEn } from '@/pages/home/interfaces';
import { Layout, Menu, notification } from 'antd';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import Icon from '@/components/Icon';
import styles from './index.less';
import { contacts, write } from '@/assets';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { createDraft } from '@/services';
import { connect, history } from 'umi';
const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderWidth = 200;

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

interface ISiderMenuProps {
  [K: string]: any;
}

function SideMenu({ unread }: ISiderMenuProps) {
  const [mailType, setMailType] = useState<MetaMailTypeEn | undefined>(
    undefined,
  );

  const handleClickNewMail = async (type: MetaMailTypeEn) => {
    try {
      const { data } = await createDraft(type);

      if (data && data?.message_id) {
        setMailType(type);
        history.push({
          pathname: '/home/new',
          query: {
            id: data.message_id,
          },
        });
      }
      setMailType(type);
    } catch {
      notification.error({
        message: 'Network Error',
        description: 'Can NOT create a new e-mail for now.',
      });
      setMailType(undefined);
    }
  };

  const handleClickMenuItem = (filter: string) => {
    if (!Number.isNaN(filter)) {
      history.push({
        pathname: '/home/list',
        query: {
          filter,
        },
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
            mailType === MetaMailTypeEn.Plain
              ? styles.on
              : mailType !== undefined && styles.off,
          )}
          onClick={() => handleClickNewMail(MetaMailTypeEn.Plain)}
        >
          Plain Mail
        </div>
        <div
          className={cn(
            styles.btn,
            styles.encrypted,
            mailType === MetaMailTypeEn.Encrypted
              ? styles.on
              : mailType !== undefined && styles.off,
          )}
          onClick={() => handleClickNewMail(MetaMailTypeEn.Encrypted)}
        >
          Encrypted Mail
        </div>
        <img
          src={write}
          className={cn(
            styles.icon,
            mailType !== undefined ? styles.onIcon : null,
          )}
        />
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
            <Menu.Item key={Number(item.key)} icon={<Icon url={item.logo} />}>
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
                  <span className={styles.unreadBubble}>{unread}</span>
                ) : null}
              </div>
            </Menu.Item>
          );
        })}

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
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

const mapStateToProps = (state: any) => {
  return state.user.unreadCount ?? {};
};

export default connect(mapStateToProps)(SideMenu);
