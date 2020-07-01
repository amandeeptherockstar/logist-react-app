import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const HeaderDropdown = ({ placement, overlayClassName: cls, ...restProps }) => (
  <Dropdown
    trigger={['click']}
    placement={placement || 'bottomLeft'}
    getPopupContainer={trigger => trigger.parentNode}
    overlayClassName={classNames(styles.container, cls)}
    {...restProps}
  />
);

export default HeaderDropdown;
