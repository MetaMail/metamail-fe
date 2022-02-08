import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
import { getRandomStrToSign } from '@/services';

interface IUserStateProps {
  address?: string;
  ensName?: string;
  randomToken?: string;
  jwtToken?: string;
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

    setJwtToken(
      state: IUserStateProps,
      { payload: token }: { payload: string },
    ) {
      state.jwtToken = token;

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
