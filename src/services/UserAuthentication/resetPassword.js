import Axios from 'axios';
import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

export async function resetPassword(params) {
  return Axios.post(
    `${hostUrl}/xapi/v1/user/update/password`,
    {
      ...params,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then(response => ({
      status: 'ok',
      resp: response,
    }))
    .catch(err => ({
      status: 'notok',
      currentAuthority: 'guest',
      error: err.response,
    }));
}
