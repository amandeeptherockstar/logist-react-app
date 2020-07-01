import Axios from 'axios';
import { hostname } from '../../pages/hostUrl';

const hostUrl = hostname();

// TODO: If once countries are fetched, store it in localstorage/global state
export function countryList() {
  // const { email } = payload.location.state;
  return Axios({
    method: 'get',
    url: `${hostUrl}/xapi/v1/common/country`,
  })
    .then(response => {
      const status = 'ok';
      return {
        data: response.data,
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
