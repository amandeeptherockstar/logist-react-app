import { Button, Col, Form, Input, Popover, Progress, Row } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
// import { router } from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userregister.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
class UserRegister extends Component {
  state = {
    visible: false,
    help: '',
  };

  interval = undefined;

  componentDidUpdate() {
    const { register } = this.props;
    // const account = form.getFieldValue('mail');
    // console.dir(this.props);
    if (register.status === 'ok') {
      // message.success('Success!');
      // router.push({
      //   pathname: '/user/verify',
      //   state: {
      //     account,
      //   },
      // });
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

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'register/submit',
            payload: { ...values },
          });
          // router.push({
          //   pathname: '/user/verify',
          // });
        }
      },
    );
  };

  // checkConfirm = (rule, value, callback) => {
  //   const { form } = this.props;

  //   if (value && value !== form.getFieldValue('password')) {
  //     callback(
  //       formatMessage({
  //         id: 'userregister.password.twice',
  //       }),
  //     );
  //   } else {
  //     callback();
  //   }
  // };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'userregister.password.required',
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

  // changePrefix = value => {
  //   this.setState({
  //     prefix: value,
  //   });
  // };

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

  alreadyEmail = (rule, value, callback) => {
    if (this.props.register.emailStatus === 400) {
      callback('Your Email ID already Exist');
    }
    // Note: must always return a callback, otherwise validateFieldsAndScroll can't respond to
    callback();
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help } = this.state;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="userregister.register.register" />
        </h3>
        <Form
          onSubmit={this.handleSubmit}
          ref={forms => {
            this.registerForm = forms;
          }}
        >
          <Row>
            <Col span={12}>
              <FormItem
                label={formatMessage({
                  id: 'userregister.firstName.label',
                })}
                // label={<FormattedMessage id="userregister.firstName.label" />}
              >
                {getFieldDecorator('first_name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'userregister.firstName.required',
                      }),
                    },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({
                      id: 'userregister.firstName.placeholder',
                    })}
                    // placeholder="Enter First Name"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={1} />
            <Col span={11}>
              <FormItem
                label={formatMessage({
                  id: 'userregister.lastName.label',
                })}
                // label={<FormattedMessage id="userregister.lastName.label" />}
              >
                {getFieldDecorator('last_name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'userregister.lastName.required',
                      }),
                    },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({
                      id: 'userregister.lastName.placeholder',
                    })}
                    // placeholder="Enter Last Name"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            label={formatMessage({
              id: 'userregister.company.label',
            })}
            // label={<FormattedMessage id="userregister.company.label" />}
          >
            {getFieldDecorator('organization_name', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'userregister.company.label.required',
                  }),
                },
              ],
            })(
              <Input
                placeholder={formatMessage({
                  id: 'userregister.company.placeholder',
                })}
                // placeholder="Enter Company Name"
              />,
            )}
          </FormItem>
          <FormItem
            label={formatMessage({
              id: 'userregister.email.label',
            })}
            // label={<FormattedMessage id="userregister.email.label" />}
          >
            {getFieldDecorator('email_address', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'userregister.email.required',
                  }),
                },
                // {
                //   validator: this.alreadyEmail,
                // },
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'userregister.email.wrong-format',
                  }),
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({
                  id: 'userregister.email.placeholder',
                })}
                // placeholder="Enter Email ID"
              />,
            )}
          </FormItem>
          <FormItem
            help={help}
            label={formatMessage({
              id: 'userregister.login.password',
            })}
            // label={<FormattedMessage id="userregister.login.password" />}
          >
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
                    <FormattedMessage id="userregister.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              // visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'userregister.password.required' }),
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({
                    id: 'userregister.password.placeholder',
                  })}
                  // placeholder="Enter Password"
                />,
              )}
            </Popover>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="userregister.register.register" />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="userregister.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserRegister);
