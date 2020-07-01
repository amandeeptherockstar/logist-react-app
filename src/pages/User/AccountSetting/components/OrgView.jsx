/* eslint-disable no-template-curly-in-string */
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Upload,
  message,
  Skeleton,
  Avatar,
  Tabs,
  Icon,
  Spin,
  Popover,
  Switch,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component, useState, useRef } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import styles from './BaseView.less';
import { hostname } from '@/pages/hostUrl';
import OrgAttachments from './OrgComponents/OrgAttachments';

import { getFooterTextService, updateFooterTextService } from '../service';
import appConfig from '@/config/appConfig';
import OrgSettings from './OrgComponents/OrgSettings';
import { getAuthority } from '@/utils/authority';
import RoleAuthorization from '@/components/RoleAuthorization';

const { TabPane } = Tabs;

CKEditor.editorConfig = () => {
  // misc options
};

const FormItem = Form.Item;
const AvatarView = props => {
  const { currentUser, dispatch } = props;
  const [state, setState] = useState({ avatar: null, loading: false });
  const { org_party_id: orgPartyId } = props.currentUser.organization_details;

  const canvasRef = useRef(null);

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      // uploaded Image
      setState({ loading: true });
      return;
    }
    if (orgPartyId && info.file.status === 'done') {
      // validate image for size and dimensions
      const fileSize = info.file.size / 1024;
      setState({ loading: true });
      if (fileSize > 1024) {
        message.error('File is larger than 1 MB');
        setState({ loading: false });
        return;
      }

      const canvas = canvasRef.current;
      const img = new Image();
      const ctx = canvas.getContext('2d');
      img.onload = async () => {
        // clear the canvas for redrawing
        const ix = img.width;
        const iy = img.height;
        let cix;
        let ciy;
        let sx = 0;
        let sy = 0;

        if (ix <= iy) {
          sx = (ix - iy) / 2;
          ciy = iy;
          cix = iy;
        } else {
          sy = (iy - ix) / 2;
          ciy = ix;
          cix = ix;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, sx, sy, cix, ciy, 0, 0, 512, 512);

        // convert the canvas data to base64 string
        const dataUrl = canvas.toDataURL('image/png');
        const bytes =
          dataUrl.split(',')[0].indexOf('base64') >= 0
            ? atob(dataUrl.split(',')[1])
            : window.unescape(dataUrl.split(',')[1]);

        const max = bytes.length;
        const ia = new Uint8Array(max);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < max; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        // convert blob to file object
        const newImageFileFromCanvas = new File([ia], `image_${Date.now()}.png`, {
          type: 'image/png',
        });

        // make network request
        const data = new FormData();
        data.append('file', newImageFileFromCanvas);
        await axios.post(`${hostname()}/xapi/v1/party/${orgPartyId}/profileImage`, data, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data',
          },
        });
        setState({
          avatar: dataUrl,
          loading: false,
        });

        message.success(`${info.file.name} file uploaded successfully`);
        dispatch({
          type: 'userAccountSetting/getOrgLogo',
          payload: {
            partyId: orgPartyId,
          },
        });
      };
      const fileReader = new FileReader();
      fileReader.onload = () => {
        img.src = fileReader.result;
      };
      if (info.file.originFileObj) {
        fileReader.readAsDataURL(info.file.originFileObj);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  return (
    <div>
      <div className={[styles.avatar, 'mb-3', 'text-center'].join(' ')}>
        {state.avatar || props.avatar ? (
          <>
            {state.loading ? (
              <Spin spinning={state.loading}>
                <Skeleton />
              </Spin>
            ) : (
              <img
                height="150px"
                src={state.avatar || props.avatar}
                alt="avatar"
                className="rounded-full"
              />
            )}
          </>
        ) : (
          <>
            <Avatar size={104} icon="user">
              {currentUser.party_initials}
            </Avatar>
          </>
        )}
      </div>
      {/* use the canvas to resize the image but keep it hidden from the dom */}
      <canvas
        id="canvas"
        height="512"
        width="512"
        style={{ display: 'none' }}
        ref={canvasRef}
      ></canvas>
      <Upload
        onChange={onFileChangeHandler}
        multiple={false}
        showUploadList={false}
        accept=".png,.jpg,.jpeg"
      >
        <div className={styles.button_view}>
          <Button
            loading={state.loading || props.userAvatarLoading}
            shape={!state.loading && !props.userAvatarLoading && 'plus'}
          >
            {state.avatar || props.avatar ? (
              <FormattedMessage
                id="user-accountsetting.basic.change-logo"
                defaultMessage="Change Logo"
              />
            ) : (
              <FormattedMessage id="user-accountsetting.basic.add-logo" defaultMessage="Add Logo" />
            )}
          </Button>
        </div>
      </Upload>
    </div>
  );
};

