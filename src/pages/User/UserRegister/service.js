import axios from 'axios';
// import request from '@/utils/request';
import { hostname } from '../../hostUrl';

const hostUrl = hostname();

export async function userRegisterFunc(params) {
  return axios({
    method: 'post',
    url: `${hostUrl}/xapi/v1/user/register`,
    data: params,
    timeout: 30000,
  })
    .then(response => ({
      status: 'ok',
      data: response.data,
    }))
    .catch(err => ({
      status: 'notok',
      error: err.response,
    }));
}
