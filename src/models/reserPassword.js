import { parse } from 'qs';
import { resetPassword } from '../services/UserAuthentication/resetPassword';

export function getPageQuery() {
  return parse(window.location.href && window.location.href.split('?')[1]);
}
const Model = {
  namespace: 'resetPassword',
  state: {
    status: undefined,
    authenticationToken: '',
    partyId: '',
    error: null,
    loginVerify: false,
  },
  effects: {
    *reset({ payload, callback }, { call }) {
      const resetPassResponse = yield call(resetPassword, payload);

      callback(resetPassResponse);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        authenticationToken: payload.accessToken,
        partyId: payload.partyId,
        error: payload.error,
      };
    },
    changeAuthToken(state, { payload }) {
      return {
        ...state,
        authenticationToken: payload.authenticationToken,
      };
    },
    setError(state, { payload }) {
      return {
        ...state,
        domError: payload,
      };
    },
  },
};
export default Model;
