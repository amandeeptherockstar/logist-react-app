// import { Component } from 'react';
import { queryNotices, fetchSearchedData } from '@/services/user';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    globalSearches: {},
    currentOrgDetails: {},
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *unloadModal(_, { put }) {
      yield put({ type: 'unload' });
    },
    *fetchGlobalSearch({ payload, callback }, { call, put }) {
      yield put({
        type: 'unload',
      });
      const data = yield call(fetchSearchedData, payload);
      yield put({
        type: 'saveGlobalSearch',
        payload: {
          data,
          totalCount: data.records.length,
        },
      });
      if (callback) callback(data);
    },

    *loadMoreSearch({ payload, callback }, { call, put, select }) {
      const data = yield call(fetchSearchedData, payload);
      const prevData = yield select(state => state.global.globalSearches);
      const concatedData = {
        ...data,
        records: prevData.records.concat(data.records),
      };
      yield put({
        type: 'saveGlobalSearch',
        payload: {
          data: concatedData,
          totalCount: concatedData.records.length,
        },
      });
      if (callback) callback(concatedData);
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = {
            ...item,
          };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *setProgressBarLoading(_, { put }) {
      yield put({
        type: 'setLoadingState',
      });
    },
  },
  reducers: {
    saveOrgDetails(state, { payload }) {
      return {
        ...state,
        currentOrgDetails: payload,
      };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    unload(state) {
      return {
        ...state,
        globalSearches: {},
      };
    },
    saveGlobalSearch(state, { payload }) {
      return {
        ...state,
        globalSearches: payload.data,
        totalGlobalSearches: payload.totalCount,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
  // setProgressBarLoading:{

  // }
};
export default GlobalModel;
