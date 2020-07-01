import {
  Icon,
  AutoComplete,
  List,
  Avatar,
  Tabs,
  Modal,
  Input,
  Badge,
  Row,
  Col,
  Tag,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { connect } from 'dva';
import React, { useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Intercom, { IntercomAPI } from 'react-intercom';
import { router } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import ZCPSearchEmptyState from '../ZCPSearchEmptyState';
import HelpCenterSvgIcon from '@/assets/icons/help.svg';
import ChatSvgIcon from '@/assets/icons/chat.svg';
import ZcpIcons from '@/assets/icons/ZcpIcons';
import { formatCurrencyToUSDAmount } from '@/utils/formatUsaPhone';
import ZCPLoader from '../ZCPLoader';

const { div } = AutoComplete;
const { TabPane } = Tabs;

const GlobalHeaderRight = props => {
  const [searchMode, setSearchmode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [totalRecords, setTotalrecords] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const { theme, layout, loading } = props;
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [activeKey, setActiveKey] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [infiniteScrollLoading, setInfiniteScrollLoading] = useState(false);

  const viewSize = 20;
  const calculateStartIndex = page => (page + 1) * viewSize - viewSize;

  const parentRef = useRef(null);

  const user = {
    user_id: props.currentUser.email,
    email: props.currentUser.email,
    name: `${props.currentUser.firstName} ${props.currentUser.lastName}`,
    alignment: 'top',
    hide_default_launcher: true,
  };

  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }

  let dataSource = [];
  if (props.currentUser.organizationDetails.business_type !== 'B2B') {
    dataSource =
      props.globalSearches.records &&
      props.globalSearches.records.filter(
        data => data.partyModel !== null && data.partyModel !== 'Vendor',
      );
  } else {
    dataSource =
      props.globalSearches.records &&
      props.globalSearches.records.filter(data => data.partyModel !== null);
  }

  const getDocTypeFromActiveTabSelected = activeTabKey => {
    switch (activeTabKey) {
      case 'ALL':
        return '';
      case 'QUOTES':
        return 'quote';
      case 'CUSTOMERS':
        return 'customer';
      case 'VENDORS':
        return 'supplier';
      case 'PRODUCTS':
        return 'products';
      case 'EMPLOYEES':
        return 'employees';
      default:
        return '';
    }
  };

  let hide = useRef(null);

  const getBooleanHasMore = (
    activeTabKey,
    fetchedDataLength,
    {
      _totalRecords,
      _totalQuotes,
      _totalCustomers,
      _totalVendors,
      _totalProducts,
      _totalEmployees,
    },
  ) => {
    switch (activeTabKey) {
      case 'ALL':
        return fetchedDataLength < _totalRecords;
      case 'QUOTES':
        return fetchedDataLength < _totalQuotes;
      case 'CUSTOMERS':
        return fetchedDataLength < _totalCustomers;
      case 'VENDORS':
        return fetchedDataLength < _totalVendors;
      case 'PRODUCTS':
        return fetchedDataLength < _totalProducts;
      case 'EMPLOYEES':
        return fetchedDataLength < _totalEmployees;
      default:
        return false;
    }
  };

  const handleSearch = async (value, doctype) => {
    let businessType = '';
    if (props.currentUser.organizationDetails.business_type !== 'B2B') {
      businessType = 'B2C';
    } else {
      businessType = '';
    }
    // clear old
    setTimeout(hide, 0);
    hide.current = null;
    hide = message.loading('Fetching...', 0);
    await props.dispatch({
      type: 'global/fetchGlobalSearch',
      payload: {
        viewSize,
        startIndex: 0,
        keyword: value || ' ',
        docType: doctype,
        businessType,
      },
      callback: res => {
        if (res) {
          const haveMoreRecordsToFetch = getBooleanHasMore(activeKey, res.records.length, {
            _totalRecords: res.all_records,
            _totalQuotes: res.total_quotes_count,
            _totalCustomers: res.total_customers_count,
            _totalVendors: res.total_vendors_count,
            _totalProducts: res.total_products_count,
            _totalEmployees: res.total_contacts_count,
          });
          setTotalrecords(res.all_records);
          setTotalQuotes(res.total_quotes_count);
          setTotalCustomers(res.total_customers_count);
          setTotalVendors(res.total_vendors_count);
          setTotalProducts(res.total_products_count);
          setTotalEmployees(res.total_contacts_count);
          setInfiniteScrollLoading(false);
          setTimeout(hide, 0);
          hide.current = null;
          if (!haveMoreRecordsToFetch && dataSource && dataSource.length > 0) {
            message.success('All Records Fetched');
          }
          setHasMore(haveMoreRecordsToFetch);
          return;
        }
        setTimeout(hide, 0);
        hide.current = null;
      },
    });
  };
  const action = (value, doctype, onPage) => {
    setSearchText(value);
    handleSearch(value, doctype, onPage);
  };

  const debounceSearch = React.useCallback(debounce(action, 400), []);

  const loadMore = async (value, docType, page) => {
    let businessType = '';
    if (props.currentUser.organizationDetails.business_type !== 'B2B') {
      businessType = 'B2C';
    } else {
      businessType = '';
    }
    setTimeout(hide, 0);
    hide.current = null;
    message.loading('Fetching More...');
    setInfiniteScrollLoading(true);
    await props.dispatch({
      type: 'global/loadMoreSearch',
      payload: {
        viewSize,
        startIndex: calculateStartIndex(page),
        keyword: value || ' ',
        docType,
        businessType,
      },
      callback: res => {
        if (res) {
          const haveMoreRecordsToFetch = getBooleanHasMore(activeKey, res.records.length, {
            _totalRecords: res.all_records || 0,
            _totalQuotes: res.total_quotes_count || 0,
            _totalCustomers: res.total_customers_count || 0,
            _totalVendors: res.total_vendors_count || 0,
            _totalProducts: res.total_products_count || 0,
            _totalEmployees: res.total_contacts_count || 0,
          });
          setTotalrecords(res.all_records);
          setTotalQuotes(res.total_quotes_count);
          setTotalCustomers(res.total_customers_count);
          setTotalVendors(res.total_vendors_count);
          setTotalProducts(res.total_products_count);
          setTotalEmployees(res.total_contacts_count);
          setInfiniteScrollLoading(false);
          setTimeout(hide, 0);
          hide.current = null;
          if (!haveMoreRecordsToFetch && dataSource && dataSource.length > 0) {
            message.success('All Records Fetched');
          }
          setHasMore(haveMoreRecordsToFetch);
          // setHasMore(true);
          return;
        }
        setTimeout(hide, 0);
        hide.current = null;
      },
    });
  };

  const handleTabChange = key => {
    if (key === 'ALL') {
      handleSearch(searchText, '');
      setActiveKey('ALL');
      setCurrentPage(0);
    } else if (key === 'QUOTES') {
      handleSearch(searchText, 'quote');
      setActiveKey('QUOTES');
      setCurrentPage(0);
    } else if (key === 'CUSTOMERS') {
      handleSearch(searchText, 'customer');
      setActiveKey('CUSTOMERS');
      setCurrentPage(0);
    } else if (key === 'VENDORS') {
      handleSearch(searchText, 'supplier');
      setActiveKey('VENDORS');
      setCurrentPage(0);
    } else if (key === 'PRODUCTS') {
      handleSearch(searchText, 'products');
      setActiveKey('PRODUCTS');
      setCurrentPage(0);
    } else if (key === 'EMPLOYEES') {
      handleSearch(searchText, 'employee');
      setActiveKey('EMPLOYEES');
      setCurrentPage(0);
    }
  };

  const colors = {
    ordered: {
      text: 'green',
      bg: 'green',
    },
    active: {
      text: '#0A4933',
      bg: '#D7F5EA',
    },
    expired: {
      text: '#6F2323',
      bg: '#FFE0E0',
    },
    draft: {
      text: '#45400E',
      bg: '#FBF8DE',
    },
  };

  function getTagColor(status) {
    if (status && status !== '') {
      let color;
      switch (status) {
        case 'Draft':
          color = colors.draft.bg;
          break;
        case 'Active':
          color = colors.active.bg;
          break;
        case 'Expired':
          color = colors.expired.bg;
          break;
        case 'Rejected':
          color = colors.expired.bg;
          break;
        default:
          color = colors.draft.bg;
      }
      return color;
    }
    return 'orange';
  }

  function getTagTextColor(status) {
    if (status && status !== '') {
      let color;
      switch (status) {
        case 'Draft':
          color = colors.draft.text;
          break;
        case 'Active':
          color = colors.active.text;
          break;
        case 'Expired':
          color = colors.expired.text;
          break;
        case 'Rejected':
          color = colors.expired.text;
          break;
        default:
          color = colors.draft.text;
      }
      return color;
    }
    return 'orange';
  }

  const renderItems = (item, dataName) => {
    if (item.docType && item.docType === 'quote') {
      return (
        <Row type="flex" justify="start">
          <Col>
            {dataName.status ? (
              <Tag
                color={getTagColor(dataName.status)}
                text
                style={{
                  color: getTagTextColor(dataName.status),
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  borderRadius: '999px',
                  padding: '0 12px',
                }}
              >
                {dataName.status}
              </Tag>
            ) : null}
          </Col>
          <Col style={{ width: '10%' }} className="pl-2">
            {dataName.total ? (
              <div className="text-gray-700">{`$ ${formatCurrencyToUSDAmount(
                dataName.total,
              )}`}</div>
            ) : null}
          </Col>
        </Row>
      );
    }

    if (
      item.docType &&
      item.docType === 'party' &&
      item.partyModel &&
      item.partyModel === 'Vendor'
    ) {
      return (
        <Row type="flex">
          <Col style={{ width: '30%' }}>
            {dataName.email ? <b color="purple"> {dataName.email}</b> : null}
          </Col>
          <Col style={{ width: '30%' }}>
            {dataName.phone ? <b color="purple"> {dataName.phone}</b> : null}
          </Col>
        </Row>
      );
    }
    if (
      item.docType &&
      item.docType === 'party' &&
      item.partyModel &&
      item.partyModel === 'Customer'
    ) {
      return (
        <Row type="flex" justify="start">
          <Col>{dataName.email ? <b color="purple"> {dataName.email}</b> : null}</Col>
          <Col className="pl-2">
            {dataName.phone ? <div className="text-gray-700"> {dataName.phone}</div> : null}
          </Col>
        </Row>
      );
    }
    if (
      item.docType &&
      item.docType === 'party' &&
      item.partyModel &&
      item.partyModel === 'vendor-poc'
    ) {
      return (
        <Row type="flex">
          <Col style={{ width: '30%' }}>{dataName.id}</Col>
          <Col style={{ width: '30%' }}>
            {dataName.email ? <b color="green"> {dataName.email}</b> : null}
          </Col>
          <Col style={{ width: '30%' }}>
            {dataName.phone ? <b color="green"> {dataName.phone}</b> : null}
          </Col>
        </Row>
      );
    }
    if (
      item.docType &&
      item.docType === 'party' &&
      item.partyModel &&
      item.partyModel === 'customer-poc'
    ) {
      return (
        <Row type="flex">
          <Col style={{ width: '30%' }}>{dataName.id}</Col>
          <Col style={{ width: '30%' }}>
            {dataName.email ? <b color="green"> {dataName.email}</b> : null}
          </Col>
          <Col style={{ width: '30%' }}>
            {dataName.phone ? <b color="green"> {dataName.phone}</b> : null}
          </Col>
        </Row>
      );
    }
    if (item.docType && item.docType === 'products') {
      return (
        <Row type="flex" justify="start">
          <Col>{dataName.id}</Col>
          <Col className="pl-2">
            {dataName.costprice ? (
              <div className="text-gray-700">{`$ ${formatCurrencyToUSDAmount(
                dataName.costprice,
              )}`}</div>
            ) : (
              <div className="text-gray-700">$0</div>
            )}
          </Col>
        </Row>
      );
    }
    return null;
  };
  const renderitemAvatar = dataName => {
    if (dataName.initialsPartyName && dataName.initialsPartyName.length >= 2) {
      return dataName.initialsPartyName[0] + dataName.initialsPartyName[1];
    }
    return null;
  };

  const renderListItems = () => {
    if (dataSource && dataSource.length > 0) {
      return (
        <div className="bg-gray-100">
          <InfiniteScroll
            loadMore={() => {
              const haveMoreRecordsToFetch = getBooleanHasMore(activeKey, dataSource.length, {
                _totalRecords: totalRecords,
                _totalQuotes: totalQuotes,
                _totalCustomers: totalCustomers,
                _totalVendors: totalVendors,
                _totalProducts: totalProducts,
                _totalEmployees: totalEmployees,
              });
              if (!haveMoreRecordsToFetch) {
                message.success('No more records to fetch');
                return;
              }
              loadMore(searchText, getDocTypeFromActiveTabSelected(activeKey), currentPage + 1);
              setCurrentPage(prev => prev + 1);
            }}
            hasMore={!infiniteScrollLoading && hasMore}
            pageStart={0}
            initialLoad={false}
            useWindow={false}
            getScrollParent={() => parentRef.current}
          >
            <List
              size="small"
              itemLayout="vertical"
              loading={loading}
              dataSource={dataSource}
              renderItem={item => {
                let dataName;
                if (item.docType === 'party' && item.partyModel === 'Customer') {
                  dataName = {
                    searchColor: item.docType && 'purple',
                    searchType: item.docType && 'Customer',
                    name: item.partyName && item.partyName,
                    email: item.emailAddress && item.emailAddress,
                    phone: item.phoneNumber && item.phoneNumber,
                    id: item.partyId && item.partyId,
                    partyId: item.partyId && `/customers/${item.partyId}/view/employees`,
                    initialsPartyName: item.partyName && item.partyName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'party' && item.partyModel === 'Vendor') {
                  dataName = {
                    searchColor: item.docType && 'orange',
                    searchType: item.docType && 'Vendor',
                    name: item.partyName && item.partyName,
                    id: item.partyId && item.partyId,
                    email: item.emailAddress && item.emailAddress,
                    phone: item.phoneNumber && item.phoneNumber,
                    partyId: item.partyId && `/vendors/${item.partyId}/view`,
                    initialsPartyName: item.partyName && item.partyName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'party' && item.partyModel === null) {
                  dataName = {
                    searchColor: item.docType && 'orange',
                    searchType: item.docType && 'Vendor',
                    name: item.partyName && item.partyName,
                    id: item.partyId && item.partyId,
                    email: item.emailAddress && item.emailAddress,
                    phone: item.phoneNumber && item.phoneNumber,
                    partyId: item.partyId && `/vendors/${item.partyId}/view`,
                    initialsPartyName: item.partyName && item.partyName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'party' && item.partyModel === 'vendor-poc') {
                  dataName = {
                    searchColor: item.docType && 'green',
                    searchType: item.docType && 'Employee',
                    name: item.partyName && item.partyName,
                    id: item.partyId && item.partyId,
                    email: item.emailAddress && item.emailAddress,
                    phone: item.phoneNumber && item.phoneNumber,
                    partyId:
                      item.partyId && item.employer !== props.currentUser.orgId
                        ? `/vendors/${item.employer}/employee/${item.partyId}`
                        : `/employees/${item.partyId}/view`,
                    initialsPartyName: item.partyName && item.partyName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'party' && item.partyModel === 'customer-poc') {
                  dataName = {
                    searchColor: item.docType && 'green',
                    searchType: item.docType && 'Employee',
                    name: item.partyName && item.partyName,
                    id: item.partyId && item.partyId,
                    email: item.emailAddress && item.emailAddress,
                    phone: item.phoneNumber && item.phoneNumber,
                    partyId:
                      item.partyId && item.employer !== props.currentUser.orgId
                        ? `/customers/${item.employer}/employee/${item.partyId}`
                        : `/employees/${item.partyId}/view`,
                    initialsPartyName: item.partyName && item.partyName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'products') {
                  dataName = {
                    searchColor: item.docType && 'blue',
                    searchType: item.docType && 'Product',
                    costprice: item.productCostPrice && item.productCostPrice,
                    name: item.productDisplayName && item.productDisplayName,
                    id: item.productId && item.productId,
                    total: item.productCostPrice && item.productCostPrice,
                    partyId:
                      item.productId && item.supplierPartyId
                        ? `/products/vendor/${item.supplierPartyId}/product/${item.productId}`
                        : null,
                    initialsPartyName: item.productDisplayName
                      ? item.productDisplayName.match(/\b(\w)/g)
                      : [],
                    partyType: item.docType && item.docType,
                  };
                } else if (item.docType === 'quote') {
                  dataName = {
                    searchColor: item.docType && '#f50',
                    searchType: item.docType && 'Quote',
                    name: item.quoteName && item.quoteName,
                    id: item.quoteId && item.quoteId,
                    partyId: item.quoteId && `/quotes/quote/${item.quoteId}/edit`,
                    total: item.quoteTotal && item.quoteTotal,
                    initialsPartyName: item.quoteName && item.quoteName.match(/\b(\w)/g),
                    partyType: item.docType && item.docType,
                    status: item.quoteStatus && item.quoteStatus,
                  };
                } else {
                  dataName = {
                    name: '',
                    id: '',
                  };
                }
                return (
                  <List.Item
                    className="zcp-global-search-result-item"
                    onClick={() => {
                      router.push(dataName.partyId);
                      props.dispatch({ type: 'global/unloadModal' });
                      setSearchText('');
                      setSearchmode(false);
                    }}
                    extra={
                      <Tag color={dataName.searchColor}>
                        {dataName.searchType && dataName.searchType}
                      </Tag>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: dataName.searchColor }}>
                          {renderitemAvatar(dataName)}
                        </Avatar>
                      }
                      description={renderItems(item, dataName)}
                      title={<div className="truncate ...">{dataName.name}</div>}
                    />
                  </List.Item>
                );
              }}
            />
            {infiniteScrollLoading && hasMore && (
              <div className="flex justify-center items-center w-full px-2 py-3">
                <ZCPLoader />
              </div>
            )}
          </InfiniteScroll>
        </div>
      );
    }
    return <ZCPSearchEmptyState />;
  };

  const renderData = () => {
    if (searchText !== '') {
      return (
        <div>
          <div className="px-8 border-0 border-b border-solid" style={{ borderColor: '#e8e8e8' }}>
            <Tabs
              className=""
              onChange={handleTabChange}
              activeKey={activeKey}
              tabBarStyle={{ marginBottom: 0 }}
            >
              <TabPane
                tab={
                  <span>
                    <Badge
                      overflowCount={100}
                      count={totalRecords && totalRecords}
                      style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                    >
                      <span style={{ paddingRight: '15px' }}>All</span>
                    </Badge>
                  </span>
                }
                key="ALL"
              />
              <TabPane
                tab={
                  <span>
                    <Badge
                      overflowCount={100}
                      count={totalQuotes && totalQuotes}
                      style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                    >
                      <span style={{ paddingRight: '15px' }}>Quotes</span>
                    </Badge>
                  </span>
                }
                key="QUOTES"
              />
              <TabPane
                tab={
                  <span>
                    <Badge
                      overflowCount={100}
                      count={totalCustomers && totalCustomers}
                      style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                    >
                      <span style={{ paddingRight: '15px' }}>Customers</span>
                    </Badge>
                  </span>
                }
                key="CUSTOMERS"
              />
              {props.currentUser.organizationDetails.business_type !== 'B2B' ? null : (
                <TabPane
                  tab={
                    <span>
                      <Badge
                        overflowCount={100}
                        count={totalVendors && totalVendors}
                        style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                      >
                        <span style={{ paddingRight: '15px' }}>Vendors</span>
                      </Badge>
                    </span>
                  }
                  key="VENDORS"
                />
              )}
              <TabPane
                tab={
                  <span>
                    <Badge
                      overflowCount={100}
                      count={totalProducts && totalProducts}
                      style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                    >
                      <span style={{ paddingRight: '15px' }}>Products</span>
                    </Badge>
                  </span>
                }
                key="PRODUCTS"
              />
              <TabPane
                tab={
                  <span>
                    <Badge
                      overflowCount={100}
                      count={totalEmployees && totalEmployees}
                      style={{ backgroundColor: '#1b4fe8', zIndex: 8 }}
                    >
                      <span style={{ paddingRight: '15px' }}>Employees</span>
                    </Badge>
                  </span>
                }
                key="EMPLOYEES"
              />
            </Tabs>
          </div>

          <div className="zcp-global-search-results" ref={parentRef}>
            {renderListItems()}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex py-4" style={{ placeContent: 'center' }}>
          <div>Start typing in the search box above to see results</div>
        </div>
      </div>
    );
  };
  IntercomAPI('onHide', () => setShowHelpModal(false));

  return (
    <div className={className}>
      <Icon type="search" key="Icon" onClick={() => setSearchmode(true)} />
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu>
            <Menu.Item>
              <a href="http://support.zeus.fidelissd.com/" target="_blank_">
                <div className="flex">
                  <div className="flex-none text-lg pr-2 pt-2">
                    <img src={HelpCenterSvgIcon} alt="Help" style={{ width: '24px' }} />
                  </div>
                  <div className="flex-auto">
                    Zeus Support Center
                    <div className="text-gray-500 text-sm">Knowledge base and how to articles</div>
                  </div>
                </div>
              </a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <a
                className="text-normal"
                onClick={() => {
                  if (!showHelpModal) {
                    setShowHelpModal(true);
                    setTimeout(() => {
                      IntercomAPI('show');
                    }, 200);
                  }
                }}
              >
                <div className="flex">
                  <div className="flex-none text-lg pr-2 pt-2">
                    <img src={ChatSvgIcon} alt="Help" style={{ width: '24px' }} />
                  </div>
                  <div className="flex-auto">
                    Request Chat Support
                    <div className="text-gray-500 text-sm">Chat with a live agent</div>
                  </div>
                </div>
              </a>
            </Menu.Item>
          </Menu>
        }
      >
        <span className="p-4 cursor-pointer">
          <Icon data-tut="reactour__helpCenter" type="question-circle" className="text-lg" />
        </span>
      </Dropdown>

      <Intercom appID="b2l770ch" {...user} />

      <AvatarDropdown menu />

      {/* Global search modal */}
      <Modal
        maskClosable={false}
        className="zcp-global-search-modal $styles.widthModal"
        style={{ top: 20, width: '80% !important' }}
        visible={searchMode}
        onCancel={() => {
          setSearchmode(false);
        }}
        footer={null}
        closable={false}
        width="80%"
        title={null}
        destroyOnClose
      >
        <Input
          autoFocus
          size="large"
          prefix={<Icon component={ZcpIcons.Search} />}
          suffix={
            <Icon
              style={{ fontSize: 20 }}
              onClick={() => {
                props.dispatch({ type: 'global/unloadModal' });
                setSearchText('');
                setSearchmode(false);
              }}
              component={ZcpIcons.Clear}
            />
          }
          placeholder="Search for quotes, customers, products, contacts..."
          allowClear
          style={{ marginTop: 20 }}
          onChange={val => {
            setSearchText(val.target.value);
            debounceSearch(val.target.value, '');
          }}
        />
        {renderData()}
      </Modal>
    </div>
  );
};

export default connect(({ settings, global, loading, user }) => ({
  currentUser: user.currentUser,
  globalSearches: global.globalSearches,
  theme: settings.navTheme,
  layout: settings.layout,
  loading: loading.effects['global/fetchGlobalSearch'],
  currentTheme: settings.navTheme,
}))(GlobalHeaderRight);
