export default [
  { exact: true, path: '/', component: '@/pages/index' },
  { exact: true, path: '/login', component: '@/pages/login' },
  { exact: true, path: '/about', component: '@/pages/about' },
  { exact: true, path: '/404', component: '@/pages/notFound' },
  { exact: true, path: '/notification', component: '@/pages/notification' },
  {
    path: '/home',
    component: '@/pages/home',
    routes: [
      {
        path: '/home/list',
        component: '@/pages/list',
        title: 'Home - MetaMail',
      },
      {
        path: '/home/mail',
        component: '@/pages/mail',
        title: 'Mail - MetaMail',
      },
      {
        path: '/home/new',
        component: '@/pages/new',
        title: 'Edit - MetaMail',
      },
      {
        path: '/home/contacts',
        component: '@/pages/contacts',
        title: 'Contacts - MetaMail',
      },
      {
        path: '/home/discover',
        component: '@/pages/discover',
        title: 'Discover - MetaMail',
      },
    ],
  },
];
