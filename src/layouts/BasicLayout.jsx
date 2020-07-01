/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Ant Design Pro v4 use `@ant-design/pro - layout` to handle Layout. * You can view component api by: * https://github.com/ant-design/ant-design-pro-layout */
import ProLayout from '@ant-design/pro-layout';
import Authorized from '@/utils/Authorized';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { Modal, Progress, Icon, Button, Dropdown, Menu, Alert } from 'antd';
import logo from '../assets/logo/logoSmall.svg';
import bluelogo from '../assets/logo/zeus-blue.png';
import QuickAction from '@/components/GlobalHeader/QuickAction';
import { router } from 'umi';
import SessionTimeoutNotification from '@/components/SessionTimeoutNotification';
import timers from '@/timers';
import { resetAuthTimer } from '@/utils/auth';
import style from './SetupLayout.less';
import moment from 'moment';
import NotificationBar from '@/components/NotificationBar';
import { getAuthority } from '@/utils/authority';

const RightContent = React.lazy(() => import('@/components/GlobalHeader/RightContent'));
/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map((item, index) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null);
  });
const footerRender = () => <></>;

const BasicLayout = props => {
  const { dispatch, children, settings, hasActiveLicense } = props;

  let timer;
  useEffect(() => {
    props.dispatch({
      type: 'countriesList/getAllCountries',
    });

    // check if user has a trial account going on
    if (props.assumed) {
      // if user is trialing add a is-trialing class to the html
      document.body.classList.add('is-trialing');
    }

    return () => {
      clearInterval(timer);
    };
  }, [props.assumed]);

  useEffect(() => {
    props.dispatch({
      type: 'subscription/getBillingInfo',
    });
    return () => {};
  }, []);

  useEffect(() => {
    let collapsed;
    let navTheme;
    let zcpTheme;

    if (localStorage.getItem('leftMenuCollapsed')) {
      if (localStorage.getItem('leftMenuCollapsed') === 'false') {
        collapsed = false;
      } else {
        collapsed = true;
      }
    } else {
      collapsed = false;
    }

    if (localStorage.getItem('navTheme')) {
      if (localStorage.getItem('navTheme') === 'dark') {
        navTheme = 'dark';
        zcpTheme = 'zcpp-theme-dark';
      } else {
        navTheme = 'light';
        zcpTheme = 'zcpp-theme-light';
      }
    } else {
      navTheme = 'dark';
      zcpTheme = 'zcpp-theme-dark';
    }

    dispatch({
      type: 'settings/changeCollapsed',
      payload: collapsed,
    });
    dispatch({
      type: 'settings/changeTheme',
      payload: navTheme,
    });
    dispatch({
      type: 'customFields/getAllCustomFieldTypes',
    });
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeCollapsed',
        payload,
      });
      dispatch({
        type: 'settings/changeCollapsed',
        payload,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/camelcase

  return (
    <>
      {props.subscription.is_trialing && (
        <NotificationBar
          onUpgrade={() => {}}
          onCancel={() => {}}
          description={
            <span className="text-xs text-gray-400 py-1">
              <Icon type="info-circle"></Icon> Your trial expires{' '}
              {moment(props.subscription.trial_end_date).fromNow()}
              {'. '}
              <span className="text-gray-200">
                Manage your Subscription in{' '}
                <Link
                  to="/account/settings/general"
                  className="font-medium text-gray-200 underline"
                >
                  Account Settings
                </Link>
                <Icon type="angle-right"></Icon>
              </span>
            </span>
          }
        />
      )}
      {props.assumed && (
        <NotificationBar
          onUpgrade={() => {}}
          onCancel={() => {}}
          description={
            <span className="text-xs text-gray-400 py-1">
              <Icon type="info-circle"></Icon> You are assuming{' '}
              <strong>{props.currentUser.displayName}</strong>
              {"'"}s account{'. '}Everything will be logged via{' '}
              <strong>{props.currentUser.email}</strong>.
            </span>
          }
        />
      )}

      {props.globalLoadingActive && (
        <Progress
          style={{
            position: 'fixed',
            top: -10,
            zIndex: 5,
            marginTop: '0 !important',
          }}
          strokeColor={{
            from: '#000',
            to: '#ff0000',
          }}
          percent={100}
          showInfo={false}
          status="active"
        />
      )}
      {/* Needs a subscription modal */}
      <Modal
        centered
        wrapClassName="zcp-subscription-modal"
        visible={props.showSessionExpiringMessage}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <SessionTimeoutNotification
          onRefreshSessionClick={() => {
            clearTimeout(timers.authenticationCountTimer);
            dispatch({ type: 'login/refreshToken' }).then(resp => {
              if (resp) {
                dispatch({
                  type: 'login/showAuthWarning',
                  payload: false,
                });
                resetAuthTimer();
              }
            });
          }}
        />
      </Modal>
      {/* Needs a subscription modal */}
      <Modal
        title="Pardon the interruption!"
        centered
        wrapClassName="zcp-subscription-modal"
        // eslint-disable-next-line @typescript-eslint/camelcase
        visible={!!props.subscription && !props.subscription.is_active}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <div id="map"></div>
        <div className="bg-gray-100">
          <div className="p-4">
            <h3 className="text-gray-800 text-2xl font-bold">Let&apos;s choose a plan!</h3>
            <p className="text-base text-gray-800">
              Seems like your account does not have an active subscription!
            </p>
            <p className="text-xs text-gray-600">
              Choose a plan below to activate your subscription.
            </p>
          </div>
          <div className="scroll-shadow-active visible md:invisible lg:invisible">
            <div className="scroll-shadow-t"></div>
          </div>
        </div>
      </Modal>

      <QuickAction float />

      <ProLayout
        collapsed
        title="Zeus"
        location="/"
        logo={props.navTheme === 'dark' ? logo : bluelogo}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => {}}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }
          return (
            <Link id={`${menuItemProps.name}-${menuItemProps.path}`} to={menuItemProps.path}>
              {defaultDom}
            </Link>
          );
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        itemRender={r => (
          <Link id={r.breadcrumbName} to={r.path}>
            {r.breadcrumbName}
          </Link>
        )}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={(rightProps, leftProps) => (
          <>
            <QuickAction {...leftProps} />
            <Suspense fallback={null}>
              <RightContent {...rightProps} />
            </Suspense>
          </>
        )}
        {...props}
        route={{
          ...props.route,
          routes: props.route.routes.map(r => {
            if (
              (r.name === 'setup.guide' && props.currentUser.isOrgSetupComplete) ||
              (r.name === 'vendor' && props.currentUser.organizationDetails.business_type !== 'B2B')
            ) {
              return {
                ...r,
                hideInMenu: true,
              };
            }
            return r;
          }),
        }}
        {...settings}
      >
        {children}
      </ProLayout>
    </>
  );
};
export default connect(
  state => ({
    currentUser: state.user.currentUser,
    hasActiveLicense: state.user.hasActiveLicense,
    subscription: state.user.currentUser.subscription,
    collapsed: state.settings.collapsed,
    navTheme: state.settings.navTheme,
    globalLoadingActive: Object.values(state.loading).includes(true),
    settings: state.settings,
    authenticationToken: state.login.authenticationToken,
    partyId: state.login.partyId,
    sessionMessage: state.login.message,
    showSessionExpiringMessage: state.login.showSessionExpirationNotification,
    authWarning: state.login.authWarning,
    assumed: state.login.assumed,
  }),
  dispatch => ({ dispatch }),
)(BasicLayout);
