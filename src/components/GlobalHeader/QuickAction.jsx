import { Icon, Menu } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';

class QuickAction extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    router.push(`/${key}`);
  };

  render() {
    const auth = getAuthority();
    const authority = ['ORG_ADMIN', 'ORG_MANAGER'];
    const menuAuthHeaderDropdown = (
      <Menu className={styles.menu} onClick={this.onMenuClick}>
        <Menu.Item key="quotes/quote/new">
          <Icon type="file-text" />
          <FormattedMessage id="menu.quick.addQuote" defaultMessage="Add Quote" />
        </Menu.Item>
        <Menu.Item key="products/new">
          <Icon type="skin" />
          <FormattedMessage id="menu.quick.addProduct" defaultMessage="Add New Product" />
        </Menu.Item>
      </Menu>
    );
    const renderVendorItem = () => {
      if (this.props.sellerType === 'Vendor') {
        return (
          <Menu.Item key="vendors/new">
            <Icon type="cluster" />
            <FormattedMessage id="menu.quick.addSupplier" defaultMessage="Add New Vendor" />
          </Menu.Item>
        );
      }
      return null;
    };
    const menuHeaderDropdown = (
      <Menu className={styles.menu} onClick={this.onMenuClick}>
        <Menu.Item key="quotes/quote/new">
          <Icon type="file-text" />
          <FormattedMessage id="menu.quick.addQuote" defaultMessage="Add Quote" />
        </Menu.Item>
        <Menu.Item key="products/new">
          <Icon type="skin" />
          <FormattedMessage id="menu.quick.addProduct" defaultMessage="Add New Product" />
        </Menu.Item>
        <Menu.Item key="customers/new">
          <Icon type="team" />
          <FormattedMessage id="menu.quick.addCustomer" defaultMessage="Add New Customer" />
        </Menu.Item>
        {renderVendorItem()}
        <Menu.Item key="employees/new">
          <Icon type="user-add" />
          <FormattedMessage id="menu.quick.addEmployee" defaultMessage="Add New Employee" />
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown
        trigger={['click']}
        overlay={authority.includes(auth[0]) ? menuHeaderDropdown : menuAuthHeaderDropdown}
        className={!this.props.float ? styles.left : ''}
      >
        {this.props.float ? (
          <span className={styles.floatButtonGlobal}>
            <Icon
              type="plus-circle"
              theme="filled"
              className={
                this.props.navTheme === 'dark' ? 'text-white text-3xl' : 'text-blue-900 text-3xl'
              }
            />
          </span>
        ) : (
          <span className={styles.action} data-tut="reactour__createEntity">
            <Icon type="plus-circle" style={{ fontSize: '18px', color: '#1b4fe8' }} />
          </span>
        )}
      </HeaderDropdown>
    );
  }
}

export default connect(({ user, settings }) => ({
  currentUser: user.currentUser,
  sellerType: settings.sellerType,
  navTheme: settings.navTheme,
}))(QuickAction);
