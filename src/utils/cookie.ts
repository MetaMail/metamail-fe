import { getCookie, setCookie, Types, removeCookie } from 'typescript-cookie';

export const TokenCookieName = 'token';

const baseConfigOptions = {
  domain: 'metamail.ink',
};

export function getCookieByName(name: string) {
  return getCookie(name);
}

export function setCookieByName(
  name: string,
  value: any,
  options?: Types.CookieAttributes,
) {
  return setCookie(name, value, {
    ...baseConfigOptions,
    ...(options ? { ...options } : {}),
  });
}

export function deleteCookieByName(
  name: string,
  options?: Types.CookieAttributes,
) {
  return removeCookie(name, options);
}
