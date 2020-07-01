import { Button, Form, Input, Popover, Progress, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import jwt from 'jwt-decode';
import router from 'umi/router';
import styles from '../UserLogin/style.less';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/animations/lock-unlock.json';

const FormItem = Form.Item;

const secureYourAccountAnimation = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user-inviteduserlogin.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user-inviteduserlogin.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user-inviteduserlogin.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ invitedUserLogin, loading }) => ({
  invitedUserLogin,
  submitting: loading.effects['invitedUserLogin/register'],
}))
class InvitedUserLogin extends Component {
  state = {
    confirmDirty: false,
    visible: true,
    help: '',
  };

  interval = undefined;

  componentDidUpdate() {
    const { invitedUserLogin, form } = this.props;
    const account = form.getFieldValue('mail');

    if (invitedUserLogin.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
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

  // eslint-disable-next-line @typescript-eslint/camelcase
  handleSubmit = (e, tenantId) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    // const { type } = this.state;

    form.validateFieldsAndScroll(
      {
        force: true,
      },
      (err, values) => {
        const apiToken = btoa(`${values.email_address}:${values.password}`);
        const { query } = this.props.location;
        if (!err) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          const { email_address, password, confirm } = values;
          dispatch({
            type: 'invitedUserLogin/register',
            payload: {
              userDetails: {
                email_address,
                password,
                confirm_password: confirm,
              },
              apiToken,
              tenantId,
              inviteToken: query.token,
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
          id: 'user-inviteduserlogin.password.twice',
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
          id: 'user-inviteduserlogin.password.required',
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

    const token = location.search && location.search.split('=')[1];

    if (!token) {
      router.push('/user/login');
      return null;
    }
    const decodedToken = jwt(token);

    const { emailAddress, tenantId, firstName } = decodedToken;

    return (
      <div className={styles.main}>
        <div className="text-center py-4">
          <p className={`${styles.headerTitle} text-xl font-bold`}>Welcome {firstName}!</p>
          <div className="text-base text-gray-600">
            Your account has been set up for <strong>{emailAddress}</strong>
          </div>
          <div className="text-sm text-gray-500">
            You will use this email to log into your account.
          </div>
          <div className="py-1">
            <Lottie options={secureYourAccountAnimation} height={95} width={95} />
          </div>
        </div>
        <div className="pb-4 flex">
          <p className="text-lg font-medium">
            Let&apos;s secure your account with a strong password <Icon type="arrow-right"></Icon>
          </p>
        </div>
        <div>
          <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
            <div className="hidden">
              <FormItem label="Email Address">
                {getFieldDecorator('email_address', {
                  initialValue: emailAddress,
                })(
                  <Input
                    size="large"
                    disabled
                    placeholder={formatMessage({
                      id: 'user-inviteduserlogin.email.placeholder',
                    })}
                    style={{ color: '#000' }}
                  />,
                )}
              </FormItem>
            </div>
            <FormItem help={help} label={<div className="text-sm">Choose a Password</div>}>
              <Popover
                trigger="focus"
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
                      <FormattedMessage id="user-inviteduserlogin.strength.msg" />
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
                })(<Input size="large" autoFocus type="password" placeholder="••••••••" />)}
              </Popover>
            </FormItem>
            <FormItem label={<div className="text-sm">Confirm Password</div>}>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user-inviteduserlogin.confirm-password.required',
                    }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input size="large" type="password" placeholder="••••••••" />)}
            </FormItem>
            <FormItem>
              <Button
                block
                loading={submitting}
                type="primary"
                htmlType="submit"
                className={styles.button}
                onClick={e => this.handleSubmit(e, tenantId)}
              >
                Create Account
              </Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <p className="text-center text-sm">
            Done with your set up already? <a href="/user/login">Back to Sign in</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Form.create()(InvitedUserLogin);
