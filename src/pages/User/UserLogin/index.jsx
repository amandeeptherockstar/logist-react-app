import { Row, Col, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

const exclamationSvg = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-8 h-8"
  >
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
  </svg>
);
const securitySvg = () => (
  <svg x="0px" y="0px" width="32" height="32" viewBox="0 0 172 172" style={{ fill: '#000000' }}>
    <g
      fill="none"
      fillRule="nonzero"
      stroke="none"
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeDasharray=""
      strokeDashoffset="0"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
      style={{ mixBlendMode: 'normal' }}
    >
      <path d="M0,172v-172h172v172z" fill="none"></path>
      <g>
        <path
          d="M86,151.84375c33.325,-19.75313 53.75,-54.95938 53.75,-94.19687v-20.29063l-53.75,-19.8875l-53.75,19.8875v20.29062c0,39.2375 20.425,74.44375 53.75,94.19688"
          fill="#ffffff"
        ></path>
        <path
          d="M86,155.875c-0.67187,0 -1.47813,-0.13438 -2.01562,-0.5375c-34.9375,-20.69375 -55.76562,-57.24375 -55.76562,-97.69063v-20.29062c0,-1.74688 1.075,-3.225 2.6875,-3.7625l53.75,-19.8875c0.94062,-0.26875 1.88125,-0.26875 2.82187,0l53.61563,19.8875c1.6125,0.5375 2.6875,2.15 2.6875,3.7625v20.29062c0,40.44688 -20.82812,76.99687 -55.76562,97.69063c-0.5375,0.40312 -1.34375,0.5375 -2.01562,0.5375zM36.28125,40.17813v17.46875c0,36.81875 18.54375,70.00938 49.71875,89.49375c31.175,-19.35 49.71875,-52.675 49.71875,-89.49375v-17.46875l-49.71875,-18.40938z"
          fill="#744210"
        ></path>
        <path
          d="M86,136.525c-0.80625,0 -1.74688,-0.26875 -2.41875,-0.80625c-21.36562,-15.72187 -34.9375,-38.96875 -38.43125,-65.17187c-0.26875,-2.15 1.20938,-4.16563 3.49375,-4.56875c2.15,-0.26875 4.16562,1.20937 4.56875,3.49375c3.09063,22.97813 14.64688,43.40313 32.7875,57.78125c21.36563,-16.93125 33.59375,-42.19375 33.59375,-69.74062v-6.18125l-33.59375,-12.3625l-36.28125,13.4375c-2.15,0.80625 -4.43437,-0.26875 -5.24063,-2.41875c-0.80625,-2.15 0.26875,-4.43437 2.41875,-5.24063l37.75938,-13.84063c0.94062,-0.26875 1.88125,-0.26875 2.82187,0l37.625,13.975c1.6125,0.5375 2.6875,2.15 2.6875,3.7625v9.00313c0,31.175 -14.24375,59.6625 -39.2375,78.07188c-0.80625,0.5375 -1.74688,0.80625 -2.55312,0.80625z"
          fill="#ECC94B"
        ></path>
        <g fill="#faca00">
          <path d="M86,34.66875v97.825c23.78437,-17.60313 37.625,-44.88125 37.625,-74.84688v-9.00313z"></path>
        </g>
      </g>
    </g>
  </svg>
);
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class UserLogin extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    // autoLogin: true,
    errorMessage: false,
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    const apiToken = btoa(`${values.userName}:${values.password}`);
    localStorage.setItem('apiToken', apiToken);
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          apiToken,
          type,
          cb: () => localStorage.setItem('antd-pro-authority', JSON.stringify(['ORG_EMPLOYEE'])),
        },
      });
    }
  };

  handleError = () => {
    const { message, description } = this.props.login.domError;
    // const template = <Alert message={message} description={description} type="error" showIcon />;
    const template = (
      <div className="w-full">
        <div
          className="flex rounded bg-red-100 p-4 shadow mb-4"
          style={{ backgroundColor: '#fce8e6 !important' }}
        >
          <div className="mr-2 p-1 text-red-700">
            <Icon component={exclamationSvg} />
          </div>
          <div className="flex-auto">
            <div className="font-semibold text-lg text-red-800">{message}</div>
            <div className="text-sm text-gray-700 font-medium">{description}</div>
          </div>
        </div>
      </div>
    );
    return template;
  };

  render() {
    const { login, submitting, location } = this.props;
    const { status, type: loginType } = login;
    const { type } = this.state;
    const { domError } = this.props.login;
    if (domError && !this.state.errorMessage) {
      this.setState({
        errorMessage: true,
      });
    }

    return (
      <Fragment>
        <div className={styles.main}>
          <LoginComponents
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Tab key="account" tab=" ">
              <div className="text-center pb-4">
                <p className={styles.headerTitle}>Welcome back!</p>
                <div className="text-sm text-gray-600">Enter your email address and password.</div>
              </div>
              {this.props.location.query.lgtrsn === 'inactive' && !this.state.errorMessage ? (
                <>
                  <div className="flex rounded bg-yellow-100 p-4 shadow mb-4 border-yellow-600 border-t-2">
                    <div className="mr-2 p-1">
                      <Icon component={securitySvg} />
                    </div>
                    <div className="flex-auto">
                      <div className="font-medium text-yellow-800">
                        You have been logged out due to inactivity!
                      </div>
                      <div className="text-sm">Please sign in again to continue.</div>
                    </div>
                  </div>
                </>
              ) : null}
              <div className={styles.error}>
                {this.state.errorMessage ? this.handleError() : null}
              </div>
              {status === 'error' &&
                loginType === 'account' &&
                !submitting &&
                this.renderMessage(
                  formatMessage({
                    id: 'userlogin.login.message-invalid-credentials',
                  }),
                )}
              <Row>
                <Col>
                  <span className="pl-1 zcp-form-label">Email Address</span>
                  <UserName
                    name="userName"
                    placeholder="john.doe@example.com"
                    initialusernamevalue={location.state ? location.state.email : null}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'userlogin.email.required',
                        }),
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="flex">
                    <div className="pl-1 zcp-form-label">
                      <FormattedMessage id="userlogin.login.password" />{' '}
                    </div>
                    <div className="text-right flex-auto">
                      <a
                        tabIndex="-1"
                        href="/user/forgot"
                        className="zcp-form-label text-blue-700 normal-case pr-1"
                        title="Click to recover your password"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <Password
                    name="password"
                    placeholder="********"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: 'userlogin.password.required',
                        }),
                      },
                    ]}
                    onPressEnter={e => {
                      e.preventDefault();
                      this.loginForm.validateFields(this.handleSubmit);
                    }}
                  />
                </Col>
              </Row>
            </Tab>
            <Submit loading={submitting}>
              <FormattedMessage id="userlogin.login.login" />
            </Submit>
            <div>
              <p className="text-center text-base text-gray-500 font-semibold">
                Don&apos;t have an account?{' '}
                <a
                  href="https://zeus.fidelissd.com/get-started"
                  target="_blank"
                  className="text-blue-700 visited:text-blue-800 font-semibold hover:underline"
                  rel="noopener noreferrer"
                >
                  Start for free <Icon type="arrow-right" />
                </a>
              </p>
            </div>
          </LoginComponents>
        </div>
      </Fragment>
    );
  }
}

export default UserLogin;
