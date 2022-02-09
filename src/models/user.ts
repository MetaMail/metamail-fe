import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
import { getRandomStrToSign } from '@/services';

export interface IUserStateProps {
  address?: string;
  ensName?: string;
  randomToken?: string;
  accountStatus?: number;
}

export default {
  namespace: 'user',
  state: {},
  reducers: {
    setAddress(
      state: IUserStateProps,
      { payload: newAddress }: { payload: string },
    ) {
      return {
        ...state,
        address: newAddress,
      };
    },

    setRandom(
      state: IUserStateProps,
      { payload: tokenForRandom }: { payload: string },
    ) {
      state.randomToken = tokenForRandom;

      return state;
    },
  },

  effects: {
    *getRandomStrToSign(
      { payload }: ReduxAction,
      { call, put }: ReduxSagaEffects,
    ) {
      const { data } = yield call(getRandomStrToSign);
      const { randomStr, signMethod, tokenForRandom } = data;
      yield put({
        type: 'save',
        payload: { data },
      });
    },
  },
};
