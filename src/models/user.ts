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
}

export default {
  namespace: 'user',
  state: {
    publicKey:
      '0xb38c15782b05b56c5c12ca391cab534dfe0beca3a54248e763be436308fd075ba571080d4b8163e9cf58cab939a7a66889d6d250cd242e46bb62ab5a0edef736',

    address: '0x51AE47d66E1434574632403a2EdE8E2d7CEE70b9',
  },
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
    saveRandomBits(
      state: IUserStateProps,
      { payload: randomBits }: { payload: string },
    ) {
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