@connect(
  ({ userAccountSetting, loading }) => ({
    currentUser: userAccountSetting.currentUser,
    orgLogo: userAccountSetting.orgLogo,
    userAvatarLoading: loading.effects['user/fetchCurrent'],
  }),
  dispatch => ({ dispatch }),
)
class OrgView extends Component {
  view = undefined;

  state = {
    orgLogo: '',
    loading: false,
    coverLetterMsg: '',
    updatedMessage: '',
    footerText: 'Loading...',
    replyToEmailAddress: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    if (this.props.currentUser.organization_details) {
      const { org_party_id: orgPartyId } = this.props.currentUser.organization_details;
      await this.props.dispatch({
        type: 'userAccountSetting/getOrgLogo',
        payload: {
          partyId: orgPartyId,
        },
      });
      if (this.props.orgLogo.length > 0) {
        this.setState({ orgLogo: this.props.orgLogo[0].publicResourceUrl });
      }

      this.setState({
        loading: false,
        replyToEmailAddress: this.props.currentUser.organization_details.allow_reply_to_alias,
      });
      this.setBaseInfo();
      const { currentUser, form } = this.props;
      form.setFieldsValue({
        organization_name: currentUser.organization_details.organization_name,
        duns: currentUser.organization_details.duns,
        cage: currentUser.organization_details.cage,
        accounts: currentUser.organization_details.account_number,
        quote_id: currentUser.organization_details.quote_id_prefix || 'CQ',
        invoice_id_prefix: currentUser.organization_details.invoice_id_prefix,
        order_id_prefix: currentUser.organization_details.order_id_prefix,
        allow_reply_to_alias: currentUser.organization_details.allow_reply_to_alias,
      });

      // get reply to address
      await this.props.dispatch({
        type: 'userAccountSetting/getReplyToAddress',
        payload: {
          partyId: orgPartyId,
        },
        cb: response => {
          if (response.replyToAddress) {
            form.setFieldsValue({
              reply_to_address: response.replyToAddress,
              cc_address: response.ccAddress,
              bcc_address: response.bccAddress,
            });
          }
        },
      });

      // get org cover letter msg
      await this.props.dispatch({
        type: 'userAccountSetting/getOrgPreferences',
        payload: {
          partyId: orgPartyId,
        },
        cb: response => {
          if (response.default_quote_email_message) {
            form.setFieldsValue({
              cover_letter_msg: response.default_quote_email_message,
            });
            this.setState({ coverLetterMsg: response.default_quote_email_message });
          }
        },
      });

      const footerText = await getFooterTextService({ orgId: orgPartyId });
      form.setFieldsValue({
        footerText: footerText.text,
      });
      if (footerText.text) {
        this.setState({
          footerText: footerText.text,
        });
      } else {
        this.setState({
          footerText: '',
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setBaseInfo();
    }
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};

        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  updateEmailSettings = () => {
    const { form } = this.props;
    const { org_party_id: orgPartyId } = this.props.currentUser.organization_details;
    const replyToAddress = form.getFieldValue('reply_to_address');
    const coverMessage = this.state.updatedMessage;
    if (replyToAddress === '') {
      message.error('Enter Default Reply To Address');
    }
    if (coverMessage === '' || this.state.coverLetterMsg === '') {
      message.error('Enter Cover Letter Message');
    }
    form.validateFields(async (err, values) => {
      this.props.dispatch({
        type: 'userAccountSetting/updateEmailAddressesForOrganization',
        payload: {
          reply_to_address: values.reply_to_address,
          cc_address: values.cc_address,
          bcc_address: values.bcc_address,
        },
      });
      this.setState({ loading: true });
      this.props
        .dispatch({
          type: 'userAccountSetting/updateOrgPreferences',
          payload: {
            partyId: orgPartyId,
            message: coverMessage,
          },
        })
        .then(() => {
          this.setState({ loading: false });
          message.success('Email Settings Updated');
        });
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = () => {
    const { form, currentUser } = this.props;
    const { org_party_id: orgPartyId } = this.props.currentUser.organization_details;
    form.validateFields(async (err, values) => {
      const dataForServer = {
        personal_details: {
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
          organization_details: {
            organization_name: values.organization_name,
            cage: values.cage,
            org_party_id: localStorage.getItem('organizationId'),
            duns: values.duns,
            quote_id_prefix: values.quote_id,
            account_number: values.accounts,
            invoice_id_prefix: values.invoice_id_prefix,
            order_id_prefix: values.order_id_prefix,
            allow_reply_to_alias: values.allow_reply_to_alias,
          },
        },
        primary_phone: {
          ...currentUser.primary_phone,
        },
      };
      if (!err) {
        this.setState({ loading: true });
        this.props.dispatch({
          type: 'userAccountSetting/updateOrganization',
          payload: dataForServer,
          callback: data => {
            form.setFieldsValue({
              organization_name: data.organization_name,
              duns: data.duns,
              cage: data.cage,
              accounts: data.account_number,
              quote_id: data.quote_id_prefix || 'CQ',
              invoice_id_prefix: data.invoice_id_prefix,
              order_id_prefix: data.order_id_prefix,
            });
          },
        });
        await updateFooterTextService({ footerText: this.state.footerText, orgId: orgPartyId });
        message.success(
          formatMessage({
            id: 'user-accountsetting.basic.update.success',
          }),
        );
        this.setState({ loading: false });
      }
    });
  };

  orgSettings = () => {
    if (getAuthority()[0] === 'ORG_ADMIN') {
      return (
        <TabPane
          tab={
            <span>
              <Icon type="tool" />
              Org settings
            </span>
          }
          key="4"
        >
          <OrgSettings />
        </TabPane>
      );
    }
    return null;
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
      dispatch,
    } = this.props;

    return (
      <div className="w-4/5" ref={this.getViewDom}>
        {this.props.currentUser.organization_details && (
          <div className={styles.left}>
            <Form onSubmit={this.handlerSubmit} hideRequiredMark>
              <FormItem>
                {currentUser.organization_details && (
                  <React.Fragment>
                    <div className="text-center">
                      {this.state.loading === true ? (
                        <Spin spinning={this.state.loading}>
                          <Skeleton />
                        </Spin>
                      ) : (
                        <AvatarView
                          dispatch={dispatch}
                          currentUser={currentUser}
                          avatar={this.state.orgLogo}
                        />
                      )}
                    </div>
                    <div className="pt-4 text-center text-xl">
                      <div className="text-gray-800 font-bold">
                        <Link
                          to={`/vendors/${this.props.currentUser.organization_details.org_party_id}/view/products`}
                        >
                          {currentUser.organization_details.organization_name}
                        </Link>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </FormItem>
              <Row gutter={24}>
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <Icon type="setting" />
                        Preferences
                      </span>
                    }
                    key="1"
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">
                                    <span className="text-red-600 text-base">* </span>Organization
                                  </span>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator('organization_name', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Believe it or not, organization name is mandatory',
                                },
                              ],
                            })(
                              <Input
                                size="large"
                                maxLength={100}
                                placeholder="Enter your organization"
                              />,
                            )}
                          </FormItem>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex-auto">
                                <span className="zcp-form-label">Bank Account Number </span>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'accounts',
                              {},
                            )(<Input size="large" placeholder="Enter your accounts" />)}
                          </FormItem>
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">Quote ID Prefix</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">Quote email reply mailbox</div>
                                          <div>
                                            Setting this email will ensure your customers have a
                                            means to respond to your quote packages. Usually
                                            something like quote-reply@yourcompany.com is a good
                                            starting point. You can always come back and change it
                                            later.
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'quote_id',
                              {},
                            )(<Input size="large" placeholder="Enter Quote Prefix" />)}
                          </FormItem>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">DUNS Code</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">
                                            Your company&apos;s DUNS code
                                          </div>
                                          <div>
                                            The DUNS number is a nine-digit number, issued by D&B,
                                            assigned to each business location in the D&B database,
                                            having a unique, separate, and distinct operation for
                                            the purpose of identifying them.
                                            <div className="pt-2">
                                              <a
                                                href="https://en.wikipedia.org/wiki/Data_Universal_Numbering_System"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600"
                                              >
                                                Learn more
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'duns',
                              {},
                            )(<Input size="large" placeholder="Enter duns" />)}
                          </FormItem>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">Order Id Prefix</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">
                                            Your company&apos;s Quote Order Prefix
                                          </div>
                                          <div>
                                            This will relect as the prefix to your Quote Order Id
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'order_id_prefix',
                              {},
                            )(<Input size="large" placeholder="Enter Order Id Prefix" />)}
                          </FormItem>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">Invoice Id Prefix</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">Quote Invoice Prefix</div>
                                          <div>
                                            This will relect as the prefix to your Invoice Id
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'invoice_id_prefix',
                              {},
                            )(<Input size="large" placeholder="Enter Invoice Id Prefix" />)}
                          </FormItem>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={getAuthority()[0] === 'ORG_ADMIN' ? 12 : 24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">Cage Code</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">
                                            Your company&apos;s CAGE code (If any)
                                          </div>
                                          <div>
                                            The Commercial and Government Entity Code, or CAGE Code,
                                            is a unique identifier assigned to suppliers to various
                                            government or defense agencies, as well as to government
                                            agencies themselves and various organizations.
                                            <div className="pt-2">
                                              <a
                                                href="https://en.wikipedia.org/wiki/Commercial_and_Government_Entity_code"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600"
                                              >
                                                Learn more
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'cage',
                              {},
                            )(<Input size="large" placeholder="Enter cage number" />)}
                          </FormItem>
                        </div>
                      </Col>

                      <Col span={12}>
                        <RoleAuthorization authority={['ORG_ADMIN']}>
                          <div className="zcp-ant-form-label-w-full">
                            <FormItem
                              label={
                                <div className="flex justify-between">
                                  <div className="flex-auto">
                                    <span className="zcp-form-label">
                                      Allow individual reply to addresses
                                    </span>
                                  </div>
                                  <div className="flex-none">
                                    <Popover
                                      content={
                                        <div className="max-w-sm flex">
                                          <div className="w-20 p-2">
                                            <Icon
                                              type="bulb"
                                              theme="twoTone"
                                              className="text-2xl"
                                            />
                                          </div>
                                          <div className="flex-auto">
                                            <div className="font-bold">
                                              Allow individual reply-to addresses
                                            </div>
                                            <div>
                                              Use this setting to set a reply to email address of
                                              the org employees
                                              <div className="pt-2">
                                                <a
                                                  href="https://en.wikipedia.org/wiki/Commercial_and_Government_Entity_code"
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600"
                                                >
                                                  Learn more
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      }
                                    >
                                      <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                    </Popover>
                                  </div>
                                </div>
                              }
                              colon={false}
                            >
                              {getFieldDecorator('allow_reply_to_alias', {
                                initialValue:
                                  currentUser &&
                                  currentUser.organization_details.allow_reply_to_alias,
                              })(
                                <Switch
                                  checked={this.state.replyToEmailAddress}
                                  onChange={e => {
                                    this.setState({
                                      replyToEmailAddress: e,
                                    });
                                  }}
                                />,
                              )}
                            </FormItem>
                          </div>
                        </RoleAuthorization>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">Quote PDF Disclaimer</span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">Disclaimer message</div>
                                          <div>
                                            Use this setting to set a global company wide dislcaimer
                                            message that will be shown at the bottom of the quote
                                            pdf.
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'footerText',
                              {},
                            )(
                              <CKEditor
                                editor={DecoupledEditor}
                                placeholder="Enter the Footer Text"
                                config={appConfig.editor.toolbarType.restrictedMode}
                                data={this.state.footerText}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  this.setState({ footerText: data });
                                }}
                                onInit={editor => {
                                  // Insert the toolbar before the editable area.
                                  editor.ui
                                    .getEditableElement()
                                    .parentElement.insertBefore(
                                      editor.ui.view.toolbar.element,
                                      editor.ui.getEditableElement(),
                                    );
                                }}
                              />,
                            )}
                          </FormItem>
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-2">
                      <Button type="primary" onClick={e => this.handlerSubmit(e)} block>
                        <Icon type={this.state.loading ? 'loading' : ''}></Icon>
                        Update Preferences
                      </Button>
                    </div>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="mail" />
                        Email Settings
                      </span>
                    }
                    key="2"
                  >
                    <Row gutter={24}>
                      <Col span={24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex-auto">
                                <span className="zcp-form-label">Reply To Email Address</span>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'reply_to_address',
                              {},
                            )(
                              <Input
                                size="large"
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter default reply to address"
                              />,
                            )}
                            <div className="text-xs text-gray-500 leading-tight bg-blue-100 text-blue-700 p-1">
                              <Icon type="info-circle" /> Your quote package recipients can reply to
                              this address.
                            </div>
                          </FormItem>
                        </div>
                      </Col>{' '}
                      <Col span={24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex-auto">
                                <span className="zcp-form-label">Default Email Cc Address</span>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'cc_address',
                              {},
                            )(
                              <Input
                                size="large"
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter default CC address"
                              />,
                            )}
                          </FormItem>
                        </div>
                      </Col>{' '}
                      <Col span={24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex-auto">
                                <span className="zcp-form-label">Default Email Bcc Address</span>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator('bcc_address')(
                              <Input
                                size="large"
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter default reply BCC address"
                              />,
                            )}
                          </FormItem>
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="zcp-ant-form-label-w-full">
                          <FormItem
                            label={
                              <div className="flex justify-between">
                                <div className="flex-auto">
                                  <span className="zcp-form-label">
                                    Default quote package email message
                                  </span>
                                </div>
                                <div className="flex-none">
                                  <Popover
                                    content={
                                      <div className="max-w-sm flex">
                                        <div className="w-20 p-2">
                                          <Icon type="bulb" theme="twoTone" className="text-2xl" />
                                        </div>
                                        <div className="flex-auto">
                                          <div className="font-bold">Default email message</div>
                                          <div>
                                            Use this setting to set a global company wide default
                                            cover letter message. You can always change it later.
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="text-blue-600 text-sm">What&apos;s this?</div>
                                  </Popover>
                                </div>
                              </div>
                            }
                            colon={false}
                          >
                            {getFieldDecorator(
                              'cover_letter_msg',
                              {},
                            )(
                              <CKEditor
                                editor={DecoupledEditor}
                                placeholder="Enter the cover message"
                                config={appConfig.editor.toolbarType.email}
                                data={this.state.coverLetterMsg}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  this.setState({ updatedMessage: data });
                                }}
                                onInit={editor => {
                                  // Insert the toolbar before the editable area.
                                  editor.ui
                                    .getEditableElement()
                                    .parentElement.insertBefore(
                                      editor.ui.view.toolbar.element,
                                      editor.ui.getEditableElement(),
                                    );
                                }}
                              />,
                            )}
                            <div className="text-xs text-gray-500 leading-tight bg-blue-100 text-blue-700 p-1 flex">
                              <div>
                                <Icon type="info-circle" />
                              </div>
                              <div className="pl-1 flex-auto">
                                The snippet <strong>{'${quoteId}'}</strong> will be replaced by
                                generated quote id for a quote.
                              </div>
                            </div>
                          </FormItem>
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-2">
                      <Button
                        loading={this.state.loading}
                        type="primary"
                        onClick={() => this.updateEmailSettings()}
                        block
                      >
                        Update Email Settings
                      </Button>
                    </div>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="paper-clip" />
                        Default Attachments
                      </span>
                    }
                    key="3"
                  >
                    {currentUser.organization_details.org_party_id ? (
                      <OrgAttachments vendorId={currentUser.organization_details.org_party_id} />
                    ) : (
                      <div />
                    )}
                  </TabPane>
                  {this.orgSettings()}
                </Tabs>
              </Row>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

export default Form.create()(OrgView);
