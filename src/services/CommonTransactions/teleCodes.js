import axios from 'axios';
import hostUrl from '@/pages/hostUrl';

// get Telephonic Codes
export function getTeleCodes() {
  return axios.get(`${hostUrl}/xapi/v1/common/country/telephonicCode`);
}
