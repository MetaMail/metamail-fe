import qs from 'qs';

export const separateUrl = (url: string) => {
  const params: Record<string, any> = {};
  const uri = url.replace(/(\?|\&)(\w+)=([\w-]+)/g, (m, $0, $1, $2) => {
    params[$1] = $2;
    return '';
  });
  return { uri, params };
};

export const deleteEmpty = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const copy = { ...obj };
  Object.keys(obj).forEach((key) => {
    if (copy[key] === undefined || copy[key] === null) {
      delete copy[key];
    }
  });
  return copy;
};

export const mergeUrlWithParams = (
  url: string,
  params?: Record<string, unknown>,
) => {
  if (typeof params !== 'object' || params === null || params === undefined) {
    return url;
  }
  const { uri, params: _params } = separateUrl(url);
  const query = qs.stringify(deleteEmpty({ ..._params, ...params }));
  return `${uri}${query ? '?' + query : ''}`;
};
