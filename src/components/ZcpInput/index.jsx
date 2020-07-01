/**
 * To be used for text input and password input fields in a form.
 */
import React from 'react';
import { Input } from 'antd';

const { Password } = Input;

const ZcpInput = ({ formItemProps, label, isPassword, required, children, ...restProps }) => {
  // TODO:MSK // implement showPasswordStrengthIndicator props to show password strength
  // ...refer existing implementation src\pages\User\InvitedUserLogin\index.jsx
  const renderZcpInput = () => {
    if (isPassword) {
      return (
        <>
          <Password size="large" placeholder="Enter your old password" {...restProps} />
        </>
      );
    }
    return (
      <>
        <Input size="large" placeholder="Enter your old password" {...restProps} />
      </>
    );
  };

  return renderZcpInput();
};

export default ZcpInput;
