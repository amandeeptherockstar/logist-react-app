import axios from 'axios';
import request from '@/utils/request';
import { hostname } from '../../hostUrl';
import apiEndPoints from '@/utils/apiEndPoints';
import apiUtils from '@/utils/apiUtils';

const hostUrl = hostname();

export function uploadUserImage(data) {
  return axios.post(
    `${hostUrl}/xapi/v1/party/${localStorage.getItem('userId')}/profileImage`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        accessToken: localStorage.getItem('accessToken'),
      },
    },
  );
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}

export function updateUserProfileInfoService(payload) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.updateLoggedInUser.v1,
    body: {
      ...payload,
    },
  });
}

export function updateUserOrgService(payload) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.updateUserOrg.v1,
    body: {
      ...payload,
    },
  });
}

export function getOrgLogoService({ partyId }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.getOrgLogo.v1,
    pathParams: {
      partyId,
    },
  });
}

export function getOrgAttachments({ orgId }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.getOrgAttachment.v1,
    pathParams: { orgId },
  });
}

export function deleteOrgAttachments({ vendorId, contentId }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.deleteOrgAttachment.v1,
    pathParams: { vendorId, contentId },
  });
}

export function updateOrgAttachments({ vendorId, attachmentId, body }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.updateOrgAttachment.v1,
    pathParams: { vendorId, attachmentId },
    body,
  });
}
export function getReplyToAddress({ partyId }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.getReplyToAddress.v1,
    pathParams: { partyId },
  });
}
export function getOrgPreferences({ partyId }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.getOrgPreferences.v1,
    pathParams: { partyId },
  });
}
export function updateReplyToAddress({ partyId, email }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.updateReplyToAddress.v1,
    pathParams: { partyId },
    body: {
      email_type: 'QUICK_QUOTE_EML',
      email_reply_to_address: email,
    },
  });
}
export function updateOrgPreferences({ partyId, message }) {
  return apiUtils.callApiBeta({
    uriEndPoint: apiEndPoints.me.updateOrgPreferences.v1,
    pathParams: { partyId },
    body: {
      default_quote_email_message: message,
    },
  });
}
export async function updatePassword(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.updatePassword.v1,
      body: {
        ...payload,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}
export async function getFooterTextService({ orgId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.getOrgFooter.v1,
      pathParams: {
        orgPartyId: orgId,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function updateFooterTextService({ footerText, orgId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.updateOrgFooter.v1,
      pathParams: {
        orgPartyId: orgId,
      },
      body: {
        quote_pdf_footer_text: footerText,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}
export function cancelSubscription({ subscriptionId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.cancelSubscription.v1,
      pathParams: {
        subscriptionId,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}
export function updateOrgEmails(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.setupGuide.updateOrgDetails.v1,
      body: payload,
      pathParams: {
        orgId: 10001,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function resumeSubscription({ subscriptionId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.resumeSubscription.v1,
      pathParams: { subscriptionId },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function intializeStripePayment() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.stripeInit.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function sendStripeAuthorizedData({ data }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.stripeAuthotizedData.v1,
      query: {
        ...data,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function changeBusinessType({ orgId, prefValue }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.changeBusinessType.v1,
      pathParams: { orgId },
      body: {
        pref_name: 'businessType',
        pref_value: prefValue,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function getStripeInfo() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.getStripeInfo.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function disconnectStripe() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.disconnectStripe.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function intializeQuickBooks() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.quickBooksInit.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function sendQuickBooksAuthorizedDataService({ data }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.quickBooksAuthotizedData.v1,
      query: {
        ...data,
      },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function getQuicKBooksInfo() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.getQuicKBooksInfo.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function disconnectQuickBooks() {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.disconnectQuickBooks.v1,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function importQuickCustomers(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.importQuickCustomers.v1,
      body: payload,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function importQuickVendors(payload) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.importQuickVendors.v1,
      body: payload,
    })
    .then(response => response)
    .catch(() => ({}));
}

export function generateInvoice({ salesInvoiceId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.quickbooksInvoices.v1,
      pathParams: { salesInvoiceId },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function exportAttachmentsToQuickbooks({ salesInvoiceId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.exportAttachmentsToQuickbooks.v1,
      pathParams: { salesInvoiceId },
    })
    .then(response => response)
    .catch(() => ({}));
}

export function getquickbooksInvoiceStatus({ salesInvoiceId }) {
  return apiUtils
    .callApiBeta({
      uriEndPoint: apiEndPoints.me.getquickbooksInvoiceStatus.v1,
      pathParams: { salesInvoiceId },
    })
    .then(response => response)
    .catch(() => ({}));
}
