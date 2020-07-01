/**
 * Handles email verification token view, shows the verified, expired messages and redirects the
 * user to login page
 */
import Axios from 'axios';
import { message } from 'antd';

import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

export function verifyEmailToken(token) {
  return Axios({
    method: 'post',
    url: `${hostUrl}/xapi/v1/user/verify/link`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      token_id: token,
    },
  })
    .then(response => {
      if (response.data.isEmailVerified) {
        message.success('Email Verified, Redirecting to the login page in 3 seconds.', 3);
        return {
          status: 'ok',
        };
        // setTimeout(() => {
        //   router.push('/user/login');
        // }, 2000);
      }
      message.error('Email verification failed..');
      return {
        status: 'notok',
      };
    })
    .catch(err => {
      const status = 'notok';
      if (status === 'notok') {
        if (err.response.status === 400) {
          message.error(
            'Your Verification Token Has Expired, Login again to Resend New Verification Token',
          );
        } else {
          message.error('An Error Occured, Please contact your Admin');
        }
      }
      return {
        status,
      };
    });
}
