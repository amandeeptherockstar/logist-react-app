export const hostname = () => {
  let hostUrl = '';
  switch (window.location.hostname) {
    case 'app.zeus.fidelissd.com': // production
      hostUrl = 'https://api.zeus.fidelissd.com';
      break;
    default:
      hostUrl = 'https://api-test.zeus.fidelissd.com';
      // hostUrl = 'https://192.168.0.48:8443';
      // hostUrl = 'https://172.20.10.2:8443';
      break;
  }
  return hostUrl;
};
