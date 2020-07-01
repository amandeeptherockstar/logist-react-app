import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { router } from 'umi';
// import { connect } from 'dva';

import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import {
  usernamePasswordLogin,
  checkCurrentToken,
  refreshToken,
  checkServer,
} from '@/pages/User/UserLogin/service';
import alertErrorAudioUrl from '@/assets/sounds/wav/secondary-system-sounds/alert_error-01.wav';

const alertErrorAudio = new Audio(alertErrorAudioUrl);

export function getPageQuery() {
  return parse(window.location.href && window.location.href.split('?')[1]);
}
const Model = {
  namespace: 'login',
  state: {
    roles: '',
    status: undefined,
    authenticationToken: '',
    partyId: '',
    error: null,
    loginVerify: false,
    timeRemaining: 1800,
    authWarning: localStorage.getItem('authWarningDispatched') === 'true',
    assumed: false,
  },
  effects: {
    *assumeWithTokenObject({ payload }, { put }) {
      localStorage.setItem('partyId', payload.partyInitials);
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('userId', payload.partyId);
      const response = {
        status: 'ok',
        resp: payload,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        partyId: payload.partyId,
        currentAuthority: ['ORG_EMPLOYEE'],
        isEmailVerificationComplete: payload.isEmailVerificationComplete,
        isOrgSetupComplete: payload.isOrgSetupComplete,
      };

      if (response.status === 'ok') {
        yield put({
          type: 'changeAssumed',
          payload: true,
        });
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        });
        response.isEmailVerificationComplete = true;
        response.isOrgSetupComplete = true;

        if (!response.isEmailVerificationComplete) {
          // Email verification not done - redirect to verification page
          router.push('/user/verify', {
            email: response.partyId,
            emailVerified: response.isEmailVerificationComplete,
            throughLogin: true,
          });
          this.setState({
            loginVerify: true,
          });
        }
        if (response.isEmailVerificationComplete && !response.isOrgSetupComplete) {
          // Org setup pending = redirect to org setup page
          router.push('/setup/org');
        }

        // Everything fine - return to Dashboard
        yield put({ type: 'user/fetchCurrent' });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        }); // Login successfully
        if (response.isEmailVerificationComplete && response.isOrgSetupComplete) {
          yield put(routerRedux.replace(redirect || '/'));
        }
      } else if (response.error) {
        // handle logical errors
        const responseData = response.error.data;
        // List of errors returned by server
        const { errors } = responseData;

        let errorMessage = "That didn't work!";
        let errorMessageDescription =
          'An error occurred while trying to log you in, please check your input and try again.';
        let errorCode = 'ACCOUNT_NOT_FOUND';
        if (errors) {
          // extract the list of messages
          if (errors[0]) {
            errorMessageDescription = errors[0].message;
            errorCode = errors[0].code;
          }
        }

        switch (errorCode) {
          case 'ACCOUNT_NOT_FOUND':
            errorMessage = 'Invalid account!';
            break;
          case 'UNAUTHORIZED':
            errorMessage = 'Login failed!';
            break;
          default:
            break;
        }
        alertErrorAudio.play();

        switch (response.error.status) {
          case 500: {
            yield put({
              type: 'setError',
              payload: {
                message: 'Something went wrong!',
                description:
                  "We're sorry, server failed to process your request. Please contact support at support@zeus.com",
              },
            });
            break;
          }
          case 503: {
            yield put({
              type: 'setError',
              payload: {
                message: 'Service is not available!',
                description:
                  'We are not able to connect to the server at this moment. Please contact support at support@zeus.com',
              },
            });
            break;
          }
          default: {
            yield put({
              type: 'setError',
              payload: {
                message: errorMessage,
                description: errorMessageDescription,
              },
            });
          }
        }
      } else {
        // network error
        yield put({
          type: 'setError',
          payload: {
            message: 'Unable to Connect to the Server',
            description: 'Please, contact Administrator!',
          },
        });
      }
    },
    *checkServer(_, { call }) {
      const response = yield call(checkServer);
      return !!response;
    },
    *showAuthWarning({ payload }, { put }) {
      yield put({
        type: 'setAuthWarning',
        payload,
      });
    },
    *changeTimeRemaining({ payload }, { put }) {
      yield put({
        type: 'setTimeRemaining',
        payload,
      });
    },

    *tokenCheck({ payload }, { call, put }) {
      const response = yield call(checkCurrentToken, payload);

      if (!response) {
        put({ type: 'login/logout' });
        return false;
      }
      yield put({
        type: 'user/fetchCurrent',
      });
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
        },
      });
      return true;
    },
    *refreshToken(_, { call, put }) {
      const response = yield call(refreshToken);
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        });
        yield put({
          type: 'saveAuthToken',
          payload: {
            authenticationToken: response.accessToken,
            refreshToken: response.refreshToken,
          },
        });
        yield put({ type: 'login/changeTimeRemaining', payload: { reset: true } });
        yield put({
          type: 'login/changeSessionStatus',
          payload: { showSessionExpirationNotification: false },
        });
        return true;
      }
      return false;
    },
    *login({ payload }, { call, put }) {
      const response = yield call(usernamePasswordLogin, payload);
      if (payload.cb) payload.cb();
      if (response.status === 'ok') {
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        });
        response.isEmailVerificationComplete = true;
        response.isOrgSetupComplete = true;

        if (!response.isEmailVerificationComplete) {
          // Email verification not done - redirect to verification page
          router.push('/user/verify', {
            email: response.partyId,
            emailVerified: response.isEmailVerificationComplete,
            throughLogin: true,
          });
          this.setState({
            loginVerify: true,
          });
        }
        if (response.isEmailVerificationComplete && !response.isOrgSetupComplete) {
          // Org setup pending = redirect to org setup page
          router.push('/setup/org');
        }

        // Everything fine - return to Dashboard
        yield put({ type: 'user/fetchCurrent' });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        }); // Login successfully
        if (response.isEmailVerificationComplete && response.isOrgSetupComplete) {
          yield put(routerRedux.replace(redirect || '/'));
        }
      } else if (response.error) {
        // handle logical errors
        const responseData = response.error.data;
        // List of errors returned by server
        const { errors } = responseData;

        let errorMessage = "That didn't work!";
        let errorMessageDescription =
          'An error occurred while trying to log you in, please check your input and try again.';
        let errorCode = 'ACCOUNT_NOT_FOUND';
        if (errors) {
          // extract the list of messages
          if (errors[0]) {
            errorMessageDescription = errors[0].message;
            errorCode = errors[0].code;
          }
        }

        switch (errorCode) {
          case 'ACCOUNT_NOT_FOUND':
            errorMessage = 'Invalid account!';
            break;
          case 'UNAUTHORIZED':
            errorMessage = 'Login failed!';
            break;
          default:
            break;
        }
        alertErrorAudio.play();

        switch (response.error.status) {
          case 500: {
            yield put({
              type: 'setError',
              payload: {
                message: 'Something went wrong!',
                description:
                  "We're sorry, server failed to process your request. Please contact support at support@zeus.com",
              },
            });
            break;
          }
          case 503: {
            yield put({
              type: 'setError',
              payload: {
                message: 'Service is not available!',
                description:
                  'We are not able to connect to the server at this moment. Please contact support at support@zeus.com',
              },
            });
            break;
          }
          default: {
            yield put({
              type: 'setError',
              payload: {
                message: errorMessage,
                description: errorMessageDescription,
              },
            });
          }
        }
      } else {
        // network error
        yield put({
          type: 'setError',
          payload: {
            message: 'Unable to Connect to the Server',
            description: 'Please, contact Administrator!',
          },
        });
      }
    },
    *logout({ payload }, { put }) {
      const { redirect } = getPageQuery(); // redirect
      setAuthority('guest');
      reloadAuthorized();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('partyId');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
              ...payload,
            }),
          }),
        );
      }
    },
    *saveAuthToken({ payload }, { put }) {
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('accessToken', payload.authenticationToken);
      yield put({
        type: 'changeAuthToken',
        payload,
      }); // Login successfully
    },
  },
  reducers: {
    setAdminRoles(state, { payload }) {
      return {
        ...state,
        roles: payload,
      };
    },
    setTimeRemaining(state, { payload }) {
      return {
        ...state,
        timeRemaining: payload.reset ? 1800 : state.timeRemaining + payload.change,
      };
    },
    setAuthWarning(state, { payload }) {
      return { ...state, showSessionExpirationNotification: payload };
    },
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload);
      reloadAuthorized();
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
    changeAssumed(state, { payload }) {
      return {
        ...state,
        assumed: payload,
      };
    },
  },
};
export default Model;
