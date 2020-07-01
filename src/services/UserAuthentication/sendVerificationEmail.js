import Axios from 'axios';
import { message } from 'antd';
import { router } from 'umi';
import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

export function emailVerification(payload) {
  return Axios({
    method: 'post',
    url: `${hostUrl}/xapi/v1/user/resend/emailConfirmation`,
    headers: {
      'Content-type': 'application/json',
    },
    data: {
      email_address: payload.email,
    },
    // timeout: 10000,
  })
    .then(response => {
      message.success('Verification Email Sent');
      return {
        status: 'ok',
        data: response,
      };
    })
    .catch(err => {
      let errorMessageToDisplay =
        'An error occured While Sending Verification Email, Please Contact Admin';

      let isAlreadyVerified = false;
      if (err.response.data && err.response.data.message) {
        const responseData = err.response.data;
        errorMessageToDisplay = responseData.message;

        if (responseData.code === 'ALREADY_VERIFIED') {
          isAlreadyVerified = true;
        }
      }

      // User's email is already verified, redirect user to login page.
      if (isAlreadyVerified) {
        const msgBeforeRedirect = `${errorMessageToDisplay} Redirecting to login page in 2 seconds.`;
        message.error(msgBeforeRedirect);
        setTimeout(() => {
          router.push({
            pathname: '/user/login',
            query: {
              username: 'abc@gmail.com',
            },
          });
        }, 2000);
      }

      return {
        status: 'notok',
        error: err,
      };
    });
}
