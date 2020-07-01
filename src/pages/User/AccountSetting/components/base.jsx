import { Button, Form, Input, Upload, message, Avatar, Row, Col, Spin, Skeleton } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-locale';
import React, { Component, Fragment, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'dva';
import styles from './BaseView.less';
import { hostname } from '@/pages/hostUrl';
import { getTeleCodes } from '@/services/CommonTransactions/teleCodes';
import { decodeUSAPhoneToNormalString, formatPhoneNumber } from '@/utils/formatUsaPhone';
import { PhoneNumber } from '@/components/PhoneNumber';

const FormItem = Form.Item;

const AvatarView = props => {
  const { currentUser, dispatch } = props;
  const [state, setState] = useState({ avatar: null });

  const canvasRef = useRef(null);

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // validate the image size and resolution
      // setIsAvatarUploading(false);
      setState({ loading: true });
      const fileSize = info.file.size / 1024;
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
        // // convert blob to file object
        const newImageFileFromCanvas = new File([ia], `image_${Date.now()}.png`, {
          type: 'image/png',
        });

        // make network request
        const data = new FormData();
        data.append('file', newImageFileFromCanvas);
        await axios.post(`${hostname()}/xapi/v1/party/${currentUser.id}/profileImage`, data, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            // 'content-type': 'application/x-www-form-urlencoded',
            'Content-Type': 'multipart/form-data',
          },
        });
        setState({
          avatar: dataUrl,
          loading: false,
        });
        message.success(`${info.file.name} file uploaded successfully`);
        dispatch({
          type: 'user/fetchCurrent',
          payload: {
            authenticationToken: localStorage.getItem('accessToken'),
            partyId: currentUser.userid,
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
    <Fragment>
      <div className="text-base font-semibold mb-2 text-center">
        <FormattedMessage id="user-accountsetting.basic.avatar" defaultMessage="Avatar" />
        <div className="font-normal text-sm m-0 p-0">
          PNG, JPG will be automatically resized to maximum of 300px by 300px
        </div>
      </div>

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
            shape={state.loading || props.userAvatarLoading ? 'loading' : 'plus'}
          >
            {state.avatar || props.avatar ? (
              <FormattedMessage
                id="user-accountsetting.basic.change-avatar"
                defaultMessage="Change avatar"
              />
            ) : (
              <FormattedMessage
                id="user-accountsetting.basic.add-avatar"
                defaultMessage="Add avatar"
              />
            )}
          </Button>
        </div>
      </Upload>
    </Fragment>
  );
};

@connect(
  ({ userAccountSetting, loading }) => ({
    currentUser: userAccountSetting.currentUser,
    currentUserMetaData: userAccountSetting.currentUserMetaData,
    userAvatarLoading: loading.effects['user/fetchCurrent'],
  }),
  dispatch => ({ dispatch }),
)
class BaseView extends Component {
  view = undefined;

  state = {
    loadingState: false,
    telephoneCountryList: [],
    phone: '',
  };

  componentDidMount() {
    this.setBaseInfo();
    getTeleCodes()
      .then(response => {
        const telephoneCodeList = response.data
          .filter(element => element.teleCode !== null)
          .sort((a, b) => (a.countryCode > b.countryCode ? 1 : -1));

        this.setState({
          telephoneCountryList: telephoneCodeList,
        });
      })
      .catch(() => {});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setBaseInfo();
    }
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      this.setState({
        phone: formatPhoneNumber(
          currentUser.primary_phone &&
            currentUser.primary_phone.area_code + currentUser.primary_phone.phone,
        ),
      });
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        if (key === 'phone') {
          // Implement me
          obj[`${key}.phone`] =
            currentUser.primary_phone && currentUser.primary_phone.phone
              ? formatPhoneNumber(
                  currentUser.primary_phone &&
                    currentUser.primary_phone.area_code + currentUser.primary_phone.phone,
                )
              : '';
          obj[`${key}.phone_extention`] =
            currentUser.primary_phone && currentUser.primary_phone.extension;
        }
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar_url) {
        return currentUser.avatar_url;
      }
    }

    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loadingState: true });
        const { teleCode } = this.state.telephoneCountryList.find(
          teleCountry => teleCountry.countryName === values.phone.country_code,
        );
        const unformattedPhone = decodeUSAPhoneToNormalString(values.phone.phone);
        const data = {
          personal_details: {
            first_name: values.first_name,
            last_name: values.last_name,
            primary_phone: {
              id: this.props.currentUser.primary_phone.id,
              country_code: teleCode,
              area_code: unformattedPhone.substring(0, 3),
              phone: unformattedPhone.substring(3),
              extension: values.phone.phone_extention,
              phone_purposes: ['PRIMARY_PHONE'],
            },
            company_designation: values.company_designation,
            organization_details: {
              ...this.props.currentUser.organization_details,
            },
          },
        };
        this.props
          .dispatch({
            type: 'userAccountSetting/updateUserProfileInfo',
            payload: data,
          })
          .then(() => {
            this.setState({ loadingState: false });
            message.success(
              formatMessage({
                id: 'user-accountsetting.basic.update.success',
              }),
            );
            this.props.dispatch({
              type: 'user/fetchCurrent',
              payload: {
                authenticationToken: localStorage.getItem('accessToken'),
                partyId: this.props.currentUser.userid,
              },
            });
          });
      }
    });
  };

  render() {
    const { form } = this.props;

    const {
      form: { getFieldDecorator },
      currentUser,
      currentUserMetaData,
      dispatch,
    } = this.props;

    return (
      <div className="mt-6">
        <div className="flex justify-between">
          <div className="py-2">
            <div className="zcp-form-label">Account Email</div>
            <div className="text-gray-800 text-lg font-semibold">{currentUser.primary_email}</div>
          </div>
          <div className="pt-4 text-right">
            <div className="zcp-form-label">Org Account Id</div>
            <div className="text-gray-800 text-lg font-semibold">
              {currentUserMetaData.tenant_id}
            </div>
          </div>
        </div>
        <div className={styles.baseView} ref={this.getViewDom}>
          <div className={styles.left}>
            <Form layout="vertical" onSubmit={this.handlerSubmit} hideRequiredMark>
              <div className="zcp-ant-form-label-w-full">
                <FormItem
                  label={
                    <div className="flex-auto">
                      <span className="zcp-form-label">
                        <span className="text-red-600 text-base">* </span>First Name
                      </span>
                    </div>
                  }
                  colon={false}
                >
                  {getFieldDecorator('first_name', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage(
                          {
                            id: 'user-accountsetting.basic.firstName-message',
                          },
                          {},
                        ),
                      },
                    ],
                  })(<Input size="large" placeholder="Enter your first name" />)}
                </FormItem>
              </div>
              <div className="zcp-ant-form-label-w-full">
                <FormItem
                  label={
                    <div className="flex-auto">
                      <span className="zcp-form-label">
                        <span className="text-red-600 text-base">* </span>Last Name
                      </span>
                    </div>
                  }
                  colon={false}
                >
                  {getFieldDecorator('last_name', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'user-accountsetting.basic.lastName-message',
                        }),
                      },
                    ],
                  })(<Input size="large" placeholder="Enter your last name" />)}
                </FormItem>
              </div>
              <Row gutter={8}>
                <Col span={24}>
                  <Col span={24}>
                    <div className="zcp-ant-form-label-w-full">
                      <div className="flex-auto">
                        <span className="zcp-form-label"> Phone</span>
                      </div>
                      <PhoneNumber
                        phone={this.state.phone}
                        autoFocus={false}
                        label={false}
                        form={form}
                        styles={styles}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="zcp-ant-form-label-w-full">
                      <FormItem
                        label={
                          <div className="flex-auto">
                            <span className="zcp-form-label">Title / Designation</span>
                          </div>
                        }
                        colon={false}
                      >
                        {getFieldDecorator(
                          'company_designation',
                          {},
                        )(<Input size="large" placeholder="Your Title / Designation" />)}
                      </FormItem>
                    </div>
                  </Col>
                </Col>
              </Row>
              <Button
                loading={this.state.loadingState}
                type="primary"
                onClick={this.handlerSubmit}
                block
              >
                Update Details
              </Button>
            </Form>
          </div>
          <div className={styles.right}>
            <div className="flex flex-col items-center">
              <AvatarView
                dispatch={dispatch}
                currentUser={currentUser}
                avatar={currentUser.avatar_url}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
