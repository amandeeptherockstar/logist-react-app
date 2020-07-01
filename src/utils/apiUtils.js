/**
 * Utility methods to be used for invoking API methods
 */
import Axios from 'axios';
import { notification } from 'antd';
import queryString from 'querystring';
import { router } from 'umi';
import { makeUrl } from './endPoints';
import { stringify } from 'qs';
import { getPageQuery } from '@/models/invitedUserLogin';

const getDefaultHeaders = () => ({
  accessToken: localStorage.getItem('accessToken'),
  'Content-Type': 'application/json',
});
/**
 * Returns true if the input apiResponse has errors.
 * @param {*} apiResponse
 */
const hasErrors = apiResponse => {
  const { error } = apiResponse;

  if (error) {
    return true;
  }

  return false;
};

/**
 * Generic utility method that should be called when invoking any REST API
 * @param {Object} obj - The employee who is responsible for the project.
 * @param {string} obj.uriEndPoint - Endpoint.
 * @param {string} obj.uriEndPoint.type - GET/POST/PUT/DELETE Endpoint.
 * @param {string} obj.body - Body of the request.
 * @deprecated
 */
const callApi = ({ uriEndPoint, body }) =>
  new Promise((resolve, reject) => {
    Axios({
      ...uriEndPoint,
      url: uriEndPoint.query
        ? `${uriEndPoint.url}?${queryString.stringify(uriEndPoint.query)}`
        : uriEndPoint.url,
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
      },
      data: body || {},
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // eslint-disable-next-line no-underscore-dangle
        window.g_app._store.dispatch({
          type: 'global/setProgressBarLoading',
          payload: percentCompleted,
        });
      },
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        // extract the error message
        // TODO: Mss replace with extractErrors
        // TODO: MSS make sure we handle all types of error message extraction
        const errorMessage = err.response.data.message;

        notification.error({
          message: 'Something went wrong!',
          description: errorMessage,
        });
        reject(err.response);
      });
  });

/**
 * Generic utility method that should be called when invoking any REST API
 *
 * This function streamlines the functionality to make api calls,
 * and carries easy management for controlling versions of the apis
 *
 * @since 1.0.0
 *
 * @alias callApiBeta
 * @memberof apiUtils
 * @param {Object} APIParamaters - Set of objects required to make the api call.
 * @param {Object} APIParamaters.uriEndPoint - Endpoint object as described in apiEndPoints.js.
 * @param {Object} APIParamaters.pathParams - Path parameters. Example :id in the path,
 * then pathParams object will be {id:value}.
 * @param {Object} APIParamaters.query - GET/POST/PUT/DELETE Endpoint.
 * @param {Object} APIParamaters.body - Body of the request.
 * @returns {Promise<object>} A promise that contains the user's favorite color
 * when fulfilled
 */
const callApiBeta = ({
  uriEndPoint = { uri: '', method: '', version: '', headerProps: {} },
  pathParams,
  query,
  body,
  hostUrl,
}) =>
  new Promise((resolve, reject) => {
    Axios({
      method: uriEndPoint.method,
      url: makeUrl({ ...uriEndPoint, pathParams, query }, hostUrl),
      headers: {
        ...getDefaultHeaders(),
        ...uriEndPoint.headerProps,
      },
      data: body || {},
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // eslint-disable-next-line no-underscore-dangle
        window.g_app._store.dispatch({
          type: 'global/setProgressBarLoading',
          payload: percentCompleted,
        });
      },
    })
      .then(response => {
        resolve(response.data);
        // eslint-disable-next-line no-underscore-dangle
        localStorage.setItem('timer', 1800);
        // localStorage.setItem('tokenUsed', 'true');
      })
      .catch(err => {
        // extract the error message
        // TODO: Mss replace with extractErrors
        // TODO: MSS make sure we handle all types of error message extraction
        if (!err.response) {
          if (!getPageQuery().redirect) {
            router.push(
              `/server-unreachable?${stringify({
                redirect: window.location.href,
              })}`,
            );
          }
          return;
        }
        const errorMessage = err.response.data.message;
        if (err.response.status === 401) {
          // eslint-disable-next-line no-underscore-dangle
          window.g_app._store.dispatch({
            type: 'login/logout',
            payload: { reset: true },
          });
          return;
        }
        notification.error({
          message: 'Something went wrong!',
          description: errorMessage,
        });
        reject(err.response);
      });
  });

export default { callApi, callApiBeta, hasErrors };
