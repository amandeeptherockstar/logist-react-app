import React, { useState } from 'react';
import { Modal, Row, Icon, Drawer, Form, List, Col, Button, Spin } from 'antd';
import { connect } from 'dva';
import SingleAddress from '../Address/Single Address';
import Address from '../Address';
import { uncapitalizeFirstLetter } from '@/utils/utils';
import noAddressEmptyStateSvg from '@/assets/img/empty-states/shipping.svg';
import SkipQuoteSetupHeader from '../SkipQuoteSetupHeader';

const BrowsePartyAddresses = ({
  visible,
  setVisible,
  party,
  partyType,
  type,
  typeText,
  form,
  dispatch,
  onSelectAddress,
  loading,
  quoteId,
  loadingAddress,
}) => {
  const [addAddressDrawerVisible, setAddAddressDrawerVisible] = useState(false);
  const addAddress = (values, cb) => {
    const dynamicProp = typeText.toLowerCase();
    const dataForServer = {
      to_name: values[`${dynamicProp}To`] || '',
      attn_name: values[`${dynamicProp}Attn`] || '',
      address_line_1: values[`${dynamicProp}AddressLine1`],
      address_line_2: values[`${dynamicProp}AddressLine2`] || '',
      city: values[`${dynamicProp}City`],
      state_code: values[`${dynamicProp}StateCode`].split(' ')[0],
      country_code: values[`${dynamicProp}CountryCode`].split(' ')[0],
      postal_code: values[`${dynamicProp}PostalCode`],
      // directions: '',
      address_purposes: [type].join(','),
    };
    dispatch({
      type: 'quoteDetails/addPartyAddress',
      payload: {
        partyId: party.id,
        contactMechPurposeTypeId: type,
        data: dataForServer,
        type: partyType,
        cb: id => {
          if (cb) cb(id);
          form.resetFields();
          setAddAddressDrawerVisible(false);
          setVisible(false);
        },
      },
    });
  };

  const typeOfContactMechId = ['SHIPPING_LOCATION', 'PRIMARY_LOCATION'];
  const partyName = partyType === 'Supplier' ? 'Vendor' : partyType;
  const modalTitle =
    partyType === 'Supplier' ? 'Select Ship From Address' : 'Select Ship To Address';
  const addressCount = party && party.address ? party.address.length : 0;

  return (
    <div>
      <Modal
        title={
          <Row type="flex" justify="space-between">
            <Col>{modalTitle}</Col>
            <Col style={{ marginRight: '20px' }}>
              <SkipQuoteSetupHeader dispatch={dispatch} />
              <span
                className="primary-color cursor-pointer text-sm"
                id={`new-address-modal-${partyType}`}
                onClick={() => setAddAddressDrawerVisible(true)}
              >
                <Icon type="plus-circle" /> Add New
              </span>
            </Col>
          </Row>
        }
        onCancel={() => {
          // setVisible(0);
          setVisible(false);
        }}
        destroyOnClose
        visible={visible}
        footer={null}
        maskClosable={false}
      >
        <div>
          {addressCount === 0 ? (
            <>
              {/* Empty state, no address exists */}
              <div className="text-center">
                <p className="text-lg">
                  What&apos;s a good <strong>ship to</strong> address for the {partyName}?
                </p>
                <img src={noAddressEmptyStateSvg} alt="No address" style={{ height: '150px' }} />
                <div className="pt-2">
                  <p className="text-base mb-4">
                    We&apos;ll show this information on the quote PDF as customer&apos;s ship to
                    address!
                  </p>
                  <Button type="primary" onClick={() => setAddAddressDrawerVisible(true)}>
                    Let&apos;s add a shipping address <Icon type="arrow-right" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
              spinning={loadingAddress}
            >
              <List
                size="small"
                bordered
                style={{ maxHeight: 300, overflowX: 'hidden', overflowY: 'auto' }}
                dataSource={
                  party && partyName === 'Vendor'
                    ? party.shipping_address
                    : party.address.filter(address =>
                        typeOfContactMechId.includes(address.contact_mech_purpose_type_id),
                      )
                }
                renderItem={address => (
                  <List.Item
                    onClick={() => {
                      onSelectAddress({
                        addressId: address.id,
                        partyId: party.id,
                        addressType: typeText.toLowerCase(),
                        partyType: partyType.toLowerCase(),
                      });
                    }}
                  >
                    <Col span={24}>
                      <a>
                        {' '}
                        <SingleAddress
                          addressType={address.contact_mech_purpose_type_id}
                          address={address}
                          // qId="123"
                        />
                      </a>
                    </Col>
                  </List.Item>
                )}
              />
            </Spin>
          )}
        </div>
        <Drawer
          className="sidebar"
          title="Add New Shipping Address"
          onClose={() => setAddAddressDrawerVisible(false)}
          width="40%"
          destroyOnClose
          maskClosable={false}
          visible={addAddressDrawerVisible}
          keyboard={false}
        >
          <div style={{ margin: '20px', marginTop: '60px' }}>
            <Form>
              <Address
                showToAndAttn
                addressRequired
                partyType={partyType}
                addressType={typeText}
                type={uncapitalizeFirstLetter(typeText)}
                form={form}
                submit
                loading={loading}
                isModal
                onAddAddress={addAddress}
                qId={quoteId}
                afterSubmit={addressid => {
                  onSelectAddress({
                    addressId: addressid,
                    partyId: party.id,
                    addressType: typeText.toLowerCase(),
                    partyType: partyType.toLowerCase(),
                  });
                }}
              />
            </Form>
          </div>
        </Drawer>
      </Modal>
    </div>
  );
};

const mapstateToProps = ({ loading }) => ({
  loading: loading.effects['quoteDetails/addPartyAddress'],
});

export default connect(mapstateToProps, dispatch => ({ dispatch }))(
  Form.create()(BrowsePartyAddresses),
);
