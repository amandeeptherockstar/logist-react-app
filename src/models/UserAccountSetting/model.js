// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable global-require */
import {
  query as queryUsers,
  updateUserProfileInfoService,
  updateUserOrgService,
  getOrgLogoService,
  getOrgAttachments,
  deleteOrgAttachments,
  updateOrgAttachments,
  getReplyToAddress,
  updateReplyToAddress,
  getOrgPreferences,
  updateOrgPreferences,
  updatePassword,
  cancelSubscription,
  updateOrgEmails,
  resumeSubscription,
  intializeStripePayment,
  sendStripeAuthorizedData as sendStripeAuthorizedDataService,
  getStripeInfo,
  disconnectStripe,
  intializeQuickBooks,
  sendQuickBooksAuthorizedDataService,
  getQuicKBooksInfo,
  disconnectQuickBooks,
  importQuickCustomers,
  importQuickVendors,
  changeBusinessType,
  generateInvoice,
  exportAttachmentsToQuickbooks,
  getquickbooksInvoiceStatus,
} from '@/pages/User/AccountSetting/service';
import { queryCurrent } from '@/services/user';
import cities from '@/pages/User/AccountSetting/geographic/city.json';
import provinces from '@/pages/User/AccountSetting/geographic/province.json';

const Model = {
  namespace: 'userAccountSetting',
  state: {
    currentUser: {
      initials: 'NA',
    },
    currentUserMetaData: {
      tenantId: '',
    },
    province: [],
    city: [],
    orgLogo: [],
    orgAttachments: [],
    updatedImage: 'null',
    isLoading: false,
    authorizedUrl: null,
    paymentDetails: null,
    quickBooksDetails: {},
    quickBooksInvoiceInfo: null,
  },
  effects: {
    *quickBooksInvoiceStatus({ payload, cb }, { call, put }) {
      const res = yield call(getquickbooksInvoiceStatus, payload);
      if (cb) cb(res);
      yield put({
        type: 'getQuickBooksInvoiceStatus',
        payload: res,
      });
    },
    *exportAttachmentsToQuickbooks({ payload, cb }, { call }) {
      const res = yield call(exportAttachmentsToQuickbooks, payload);
      if (cb) cb(res);
    },
    *generateQuickBooksInvoive({ payload, cb }, { call }) {
      const res = yield call(generateInvoice, payload);
      if (cb) cb(res);
    },
    *importQuickBooksCustomers({ payload, cb }, { call }) {
      const res = yield call(importQuickCustomers, payload);
      if (cb) cb(res);
    },
    *importQuickBooksVendors({ payload, cb }, { call }) {
      const res = yield call(importQuickVendors, payload);
      if (cb) cb(res);
    },
    *disconnectQuickBooks({ cb }, { call }) {
      const res = yield call(disconnectQuickBooks);
      if (cb) cb(res);
    },
    *disconnectStripeAccount(_, { call }) {
      yield call(disconnectStripe);
    },

    *getStripePaymentDetails({ cb }, { call, put }) {
      const res = yield call(getStripeInfo);
      yield put({
        type: 'updateStripePaymentDetails',
        payload: res,
      });
      if (cb) cb(res);
    },

    *stripePaymentInit({ callback }, { call, put }) {
      const resp = yield call(intializeStripePayment);
      yield put({
        type: 'storeStripeUrl',
        payload: resp,
      });
      if (callback) {
        callback(resp.authorizeUrl);
      }
    },
    *getQuickBooksInfo({ cb }, { call, put }) {
      const res = yield call(getQuicKBooksInfo);
      yield put({
        type: 'updateQuickBooksDetails',
        payload: res,
      });
      if (cb) cb(res);
    },
    *quickBooksInit({ callback }, { call }) {
      const resp = yield call(intializeQuickBooks);

      if (callback) {
        callback(resp.authorizeUrl);
      }
    },
    *sendStripeAuthorizedData({ payload }, { call }) {
      const resp = yield call(sendStripeAuthorizedDataService, payload);
      if (payload.callback && resp) payload.callback();
    },
    *sendQuickBooksAuthorizedData({ payload }, { call }) {
      const resp = yield call(sendQuickBooksAuthorizedDataService, payload);
      if (payload.callback && resp) payload.callback(resp);
    },
    *changeBusinessType({ payload, cb }, { call, select }) {
      const response = yield call(changeBusinessType, payload);
      const user = yield select(state => state.user.currentUser);
      user.organizationDetails.business_type = response.pref_value;
      if (cb) cb(response);
    },
    *uploadSelectedImage(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'updateUserAvatar',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
        subscription: response.subscription,
      });
      if (payload && payload.fetchOrgLogo) {
        yield put({
          type: 'getOrgLogo',
          payload: {
            partyId: response.personal_details.organization_details.org_party_id,
          },
        });
        const resp = yield call(getOrgLogoService, payload);
        yield put({
          type: 'saveOrgLogo',
          payload: resp.allContentDetails,
        });
        if (payload.callback) {
          payload.callback();
        }
      }
    },

    *fetchProvince(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = provinces;
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },

    *fetchCity(_, { put }) {
      const response = cities;
      yield put({
        type: 'setCity',
        payload: response,
      });
    },
    *updateUserProfileInfo({ payload }, { select, call, put }) {
      const currentUser = yield select(state => state.userAccountSetting.currentUser);
      const response = yield call(updateUserProfileInfoService, payload);
      currentUser.first_name = response.personal_details.first_name;
      currentUser.company_designation = response.personal_details.company_designation;
      currentUser.last_name = response.personal_details.last_name;
      currentUser.organization_details = response.personal_details.organization_details;
      currentUser.primary_phone = {
        ...currentUser.primary_phone,
        ...response.personal_details.primary_phone,
      };
      yield put({
        type: 'updateCurrentUserProfile',
        payload: currentUser,
      });
      const payloadForCurrentUser = {
        firstName: response.personal_details.first_name,
        lastName: response.personal_details.last_name,
        displayName: `${response.personal_details.first_name} ${response.personal_details.last_name}`,
        initials: `${response.personal_details.first_name.substring(
          0,
          1,
        )} ${response.personal_details.last_name.substring(0, 1)}`,
        phone: `+${response.personal_details.primary_phone.country_code} (${
          response.personal_details.primary_phone.area_code
        }) ${response.personal_details.primary_phone.phone.substring(
          0,
          3,
        )}-${response.personal_details.primary_phone.phone.substring(3)}}`,
        // company_designation: null,
        // avatar: null,
        orgName: response.personal_details.organization_details.organization_name,
        // orgId: null,
      };
      yield put({
        type: 'user/updateUser',
        payload: payloadForCurrentUser,
      });
    },
    *updateOrganization({ payload, callback }, { select, call, put }) {
      let currentUser = yield select(state => state.userAccountSetting.currentUser);
      // api call to update
      const response = yield call(updateUserOrgService, payload);
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { organization_details } = response.personal_details;
      const orgDetails = {
        ...currentUser.organization_details,
        is_setup_done: organization_details.is_setup_done,
        organization_name: organization_details.organization_name,
        cage: organization_details.cage,
        org_party_id: organization_details.org_party_id,
        duns: organization_details.duns,
        account_number: organization_details.account_number,
        quote_id_prefix: organization_details.quote_id_prefix,
        invoice_id_prefix: organization_details.invoice_id_prefix,
        order_id_prefix: organization_details.order_id_prefix,
        is_govt_data_loaded: organization_details.is_govt_data_loaded,
        allow_reply_to_alias: organization_details.allow_reply_to_alias,
      };
      currentUser = {
        ...currentUser,
        organization_details: orgDetails,
      };
      const payloadForCurrentUser = {
        orgName: response.personal_details.organization_details.organization_name,
      };
      yield put({
        type: 'user/updateOrg',
        payload: payloadForCurrentUser,
      });
      yield put({
        type: 'user/fetchCurrent',
      });
      yield put({
        type: 'updateCurrentUserProfile',
        payload: currentUser,
      });
      if (callback) {
        callback(orgDetails);
      }
    },
    *getOrgLogo({ payload }, { call, put }) {
      const response = yield call(getOrgLogoService, payload);
      yield put({
        type: 'saveOrgLogo',
        payload: response.allContentDetails,
      });
    },
    *getReplyToAddress({ payload, cb }, { call }) {
      const response = yield call(getReplyToAddress, payload);
      if (cb) {
        cb(response);
      }
    },
    *getOrgPreferences({ payload, cb }, { call }) {
      const response = yield call(getOrgPreferences, payload);
      if (cb) {
        cb(response);
      }
    },
    *updateOrgPreferences({ payload, cb }, { call }) {
      const response = yield call(updateOrgPreferences, payload);
      if (cb) {
        cb(response);
      }
    },
    *updateReplyToAddress({ payload, cb }, { call }) {
      const response = yield call(updateReplyToAddress, payload);
      if (cb) {
        cb(response);
      }
    },
    *updateEmailAddressesForOrganization({ payload }, { call }) {
      yield call(updateOrgEmails, payload);
    },
    *updateOrgAttachment({ payload }, { call, put }) {
      yield call(updateOrgAttachments, payload);
      yield put({
        type: 'getOrgAttachments',
        payload: {
          orgId: payload.vendorId,
        },
      });
    },
    *getOrgAttachments({ payload }, { call, put }) {
      const response = yield call(getOrgAttachments, payload);
      yield put({
        type: 'setOrgAttachments',
        payload: response,
      });
    },
    *deleteOrgAttachment({ payload }, { call }) {
      yield call(deleteOrgAttachments, payload);
      if (payload.cb) payload.cb();
    },
    *updatePassword({ payload, cb }, { call }) {
      const response = yield call(updatePassword, payload);

      if (cb) {
        cb(response);
      }
    },
    *cancelPaymentSubscription({ payload }, { call, put }) {
      const response = yield call(cancelSubscription, payload);
      if (response.isCancelled === true) {
        yield put({
          type: 'userAccountSetting/fetchCurrent',
          payload: {},
        });
      }
    },
    *resumePaymentSubscription({ payload }, { call, put }) {
      const response = yield call(resumeSubscription, payload);
      if (response.isResumed === true) {
        yield put({
          type: 'userAccountSetting/fetchCurrent',
          payload: {},
        });
      }
    },
  },
  reducers: {
    getQuickBooksInvoiceStatus(state, action) {
      return {
        ...state,
        quickBooksInvoiceInfo: action.payload,
      };
    },
    storeStripeUrl(state, action) {
      return {
        ...state,
        authorizedUrl: action.payload,
      };
    },
    updateUserAvatar(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          avatar: action.payload,
        },
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.personal_details,
        currentUserMetaData: action.payload,
        subscription: action.subscription,
      };
    },
    saveOrgLogo(state, action) {
      return {
        ...state,
        orgLogo: action.payload,
      };
    },
    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },

    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    updateCurrentUserProfile(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    setOrgAttachments(state, action) {
      return {
        ...state,
        orgAttachments: action.payload,
      };
    },
    updateStripePaymentDetails(state, action) {
      return {
        ...state,
        paymentDetails: action.payload,
      };
    },
    updateQuickBooksDetails(state, action) {
      return {
        ...state,
        quickBooksDetails: action.payload,
      };
    },
  },
};
export default Model;
