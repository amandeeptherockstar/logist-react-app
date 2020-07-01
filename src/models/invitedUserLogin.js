import { parse } from 'qs';
import { invitedUserLogin } from '../services/OrgSetup/inviteColleagues';

export function getPageQuery() {
  return parse(window.location.href && window.location.href.split('?')[1]);
}
const Model = {
  namespace: 'invitedUserLogin',
  state: {
    status: undefined,
    authenticationToken: '',
    partyId: '',
    error: null,
    loginVerify: false,
  },
  effects: {
    *register({ payload }, { call, put }) {
      const { userDetails, tenantId, inviteToken } = payload;
      const response = yield call(invitedUserLogin, {
        params: userDetails,
        tenantId,
        inviteToken,
      });
      const apiToken = btoa(`${userDetails.email_address}:${userDetails.password}`);
      if (response.status === 'ok') {
        yield put({
          type: 'login/login',
          payload: {
            apiToken,
            cb: () => localStorage.setItem('antd-pro-authority', JSON.stringify(['ORG_EMPLOYEE'])),
          },
        });
      }
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
