const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    // loggedInUser: null,
  },
  effects: {
    // getDraftQuotes(_, { call, put }) {
    //   const response = yield call();
    //   yield put({
    //     type: 'setDraftQuotes',
    //     payload: draftQuotes,
    //   });
    // },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    // setLoggedInUser(state, {})
  },
};
export default Model;
