/**
 * Product related services, desired set of records can be retrieved using different input criteria.
 * For example, to fetch products for a supplier, pass in supplier_id.
 *  - To search products in a collection pass collection_id
 */
import { countryList } from '@/services/CommonTransactions/countryList';

const Model = {
  namespace: 'countriesList',
  state: {
    countries: [],
  },
  effects: {
    *getAllCountries({ payload }, { put, call }) {
      // check the localStorage for countries,
      let countries = localStorage.getItem('countries');
      if (countries) {
        // put the countries to localState,
        const parsedCountries = JSON.parse(countries);
        yield put({
          type: 'setCountries',
          payload: parsedCountries,
        });
        if (payload && payload.callback) {
          payload.callback(parsedCountries);
        }
      } else {
        // call the api to get the countries list
        countries = yield call(countryList);
        localStorage.setItem('countries', JSON.stringify(countries.data));
        yield put({
          type: 'setCountries',
          payload: countries,
        });
        if (payload && payload.callback) {
          payload.callback(countries);
        }
      }
    },
  },
  reducers: {
    setCountries(state, action) {
      return {
        ...state,
        countries: action.payload,
      };
    },
  },
};
export default Model;
