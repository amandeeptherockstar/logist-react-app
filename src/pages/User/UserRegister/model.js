import { userRegisterFunc } from './service';

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(userRegisterFunc, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      }); // Registration Successful
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
