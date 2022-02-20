import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
import { getRandomStrToSign } from '@/services';

interface IUnreadCount {
  unread: number;
  total: number;
}
export interface IUserStateProps {
  address?: string;
  ensName?: string;
  randomToken?: string;
  accountStatus?: number;
  unreadCount?: IUnreadCount;
  publicKey?: string;
  encryptedKey?: string;
}

export default {
  namespace: 'user',
  state: {},
  reducers: {
    saveUnreadCount(
      state: IUserStateProps,
      { payload: unreadCount }: { payload: IUnreadCount },
    ) {
      return {
        ...state,
        unreadCount,
      };
    },
    saveUserAddress(
      state: IUserStateProps,
      { payload: address }: { payload: string },
    ) {
      return {
        ...state,
        address,
      };
    },
    savePublicKey(
      state: IUserStateProps,
      { payload: publicKey }: { payload: string },
    ) {
      return {
        ...state,
        publicKey,
      };
    },
    saveEncryptedKey(
      state: IUserStateProps,
      { payload: publicKey }: { payload: string },
    ) {
      return {
        ...state,
        publicKey,
      };
    },
  },

  effects: {
    *setUnreadCount({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveUnreadCount',
        payload,
      });
    },
    *setUserAddress({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveUserAddress',
        payload,
      });
    },
    *setPublicKey({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'savePublicKey',
        payload,
      });
    },
    *setEncryptedKey({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveEncryptedKey',
        payload,
      });
    },
  },
};
