import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
export default {
  namespace: 'pageIdx',
  state: 1,
  reducers: {
    savePageIdx(state: number, { payload: pageIdx }: { payload: number }) {
      return {
        state: state + 1,
        pageIdx,
      };
    },
  },

  effects: {
    *addPageIdx({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'savePageIdx',
        payload,
      });
    },
  },
};
