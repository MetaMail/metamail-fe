import { MailMenuItems } from '@/layouts/SideMenu/constants';
import { FilterTypeEn, MetaMailTypeEn } from '@/pages/home/interfaces';
import { Layout, Menu, notification, Modal } from 'antd';
import Icon from '@/components/Icon';
import styles from './index.less';
import cn from 'classnames';
import { useState } from 'react';
import { createDraft } from '@/services';
import { connect, history } from 'umi';
import { generateRandom256Bits, updatePublicKey, pkEncrypt } from './utils';
import { getWalletAddress, saveUserInfo } from '@/store/user';

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

function SideMenu({ unreadCount, setRandomBits }: ISiderMenuProps) {
  const [mailType, setMailType] = useState<MetaMailTypeEn | undefined>(
    undefined,
  );
  const [hover, setHover] = useState<MetaMailTypeEn | undefined>(undefined);

  const handleClickNewMail = async (type: MetaMailTypeEn) => {
    try {
      let key;
      if (type === MetaMailTypeEn.Encrypted) {
        let pKey = getWalletAddress();
        if (!pKey || pKey?.length === 0) {
          Modal.confirm({
            title: 'Enable Encrypted Mail',
            content:
              'You are creating encrypted for the first time. You need to provide your public key for p2p encryption—no gas fee.',
            okText: 'Confirm',
            cancelText: 'Not now',
            onOk: async () => {
              pKey = saveUserInfo(getWalletAddress());
              if (!pKey) {
                notification.error({
                  message: 'Permission denied',
                  description: 'Failed to get your public key',
                });
                return;
              }
              updatePublicKey(pKey);
              notification.success({
                message: 'Success',
                description: 'You can send and receive encrypted mail now.',
              });
            },
          });
          return;
        }
        const randomBits = generateRandom256Bits(getWalletAddress());
        key = pkEncrypt(pKey, randomBits);
        setRandomBits(randomBits);
      } else {
        setRandomBits(undefined);
      }
      if (type === MetaMailTypeEn.Encrypted && (!key || key?.length === 0)) {
        return;
      }
      const { data } = await createDraft(type, key);

      if (data && data?.message_id) {
        setMailType(type);
        history.push({
          pathname: '/home/new',
          query: {
            id: data.message_id,
            type: type + '',
          },
        });
      }
      setMailType(type);
    } catch (e) {
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

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setRandomBits: (data: any) =>
    dispatch({
      type: 'user/setRandomBits',
      payload: data,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
