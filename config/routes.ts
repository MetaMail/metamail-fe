export default [
  { exact: true, path: '/', component: '@/pages/index' },
  { exact: true, path: '/login', component: '@/pages/login' },
  { exact: true, path: '/about', component: '@/pages/about' },
  { exact: true, path: '/404', component: '@/pages/notFound' },
  {
    path: '/home',
    component: '@/pages/home',
    routes: [
      {
        path: '/home/list',
        component: '@/pages/list',
      },
      {
        path: '/home/mail',
        component: '@/pages/mail',
      },
      {
        path: '/home/new',
        component: '@/pages/new',
      },
    ],
  },
];
