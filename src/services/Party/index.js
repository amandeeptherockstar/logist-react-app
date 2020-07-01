import Axios from 'axios';
import { hostname } from '@/pages/hostUrl';

export function getPartyPOCList() {
  Axios.get(`${hostname()}`);
}
