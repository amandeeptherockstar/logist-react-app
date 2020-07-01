/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Form, Select, InputNumber } from 'antd';
import { getSimplePhoneStringFromUSAPhoneFormat } from '@/utils/formatUsaPhone';
// import PageLoading from '../PageLoading';
import cssStyles from './styles.less';
import ZCPCheckValidation from '../ZCPCheckValidation';
import { getTeleCodes } from '@/services/CommonTransactions/teleCodes';

export const PhoneNumber = ({
  form,
  styles,
  phone,
  phone_extension,
  phoneRequired,
  onPhoneChange,
  label,
  autoFocus,
  countryCode,
}) => {
  const [telephoneCountryList, setTelephoneCountryList] = useState([]);
  const [inputPhone, setInputPhone] = useState('');

  useEffect(
    () => {
      // if the phone is not set
      if (!form.getFieldValue('phone.phone') && phone) {
        form.setFieldsValue({
          'phone.phone': phone,
        });
      }
      if (inputPhone === '') {
        setInputPhone(phone || form.getFieldValue('phone.phone'));
      }
    },
    [form.getFieldValue('phone')],
    phone,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    getTeleCodes()
      .then(response => {
        setTelephoneCountryList(
          response.data
            .filter(element => element.teleCode !== null)
            .sort((a, b) => (a.countryCode > b.countryCode ? 1 : -1)),
        );
      })
      .catch(() => {});
    return () => {};
  }, []);
  const { getFieldDecorator } = form;

  let code = 'US (+1)';
  if (telephoneCountryList.length > 0 && countryCode) {
    if (countryCode !== '1') {
      const country = telephoneCountryList.find(c => c.teleCode === countryCode);
      code = country ? country.countryName : 'US (+1)';
    }
  }

  const cleanInput = inp => {
    // replace anything which is not a number with empty string
    if (inp) {
      return inp.replace(/[^\d]/g, '');
    }
    return '';
  };

  const prefixSelector = getFieldDecorator('phone.country_code', {
    // initialValue: 'US (+1)',
    initialValue: code,
    rules: [{ required: phoneRequired, message: 'Select Country' }],
  })(
    <Select
      showSearch
      // style={{ width: '90px' }}
      placeholder="Country Code"
      tabIndex="-1"
      size="large"
    >
      {telephoneCountryList &&
        telephoneCountryList.map(element => (
          <Select.Option key={`tele_${element.teleCode}`} value={element.countryName}>
            {element.countryName}
          </Select.Option>
        ))}
    </Select>,
  );

  return (
    <>
      <ZCPCheckValidation show={label}>
        <div className={styles ? styles.zeusFormLabel : cssStyles.zeusFormLabel}>Phone</div>
      </ZCPCheckValidation>
      <div className="flex zcp-ant-form-label-w-full">
        <div className="w-1/4">
          <Form.Item>{prefixSelector}</Form.Item>
        </div>
        <div className="w-2/4">
          <Form.Item colon={false} required={false}>
            <div className="zcp-phoneview-wrapper zcp-hide-up-down-arrow-inputnumber">
              {getFieldDecorator('phone.phone', {
                validateTrigger: 'onBlur',
                initialValue: cleanInput(phone) || '',
                rules: [
                  { required: phoneRequired, message: 'Input Phone' },
                  {
                    validator(rule, val) {
                      const value = val.toString();
                      const unformattedPhone = getSimplePhoneStringFromUSAPhoneFormat(value);
                      if (unformattedPhone !== '' && unformattedPhone.length < 10) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('Phone number must be of 10 digits');
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              })(
                <InputNumber
                  autoFocus={autoFocus}
                  style={{ width: '100%' }}
                  id="Phone-Number-Input-Field"
                  onKeyUp={() => onPhoneChange && onPhoneChange()}
                  type="text"
                  maxLength={14}
                  parser={value => value.replace(/[^\d]/g, '')}
                  formatter={v => {
                    const value = cleanInput(v.toString());
                    const mask = '(###) ###-####';
                    let i = 0;
                    let lIndex = -1;
                    const formattedInput = mask.replace(/#/g, (_, index) => {
                      if (i >= value.length) {
                        return '#';
                      }
                      lIndex = index;
                      i += 1;
                      return value[i - 1];
                    });
                    return formattedInput.substring(0, lIndex + 1);
                  }}
                  size="large"
                  placeholder="(###) ###-####"
                />,
              )}
            </div>
          </Form.Item>
        </div>
        <div className="w-1/4 zcp-phoneview-wrapper zcp-hide-up-down-arrow-inputnumber">
          <Form.Item>
            {!isMobile &&
              getFieldDecorator('phone.phone_extention', {
                initialValue: phone_extension || '',
              })(
                <InputNumber
                  parser={value => value.replace(/[^\d]/g, '')}
                  formatter={v => {
                    const value = cleanInput(v.toString());
                    return value;
                  }}
                  id="Phone-Extension-Input-Field"
                  type="text"
                  maxLength={8}
                  size="large"
                  placeholder="Extn."
                />,
              )}
          </Form.Item>
        </div>
      </div>
    </>
  );
};
