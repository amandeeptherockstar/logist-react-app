import Axios from 'axios';
import { message } from 'antd';
import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

export function sendResetPasswordLink(payload) {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { email_address } = payload;
  return Axios({
    method: 'post',
    url: `${hostUrl}/xapi/v1/user/reset/password`,
    headers: {
      'Content-type': 'application/json',
    },
    data: {
      email_address,
    },
    // timeout: 10000,
  })
    .then(response => {
      message.success('Password Reset Link Sent');
      return {
        status: 'ok',
        data: response,
      };
    })
    .catch(err => {
      message.error('An Error Occured While Sending Reset Link to Email, Please Contact Admin');
      return {
        status: 'notok',
        error: err,
      };
    });
}

// export function verifyForgotPasswordToken(payload) {
//   const accessToken = localStorage.getItem('accessToken');
//   return Axios({
//     method: 'post',
//     url: `${hostUrl}/xapi/v1/client/reset/password`,
//     headers: {
//       'Content-type': 'application/json',
//       accessToken,
//     },
//     data: {
//       email_address: payload.email,
//     },
//     // timeout: 10000,
//   })
//     .then(response => {
//       message.success('Verification Email Sent');
//       return {
//         status: 'ok',
//         data: response,
//       };
//     })
//     .catch(err => {
//       message.error('An Error Occured While Sending Verification Email, Please Contact Admin');
//       return {
//         status: 'notok',
//         error: err,
//       };
//     });
// }
