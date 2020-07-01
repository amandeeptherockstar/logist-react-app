import axios from 'axios';
import jwt from 'jwt-decode';
import { hostname } from '../../hostUrl';
import apiUtils from '@/utils/apiUtils';
import apiEndPoints from '@/utils/apiEndPoints';

const hostUrl = hostname();

export async function usernamePasswordLogin(params) {
  return axios({
    method: 'post',
    url: `${hostUrl}/xapi/v1/access/token`,
    headers: {
      apiKey: params.apiToken,
    },
    timeout: 10000,
  })
    .then(response => {
      localStorage.setItem('partyId', response.data.partyInitials);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userId', response.data.partyId);
      return {
        status: 'ok',
        resp: response,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        partyId: response.data.partyId,
        currentAuthority: ['ORG_EMPLOYEE'],
        isEmailVerificationComplete: response.data.isEmailVerificationComplete,
        isOrgSetupComplete: response.data.isOrgSetupComplete,
      };
    })
    .catch(err => ({
      status: 'notok',
      currentAuthority: 'guest',
      error: err.response,
    }));
}
export function checkCurrentToken() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.auth.checkToken.v1,
    })
    .then(response => response)
    .catch(() => null);
}
export function refreshToken() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: {
        ...apiEndPoints.auth.refreshToken.v1,
        headerProps: {
          refreshToken: localStorage.getItem('refreshToken'),
        },
      },
    })
    .then(response => response)
    .catch(() => null);
}

export function getAdminRoles(token) {
  return jwt(atob(token));
}

export function checkServer() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.auth.checkServer.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}
