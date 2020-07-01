import React, { Component } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import BaseView from './components/base';
import OrgView from './components/OrgView';
import styles from './style.less';
import NotificationView from './components/notification';
import Preference from './components/Preference';

const { Item } = Menu;

@connect(({ userAccountSetting }) => ({
  currentUser: userAccountSetting.currentUser,
}))
class AccountSetting extends Component {
  main = undefined;

  constructor(props) {
    super(props);
    const menuMap = {
      '/account/settings/general': (
        <div className="leading-none py-4">
          <div className="flex items-center">
            <div>
              <i className="las la-user mr-4" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <div className="menu-title">General Information</div>
              <div className="menu-sub-title pt-1">Name, avatar, email</div>
            </div>
          </div>
        </div>
      ),
      '/account/settings/org': (
        <div className="leading-none py-4">
          <div className="flex items-center">
            <div>
              <i className="las la-building mr-4" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <div className="menu-title">Org Preferences</div>
              <div className="menu-sub-title pt-1">Org name, email, logo etc.</div>
            </div>
          </div>
        </div>
      ),
      '/account/settings/pref': (
        <div className="leading-none py-4">
          <div className="flex items-center">
            <div>
              <i className="las la-palette mr-4" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <div className="menu-title">Settings</div>
              <div className="menu-sub-title pt-1">Theme, view settings</div>
            </div>
          </div>
        </div>
      ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: this.props.route && this.props.route.name,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.route.name === 'integrations.stripe') {
      this.setState({
        selectKey: 'integrations',
      });
    }
    // if (this.props.route.name === 'account.settings') {
    //   router.push('/account/settings/general');
    // }
    if (this.props.route.name === 'integrations.quickbooks') {
      this.setState({
        selectKey: 'integrations',
      });
    }
    dispatch({
      type: 'userAccountSetting/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return this.props.route.routes.map(({ path }) => <Item key={path}>{menuMap[path]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = key => {
    router.push(`/account/settings/${key}`);
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'general':
        return (
          <div>
            <div className="text-2xl text-gray-800">General Information</div>
            <BaseView />
          </div>
        );

      case 'notification':
        return (
          <div>
            <div className="text-2xl text-gray-800 mb-6">Manage Notifications</div>
            <NotificationView />
          </div>
        );

      case 'org':
        return (
          <div>
            <div className="text-2xl text-gray-800 mb-6">Organization Settings</div>
            <OrgView />
          </div>
        );

      case 'preference':
        return (
          <div>
            <div className="text-2xl text-gray-800 mb-6">Your Settings</div>
            <Preference />
          </div>
        );

      default:
        break;
    }

    return null;
  };

  render() {
    const { mode } = this.state;
    return (
      <div className="container mx-auto">
        <PageHeaderWrapper className="withoutHeader">
          <div className="zcp-scrollable-content">
            <GridContent>
              <div
                className={styles.main}
                ref={ref => {
                  if (ref) {
                    this.main = ref;
                  }
                }}
              >
                <div className={styles.leftMenu}>
                  <Menu
                    mode={mode}
                    selectedKeys={[
                      this.props.location.pathname.includes('/account/settings/custom-fields')
                        ? '/account/settings/custom-fields'
                        : this.props.location.pathname,
                    ]}
                    onClick={({ key }) => router.push(key)}
                  >
                    {this.getMenu()}
                  </Menu>
                </div>
                <div className={styles.right}>{this.props.children}</div>
              </div>
            </GridContent>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default AccountSetting;
