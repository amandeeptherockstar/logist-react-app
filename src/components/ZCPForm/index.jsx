import React, { useState, useEffect } from 'react';
import { Form, Button, notification } from 'antd';
import moment from 'moment';
import { fields } from '@/utils/confirmLeaveFields';
import { router } from 'umi';
import RouteLeavingGuard from './RouteLeavingGuard';

const ZCPForm = props => {
  const [dirty, setDirty] = useState(false);

  const { form, children, formName, update } = props;

  function setFormValues() {
    const formData = JSON.parse(atob(localStorage.getItem(`${formName}`)));
    if (update && formName === 'AddProductForm' && 'supplierProductId' in formData.values) {
      const { values } = formData;
      const valueFieldWithoutSupplierProductId = {
        customerPrice: values.customerPrice,
        description: values.description,
        price: values.price,
        productCategories: values.productCategories,
        productType: values.productType,
        shippingCost: values.shippingCost,
        shippingTimeInDays: values.shippingTimeInDays,
        taxable: values.taxable,
        title: values.title,
      };
      form.setFieldsValue(valueFieldWithoutSupplierProductId);
    } else {
      form.setFieldsValue({
        ...formData.values,
      });
    }
  }
  function close() {}

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <div>
        <Button
          className="text-red-500"
          id="close-popup-discard-changes"
          type="link"
          onClick={() => {
            localStorage.removeItem(`${formName}`);
            notification.close(key);
          }}
        >
          Discard changes
        </Button>
        <Button
          id="close-popup"
          className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
          onClick={() => {
            setFormValues();
            notification.close(key);
          }}
        >
          Yes restore changes
        </Button>
      </div>
    );
    notification.open({
      message: `You have unsaved changes in this form since ${moment(
        JSON.parse(atob(localStorage.getItem(`${formName}`))).time,
      ).calendar()}, would you like to restore the changes?`,
      btn,
      key,
      duration: 0,
      onClose: close,
    });
  };
  useEffect(() => {
    if (localStorage.getItem(`${formName}`)) {
      const formData = JSON.parse(atob(localStorage.getItem(`${formName}`)));

      if (formData) {
        setTimeout(() => {
          openNotification();
        }, 1000);
      }
    }
  }, []);

  return (
    <>
      <RouteLeavingGuard
        when={dirty}
        navigate={path => router.push(path)}
        shouldBlockNavigation={() => dirty && !!localStorage.getItem(formName)}
      />

      <Form
        {...props}
        onChange={() => {
          form.validateFieldsAndScroll((err, values) => {
            localStorage.setItem(
              `${formName}`,
              btoa(JSON.stringify({ values, time: moment(new Date().toISOString()).format() })),
            );
          });
          const fieldValues = form.getFieldsValue(fields[formName]);
          const exists = Object.values(fieldValues).find(property => !!property);
          if (exists) {
            setDirty(true);
          } else {
            setDirty(false);
          }
        }}
      >
        {children}
      </Form>
    </>
  );
};
ZCPForm.checkFieldPresent = function checkFieldPresent() {
  //   alert(2);
};

export default ZCPForm;
