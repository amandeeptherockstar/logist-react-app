import request from '@/utils/request';
import apiUtils from '@/utils/apiUtils';
import apiEndPoints from '@/utils/apiEndPoints';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.getMyInformation.v1,
    })
    .then(resp => resp)
    .catch(() => {});
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function fetchSearchedData(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.globalsearch.search.v1,
      // body: payload,
      query: {
        doc_type: payload.docType,
        keyword: payload.keyword,
        view_size: payload.viewSize,
        start_index: payload.startIndex,
        business_type: payload.businessType,
      },
    })
    .then(resp => resp)
    .catch(() => {});
}

/**
 * Creates a subscription for the logged in user.
 * { customer}
 * @param {*} payload
 * @param {String} payload.customer_id
 * @param {String} payload.payment_token
 * @param {String} payload.subscription_product_id
 */
export async function createSubscription(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.createSubscription.v1,
      body: payload,
    })
    .then(resp => resp)
    .catch(() => {});
}
