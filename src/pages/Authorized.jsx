import React, { useEffect, useState } from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import { startAuthTimer, clearAuthTimer } from '@/utils/auth';
import { router } from 'umi';
import logoAnimatedGif from '@/assets/logo/zeus-logo.gif';
// import AuthCounterContext from '@/contexts/AuthCounterContext';

const getRouteAuthority = (path, routeData) => {
  let authorities;

  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

const AuthComponent = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
  dispatch,
}) => {
  const [verified, setVerified] = useState(false);
  const { currentUser } = user;
  const { routes = [] } = route;
  const isLogin = currentUser;

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch({ type: 'login/tokenCheck' }).then(resp => {
        dispatch({ type: 'countriesList/getAllCountries' });
        if (resp) {
          dispatch({
            type: 'user/fetchCurrent',
            payload: {},
          }).then(({ isOrgSetupComplete }) => {
            if (location.pathname !== '/setup/setup-guide') {
              if (!isOrgSetupComplete) {
                router.push('/setup/setup-guide');
                return;
              }
            }
            setVerified(resp);
          });
          startAuthTimer();
        }
      });
    } else {
      router.push('/user/login');
    }

    return () => {
      clearAuthTimer();
    };
  }, []);

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/" /> : <Redirect to="/user/login" />}
    >
      {verified ? (
        children
      ) : (
        <>
          <div className="flex justify-center content-center h-full">
            <div className="m-auto">
              <div className="text-center">
                <img src={logoAnimatedGif} alt="Zeus Logo Loading" className="w-48" />
              </div>
              <div className="font-medium text-base zcp-loading pl-10">Working on it</div>
            </div>
          </div>
        </>
      )}
    </Authorized>
  );
};

export default connect(state => ({
  user: state.user,
  collapsed: true,
  settings: state.settings,
  authenticationToken: state.login.authenticationToken,
  partyId: state.login.partyId,
  showSessionExpirationNotification: state.login.showSessionExpirationNotification,
}))(AuthComponent);
