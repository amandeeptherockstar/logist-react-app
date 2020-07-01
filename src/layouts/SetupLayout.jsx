import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import { router } from 'umi';
import { getAuthority } from '@/utils/authority';
// import currUser from '@/services/user';

const SetupLayout = props => {
  useEffect(() => {
    props.dispatch({
      type: 'subscription/getBillingInfo',
    });
    return () => {};
  }, []);
  if (getAuthority() === 'guest' || !getAuthority()) {
    router.push('/user/login');
  }

  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);

  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div>{children}</div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(SetupLayout);
