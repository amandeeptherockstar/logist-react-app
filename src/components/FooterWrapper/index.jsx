import React from 'react';
import { connect } from 'dva';
import styles from './styles.less';

function FooterWrapper({ children, collapsed }) {
  return (
    <div
      className={`${styles.zcpQuoteTotalBar} zcp-quote-totals-bar bg-white`}
      style={{
        padding: 0,
        right: 0,
        width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)',
        minHeight: 70,
      }}
    >
      {children}
    </div>
  );
}

const mapStateToProps = state => ({
  collapsed: state.settings.collapsed,
});

export default connect(mapStateToProps)(FooterWrapper);
