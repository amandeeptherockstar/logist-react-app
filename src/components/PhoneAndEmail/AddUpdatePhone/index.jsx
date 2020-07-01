import React, { useState } from 'react';
import { Modal, Button, message, Form, Row, Col, Checkbox } from 'antd';
import { connect } from 'dva';
import { decodeUSAPhoneToNormalString, formatPhoneNumber } from '@/utils/formatUsaPhone';
import { PhoneNumber } from '@/components/PhoneNumber';
import { phoneAlreadyExists } from '@/utils/utils';

const AddUpdatePhone = props => {
  const {
    setEditPhone,
    title,
    isOpen,
    form,
    fetchData,
    phone,
    extension,
    setAddPhone,
    workType,
    phones,
    countryCode,
  } = props;

  const [isPrimary, setIsPrimary] = useState(true);

  const makePrimary = ({ contactMechId }) => {
    const hide = message.loading('Making Phone Number Primary...', 0);
    props.dispatch({
      type: 'partyPoc/makePhonePrimary',
      payload: {
        partyId: props.partyId,
        mechId: contactMechId,
        cb: res => {
          setTimeout(hide, 0);
          if (res.responseMessage === 'success') {
            fetchData(true);
            message.success('Phone Number Made Primary');
          }
        },
      },
    });
  };

  const handleAddSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(['phone'], async (err, values) => {
      if (!err) {
        const unformattedPhone = decodeUSAPhoneToNormalString(values.phone.phone);
        const [countryCodeInNumberOnly] = values.phone.country_code.match(/\d+/g);
        const reqData = {
          // country_code: values.phone.country_code,
          country_code: countryCodeInNumberOnly,
          area_code: unformattedPhone.substring(0, 3),
          phone: unformattedPhone.substring(3),
          extension: values.phone.phone_extention ? values.phone.phone_extention : '',
        };

        if (
          phoneAlreadyExists({
            typedPhoneAndExtension: `${unformattedPhone}-${values.phone.phone_extention}`,
            phones,
          })
        ) {
          message.error('Phone Number already exists!');
        } else {
          await props.dispatch({
            type: 'vendors/addVendorPhone',
            payload: {
              reqData,
              partyId: props.partyId,
              callback: res => {
                if (res.responseMessage) {
                  message.success('Phone number added successfully!');
                }
                const addPhoneData = {
                  areaCode: res.phoneDetails.areaCode,
                  contactMechId: res.phoneDetails.contactMechId,
                  contactNumber: res.phoneDetails.contactNumber,
                  countryCode: res.phoneDetails.countryCode,
                  extension: res.phoneDetails.extension,
                  formattedPhoneNumberInUSFormat: res.phoneDetails.extension
                    ? `+${res.phoneDetails.countryCode} ${
                        res.phoneDetails.areaCode
                      }-${res.phoneDetails.contactNumber.substring(
                        0,
                        3,
                      )}-${res.phoneDetails.contactNumber.substring(3)}  ext. ${
                        res.phoneDetails.extension
                      }`
                    : `+${res.phoneDetails.countryCode} ${
                        res.phoneDetails.areaCode
                      }-${res.phoneDetails.contactNumber.substring(
                        0,
                        3,
                      )}-${res.phoneDetails.contactNumber.substring(3)}`,
                };
                if (isPrimary) {
                  makePrimary({ contactMechId: res.phoneDetails.contactMechId });
                  fetchData(addPhoneData, props.phoneId);
                } else {
                  fetchData(addPhoneData, props.phoneId);
                }
                setAddPhone(false);
              },
            },
          });
        }
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(['phone'], async (err, values) => {
      if (!err) {
        const unformattedPhone = decodeUSAPhoneToNormalString(values.phone.phone);
        if (unformattedPhone.toString() !== '' && unformattedPhone.toString().length < 10) {
          form.setFields({
            phone: {
              phone: {
                value: values.phone.phone,
                errors: [new Error('Phone must contain 10 digits atleast!')],
              },
            },
          });
          return;
        }
        const [countryCodeInNumberOnly] = values.phone.country_code.match(/\d+/g);
        const reqData = {
          // country_code: values.phone.country_code,
          country_code: countryCodeInNumberOnly,
          area_code: unformattedPhone.substring(0, 3),
          phone: unformattedPhone.substring(3),
          extension: values.phone.phone_extention ? values.phone.phone_extention : '',
        };
        // if (values.phone.phone_extension) {
        //   reqData.extension = values.phone.phone_extension;
        // }
        if (
          phoneAlreadyExists({
            typedPhoneAndExtension: `${unformattedPhone}-${values.phone.phone_extention}`,
            phones,
          })
        ) {
          message.error('Phone Number already exists!');
        } else {
          await props.dispatch({
            type: 'vendors/updateVendorPhone',
            payload: {
              reqData,
              partyId: props.partyId,
              phoneId: props.phoneId,
              callback: res => {
                if (res.responseMessage) {
                  message.success('Phone number updated successfully!');
                }
                const dataForState = {
                  areaCode: reqData.area_code,
                  contactMechId: res.contactMechId,
                  contactNumber: reqData.phone,
                  countryCode: reqData.country_code,
                  extension: reqData.extension,
                  formattedPhoneNumberInUSFormat: res.phoneDetails.extension
                    ? `+${res.phoneDetails.countryCode} ${
                        res.phoneDetails.areaCode
                      }-${res.phoneDetails.contactNumber.substring(
                        0,
                        3,
                      )}-${res.phoneDetails.contactNumber.substring(3)}  ext. ${
                        res.phoneDetails.extension
                      }`
                    : `+${res.phoneDetails.countryCode} ${
                        res.phoneDetails.areaCode
                      }-${res.phoneDetails.contactNumber.substring(
                        0,
                        3,
                      )}-${res.phoneDetails.contactNumber.substring(3)}`,
                };
                fetchData(dataForState, props.phoneId);
                setEditPhone(false);
              },
            },
          });
        }
      }
    });
  };

  return (
    <Modal
      title={title}
      visible={isOpen}
      destroyOnClose
      maskClosable={false}
      footer={
        workType === 'Add' ? (
          <div>
            <Row>
              <Col span={14} className="text-left">
                <Checkbox
                  id={`${workType}-phone-make-primary`}
                  checked={isPrimary}
                  onChange={() => setIsPrimary(prev => !prev)}
                >
                  Make Primary
                </Checkbox>
              </Col>
              <Col span={10}>
                <Button
                  id="Add-Phone"
                  loading={props.loadingAdd}
                  type="primary"
                  onClick={handleAddSubmit}
                >
                  Add Phone
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <>
            <Button
              id="Update-Phone"
              loading={props.loadingUpdate}
              type="primary"
              onClick={handleSubmit}
            >
              Update Phone
            </Button>
          </>
        )
      }
      onOk={() => {}}
      onCancel={() => {
        if (workType === 'Update') {
          setEditPhone(false);
        } else {
          setAddPhone(false);
        }
      }}
    >
      <PhoneNumber
        label
        autoFocus
        phoneRequired
        phone={formatPhoneNumber(phone)}
        phone_extension={extension}
        form={form}
        countryCode={countryCode}
      ></PhoneNumber>
    </Modal>
  );
};

const mapStateToProps = state => ({
  loadingUpdate: state.loading.effects['vendors/updateVendorPhone'],
  loadingAdd: state.loading.effects['vendors/addVendorPhone'],
});
export default Form.create()(connect(mapStateToProps, dispatch => ({ dispatch }))(AddUpdatePhone));
