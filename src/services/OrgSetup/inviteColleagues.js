import Axios from 'axios';
import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

export function sendInvite(response) {
  const accessToken = localStorage.getItem('accessToken');
  return Axios.post(`${hostUrl}/xapi/v1/client/invite/email`, response.inviteEmployee, {
    headers: {
      'Content-Type': 'application/json',
      accessToken,
    },
  })
    .then(resp => {
      const status = 'ok';
      return {
        resp,
        status,
      };
    })
    .catch(() => {
      const status = 'notok';
      return {
        status,
      };
    });
}
export async function invitedUserLogin({ params, tenantId, inviteToken }) {
  return Axios.post(
    `${hostUrl}/xapi/v1/client/${tenantId}/invite/accept`,
    {
      ...params,
      invite_token: inviteToken,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        tenantId,
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
