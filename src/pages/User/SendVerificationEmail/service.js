import axios from 'axios';
import { hostname } from '../../hostUrl';

const hostUrl = hostname();

export async function verifyUser(userEmail) {
  // amandeep.kochhar@simbaquartz.com
  const data = {
    email_address: userEmail,
  };
  return axios
    .post(`${hostUrl}/xapi/v1/user/email/verification/status`, data, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const requiredResponse = response.data;
      return requiredResponse;
    })
    .catch(() => ({}));
}
