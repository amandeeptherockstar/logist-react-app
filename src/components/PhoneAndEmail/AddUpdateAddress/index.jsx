import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, message, Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './styles.less';
import Address from '@/components/Address';

const AddUpdateAddress = props => {
  const {
    form,
    isOpen,
    address,
    type,
    title,
    setAddAddress,
    setEditAddress,
    fetchData,
    displayUseAsPrimaryAddress = true,
  } = props;
  const [addressPurpose, setaddressPurpose] = useState('PRIMARY_LOCATION');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setaddressPurpose(address.contact_mech_purpose_type_id);
    }
  }, [address]);

  useEffect(() => {
    if (displayUseAsPrimaryAddress) {
      setaddressPurpose('PRIMARY_LOCATION');
    } else {
      setaddressPurpose('SHIPPING_LOCATION');
    }
  }, [displayUseAsPrimaryAddress]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const stateCode = values.updateStateCode && values.updateStateCode.split(' ');
        const countryCode = values.updateCountryCode && values.updateCountryCode.split(' ');
        const reqData = {
          to_name: values.updateTo ? values.updateTo : '',
          attn_name: values.updateAttn ? values.updateAttn : '',
          address_line_1: values.updateAddressLine1 ? values.updateAddressLine1 : '',
          address_line_2: values.updateAddressLine2 ? values.updateAddressLine2 : '',
          city: values.updateCity ? values.updateCity : '',
          state_code: stateCode ? stateCode[0] : '',
          country_code: countryCode ? countryCode[0] : '',
          postal_code: values.updatePostalCode ? values.updatePostalCode : '',
          directions: values.updateDirections ? values.updateDirections : '',
          address_purposes: addressPurpose,
        };
        setLoading(true);

        await props.dispatch({
          type: 'partyPoc/updatePartyAddress',
          payload: {
            reqData,
            partyId: props.partyId,
            addressId: address.id,
            callback: res => {
              if (res.responseMessage) {
                message.success('Address updated successfully!');
                setLoading(false);
                setEditAddress(false);
              }
            },
          },
        });
        fetchData();
      }
    });
  };

  const handleAddSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const stateCode = values.addStateCode && values.addStateCode.split(' ');
        const countryCode = values.addCountryCode && values.addCountryCode.split(' ');
        const reqData = {
          to_name: values.addTo ? values.addTo : '',
          attn_name: values.addAttn ? values.addAttn : '',
          address_line_1: values.addAddressLine1 ? values.addAddressLine1 : '',
          address_line_2: values.addAddressLine2 ? values.addAddressLine2 : '',
          city: values.addCity ? values.addCity : '',
          state_code: stateCode ? stateCode[0] : '',
          country_code: countryCode ? countryCode[0] : '',
          postal_code: values.addPostalCode ? values.addPostalCode : '',
          directions: values.addDirections ? values.addDirections : '',
          address_purposes: addressPurpose,
        };
        setLoading(true);

        await props.dispatch({
          type: 'partyPoc/addPartyAddress',
          payload: {
            reqData,
            partyId: props.partyId,
            callback: res => {
              if (res.id) {
                message.success('New address added successfully!');
                setLoading(false);
                setAddAddress(false);
              }
            },
          },
        });
        fetchData();
      }
    });
  };

  return (
    <>
      <Modal
        width="640px"
        title={title}
        visible={isOpen}
        destroyOnClose
        maskClosable={false}
        footer={
          <Row type="flex" justify="space-between">
            <Col>
              <Radio.Group
                onChange={e => {
                  setaddressPurpose(e.target.value);
                }}
                value={addressPurpose}
              >
                {displayUseAsPrimaryAddress && (
                  <Radio value="PRIMARY_LOCATION">Use as Primary Address</Radio>
                )}
                <Radio value="SHIPPING_LOCATION">Use as Shipping Address</Radio>
              </Radio.Group>
            </Col>
            <Col>
              {type === 'update' ? (
                <Button id="Update-Address" loading={loading} type="primary" onClick={handleSubmit}>
                  Update Address
                </Button>
              ) : (
                <Button id="Add-Address" loading={loading} type="primary" onClick={handleAddSubmit}>
                  Add Address
                </Button>
              )}
            </Col>
          </Row>
        }
        onCancel={e => {
          e.stopPropagation();

          if (type === 'update') {
            setEditAddress(false);
          } else {
            setAddAddress(false);
          }
        }}
      >
        <Address
          addressRequired
          addressType="employee"
          address={address}
          type={type}
          styles={styles}
          form={form}
          required
        />
      </Modal>
    </>
  );
};

const mapStateToProps = state => ({
  countries: state.countriesList.countries,
});

export default Form.create()(
  connect(mapStateToProps, dispatch => ({ dispatch }))(AddUpdateAddress),
);
