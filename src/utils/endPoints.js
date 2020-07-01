import queryString from 'querystring';
import { hostname } from '@/pages/hostUrl';

const hostUrl = hostname();
const baseUrl = `${hostUrl}/xapi/v1`;

// TODO: @MSK handle malformed url, example when a path param is not passed but defined in url.
export const makeUrl = ({ uri = '', pathParams, query, version }, host) =>
  `${host || hostUrl}${version}${uri
    .split('/')
    .map(param => (param.charAt(0) === ':' ? encodeURI(pathParams[param.slice(1)]) : param))
    .join('/')}${query ? `?${queryString.stringify(query)}` : ''}`;

/**
 *
 * @param {object} param0
 * @param {object} param0.uri Parameterised uri
 * @param {object} param0.pathParams Key map values where keys are path parameters
 * @param {object} param0.query query string
 */
export const makeUri = ({ uri = '', pathParams, query }) =>
  `${uri
    .split('/')
    .map(param => (param.charAt(0) === ':' ? encodeURI(pathParams[param.slice(1)]) : param))
    .join('/')}${query ? `?${queryString.stringify(query)}` : ''}`;

export const endPoints = {
  addCustomer: () => ({ method: 'POST', url: `${baseUrl}/customer` }),
  globalSearch: query => ({
    method: 'GET',
    url: `${baseUrl}/xapi/v1/globalSearch`,
    query,
  }),
  getCustomer: ({ pathParams }) => {
    const [customerId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/customer/${customerId}`,
    };
  },
  getPartyData: ({ pathParams }) => {
    const [partyId, partyType] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/${partyType}/${partyId}`,
    };
  },

  getEmployeeData: ({ pathParams }) => {
    const [partyId, partyType, parentPartyId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employee/${partyId}`,
    };
  },

  getEmployeeTerritories: ({ pathParams }) => {
    const [partyType, parentPartyId, partyId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employees/${partyId}/territories`,
    };
  },

  getEmployeesToTransferData: ({ pathParams }) => {
    const [partyType, parentPartyId, partyId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/${partyType}/${parentPartyId}/transferData/${partyId}`,
    };
  },

  removePartyTerritory: ({ pathParams }) => {
    const [partyType, parentPartyId, partyId, territoryId] = pathParams;
    return {
      method: 'DELETE',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employees/${partyId}/territories/${territoryId}`,
    };
  },

  removeEmployeeAsManager: ({ pathParams }) => {
    const [partyType, parentPartyId, partyId] = pathParams;
    return {
      method: 'DELETE',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employees/${partyId}/manager`,
    };
  },

  setEmployeeAsManager: ({ pathParams }) => {
    const [partyType, parentPartyId, partyId] = pathParams;
    return {
      method: 'POST',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employees/${partyId}/manager`,
    };
  },

  setEmployeeTerritory: ({ pathParams }) => {
    const [partyId, parentPartyId, partyType] = pathParams;
    return {
      method: 'POST',
      url: `${baseUrl}/${partyType}/${parentPartyId}/employees/${partyId}/territories`,
    };
  },

  getQuoteRoles: ({ pathParams }) => {
    const [quoteId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/quote/${quoteId}/roles`,
    };
  },
  deleteQuoteRole: ({ pathParams }) => {
    const [quoteId] = pathParams;
    return {
      method: 'DELETE',
      url: `${baseUrl}/quote/${quoteId}/role`,
    };
  },
  addPartyRoleToQuote: ({ pathParams }) => {
    const [quoteId] = pathParams;

    return {
      method: 'POST',
      url: `${baseUrl}/quote/${quoteId}/role`,
    };
  },
  addCustomerRoleToQuote: ({ pathParams }) => {
    const [quoteId, customerId] = pathParams;
    return {
      method: 'POST',
      url: `${baseUrl}/quote/${quoteId}/customer/${customerId}/contacts`,
    };
  },

  searchQuote: ({ query }) => ({
    method: 'POST',
    url: `${baseUrl}/quote/search`,
    query,
  }),

  updateQuoteTitle: ({ pathParams }) => {
    const [quoteId] = pathParams;
    return {
      method: 'PUT',
      url: `${baseUrl}/quote/${quoteId}`,
    };
  },
  getQuotePricingStats: ({ pathParams }) => {
    const [quoteId] = pathParams;
    return {
      method: 'GET',
      url: `${baseUrl}/quote/${quoteId}/totals`,
    };
  },

  // Employee invitations
  getEmployeeInvitationsPending: () => ({
    method: 'GET',
    url: `${baseUrl}/client/invite/pending`,
  }),
  getEmployeeInvitationsAccepted: () => ({
    method: 'GET',
    url: `${baseUrl}/client/invite/accepted`,
  }),
};
