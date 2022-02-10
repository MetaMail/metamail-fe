import {
  ContactSubMenuItems,
  MenuItems,
} from '@/components/SideMenu/constants';
import { FilterTypeEn, SiderFilterMap } from '@/pages/home/interfaces';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderWidth = 180;

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

interface ISiderMenuProps {
  handleClickMenuItem: (event: MenuInfo) => void;
}

export default function SideMenu({ handleClickMenuItem }: ISiderMenuProps) {
  return (
    <Sider breakpoint="lg" collapsedWidth="0" width={SiderWidth}>
      <Menu
        style={{ width: SiderWidth }}
        defaultSelectedKeys={[SiderFilterMap[FilterTypeEn.Inbox]]}
        defaultOpenKeys={[MenuItems.mailbox.key]}
        mode="inline"
        onClick={handleClickMenuItem}
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
  );
}
