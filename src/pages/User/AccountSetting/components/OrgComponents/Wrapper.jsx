import React from 'react';
import { Button, Icon } from 'antd';
import styles from './styles.less';

// eslint-disable-next-line no-alert
const Wrapper = ({
  children,
  checked = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggle = () => {
    // implement me
  },
  markAttachmentHandler,
}) => (
  <>
    <Button
      style={{
        position: 'absolute',
        zIndex: 2,
        padding: 10,
        height: 22,
        width: 22,
        top: -10,
        left: -9,
        borderRadius: 22,
      }}
      className={`${checked && styles.attached}`}
      // icon={checked && 'check'}
      onClick={markAttachmentHandler}
    >
      {checked && (
        <Icon
          type="check"
          style={{ position: 'absolute', top: -2, left: -2, zIndex: 1, padding: 5 }}
        />
      )}
    </Button>
    {children}
  </>
);

export default Wrapper;
