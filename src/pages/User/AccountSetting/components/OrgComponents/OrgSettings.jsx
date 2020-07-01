import React, { useState } from 'react';
import { Radio, message } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';

/**
 *
 *@OrgSettings - The purpose of this component to switch between the business
 * type like B2B to B2C or B2C to B2B.
 */

const OrgSettings = ({ currentUser, dispatch }) => {
  /**
   * @param {func} dispatch- used to call the effect.
   * @param {object} currentUser-give us the info of current user.
   */
  const [chooseBusinessType, setchooseBusinessType] = useState(
    (currentUser && currentUser.organizationDetails.business_type) || 'B2B',
  );
  const changeBusinessType = type => {
    if (currentUser.orgId) {
      dispatch({
        type: 'userAccountSetting/changeBusinessType',
        payload: {
          orgId: currentUser.orgId,
          prefValue: type,
        },
        cb: res => {
          if (res.pref_value) {
            setchooseBusinessType(res.pref_value);
            message.success(`Business type successfully changed to ${res.pref_value}`);
            dispatch({
              type: 'settings/changeSellerType',
              payload: res.pref_value === 'B2B' ? 'Vendor' : 'Company',
            });
          } else {
            message.error('Failed to changed Business Type');
          }
        },
      });
    }
  };
  const description =
    chooseBusinessType === 'B2B'
      ? '  Business to business (B2B) option allows you to work with product vendors other than yourselves.'
      : '  Business to customer (B2C) option allows you to focus on the products you sell and customers you work with, this configuration simplifies the application view to avoid any confusion if you do not have a B2B business workflow.';
  return (
    <div className="flex justify-between items-center p-6 bg-blue-100 rounded-lg">
      <div className="flex-auto">
        <div className="ml-4">
          <p className="text-gray-700 text-lg font-bold leading-none">Business Type</p>
          <p className="text-gray-600 text-sm font-semibold pt-2 pr-4">{description}</p>
        </div>
      </div>
      <div className="flex-none text-right">
        <Radio.Group
          defaultValue={chooseBusinessType}
          buttonStyle="solid"
          onChange={e => {
            setchooseBusinessType(e.target.value);
            changeBusinessType(e.target.value);
          }}
        >
          <Radio.Button value="B2B">B2B</Radio.Button>
          <Radio.Button value="B2C">B2C</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

OrgSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  /**
   * @param {func} dispatch- used to call the effect.
   */
  currentUser: PropTypes.object.isRequired,
  /**
   * @param {object} currentUser-give us the info of current user.
   */
};

const mapStateToProps = ({ loading, user }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['userAccountSetting/changeBusinessType'],
});

export default connect(mapStateToProps)(OrgSettings);
