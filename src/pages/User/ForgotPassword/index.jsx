import { Button, Form, Input } from 'antd';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
// import Link from 'umi/link';
// import { connect } from 'dva';
import styles from '../UserLogin/style.less';
import { sendResetPasswordLink } from '../../../services/UserAuthentication/forgotPassword';

const FormItem = Form.Item;

class ForgotPassword extends Component {
  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      sendResetPasswordLink(values);
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <div className="text-center py-4">
          <p className={styles.headerTitle}>Forgot your password?</p>
          <div className="text-sm text-gray-600">
            Enter the email address of your Zeus account. You will receive an email to reset your
            password.
          </div>
        </div>
        <Form
          onSubmit={this.handleSubmit}
          ref={forms => {
            this.registerForm = forms;
          }}
          hideRequiredMark
          colon={false}
        >
          <FormItem label={<div className="zcp-form-label">Your registered email address</div>}>
            {getFieldDecorator('email_address', {
              rules: [
                {
                  required: true,
                  message: 'Enter Email Address',
                },
                {
                  type: 'email',
                  message: 'Enter Valid Email Address',
                },
              ],
            })(<Input size="large" placeholder="john.doe@example.com" />)}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              block
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              Reset Password
            </Button>
          </FormItem>
        </Form>
        <div>
          <p className="text-center text-sm">
            Remember your password?{' '}
            <a href="/user/login" className="text-blue-700 visited:text-blue-800">
              Back to Sign in
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Form.create()(ForgotPassword);
