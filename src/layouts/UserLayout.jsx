import DocumentTitle from 'react-document-title';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import { Layout, Row } from 'antd';
import { router } from 'umi';
import styles from './UserLayout.less';
import logo from '../assets/logo/zeus-logo.png';

const { Content } = Layout;
let isLogo = null;

const UserLayout = props => {
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

  useEffect(() => {
    // call the effect to mount the countries
    props.dispatch({
      type: 'countriesList/getAllCountries',
    });
    if (localStorage.getItem('accessToken')) {
      // user is trying to log out, let it through
      if (window.location.pathname === '/user/logout') return;

      props.dispatch({ type: 'login/tokenCheck' }).then(status => {
        if (status) router.push('/');
      });
    }

    // set initial setup state
    props.dispatch({
      type: 'settings/changeCollapsed',
      payload: Boolean(localStorage.getItem('leftMenuCollapsed')) || false,
    });
  }, []);

  if ((location.pathname && location.pathname.split('/')[2]) === 'login') {
    isLogo = true;
  } else if ((location.pathname && location.pathname.split('/')[2]) === 'register') {
    isLogo = true;
  } else if ((location.pathname && location.pathname.split('/')[2]) === 'invitedUserLogin') {
    isLogo = true;
  } else if ((location.pathname && location.pathname.split('/')[2]) === 'forgot') {
    isLogo = true;
  } else if ((location.pathname && location.pathname.split('/')[2]) === 'resetPassword') {
    isLogo = true;
  }

  const routeName = routes.filter(name => name.path === location.pathname)[0].name || 'Zeus';
  return (
    <DocumentTitle
      title={`${formatMessage({
        id: `menu.${routeName}`,
      })} - Zeus`}
    >
      <Layout>
        <Content>
          <div className={styles.body}>
            <div className={styles.container}>
              <div className={styles.signIn}>
                <div className={styles.content}>
                  <div className={styles.top}>
                    <div className={styles.header}>
                      {/* <Link to="/"> */}
                      <Row>
                        {isLogo !== null ? (
                          <div className={styles.logo}>
                            <img alt="logo" src={logo} />
                          </div>
                        ) : null}
                      </Row>
                      {/* </Link> */}
                    </div>
                  </div>
                  {children}
                  <p className="text-center text-sm text-gray-500 pt-10">
                    &copy; 2020 Zeus - Fidelis Sustainability Distribution, LLC, All Rights Reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </DocumentTitle>
  );
};

export default connect(({ settings, login }) => ({ ...settings, login }))(UserLayout);
