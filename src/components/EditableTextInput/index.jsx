import React from 'react';
import { Input } from 'antd';
/**
 *
 * @param {import('antd/lib/input').InputProps} props
 */
const EditableTextInput = props => (
  <>
    <Input {...props} />
  </>
);

export default EditableTextInput;
