// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/camelcase */
import { Button, Form, Input, Popover, Progress, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import jwt from 'jwt-decode';
import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user-resetpassword.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user-resetpassword.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user-resetpassword.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ userResetPassword, loading }) => ({
  userResetPassword,
  submitting: loading.effects['userResetPassword/submit'],
}))
class ResetPassword extends Component {
  state = {
    confirmDirty: false,
    help: '',
  };

  interval = undefined;

  componentDidUpdate() {
    const { userResetPassword, form } = this.props;
    const account = form.getFieldValue('mail');

    if (userResetPassword.status === 'ok') {
      message.success('New Password Set');
      router.push({
        pathname: '/user/login',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 7) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = (e, token_id) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          const { email_address, password } = values;
          dispatch({
            type: 'resetPassword/reset',
            payload: { email_address, password, token_id },
            callback: response => {
              if (response.status === 'ok') {
                router.push('/user/login');
              }
            },
          });
        }
      },
    );
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback(
        formatMessage({
          id: 'user-resetpassword.password.twice',
        }),
      );
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'user-resetpassword.password.required',
        }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 8) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFieldsAndScroll(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help } = this.state;

    const {
      location = {
        pathname: '',
        search: '',
      },
    } = this.props;

    const token_id = location.search && location.search.split('=')[1];

    const decodedToken = jwt(token_id);

    const { userLoginId } = decodedToken;

    if (!token_id) {
      router.push('/user/login');
      return null;
    }

    return (
      <div className={styles.main}>
        <div className="text-center py-4">
          <h3 className="mb-0">
            <span className="text-2xl">
              <FormattedMessage id="user-resetpassword.resetpassword" />
            </span>
          </h3>
          <p className="text-sm text-gray-600">Enter the new password for your Zeus account.</p>
        </div>
        <span className="text-sm pb-1 zcp-form-label">Your registered email address</span>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email_address', {
              initialValue: userLoginId,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-resetpassword.email.required',
                  }),
                },
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'user-resetpassword.email.wrong-format',
                  }),
                },
              ],
            })(
              <Input
                size="large"
                disabled
                placeholder={formatMessage({
                  id: 'user-resetpassword.email.placeholder',
                })}
                style={{ color: '#000' }}
              />,
            )}
          </FormItem>
          <span className="text-sm pb-1 zcp-form-label">Password</span>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <FormattedMessage id="user-resetpassword.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({
                    id: 'user-resetpassword.password.placeholder',
                  })}
                />,
              )}
            </Popover>
          </FormItem>
          <span className="text-sm pb-1 zcp-form-label">Confirm password</span>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-resetpassword.confirm-password.required',
                  }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({
                  id: 'user-resetpassword.confirm-password.placeholder',
                })}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={[styles.submit, 'w-full']}
              type="primary"
              htmlType="submit"
              onClick={e => this.handleSubmit(e, token_id)}
            >
              <FormattedMessage id="user-resetpassword.reset" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ResetPassword);
