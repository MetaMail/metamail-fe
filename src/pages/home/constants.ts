export const MenuMap = {
  inbox: {
    key: 'inbox',
    title: 'Inbox',
  },
  all: {
    key: 'all',
    title: 'All',
  },
  read: {
    key: 'read',
    title: 'Read',
  },
  unread: {
    key: 'unread',
    title: 'Unread',
  },
  draft: {
    key: 'draft',
    title: 'Draft',
  },
  contacts: {
    key: 'contacts',
    title: 'Contacts',
  },
  block: {
    key: 'block',
    title: 'Block List',
  },
  allow: {
    key: 'allow',
    title: 'Allow List',
  },
  settings: {
    key: 'settings',
    title: 'Settings',
  },
};

export const menus = [
  {
    key: 1,
    title: 'Inbox',
    children: [
      {
        key: '1001',
        title: 'All',
      },
      {
        key: 1001,
        title: 'Unread',
      },
      {
        key: 1002,
        title: 'Read',
      },
      {
        key: 1003,
        title: 'Flagged',
        children: [
          {
            key: 1003001,
            title: 'Red',
          },
          {
            key: 1003002,
            title: 'Blue',
          },
        ],
      },
    ],
  },
];
