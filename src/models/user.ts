import { ReduxSagaEffects, ReduxAction, DvaModel } from '@/interfaces';
import { getRandomStrToSign } from '@/services';

interface IUnreadCount {
  unread: number;
  total: number;
}

interface pageIndexCount {
  currentIndex: number;
  totalIndex: number;
}

export interface IpageIndex {
  pageIndex?: pageIndexCount;
}

export interface IisReply {
  isReply?: boolean;
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
    //addPageIndex(state: IpageIndex
    //  ) {
    //  return { ...state,
    //    currentIndex: (state?.pageIndex?.currentIndex && state?.pageIndex?.totalIndex)?
    //    (state.pageIndex.currentIndex == state.pageIndex.totalIndex ?
    //    state.pageIndex.currentIndex : state.pageIndex.currentIndex + 1) : 1
    //  };
    //},
    //minusPageIndex(state:IpageIndex) {
    //  return { ...state,
    //    currentIndex: state?.pageIndex?.currentIndex ?
    //    (state.pageIndex.currentIndex == 1 ? state.pageIndex.currentIndex : state.pageIndex.currentIndex - 1) : 1
    //    };
    //},
    savePageIndex(
      state: IpageIndex,
      { payload: pageIndex }: { payload: pageIndexCount },
    ) {
      return {
        ...state,
        pageIndex,
      };
    },
    //saveInboxType(state: IisReply,
    //  { payload: isReply}: { payload:  boolean},
    //  ){
    //    return {
    //      ...state,
    //      isReply,
    //    };
    //  },
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
    *setPageIndex({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'savePageIndex',
        payload,
      });
    },
    *setUnreadCount({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
      yield put({
        type: 'saveUnreadCount',
        payload,
      });
    },
    //*addPageIdx({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
    //  yield put({
    //    type: 'addPageIndex',
    //    payload,
    //  });
    //},
    //*minusPageIdx({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
    //  yield put({
    //    type: 'minusPageIndex',
    //    payload,
    //  });
    //},
    //*setInboxType({ payload }: ReduxAction, { put }: ReduxSagaEffects) {
    //  yield put({
    //    type: 'saveInboxType',
    //    payload,
    //  });
    //},
  },
};
