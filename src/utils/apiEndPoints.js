const defaults = {
  methods: {
    GET: {
      method: 'GET',
    },
    POST: {
      method: 'POST',
    },
    PUT: {
      method: 'PUT',
    },
    DELETE: {
      method: 'DELETE',
    },
  },
  versions: {
    v1: {
      version: '/xapi/v1',
    },
  },
};

const apiEndPoints = {
  // org
  org: {
    orgDetails: {
      get: {
        v1: {
          ...defaults.methods.GET,
          ...defaults.versions.v1,
          uri: '/org/:orgId',
        },
      },
    },
  },
  // auth end points
  auth: {
    checkServer: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/ping',
      },
    },
    checkToken: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/access/verify/token',
      },
    },
    refreshToken: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/access/refresh',
      },
    },
  },
  // Collection End Points
  collections: {
    create: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections',
      },
    },
    addItems: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/:collectionId/collectionItems',
      },
    },
    update: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/collections/:collectionId',
      },
    },
    delete: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/collections/:collectionId',
      },
    },
    search: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/search',
      },
    },
    addCollectionsToItem: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/collectionItems/product',
      },
    },
    deleteItem: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/collections/:collectionId/collectionItems/:collectionItemId',
      },
    },
    fetchCollections: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/collections/:ownerId/names/:typeId',
      },
    },
    collectionItems: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/browse/:collectionId/items',
      },
    },
    collectionNested: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/browse',
      },
    },
    move: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/collections/change/parent',
      },
    },
  },
  // Quote Related End points
  quotes: {
    getEmailDefaults: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/email',
      },
    },
    getPaymentEmailDefaults: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/paymentEmailDefault',
      },
    },

    getQuoteSampleEmailDefaults: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/sampleEmail',
      },
    },
    resetEmailDefaults: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/email/reset',
      },
    },

    updateQuoteCoverLetterMsg: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/coverLetterMsg',
      },
    },

    sendEmail: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/email',
      },
    },
    sendPaymentLink: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/paymentEmail',
      },
    },
    addNewPartyAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address',
      },
    },
    search: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:partyId/email',
      },
    },
    reorderQuoteItems: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items/:itemId/reorder',
      },
    },
    addCustomerPOCToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/contacts',
      },
    },
    getCustomerQuoteRoles: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/contacts',
      },
    },
    deleteCustomerQuoteRoles: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/contacts',
      },
    },
    addVendorPOCToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/contacts',
      },
    },
    getVendorQuoteRoles: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/contacts',
      },
    },
    deleteVendorQuoteRoles: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/contacts',
      },
    },
    addAddressToQuote: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/:partyType/:partyId/addresses',
      },
    },
    addQuotesAttachment: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachment',
        headerProps: {
          'Content-Type': 'multipart/form-data',
        },
      },
    },
    getQuotesAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachments',
      },
    },
    updateQuotesAttachment: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachments',
      },
    },
    deleteQuotesAttachment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/content/:contentId',
      },
    },
    selectAllQuoteDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachAllQuoteDocs',
      },
    },
    deselectAllQuoteDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/detachAllQuoteDocs',
      },
    },
    selectAllQuoteProductDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachAllQuoteProductDocs',
      },
    },
    deselectAllQuoteProductDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/detachAllQuoteProductDocs',
      },
    },
    selectAllQuoteSupplierDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachAllQuoteSupplierDocs',
      },
    },
    deselectAllQuoteSupplierDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/detachAllQuoteSupplierDocs',
      },
    },
    selectAllQuoteCompanyDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/attachAllQuoteCompanyDocs',
      },
    },
    deselectAllQuoteCompanyDocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/detachAllQuoteCompanyDocs',
      },
    },
    updateCustomerQuoteAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/addresses',
      },
    },
    updateVendorQuoteAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/addresses',
      },
    },
    deleteCustomerQuoteAddress: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/addresses/:addressId',
      },
    },
    deleteVendorQuoteAddress: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/addresses/:addressId',
      },
    },
    expiredQuoteRenew: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/renew',
      },
    },
    getQuoteRating: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/score',
      },
    },
    removeSupplierAttachmentFromQuote: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/content/:contentId/attachment?is_remove_from_quote=Y',
      },
    },
    reorderCustomerPOC: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/reorderPoc',
      },
    },
    reorderSupplierPOC: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:supplierId/reorderPoc',
      },
    },
    searchSupplierProductItem: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/products/search',
      },
    },
    getQuoteProductItemTotalTax: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/tax',
      },
    },
    bulkUploadQuoteItems: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/bulkItems',
      },
    },
    addMultiplePocsToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/:parentType/:employerId/bulkContacts',
      },
    },
    searchPocs: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:parentType/:employerId/employees/search',
      },
    },
    setQuotelevelProfitMargin: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/quoteLevelMargin',
      },
    },
    getQuotelevelProfitMargin: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/quoteLevelMargin',
      },
    },
    getQuoteProductItems: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/quoteItems',
      },
    },
    copyQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/copy',
      },
    },
    addItemToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items',
      },
    },
    deleteItemToQuote: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items/:seqenceId',
      },
    },
    markQuoteArchived: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/status',
      },
    },
    reopenQuote: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/status',
      },
    },
    getQuoteCustomers: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/quote',
      },
    },
    updateQuoteParty: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/:partyType',
      },
    },
    getPartyEmployee: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:employerId/employees',
      },
    },
    getAllQuotesService: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/search',
      },
    },
    getAllQuotesStatsService: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/stats',
      },
    },
    getQuoteDetail: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId',
      },
    },
    getQuoteItems: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items',
      },
    },
    createDraftQuoteService: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote',
      },
    },
    addTagsToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/tag',
      },
    },
    getAllTags: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/tags',
      },
    },
    deleteQuoteTag: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/tag',
      },
    },
    addProductToQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items',
      },
    },
    updateQuoteProductItem: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items/:sequenceId',
      },
    },
    removeProductFromQuote: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items/:sequenceId',
      },
    },
    createQuoteNote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/note',
      },
    },
    removeQuoteNote: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/note',
      },
    },
    getQuoteNotes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/note',
      },
    },
    updateQuoteNoteService: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/note',
      },
    },
    updateQuoteValidityService: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId',
      },
    },
    getQuoteActivities: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/activity',
      },
    },
    updatePartyAddress: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address/:addressMechId',
      },
    },
    addPartyAddressService: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address',
      },
    },
    updateQuoteTitle: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId',
      },
    },
    createQuoteFromDraft: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId',
      },
    },
    getQuotePricing: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/totals',
      },
    },
    getQuoteRoles: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/roles',
      },
    },
    deleteQuoteRole: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/role',
      },
    },
    getRecentQuoteCustomers: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/recentQuoteCustomers',
      },
    },
    deleteAllQuoteItems: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/items',
      },
    },
    getEmails: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/common/emails',
      },
    },
    multiUploadQuoteItems: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/bulk_upload',
      },
    },
    multiImportQuoteItems: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/bulk_import',
      },
    },
    createQuoteInvoice: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/invoice',
      },
    },
    getSalesPipelineData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/salesPipeline',
      },
    },
    addSalesPipelineData: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/salesPipeline',
      },
    },
    updateQuoteAdjustment: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId',
      },
    },
  },
  vendors: {
    exportVendorsToQB: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/vendors/export/:vendorId',
      },
    },
    getVendorData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:partyId',
      },
    },
    bulkImport: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/bulk_import',
      },
    },
    updateEmployeeRoles: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplier_id/employee/:employee_id/roles',
      },
    },
    deleteEmployeeRoles: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:supplier_id/employee/:user_login_id/roles',
      },
    },
    addVendorAttachment: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:vendor_id/attachments',
        headerProps: {
          'Content-Type': 'multipart/form-data',
        },
      },
    },
    getVendorAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/attachments',
      },
    },
    updateVendorAttachment: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/attachments/:attachmentId',
      },
    },
    setDefaultAttachments: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:vendorId/manageAttachments',
      },
    },
    deleteVendorAttachment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/attachments/:contentId/attachment?is_remove_from_quote=Y',
      },
    },

    getReorderedSupplierTerms: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:partyId/terms/reorder',
      },
    },
    addPhone: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/phone',
      },
    },
    updatePhone: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/phone/:contentId',
      },
    },

    deletePhone: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/phone/:contentId',
      },
    },
    getPhone: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:partyId/phone/:contentId',
      },
    },
    updateEmail: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/email/:contentId',
      },
    },

    deleteLinkedIn: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contactMech/:contact_mech_id',
      },
    },

    addLinkedIn: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/linkedInUrl',
      },
    },

    updateLinkedIn: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/linkedInUrl/:contact_mech_id',
      },
    },

    deleteWebAddress: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contactMech/:contact_mech_id',
      },
    },

    addWebAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/webSite',
      },
    },

    updateWebAddress: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/webSite/:contact_mech_id',
      },
    },

    deleteEmail: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contactMech/:contentId',
      },
    },

    addTermsAndConditions: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/terms',
      },
    },
    getTermsAndConditions: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:partyId/terms',
      },
    },
    getTermsAndConditionsById: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:partyId/terms/:contentId',
      },
    },
    updatePartyTermsById: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/terms/:contentId',
      },
    },
    deletePartyTermsById: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/terms/:contentId',
      },
    },
    updateVendorRole: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/supplier/:vendorId/designation',
      },
    },
    getPaginatedVendors: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier',
      },
    },
    searchVendors: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/search',
      },
    },
    addEmail: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/email',
      },
    },
    updateAddress: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address/:addressId',
      },
    },
    addAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address',
      },
    },
    deleteAddress: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/address/:addressId',
      },
    },
    updateName: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/name',
      },
    },
    transferAccountData: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/transferData/:partyId',
      },
    },
    primaryPhone: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contactMech/:mechId/makePrimaryPhone',
      },
    },
    primaryEmail: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/contactMech/:mechId/makePrimaryEmail',
      },
    },
    deActivateParty: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/deactivate',
      },
    },
    activateParty: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/activate',
      },
    },
    createVendors: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier',
      },
    },
  },
  customers: {
    exportCustomerToQB: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/customers/export/:customerId',
      },
    },
    searchContractProducts: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/contract/search-product?view_size=10&start_index=0',
      },
    },
    updateContractProduct: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/customer/contract/:contractId/update-product',
      },
    },
    deleteProductFromContract: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/customer/contract/:contractId/product/:productId',
      },
    },
    getContractById: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/contract/:contractId',
      },
    },

    updatePricingContract: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/contract/:contractId',
      },
    },

    getContractProducts: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/contract/search-product',
      },
    },
    addProductToContract: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/contract/:contractId/add-product',
      },
    },
    addPricingContract: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/contract',
      },
    },
    getPricingContracts: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/contract',
      },
    },
    deleteContract: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/contract',
      },
    },
    bulkImport: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/bulk_import',
      },
    },
    getCustomersEmployee: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/employee/:employeeId',
      },
    },
    updateCustomerRole: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/quote/:quoteId/customer/:customerId/designation',
      },
    },
    getCustomerAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/attachments',
      },
    },
    deleteCustomerAttachment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/customer/:customerId/attachments/:contentId/attachment',
      },
    },
    searchCustomer: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/search',
      },
    },
    getAllCustomers: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer',
      },
    },
    getPartyPocs: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:partyId/employee',
      },
    },
    singleCustomer: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/:customerId',
      },
    },
    getPartyData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:partyId',
      },
    },
    getPartyPOCDetails: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:partyId/employee/:employeeId',
      },
    },
    searchQuote: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quote/search',
      },
    },
    getAllCustomerRoles: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/employee/roles',
      },
    },
    getEmployeeData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employee/:partyId',
      },
    },
    getEmployeeTerritories: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employees/:partyId/territories',
      },
    },
    getEmployeesToTransferData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/transferData/:partyId',
      },
    },
    removePartyTerritory: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employees/:partyId/territories/:territoryId',
      },
    },
    setEmployeeAsManager: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employees/:partyId/manager',
      },
    },
    removeEmployeeAsManager: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employees/:partyId/manager',
      },
    },
    addCustomerService: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer',
      },
    },
    setEmployeeTerritory: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:partyType/:parentPartyId/employees/:partyId/territories',
      },
    },
    globalPartySearch: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/globalSearch',
      },
    },
    uploadDocuments: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/bulk_upload',
      },
    },
    createdSegment: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/segments',
      },
    },
    updateSegment: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/segments/:segmentId',
      },
    },
    deleteSegment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/segments/:segmentId',
      },
    },
    searchSegments: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/search/segments',
      },
    },
    addPartiesToSegment: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/segments/:segmentId/associations',
      },
    },
    removePartiesToSegment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/segments/:segmentId/associations',
      },
    },
    template: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customer/bulk_upload/template',
        filterHeaders: ['Content-Type'],
      },
    },
    getExemptionTypes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/taxExemptTypes',
      },
    },
    addNewTaxExemption: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/taxExempt',
      },
    },
    deleteTaxExemption: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/taxExempt/:typeId',
      },
    },
    updateTaxExemption: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/taxExempt',
      },
    },
    deleteCustomerParent: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/customer/:partyId/removeParentAccount',
      },
    },
    updateAddParentCustomer: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/customer/:partyId/parentAccount/:parentId',
      },
    },
  },
  products: {
    search: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/products/search',
      },
    },
    bulkImport: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/product/bulk_import',
      },
    },
    viewproduct: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/product/:productId',
      },
    },
    deleteProductFromCategory: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/collections/:collectionId/collectionItems/:collectionItemId',
      },
    },
    addProductAttachment: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/product/:productId/:documentType/content',
      },
    },
    getProductAttachments: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/product/:productId/attachments',
      },
    },
    updateProductDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/product/:productId',
      },
    },
    deleteProductAttachments: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/product/:productId/attachment/:contentId',
      },
    },
    updateProductStatus: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/product/:productId/status',
      },
    },
    productTerms: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/product/:productId/terms',
      },
    },
    getAllTerms: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/product/:productId/terms',
      },
    },
    updateTerms: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/product/:productId/term/:contentId',
      },
    },
    deleteTerms: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/product/:productId/term/:contentId',
      },
    },
    reorderProductTerms: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/product/:productId/terms/reorder',
      },
    },
    createProduct: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customer/contract/:contractId/supplier/:supplierId/product',
      },
    },
    addProduct: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:partyId/product',
      },
    },
    updateProduct: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:partyId/product/:productId',
      },
    },
    addProductCategory: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/productCategory',
      },
    },
    getProductList: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/product/search',
      },
    },
    checkUniqueProduct: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/product/:productId',
      },
    },
  },
  globalsearch: {
    search: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/globalSearch',
      },
    },
  },
  employees: {
    bulkImport: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/client/invite/bulk_import',
      },
    },
    getAllPaginatedOrgEmployees: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/employer/employees',
      },
    },
    searchEmployee: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/employer/:employerId/employees',
      },
    },
    getPartyDesignations: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/designations',
      },
    },
    getPartyDepartments: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/departments',
      },
    },
    createEmployeeAssociation: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employee/:employeeId/association',
      },
    },
    getAssociatedEmployeeAccounts: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employee/:employeeId/association',
      },
    },
    deleteAssociatedEmployee: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/accounts/:partyId',
      },
    },
    createPartyEmployee: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:partyType/:partyId/employee',
      },
    },
    getAllPartyRoles: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/:partyType/employee/roleOverrides',
      },
    },
    getPendingInvites: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/client/invite/pending',
      },
    },
    submitStep1: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/admin/client/onboard',
      },
    },
    partyNoteNames: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/noteTypes',
      },
    },
    getPartyNotes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:partyId/notes',
      },
    },
    addPartyNotes: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/notes',
      },
    },
    updatePartyNotes: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/notes',
      },
    },
    deletePartyNotes: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/party/:partyId/notes',
      },
    },
    fetchRegionalBasedAccounts: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employee/:employeeId/regionalBasedCustomers',
      },
    },
    fetchTerritoryBasedAccounts: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employee/:employeeId/territoryBasedCustomers',
      },
    },
    getDepartmentEmployees: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/departmentEmployees/search',
      },
    },
    addEmployees: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/department',
      },
    },
    addReplyToEmailAddress: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employees/:employeeId/replyToAlias',
      },
    },
    deleteReplyToEmailAddress: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:supplierId/employees/:employeeId/replyToAlias/:userLoginId',
      },
    },
  },
  billing: {
    current: {
      get: {
        v1: {
          ...defaults.methods.GET,
          ...defaults.versions.v1,
          uri: '/billing/info',
        },
      },
    },
    plans: {
      get: {
        v1: {
          ...defaults.methods.GET,
          ...defaults.versions.v1,
          uri: '/billing/plans',
        },
      },
    },
    allocateLicence: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/org/licenses/:partyId',
      },
    },
    getOrgLicenses: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/org/licenses',
      },
    },
    deAllocateLicence: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/org/licenses/:partyId',
      },
    },
    upgradePlan: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/billing/:planId/upgrade',
      },
    },
    getBillingInfo: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/billing/info',
      },
    },
    associate: {
      put: {
        v1: {
          ...defaults.methods.PUT,
          ...defaults.versions.v1,
          uri: '/billing/payment_method/:paymentMethodId',
        },
      },
    },
  },
  me: {
    getMyInformation: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    createSubscription: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/me/subscription',
      },
    },

    updateLoggedInUser: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    setTourCompleted: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/tourComplete',
      },
    },
    updateUserOrg: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/me',
      },
    },
    getOrgLogo: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/party/:partyId/profileImage',
      },
    },
    getOrgAttachment: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/org/:orgId/attachments',
      },
    },
    deleteOrgAttachment: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/attachments/:contentId/attachment?is_remove_from_quote=Y',
      },
    },
    updateOrgAttachment: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/supplier/:vendorId/attachments/:attachmentId',
      },
    },
    getReplyToAddress: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/org/replyToAddress/QUICK_QUOTE_EML',
      },
    },
    getOrgPreferences: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/org/preferences',
      },
    },
    updateOrgPreferences: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/org',
      },
    },
    updateReplyToAddress: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/org/replyToAddress',
      },
    },
    updatePassword: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/user/update/password',
      },
    },
    getOrgFooter: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/org/:orgPartyId/quotePdfFooterText',
      },
    },
    updateOrgFooter: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/org/:orgPartyId/quotePdfFooterText',
      },
    },
    cancelSubscription: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/me/subscription/:subscriptionId/cancel',
      },
    },
    resumeSubscription: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/me/subscription/:subscriptionId/resume',
      },
    },
    stripeInit: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/stripe/initialize',
      },
    },
    quickBooksInit: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quickbooks/initialize',
      },
    },
    stripeAuthotizedData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/stripe/code',
      },
    },
    quickBooksAuthotizedData: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quickbooks/code',
      },
    },
    getStripeInfo: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/stripe/info',
      },
    },
    getQuicKBooksInfo: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quickbooks/info',
      },
    },
    disconnectStripe: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/stripe/disconnect',
      },
    },
    disconnectQuickBooks: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/quickbooks/disconnect',
      },
    },
    importQuickCustomers: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/customers/import',
      },
    },
    importQuickVendors: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/vendors/import',
      },
    },
    exportAttachmentsToQuickbooks: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/invoice/:salesInvoiceId/attachments',
      },
    },
    getquickbooksInvoiceStatus: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/quickbooks/invoice/:salesInvoiceId/status',
      },
    },
    quickbooksInvoices: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/quickbooks/invoice/:salesInvoiceId',
      },
    },
    changeBusinessType: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/org/:orgId/businessType',
      },
    },
  },
  setupGuide: {
    saveDataForGeneratingSampleQuotePDF: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/org/:orgId',
      },
    },
    updateOrgDetails: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/org/:orgId',
      },
    },
  },
  common: {
    partyContactName: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/partyName',
      },
    },
    partyDesignationName: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/designation',
      },
    },
    bulkImportPartyEmployees: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/:party/:partyId/employees/bulk_import',
      },
    },
    addSocialTwitter: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/twitter',
      },
    },
    addSocialFacebook: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/facebook',
      },
    },
    addSocialInstagram: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/instagram',
      },
    },
    updateSocialInstagram: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/instagram/:contact_mech_id',
      },
    },
    addSocialYoutube: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/party/:partyId/youTube',
      },
    },
    updateSocialYoutube: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/youTube/:contact_mech_id',
      },
    },
    updateSocialTwitter: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/twitter/:contact_mech_id',
      },
    },
    updateSocialFacebook: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/party/:partyId/facebook/:contact_mech_id',
      },
    },
  },
  customFields: {
    create: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customFields',
      },
    },
    update: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/customFields/:fieldId',
      },
    },
    remove: {
      v1: {
        ...defaults.methods.DELETE,
        ...defaults.versions.v1,
        uri: '/customFields/:fieldId',
      },
    },
    get: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customFields/:fieldId',
      },
    },
    getAll: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customFields/:entityType/all',
      },
    },
    getEntityTypes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customFields/entityTypes',
      },
    },
    getSpecificFields: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customFields/:type/all',
      },
    },
    setCustomFields: {
      v1: {
        ...defaults.methods.POST,
        ...defaults.versions.v1,
        uri: '/customFields/:customFieldId/value',
      },
    },
    updateCustomFields: {
      v1: {
        ...defaults.methods.PUT,
        ...defaults.versions.v1,
        uri: '/customFields/:customFieldId/value/:valueId',
      },
    },
    getAllCustomFieldTypes: {
      v1: {
        ...defaults.methods.GET,
        ...defaults.versions.v1,
        uri: '/customFields/customFieldTypes',
      },
    },
  },
};

export default apiEndPoints;
