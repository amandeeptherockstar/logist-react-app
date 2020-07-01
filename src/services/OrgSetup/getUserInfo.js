import Axios from 'axios';
import { hostname } from '../../pages/hostUrl';
import { setAuthority } from '@/pages/User/UserLogin/utils/utils';

const hostUrl = hostname();

export function getUserInfo() {
  // const { email } = payload.location.state;
  return Axios.get(`${hostUrl}/xapi/v1/me`, {
    headers: {
      'Content-Type': 'application/json',
      accessToken: localStorage.getItem('accessToken'),
    },
  })
    .then(response => response.data)
    .catch(() => {
      setAuthority('guest');
      return {
        status: 'notok',
      };
    });
}
