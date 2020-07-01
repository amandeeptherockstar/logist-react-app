/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

const returnStepsStatus = data => {
  if (Array.isArray(data)) {
    if (data.length > 0) {
      return 'finish';
    }
    return 'pending';
  }
  if (typeof data === 'object' && Object.keys(data).length > 0) {
    return 'finish';
  }
  if (data) {
    return 'finish';
  }
  return 'wait';
};

// eslint-disable-next-line no-confusing-arrow
const documentsUploadStepsStatus = data =>
  [
    ...data.quoteCompanyAttachments,
    ...data.quoteProductAttachments,
    ...data.quoteSupplierAttachments,
    ...data.quoteAttachments,
  ].filter(attachment => attachment.is_attached).length > 0
    ? 'finish'
    : 'pending';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
const uncapitalizeFirstLetter = string => string.charAt(0).toLowerCase() + string.slice(1);

/**
 *
 * @param {Object[]} source input to be filtered
 * @param {Object[]} target Filter Criteria
 * @returns {Boolean}  Source Contains target Values
 */
const containsAny = (source, target) => {
  const result = source.filter(item => target.indexOf(item) > -1);
  return result.length > 0;
};
const currencyParser = text => (text ? Number(text.replace(/[^\d.-]/g, '')) : 0.0);
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
/**
 *
 * @param {Number} inputNumber
 * @param {Number} step
 * @returns {Number}
 */
function setNumberDecimal(inputNumber, step) {
  return parseFloat(inputNumber.toFixed(step));
}

export {
  isAntDesignProOrDev,
  isAntDesignPro,
  isUrl,
  returnStepsStatus,
  capitalizeFirstLetter,
  uncapitalizeFirstLetter,
  containsAny,
  documentsUploadStepsStatus,
  currencyParser,
  currencyFormatter,
  setNumberDecimal,
};

export default function debounceMethod(func, wait) {
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

export const primaryPhoneEmail = phoneEmail => phoneEmail.filter(p => p.isPrimary);

export const partyPrimaryPhoneEmail = phoneEmail => phoneEmail.filter(p => p.is_primary);

export const getIntials = name => {
  const fullname = name && name.split(' ');
  const firstname = fullname[0];
  const lastname = fullname[fullname.length - 1];
  return lastname !== firstname ? firstname[0] + lastname[0] : firstname[0];
};

export const makeEmailLowerCase = email => email.toLowerCase();

export const formatPhoneToUSAPattern = phone => {
  // input 0987654322, output (098) 765-4322
  const regexPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (regexPattern.test(phone)) {
    return phone.replace(regexPattern, '($1) $2-$3');
  }
  // Invalid phone number
  return phone;
};

// for US (+1)
export const extractDigitsFromString = string => string.match(/(\d+)/)[0];

// convert the formatted phone to USA Pattern
export const convertFormattedPhoneToUSAPattern = formattedPhone => {
  // formatted phone will be like this +1 565-675-7978 ext. 67867
  const regex = /\d{3}-\d{3}-\d{4}/;
  return formatPhoneToUSAPattern(formattedPhone.match(regex)[0].replace(/-/g, ''));
};

export const extractFormattedPhoneDigits = formattedPhone => {
  const regex = /\d{3}-\d{3}-\d{4}/;
  return formattedPhone.match(regex)[0];
};

// eslint-disable-next-line max-len
export const extractCountryCodeFromFormattedPhone = formattedPhone =>
  formattedPhone.substring(1, 2);

export const phoneAlreadyExists = ({ typedPhoneAndExtension, phones }) => {
  const existingPhoneNumberAndExtensionArray =
    phones && phones.map(p => `${p.area_code}${p.phone}-${p.extension || ''}`);
  if (
    existingPhoneNumberAndExtensionArray &&
    existingPhoneNumberAndExtensionArray.includes(typedPhoneAndExtension)
  ) {
    return true;
  }
  return false;
};

/**
 *
 * @param {Array} inputArray The array of objects to be filtered on the basis of @property
 * @param {String} property The property of the objects
 * on the basis of you want to filter out the array
 * @returns Filtered arrar of objects.
 */
export const removeDuplicates = (inputArray, property) =>
  inputArray.filter(
    (obj, pos, arr) => arr.map(mapObj => mapObj[property]).indexOf(obj[property]) === pos,
  );
