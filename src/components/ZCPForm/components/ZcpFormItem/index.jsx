import React from 'react';
import { Form } from 'antd';

const ZcpFormItem = ({
  formItemProps,
  label,
  required,
  hideRequiredIndicator,
  children,
  ...restProps
}) => {
  const renderZcpFormItemLabel = () => {
    if (required && !hideRequiredIndicator) {
      return (
        <>
          <div className="flex">
            <div className="pr-1 text-red-700 font-semibold">*</div>
            <div className="zcp-form-label">{label}</div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="zcp-form-label">{label}</div>
      </>
    );
  };

  return (
    <Form.Item colon={false} label={renderZcpFormItemLabel()} {...restProps}>
      {children}
    </Form.Item>
  );
};

export default ZcpFormItem;
