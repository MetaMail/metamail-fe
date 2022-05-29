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
  },

  effects: {
    *setUnreadCount({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveUnreadCount',
        payload,
      });
    },
  },
};
