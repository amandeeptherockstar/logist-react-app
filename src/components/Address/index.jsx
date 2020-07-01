/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Select, Button, Switch, AutoComplete } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { connect } from 'dva';
import styles from './styles.less';

// eslint-disable-next-line no-undef
const map = new google.maps.Map(document.getElementById('map'));
// eslint-disable-next-line no-undef
const googleInstance = new google.maps.places.AutocompleteService();
// eslint-disable-next-line no-undef
const placesService = new google.maps.places.PlacesService(map);

const Address = props => {
  const [suggestedAddress, setSuggestedAddress] = useState([]);

  const {
    form,
    type,
    addressFieldsOptional,
    premountAddress,
    address,
    submit,
    isModal,
    onAddAddress,
    countries,
  } = props;
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }
  const action = text => {
    googleInstance.getPredictions({ input: text }, predictions => setSuggestedAddress(predictions));
  };

  const debounceSearch = React.useCallback(debounce(action, 400), []);
  const { getFieldDecorator } = form;
  const { Option } = Select;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateAvailable, setStateAvailable] = useState(true);

  const [showDirections, setShowDirections] = useState(false);
  // const [countries, setCountries] = useState([]);
  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };
  // googlePlaceInstance.getDetails({placeId},(place)=>);

  const getAddressFieldsFromGoogle = async (placeId, cb) => {
    let finalData = {};
    placesService.getDetails({ placeId }, ({ address_components }) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < address_components.length; i++) {
        const addressType = address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = address_components[i][componentForm[addressType]];
          finalData = { ...finalData, [addressType]: val };
        }
        if (address_components.length - 1 === i) {
          cb(finalData);
        }
      }
    });
  };

  const checkRequiredLabel = (labelText, isRequired) => {
    if (isRequired) {
      return (
        <>
          <span className="text-red-600 text-base">* </span>
          {labelText}
        </>
      );
    }
    return labelText;
  };
  const [showToAndAttn, setShowToAndAttn] = useState(false);

  const country = countries
    ? countries.find(el => address && el.id === address[`${type}CountryCode`])
    : null;

  let foundProvince = '';
  let formattedCountry = '';
  if (country) {
    foundProvince = country.provinces.find(state => state.code === address.state_code);
    if (foundProvince && foundProvince.length === 0) {
      setStateAvailable(false);
    }
    formattedCountry = `${country.id} ${country.name}`;
  }

  useEffect(() => {
    if (
      (address && address[`${type}To`]) ||
      (address && address[`${type}Attn`]) ||
      (address && address.to_name)
      // (address && address.directions)
    ) {
      setShowToAndAttn(true);
    } else {
      setShowToAndAttn(false);
    }
    if (address && address.directions) {
      setShowDirections(true);
    }
    if (!premountAddress && address) {
      const newCountry =
        address &&
        address.country_code &&
        props.countries.filter(c => c.id === address.country_code)[0];
      const province =
        address && newCountry && newCountry.provinces.find(p => p.code === address.state_code);
      form.setFieldsValue({
        [`${type}To`]: address.to_name,
        [`${type}Attn`]: address.attn_name,
        [`${type}AddressLine1`]: address.address_line_1,
        [`${type}AddressLine2`]: address.address_line_2,
        [`${type}Directions`]: address.directions,
        [`${type}City`]: address.city,
        [`${type}StateCode`]:
          address.country_code && address.state_code ? `${province.code} ${province.name}` : null,
        [`${type}PostalCode`]: address.postal_code,
        [`${type}CountryCode`]: address.country_code ? `${newCountry.id} ${newCountry.name}` : '',
      });
    }
  }, [address]);

  const [selectedCountry, setSelectedCountry] = useState('');
  return (
    <Form hideRequiredMark>
      <Row type="flex" justify="end" style={{ right: 0 }}>
        <span className="text-xs text-gray-600 uppercase pr-2">
          {showToAndAttn ? 'Show less fields' : 'Show more fields'}
        </span>
        <Switch
          id="show-more-less-toggler"
          checked={showToAndAttn}
          onChange={checked => {
            setShowToAndAttn(checked);
            setShowDirections(checked);
          }}
        ></Switch>
      </Row>
      {showToAndAttn && (
        <Row gutter={6}>
          <Col span={12} className="responsive">
            <div className="zcp-ant-form-label-w-full">
              <Form.Item
                className="text-left"
                colon={false}
                label={<span className={styles.zeusFormLabel}>To (Optional)</span>}
              >
                {getFieldDecorator(`${type}To`, {
                  initialValue: premountAddress
                    ? address && address[`${type}To`]
                    : address && address.to_name,
                  rules: [{ message: 'To Required' }],
                })(<Input size="large" placeholder="To" />)}
              </Form.Item>
            </div>
          </Col>
          <Col span={12} className="responsive">
            <div className="zcp-ant-form-label-w-full">
              <Form.Item
                className="text-left"
                colon={false}
                label={<span className={styles.zeusFormLabel}>Attn (Optional)</span>}
              >
                {getFieldDecorator(`${type}Attn`, {
                  initialValue: premountAddress
                    ? address && address[`${type}Attn`]
                    : address && address.attn_name,
                })(<Input size="large" placeholder="Attn" />)}
              </Form.Item>
            </div>
          </Col>
        </Row>
      )}
      <Row gutter={6} style={{ width: '100%' }}>
        <Col sm={24}>
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              label={
                <span className={styles.zeusFormLabel}>
                  {checkRequiredLabel('Street Address', props.addressRequired)}
                  {addressFieldsOptional ? ' ' : ''}{' '}
                </span>
              }
              colon={false}
            >
              {getFieldDecorator(`${type}AddressLine1`, {
                initialValue: premountAddress ? address && address[`${type}AddressLine1`] : '',
                rules: [
                  {
                    required: props.addressRequired,
                    message: 'Street address is required',
                  },
                ],
              })(
                <AutoComplete
                  id={`${type}-address-autocomplete`}
                  getPopupContainer={trigger => trigger.parentNode}
                  {...props}
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  dataSource={
                    suggestedAddress &&
                    suggestedAddress.map(({ place_id, description }) => ({
                      value: JSON.stringify({ id: place_id, description }),
                      text: description,
                    }))
                  }
                  style={{ width: '100%', height: '40px !important' }}
                  onSelect={async e => {
                    const obj = JSON.parse(e);
                    getAddressFieldsFromGoogle(obj.id, addressFieldsByGoogle => {
                      setSelectedCountry(
                        countries
                          .filter(c2 => c2.code === addressFieldsByGoogle.country)
                          .map(c3 => `${c3.id} ${c3.name}`)[0],
                      );
                      form.setFieldsValue({
                        [`${type}AddressLine1`]: [
                          addressFieldsByGoogle.street_number,
                          addressFieldsByGoogle.route,
                        ]
                          .filter(text => text)
                          .join(', '),
                        [`${type}City`]: addressFieldsByGoogle.locality,
                        [`${type}StateCode`]: countries.filter(
                          c1 => c1.code === addressFieldsByGoogle.country,
                        ).length
                          ? countries
                              .filter(c2 => c2.code === addressFieldsByGoogle.country)[0]
                              .provinces.filter(
                                p1 => p1.code === addressFieldsByGoogle.administrative_area_level_1,
                              )
                              .map(p2 => `${p2.code} ${p2.name}`)[0]
                          : '',
                        [`${type}PostalCode`]: addressFieldsByGoogle.postal_code,
                        [`${type}CountryCode`]: countries.filter(
                          c1 => c1.code === addressFieldsByGoogle.country,
                        ).length
                          ? countries
                              .filter(c2 => c2.code === addressFieldsByGoogle.country)
                              .map(c3 => `${c3.id} ${c3.name}`)[0]
                          : 'USA United States',
                      });
                    });
                  }}
                  onSearch={debounceSearch}
                >
                  <Input
                    id={`${type}-autocomplete`}
                    size="large"
                    style={{ height: 40 }}
                    type="text"
                    placeholder="123 Hill St."
                  />
                </AutoComplete>,
              )}
            </Form.Item>
          </div>
        </Col>
        <Col sm={24}>
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              label={
                <span className={styles.zeusFormLabel}>
                  Apartment, Suite, Room No. etc. (Optional)
                </span>
              }
              colon={false}
            >
              {getFieldDecorator(`${type}AddressLine2`, {
                initialValue: premountAddress ? address && address[`${type}AddressLine2`] : '',
              })(<Input size="large" type="text" placeholder="Room 101" />)}
            </Form.Item>
          </div>
        </Col>
        {showDirections && (
          <Col sm={24}>
            <div className="zcp-ant-form-label-w-full">
              <Form.Item
                label={<span className={styles.zeusFormLabel}>Directions (Optional)</span>}
                colon={false}
              >
                {getFieldDecorator(`${type}Directions`, {
                  initialValue: premountAddress
                    ? address && address[`${type}Directions`]
                    : address && address.directions,
                })(
                  <TextArea
                    size="large"
                    type="text"
                    placeholder="Any landmarks, milestones or special instructions for the address"
                  />,
                )}
              </Form.Item>
            </div>
          </Col>
        )}
      </Row>
      <Row gutter={6} style={{ width: '100%' }}>
        <Col span={12} className="responsive">
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              label={
                <span className={styles.zeusFormLabel}>
                  {checkRequiredLabel('City', props.addressRequired)}

                  {addressFieldsOptional ? '' : ''}
                </span>
              }
              colon={false}
            >
              {getFieldDecorator(`${type}City`, {
                initialValue: premountAddress ? address && address[`${type}City`] : '',
                rules: [
                  {
                    required: props.addressRequired,
                    message: 'A valid city name is required',
                  },
                ],
              })(<Input {...props} size="large" type="text" placeholder="Dallas" />)}
            </Form.Item>
          </div>
        </Col>
        <Col span={12} className="responsive">
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              colon={false}
              label={
                <span className={styles.zeusFormLabel}>
                  {checkRequiredLabel('State/Province', props.addressRequired)}
                </span>
              }
            >
              {getFieldDecorator(`${type}StateCode`, {
                initialValue: premountAddress ? address && address[`${type}StateCode`] : '',
                rules: [
                  {
                    required: props.addressRequired ? stateAvailable : false,
                    message: 'State Code is required',
                  },
                ],
              })(
                <Select
                  {...props}
                  showSearch
                  getPopupContainer={trigger => trigger.parentNode}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select Your State"
                  notFoundContent="No States Found"
                  // TODO: Add Placeholder
                >
                  {/* eslint-disable-next-line */}
                  {countries.length > 0 && selectedCountry
                    ? countries
                        // .filter(c => c.id === selectedCountry.match(/\((.*)\)/)[1])
                        .filter(c => c.id === selectedCountry.split(' ')[0])
                        .map(state =>
                          state.provinces.map(province => (
                            <Option key={province.code} value={`${province.code} ${province.name}`}>
                              {province.name} ({province.code})
                            </Option>
                          )),
                        )
                    : countries
                        .filter(c => c.id === 'USA')
                        .map(state =>
                          state.provinces.map(province => (
                            <Option key={province.code} value={`${province.code} ${province.name}`}>
                              {province.name} ({province.code})
                            </Option>
                          )),
                        )}
                </Select>,
              )}
            </Form.Item>
          </div>
        </Col>
      </Row>
      <Row gutter={6} style={{ width: '100%' }}>
        <Col span={12} className="responsive">
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              label={
                <span className={styles.zeusFormLabel}>
                  {checkRequiredLabel('ZIP / Postal', props.addressRequired)}
                  {addressFieldsOptional ? '' : ''}
                </span>
              }
              colon={false}
            >
              {getFieldDecorator(`${type}PostalCode`, {
                initialValue: premountAddress ? address && address[`${type}PostalCode`] : '',
                rules: [
                  {
                    required: props.addressRequired,
                    message: 'Postal Code is required',
                  },
                  {
                    pattern: /^\d{5}(-\d{4})?$/g,
                    message: 'Invalid Postal Code',
                  },
                ],
              })(
                <Input
                  {...props}
                  type="text"
                  maxLength={10}
                  placeholder="12345"
                  size="large"
                  onBlur={event => {
                    const { value } = event.target;
                    if (value !== '') {
                      if (value.length === 9) {
                        const formattedPostalCode = [
                          value.substring(0, 5),
                          value.substring(5),
                        ].join('-');
                        form.setFieldsValue({
                          [`${type}PostalCode`]: formattedPostalCode,
                        });
                      }
                    }
                    form.setFieldsValue({ [`${type}PostalCode`]: value });
                  }}
                  onInput={event => {
                    const { value } = event.target;
                    if (value !== '') {
                      if (value.length === 9) {
                        const formattedPostalCode = [
                          value.substring(0, 5),
                          value.substring(5),
                        ].join('-');
                        form.setFieldsValue({
                          [`${type}PostalCode`]: formattedPostalCode,
                        });
                      }
                    }
                  }}
                />,
              )}
            </Form.Item>
          </div>
        </Col>
        <Col span={12} className="responsive">
          <div className="zcp-ant-form-label-w-full">
            <Form.Item
              className="text-left"
              colon={false}
              label={
                <span className={styles.zeusFormLabel}>
                  {checkRequiredLabel('Country', props.addressRequired)}
                </span>
              }
            >
              {getFieldDecorator(`${type}CountryCode`, {
                initialValue: premountAddress ? formattedCountry : 'USA United States',
                rules: [
                  {
                    required: props.addressRequired,
                    message: 'Country Code is required',
                  },
                ],
              })(
                <Select
                  {...props}
                  showSearch
                  // allowClear
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  size="large"
                  onChange={countryValue => {
                    setSelectedCountry(countryValue);
                    // The Below line is to clear default state when user selects the countries

                    // .filter(c => c.id === selectedCountry.match(/\((.*)\)/)[1])

                    props.form.setFieldsValue({ [`${type}StateCode`]: '' });

                    setSelectedCountry(countryValue);
                    if (type === 'billing') {
                      form.setFieldsValue({
                        billingStateCode: '',
                      });
                    }

                    const states = countries
                      .filter(c => c.id === countryValue.split(' ')[0])
                      .map(state => state.provinces);
                    if (states[0].length === 0) {
                      setStateAvailable(false);
                    } else {
                      setStateAvailable(true);
                    }
                  }}
                >
                  {countries.length > 0
                    ? countries.map(c => (
                        <Option key={c.id} value={`${c.id} ${c.name}`}>
                          {c.name} ({c.id})
                        </Option>
                      ))
                    : ''}
                </Select>,
              )}
            </Form.Item>
          </div>
        </Col>
      </Row>
      {submit && isModal && (
        <Form.Item>
          <div className="zcp-form-action-bar text-right">
            <Row type="flex" justify="end">
              <Button
                id={`${type}-address-btn`}
                loading={props.loading}
                type="primary"
                onClick={() => {
                  form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                      onAddAddress(values, id => {
                        if (props.afterSubmit) {
                          props.afterSubmit(id);
                        }
                        // props.afterSubmit ? props.afterSubmit(id) : null;
                      });
                    }
                  });
                }}
              >
                {props.submitModalText ? props.submitModalText : 'Create Address'}
              </Button>
            </Row>
          </div>
        </Form.Item>
      )}
      {submit && !isModal && (
        <Form.Item>
          <div className="zcp-form-action-bar text-right">
            <Button
              id={`${type}-btn-submit`}
              type="primary"
              onClick={() => {
                form.validateFieldsAndScroll((err, values) => {
                  if (!err) onAddAddress(values);
                });
              }}
            >
              {props.submitModalText ? props.submitModalText : 'Create Address'}
            </Button>
          </div>
        </Form.Item>
      )}
    </Form>
  );
};

Address.defaultProps = {
  type: '',
};

const mapStateToProps = state => ({
  countries: state.countriesList.countries,
});

export default connect(mapStateToProps)(Address);
