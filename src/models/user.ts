import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
import { getRandomStrToSign } from '@/services';

interface IUnreadCount {
  unread: number;
  total: number;
}
export interface IUserStateProps {
  randomToken?: string;
  accountStatus?: number;
  unreadCount?: IUnreadCount;
  randomBits?: string; // 256位随机数作为对称密钥
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
    *setRandomBits({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveRandomBits',
        payload,
      });
    },
  },
};
