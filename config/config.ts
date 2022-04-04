import { defineConfig } from 'umi';
import routes from './routes';
import theme from './theme';

export default defineConfig({
  title: 'MetaMail',
  theme,
  routes,
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  favicon: '/favicon/64x.ico',
  dva: {
    immer: true,
    hmr: true,
  },
});
