import { notification } from 'antd';
import { router } from 'umi';
import { userRegisterFunc } from '../pages/User/UserRegister/service';

const Model = {
  namespace: 'register',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      let email = '';
      const response = yield call(userRegisterFunc, payload);
      // this.setState({
      //   email: payload.email_address,
      // });
      email = payload.email_address;
      yield put({
        type: 'registerHandle',
        payload: response,
      }); // Registration Successful

      if (response.status === 'ok') {
        router.push('/user/verify', {
          email,
        });
      } else if (response.error) {
        if (response.error.status === 400) {
          notification.error({
            message: 'An Error Occured',
            description: 'Please Contact Administrator',
          });
        } else if (response.error.status === 403) {
          notification.error({
            message: 'Email ID Already Exists',
            description: 'Please Change the Email Address or Sign In Using the Existing Email ID',
          });
          // router.push('/user/userExists');
        }
      }
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status, emailStatus: payload.error.status };
    },
  },
};
export default Model;
