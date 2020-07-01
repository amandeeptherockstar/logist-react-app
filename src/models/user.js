import { queryCurrent, query as queryUsers, createSubscription } from '@/services/user';
import { getRolesFromMeObject } from '@/pages/User/UserLogin/utils/utils';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {
      id: null,
      tenantId: null,
      firstName: null,
      lastName: null,
      displayName: null,
      initials: null,
      phone: null,
      company_designation: null,
      avatar: null,
      orgName: null,
      orgId: null,
      isTourCompleted: false,
      isOrgBillingPoc: false,
      isOrgBillingContact: false,
      isOrgManager: false,
      isOrgEmployee: false,
      subscription: {
        is_active: true,
        is_trialing: false,
      },
      availableBillingPlans: [],
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, {
        payload,
      });
      if (response?.claims?.isAssumed) {
        yield put({
          type: 'login/changeAssumed',
          payload: true,
        });
      }
      const roles = getRolesFromMeObject({
        isOrgEmployee: response.is_org_employee,
        isOrgAdmin: response.is_org_admin,
        isOrgManager: response.is_org_manager,
      });
      const response1 = {
        id: response.id,
        tenantId: response.tenant_id,
        firstName: response.personal_details.first_name,
        lastName: response.personal_details.last_name,
        displayName: response.personal_details.display_name,
        initials: response.personal_details.party_initials,
        avatar: response.personal_details.avatar_url,
        phone: 3652454515,
        userid: response.personal_details.id,
        email: response.personal_details.primary_email,
        company_designation: response.personal_details.company_designation,
        orgName: response.personal_details.organization_details.organization_name,
        orgId: response.personal_details.organization_details.org_party_id,
        isOrgBillingPoc: response.is_org_billing_poc,
        isOrgEmployee: response.is_org_employee,
        isOrgAdmin: response.is_org_admin,
        isOrgManager: response.is_org_manager,
        signature: '',
        title: '',
        group: '',
        tags: '',
        notifyCount: '',
        unreadCount: '',
        country: '',
        geographic: '',
        address: '',
        primary_phone: response.personal_details.primary_phone,
        subscription: {
          is_active: true,
          is_trialing: false,
        },
        organizationDetails: response.personal_details.organization_details,
        role: roles,
        isOrgSetupComplete: !!response.personal_details.organization_details.is_setup_done,
        isTourCompleted: !!response.is_tour_completed,
        hasActiveLicense: response.has_active_license,
      };
      const sellertype =
        response1.organizationDetails.business_type === 'B2B' ? 'Vendor' : 'Company';
      yield put({
        type: 'settings/changeSellerType',
        payload: sellertype,
      });

      yield put({
        type: 'saveCurrentUser',
        payload: response1,
      });

      if (roles.includes('guest')) {
        yield put({
          type: 'login/logout',
        });
        return;
      }
      setAuthority(roles);
      reloadAuthorized();
      yield put({
        type: 'login/changeLoginStatus',
        payload: roles,
      });

      // eslint-disable-next-line consistent-return
      return response1;
    },
    *updateUser({ payload }, { put, select }) {
      let currentUser = yield select(state => state.user.currentUser);
      currentUser = {
        ...currentUser,
        ...payload,
      };
      yield put({
        type: 'updateCurrentUser',
        payload: currentUser,
      });
    },
    *updateOrg({ payload }, { put, select }) {
      let currentUser = yield select(state => state.user.currentUser);
      currentUser = {
        ...currentUser,
        ...payload,
      };
      yield put({
        type: 'updateCurrentUser',
        payload: currentUser,
      });
    },
    *createSubscription({ payload }, { call, put }) {
      const response = yield call(createSubscription, payload);
      yield put({
        type: 'updateCurrentUserSubscription',
        payload: response,
      });
      yield put({
        type: 'userAccountSetting/fetchCurrent',
      });
      if (payload.callback) payload.callback(response);
    },
  },
  reducers: {
    setUserState(state, { payload: { key, value } }) {
      return {
        ...state,
        [key]: value,
      };
    },
    setAllBillingPlans(state, { payload }) {
      return {
        ...state,
        availableBillingPlans: payload.products,
      };
    },
    updateCurrentUserSubscription(state) {
      return {
        ...state,
        currentUser:
          {
            ...state.currentUser,
            subscription: {
              is_active: true,
              is_trialing: false,
            },
          } || {},
      };
    },

    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    updateCurrentUser(state, action) {
      return {
        ...state,
        currentUser: {
          ...action.payload,
        },
      };
    },
  },
};
export default UserModel;
