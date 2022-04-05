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
  randomBits?: string; // 256位随机数作为对称密钥
  showName?: string;
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
    saveUserEnsName(
      state: IUserStateProps,
      { payload: ensName }: { payload: string },
    ) {
      return {
        ...state,
        ensName,
      };
    },
    saveShowName(
      state: IUserStateProps,
      { payload: showName }: { payload: string },
    ) {
      return {
        ...state,
        showName,
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
    saveRandomBits(
      state: IUserStateProps,
      { payload: randomBits }: { payload: string },
    ) {
      console.log('randomBits', '----', randomBits);
      return {
        ...state,
        randomBits,
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
    *setUserEnsName({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveUserEnsName',
        payload,
      });
    },
    *setShowName({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveShowName',
        payload,
      });
    },
    *setPublicKey({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'savePublicKey',
        payload,
      });
    },
    *setRandomBits({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveRandomBits',
        payload,
      });
    },
  },
};
