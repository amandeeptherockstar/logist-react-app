import React, { useState } from 'react';
import { Typography, Icon, Modal, Form, Popconfirm, message, Row, Col } from 'antd';
import { connect } from 'dva';
import Address from '@/components/Address';

const { Text } = Typography;

function SingleAddress(props) {
  const [addressLoadingState, setAddressLoadingState] = useState(false);
  const [editQuoteAddressModal, setEditQuoteAddressModal] = useState(false);
  const [premountedAddress, setPremontedAddress] = useState(props.address);
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const { address, form, types } = props;
  const editAddressHandler = () => {
    let dynamicKey = null;
    const clickedObj = {
      contactMechPurposeTypeId: address.contact_mech_purpose_type_id,
      contactMechId: address.id,
      operationType: 'update',
    };
    if (props.partyType === 'Customer') {
      clickedObj.type = 'Customer';
      dynamicKey =
        address.contact_mech_purpose_type_id === 'SHIPPING_LOCATION' ||
        address.contact_mech_purpose_type_id === 'PRIMARY_LOCATION'
          ? 'shipping'
          : 'billing';
      clickedObj.customerPartyId = props.addedCustomer.id;
    } else if (props.partyType === 'Supplier') {
      dynamicKey = 'shipping';
      clickedObj.type = 'Supplier';
      clickedObj.supplierPartyId = props.currentDraftQuote.vendor.id;
    }
    const { provinces } =
      address && props.country.filter(country => country.id === (address.country_code || 'USA'))[0];
    const province = address && provinces.find(p => p.code === address.state_code);
    setEditQuoteAddressModal(true);
    setSelectedAddressType(clickedObj);
    // setAddressModalVisible(true);
    setPremontedAddress({
      [`${dynamicKey}To`]: address.to_name,
      [`${dynamicKey}Attn`]: address.attn_name,
      [`${dynamicKey}AddressLine1`]: address.address_line_1,
      [`${dynamicKey}AddressLine2`]: address.address_line_2,
      [`${dynamicKey}City`]: address.city,
      [`${dynamicKey}StateCode`]: address.state_code ? `${province.code} ${province.name}` : null, // IND India
      [`${dynamicKey}PostalCode`]: address.postal_code,
      [`${dynamicKey}CountryCode`]: address.country_code,
      [`${dynamicKey}Directions`]: address.directions,
    });
  };

  const deleteAddressHandler = () => {
    const hide = message.loading('Removing Adddress...', 0);
    const clickedObj = {
      contactMechPurposeTypeId: address.contact_mech_purpose_type_id,
      contactMechId: address.id,
      operationType: 'delete',
    };
    if (props.partyType === 'Customer') {
      clickedObj.type = 'Customer';
      clickedObj.customerPartyId = props.addedCustomer.id;
    } else if (props.partyType === 'Supplier') {
      clickedObj.type = 'Supplier';
      clickedObj.supplierPartyId = props.currentDraftQuote.vendor.id;
    }
    if (clickedObj.type === 'Customer') {
      // {
      //   contactMechId: "10571"
      //   customerId: "10212"
      //   quoteId: "CF10360"
      // }
      props.dispatch({
        type: 'quoteDetails/deleteCustomerQuoteAddress',
        payload: {
          quoteId: props.quoteId,
          contactMechId: clickedObj.contactMechId,
          customerId: clickedObj.customerPartyId,
          cb: () => {
            setTimeout(hide, 0);
            message.success('Address removed successfully.');
          },
        },
      });
    } else if (clickedObj.type === 'Supplier') {
      props.dispatch({
        type: 'quoteDetails/deleteVendorQuoteAddress',
        payload: {
          quoteId: props.quoteId,
          contactMechId: clickedObj.contactMechId,
          vendorId: clickedObj.supplierPartyId,
          cb: () => {
            setTimeout(hide, 0);
            message.success('Address removed successfully.');
          },
        },
      });
    }
  };

  const updateAddressToServer = updatedAddress => {
    setAddressLoadingState(true);
    // call the api to update the address
    if (selectedAddressType.type === 'Customer') {
      props
        .dispatch({
          type: 'quoteDetails/updateCustomerQuoteAddress',
          payload: {
            data: updatedAddress,
            addressType:
              address.contact_mech_purpose_type_id === 'SHIPPING_LOCATION' ||
              address.contact_mech_purpose_type_id === 'PRIMARY_LOCATION'
                ? 'shipping'
                : 'billing',
            quoteId: props.quoteId,
            contactMechId: selectedAddressType.contactMechId,
            customerId: selectedAddressType.customerPartyId,
            cb: () => setEditQuoteAddressModal(false),
          },
        })
        .then(() => setAddressLoadingState(false));
    } else if (selectedAddressType.type === 'Supplier') {
      props
        .dispatch({
          type: 'quoteDetails/updateVendorQuoteAddress',
          payload: {
            data: updatedAddress,
            quoteId: props.quoteId,
            contactMechId: selectedAddressType.contactMechId,
            vendorId: selectedAddressType.supplierPartyId,
            cb: () => setEditQuoteAddressModal(false),
          },
        })
        .then(() => setAddressLoadingState(false));
    }
  };

  return (
    <div>
      <div>
        <div>
          <Row type="flex">
            <Col>
              <Text strong>
                {address.to_name ? (
                  <div>
                    {address.to_name} {address.attn_name ? `${address.attn_name}` : ''}{' '}
                  </div>
                ) : (
                  ''
                )}
                {address.directions ? <div>{address.directions}</div> : ''}
                {address.address_line_1 ? <div>{address.address_line_1}</div> : ''}
                {address.address_line_2 ? <div>{address.address_line_2},</div> : ''}
                {address.city ? (
                  <div>
                    {address.city}, {address.state_code ? `${address.state_code},` : ''}{' '}
                    {address.postal_code}
                  </div>
                ) : (
                  ''
                )}
                {address.country_code ? <div>{address.country_code}</div> : ''}
              </Text>
            </Col>
          </Row>
        </div>
        {props.showEditDeleteIcons && (
          <>
            <div className="py-2">
              <span
                id={`edit-${props.partyType}`}
                className="cursor-pointer text-xs text-gray-500 uppercase"
                onClick={editAddressHandler}
              >
                <Icon id={`Edit-Address-${props.address.id}`} type="edit" /> Edit
              </span>
              <Popconfirm
                getPopupContainer={trigger => trigger.parentNode}
                placement="top"
                title="Are you sure you want to delete this address?"
                onConfirm={deleteAddressHandler}
                onCancel={() => {}}
                cancelText="Cancel"
                okText="Delete"
                okType="danger"
                okButtonProps={{
                  id: 'Confirm-Remove',
                }}
              >
                <span
                  id={`remove-${props.partyType}`}
                  className="cursor-pointer text-xs text-red-500 uppercase pl-4"
                >
                  <Icon id={`Delete-Address-${props.address.id}`} type="delete" /> Delete
                </span>
              </Popconfirm>
            </div>
          </>
        )}
        <div>
          <Modal
            keyboard={false}
            maskClosable={false}
            title={
              props.partyType === 'Customer'
                ? 'Update Customer Ship To Address'
                : `Update ${types} Ship From Address`
            }
            visible={editQuoteAddressModal}
            footer={null}
            onCancel={() => setEditQuoteAddressModal(false)}
          >
            <Address
              form={form}
              required
              type={
                address.contact_mech_purpose_type_id === 'SHIPPING_LOCATION' ||
                address.contact_mech_purpose_type_id === 'PRIMARY_LOCATION'
                  ? 'shipping'
                  : 'billing'
              }
              addressRequired
              addressFieldsOptional
              showAddressLine2
              premountAddress
              address={premountedAddress}
              submit
              isModal
              submitModalText="Update Address"
              onAddAddress={updateAddressToServer}
              loading={addressLoadingState}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  addedCustomer: state.quoteDetails ? state.quoteDetails.currentDraftQuote.customer : [],
  addedSupplier: state.quoteDetails ? state.quoteDetails.currentDraftQuote.vendor : [],
  currentDraftQuote: state.quoteDetails ? state.quoteDetails.currentDraftQuote : [],
  // currentDraftQuote: state.quoteDetails.currentDraftQuote,
});

export default Form.create()(connect(mapStateToProps)(SingleAddress));
// export default SingleAddress;
