/* eslint-disable no-underscore-dangle */
import timers from '@/timers';

export function startAuthTimer() {
  let currentTime = parseInt(localStorage.getItem('timer'), 10) || 1800;

  timers.authenticationCountInterval = setInterval(() => {
    currentTime = parseInt(localStorage.getItem('timer'), 10) || 1800;
    localStorage.setItem('timer', currentTime - 1);
    checkAuth(parseInt(localStorage.getItem('timer'), 10));
  }, 1000);
}

export function resetAuthTimer() {
  localStorage.setItem('timer', '1800');
  localStorage.removeItem('authWarningDispatched');
}
export function clearAuthTimer() {
  clearInterval(timers.authenticationCountInterval);
  localStorage.setItem('timer', '1800');
  // localStorage.clear('authWarningDispatched');
  window.g_app._store.dispatch({
    type: 'login/showAuthWarning',
    payload: false,
  });
}

export function checkAuth(currentTime) {
  // If user is inactive and less than 90 seconds are remaining show warning
  if (currentTime <= 90) {
    if (localStorage.getItem('authWarningDispatched') !== 'true') {
      localStorage.setItem('authWarningDispatched', 'true');
      window.g_app._store.dispatch({
        type: 'login/showAuthWarning',
        payload: true,
      });
    }

    // Time up, log out the user
    if (currentTime === 0) {
      localStorage.setItem('authWarningDispatched', 'false');
      clearAuthTimer();
      window.g_app._store.dispatch({
        type: 'login/logout',
        payload: {
          lgtrsn: 'inactive',
        },
      });
      // logout dispatch
    }
  }
}
