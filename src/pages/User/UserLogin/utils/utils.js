import { parse } from 'qs';
import jwt from 'jwt-decode';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
export const extractRolesFromToken = token => {
  const { isOrgAdmin } = jwt(atob(token));
  if (isOrgAdmin) {
    return ['ORG_ADMIN'];
  }
  return ['ORG_ADMIN'];
};

export const getRolesFromMeObject = ({ isOrgEmployee, isOrgAdmin, isOrgManager }) => {
  if (isOrgAdmin) return ['ORG_ADMIN'];
  if (isOrgManager) return ['ORG_MANAGER'];
  if (isOrgEmployee) return ['ORG_EMPLOYEE'];
  // return ['guest'];
  return ['ORG_ADMIN'];
};

export function getRedirectURL(cb) {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params;

  if (redirect) {
    const redirectUrlParams = new URL(redirect);

    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);

      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
      cb(redirect);
    } else {
      window.location.href = redirect;
    }
  }
}
