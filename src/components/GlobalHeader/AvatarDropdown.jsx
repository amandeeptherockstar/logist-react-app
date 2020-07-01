import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Text from 'antd/lib/typography/Text';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatar from '../../assets/avatar.jpg';
import ZCPUserAvatar from '../ZCPUserAvatar';

const spinner = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const companyUserColor = '#1b4fe8';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      // clear the forms entries on logout
      localStorage.removeItem('AddCustomerForm');
      localStorage.removeItem('AddVendorForm');
      localStorage.removeItem('AddEmployeeForm');
      localStorage.removeItem('AddProductForm');
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      window.location.reload();
      return;
    }

    router.push(`/account/${key}`);
  };

  render() {
    const { menu } = this.props;
    const { currentUser } = this.props;
    if (!currentUser.firstName || !currentUser.lastName) {
      currentUser.firstName = 'User';
      currentUser.lastName = 'Name';
      currentUser.orgName = '';
    }
    if (!menu) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      );
    }

    const menuHeaderDropdown = (
      <Menu className="profileDropDown" selectedKeys={[]} onClick={this.onMenuClick}>
        <span className={`${styles.action} ${styles.account}`}>
          <div style={{ textAlign: 'center', padding: '8px 24px' }}>
            <Avatar
              size="large"
              style={{ backgroundColor: companyUserColor }}
              className="zcp-l-avatar"
              src={currentUser.avatar ? currentUser.avatar : undefined}
            >
              {currentUser.avatar
                ? null
                : currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)}
            </Avatar>
            <div>
              <Text
                strong
                className={styles.name}
              >{`${currentUser.firstName} ${currentUser.lastName}`}</Text>
            </div>
            <div>
              <Text ellipsis style={{ maxWidth: '250px' }}>
                {currentUser.company_designation
                  ? currentUser.company_designation
                  : 'Designation Not Set'}
              </Text>
              <div>
                <Text ellipsis strong style={{ maxWidth: '250px' }}>
                  {currentUser.orgName}
                </Text>
              </div>
            </div>
          </div>
        </span>
        <Menu.Divider />
        <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser.firstName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span data-tut="reactour__settings" className={`${styles.action} ${styles.account}`}>
          <ZCPUserAvatar currentUser={currentUser} />
          <span className={styles.name}>{`${currentUser.firstName} ${currentUser.lastName}`}</span>
          <Icon type="down" />
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        indicator={spinner}
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
