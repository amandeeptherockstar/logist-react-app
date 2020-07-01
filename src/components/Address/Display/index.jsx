import React, { useState } from 'react';
import { Icon, Row, Tooltip, message, Col, Divider } from 'antd';
import { connect } from 'dva';
import SingleAddress from '../Single Address';
import AddUpdateAddress from '@/components/PhoneAndEmail/AddUpdateAddress';
import RoleAuthorization from '@/components/RoleAuthorization';
import DropdownMoreOptions from '@/components/DropdownMoreOptions';

const AddressDisplay = props => {
  const [editAddress, setEditAddress] = useState(false);
  const [editPrimaryAddress, setEditPrimaryAddress] = useState(false);
  const [editShippingAddress, setEditShippingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addAddress, setAddAddress] = useState(false);

  let { addresses } = props;
  addresses = addresses
    ? addresses.sort((a, b) => {
        if (a.contact_mech_purpose_type_id < b.contact_mech_purpose_type_id) {
          return 1;
        }
        if (a.contact_mech_purpose_type_id > b.contact_mech_purpose_type_id) {
          return -1;
        }
        return 0;
      })
    : null;

  // logic is implemented as:
  // if both address are same then show billing address
  // else show both addresses
  // No Address found is displayed if there is no billing and shipping address
  const filteredShippingAddress =
    addresses &&
    addresses.filter(address => address.contact_mech_purpose_type_id === 'SHIPPING_LOCATION');
  const filteredBillingAddress =
    addresses &&
    addresses.filter(address => address.contact_mech_purpose_type_id === 'BILLING_LOCATION');
  const filteredPrimaryAddress =
    addresses &&
    addresses.filter(address => address.contact_mech_purpose_type_id === 'PRIMARY_LOCATION');

  const deleteAddress = addressId => {
    const hide = message.loading(' Address is deleting...', 0);
    props.dispatch({
      type: 'partyPoc/deletePartyAddress',
      payload: {
        partyId: props.partyId,
        addressId,
        callback: res => {
          if (res.responseMessage) {
            setTimeout(hide, 0);
            message.success('Address deleted successfully!');
            props.fetchData();
          }
        },
      },
    });
  };

  return (
    <React.Fragment>
      <Row>
        {filteredShippingAddress &&
        filteredBillingAddress &&
        filteredPrimaryAddress &&
        (filteredPrimaryAddress.length > 0 ||
          filteredBillingAddress.length > 0 ||
          filteredShippingAddress.length > 0) ? (
          <b>{props.showTitle && props.showTitle ? null : 'Addresses'}</b>
        ) : (
          <span className="text-gray-500"> No Address Exist</span>
        )}
      </Row>
      {filteredShippingAddress &&
      filteredBillingAddress &&
      filteredPrimaryAddress &&
      (filteredPrimaryAddress.length > 0 ||
        filteredBillingAddress.length > 0 ||
        filteredShippingAddress.length > 0) ? (
        <React.Fragment>
          {filteredPrimaryAddress && filteredPrimaryAddress.length > 0 && (
            <div style={{ marginTop: 10, backgroundColor: '#fafafa' }}>
              <p
                style={{
                  fontWeight: 630,
                  color: '#638ebb',
                }}
              >
                Primary Address
              </p>
            </div>
          )}
          {filteredPrimaryAddress &&
            filteredPrimaryAddress.map((address, index) => (
              <>
                <Row type="flex" justify="space-between">
                  <Col>
                    <SingleAddress
                      addressType={address.contact_mech_purpose_type_id}
                      address={address}
                      customerType={props.customerType} // Customer Supplier
                      setPremontedAddress={props.setPremontedAddress}
                      setSelectedAddressType={props.setSelectedAddressType}
                      setAddressModalVisible={props.setAddressModalVisible}
                      country={props.country}
                    />
                    {filteredPrimaryAddress.length - 1 !== index && <Divider />}
                    <AddUpdateAddress
                      address={selectedAddress}
                      setEditAddress={setEditPrimaryAddress}
                      isOpen={editPrimaryAddress}
                      partyId={props.partyId}
                      fetchData={props.fetchData}
                      type="update"
                      title="Update Address"
                    />
                  </Col>
                  <Col>
                    <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
                      <br />
                      <DropdownMoreOptions
                        popConfirmTitle="Are you sure you want to delete this Address?"
                        handleEditClick={() => {
                          setEditPrimaryAddress(true);
                          setSelectedAddress(address);
                        }}
                        handleDeleteConfirm={() => {
                          deleteAddress(address.id);
                        }}
                      />
                    </RoleAuthorization>
                  </Col>
                </Row>
              </>
            ))}
          <br />
          {filteredShippingAddress && filteredShippingAddress.length > 0 && (
            <div style={{ backgroundColor: '#fafafa' }}>
              <p
                style={{
                  fontWeight: 630,
                  color: '#638ebb',
                }}
              >
                Shipping Address
              </p>
            </div>
          )}
          {filteredShippingAddress &&
            filteredShippingAddress
              // .filter((val, index) => index === 0)
              .map((address, index) => (
                <>
                  <Row type="flex" justify="space-between">
                    <Col>
                      <SingleAddress
                        addressType={address.contact_mech_purpose_type_id}
                        address={address}
                        customerType={props.customerType} // Customer Supplier
                        setPremontedAddress={props.setPremontedAddress}
                        setSelectedAddressType={props.setSelectedAddressType}
                        setAddressModalVisible={props.setAddressModalVisible}
                        country={props.country}
                      />
                      {filteredShippingAddress.length - 1 !== index && <Divider />}
                      <AddUpdateAddress
                        address={selectedAddress}
                        setEditAddress={setEditShippingAddress}
                        isOpen={editShippingAddress}
                        partyId={props.partyId}
                        fetchData={props.fetchData}
                        type="update"
                        title="Update Address"
                      />
                    </Col>
                    <Col>
                      <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
                        <br />
                        <DropdownMoreOptions
                          popConfirmTitle="Are you sure you want to delete this Address?"
                          handleEditClick={() => {
                            setEditShippingAddress(true);
                            setSelectedAddress(address);
                          }}
                          handleDeleteConfirm={() => {
                            deleteAddress(address.id);
                          }}
                        />
                      </RoleAuthorization>
                    </Col>
                  </Row>
                </>
              ))}
          {filteredBillingAddress && filteredBillingAddress.length > 0 && (
            <div style={{ backgroundColor: '#fafafa' }}>
              <p
                style={{
                  fontWeight: 630,
                  color: '#638ebb',
                }}
              >
                Billing Address
              </p>
            </div>
          )}
          {filteredBillingAddress &&
            filteredBillingAddress
              // .filter((val, index) => index === 0)
              .map(address => (
                <>
                  <Row type="flex" justify="space-between">
                    <Col>
                      <SingleAddress
                        addressType={address.contact_mech_purpose_type_id}
                        address={address}
                        customerType={props.customerType} // Customer Supplier
                        setPremontedAddress={props.setPremontedAddress}
                        setSelectedAddressType={props.setSelectedAddressType}
                        setAddressModalVisible={props.setAddressModalVisible}
                        country={props.country}
                      />
                      <AddUpdateAddress
                        address={selectedAddress}
                        setEditAddress={setEditAddress}
                        isOpen={editAddress}
                        partyId={props.partyId}
                        fetchData={props.fetchData}
                        type="update"
                        title="Update Address"
                      />
                    </Col>
                    <Col>
                      <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
                        <br />
                        <DropdownMoreOptions
                          popConfirmTitle="Are you sure you want to delete this Address?"
                          handleEditClick={() => {
                            setEditAddress(true);
                            setSelectedAddress(address);
                          }}
                          handleDeleteConfirm={() => {
                            deleteAddress(address.id);
                          }}
                        />
                      </RoleAuthorization>
                    </Col>
                  </Row>
                </>
              ))}{' '}
        </React.Fragment>
      ) : null}

      {filteredShippingAddress &&
      filteredBillingAddress &&
      filteredPrimaryAddress &&
      (filteredPrimaryAddress.length > 0 ||
        filteredBillingAddress.length > 0 ||
        filteredShippingAddress.length > 0) ? (
        <div>
          {props.showTitle && !props.showTitle ? (
            <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
              <Row>
                <a
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setAddAddress(true);
                  }}
                >
                  <Tooltip title="Add New Address">
                    <Icon
                      id="Add-Address-Icon"
                      type="plus-circle"
                      style={{ color: '#25e', cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <a> Add Another </a>
                  <AddUpdateAddress
                    setAddAddress={setAddAddress}
                    isOpen={addAddress}
                    partyId={props.partyId}
                    fetchData={props.fetchData}
                    type="add"
                    title="Add New Address"
                  />
                </a>
              </Row>
            </RoleAuthorization>
          ) : null}
        </div>
      ) : (
        <div>
          {props.showTitle && !props.showTitle ? (
            <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
              <Row>
                <a
                  style={{ color: 'blue' }}
                  onClick={() => {
                    setAddAddress(true);
                  }}
                >
                  <Tooltip title="Add New Address">
                    <Icon
                      id="Add-Address-Icon"
                      type="plus-circle"
                      style={{ color: '#25e', cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <a> Add New </a>
                  <AddUpdateAddress
                    setAddAddress={setAddAddress}
                    isOpen={addAddress}
                    partyId={props.partyId}
                    fetchData={props.fetchData}
                    type="add"
                    title="Add New Address"
                  />
                </a>
              </Row>
            </RoleAuthorization>
          ) : null}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  addedCustomer: state.quoteDetails ? state.quoteDetails.currentDraftQuote.vendor : [],
  addedSupplier: state.quoteDetails ? state.quoteDetails.currentDraftQuote.vendor : [],
  // currentDraftQuote: state.quoteDetails ? state.quoteDetails.currentDraftQuote : [],
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(AddressDisplay);
