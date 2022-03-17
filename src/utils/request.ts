import axios from 'axios';
import { getCookieByName, TokenCookieName } from './cookie';
import { mergeUrlWithParams } from './url';

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
        console.error('Network went wrong, ', e);
      }

      if (res && (res.status === 200 || res.status === 304)) return res.data;
    },

    get: async (params: requestParams = {}, config: requestParams = {}) => {
      let res;
      const _url = mergeUrlWithParams(url, params);
      try {
        res = await ajax.get(_url, { ...(config ? { ...config } : {}) });
      } catch (e) {
        // const isCancel = axios.isCancel(e);
        console.error('Network went wrong, ', e);
      }

      if (res && (res.status === 200 || res.status === 304)) return res.data;
    },

    patch: async (params: requestParams = {}, config: requestParams = {}) => {
      let res;
      try {
        res = await ajax.patch(url, params, {
          ...(config ? { ...config } : {}),
        });
      } catch (e) {
        console.error('Network went wrong, ', e);
      }

      if (res && (res.status === 200 || res.status === 304)) return res.data;
    },

    delete: async (config: requestParams = {}) => {
      let res;
      try {
        res = await ajax.delete(url, {
          ...(config ? { ...config } : {}),
        });
      } catch (e) {
        console.error('Network went wrong, ', e);
      }

      if (res && (res.status === 200 || res.status === 304)) return res.data;
    },
  };
};

export default request;
