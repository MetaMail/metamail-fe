/**
 * sessionStorage封装
 */

export const updateStorage = (key: string, value: any) => {
  if (value === undefined) return;
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key: string, defaultValue: any = null) => {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

export const deleteStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const clearStorage = () => {
  sessionStorage.clear();
};
