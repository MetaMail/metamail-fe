import { getLogout } from '@/services';
import axios from 'axios';
import { mergeUrlWithParams } from './url';
import { history } from 'umi';

const BASE_URL = 'https://api.metamail.ink/';

const ajax = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

// ajax.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
ajax.defaults.headers.common['Access-Control-Allow-Origin'] =
  'https://api.metamail.ink/';

type requestParams = Record<string, any>;

const checkResponse = (res: any) => {
  if (res && (res?.status === 200 || res?.status === 304)) {
    return res?.data ?? {};
  }
};

const checkLoginStatus = (e: unknown) => {
  if (String(e)?.includes('status code 401')) {
    history.push({
      pathname: '/login',
    });
  }

  console.error('Network went wrong, see more info: ', e);
};

const request = (url: string, config?: Record<string, string>) => {
  return {
    post: async (params: requestParams = {}, config: requestParams = {}) => {
      let res;
      try {
        res = await ajax.post(url, params, {
          ...(config ? { ...config } : {}),
        });
      } catch (e) {
        // const isCancel = axios.isCancel(e);
        checkLoginStatus(e);
      }

      return checkResponse(res);
    },

    get: async (params: requestParams = {}, config: requestParams = {}) => {
      let res;
      const _url = mergeUrlWithParams(url, params);
      try {
        res = await ajax.get(_url, { ...(config ? { ...config } : {}) });
      } catch (e) {
        // const isCancel = axios.isCancel(e);
        checkLoginStatus(e);
      }

      return checkResponse(res);
    },

    patch: async (params: requestParams = {}, config: requestParams = {}) => {
      let res;
      try {
        res = await ajax.patch(url, params, {
          ...(config ? { ...config } : {}),
        });
      } catch (e) {
        checkLoginStatus(e);
      }

      return checkResponse(res);
    },

    delete: async (config: requestParams = {}) => {
      let res;
      try {
        res = await ajax.delete(url, {
          ...(config ? { ...config } : {}),
        });
      } catch (e) {
        checkLoginStatus(e);
      }

      return checkResponse(res);
    },
  };
};

export default request;
