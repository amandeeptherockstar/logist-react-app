export function formatPhoneNumber(phoneNumberString) {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumberString;
}

export function decodeUSAPhoneToNormalString(phoneNumber) {
  if (phoneNumber) {
    return phoneNumber !== '' ? phoneNumber.replace(/[^\d]/g, '') : '';
  }
  return '';
}

// input (222) 222-2222, output = 2222222222
export function getSimplePhoneStringFromUSAPhoneFormat(usaPhone) {
  if (usaPhone) {
    return usaPhone.match(/\d+/g).join('');
  }
  return usaPhone;
}

// returns true if phone is already in usa format ie (222) 222-2222, false otherwise
export function isUSAFormattedPhone(usaPhone) {
  if (usaPhone) {
    return /\(\d{3}\)\s\d{3}-\d{4}/.test(usaPhone);
  }
  return false;
}

export function formatCurrencyInUSD(amount) {
  const validAmount = decodeDollarsToDigits(amount);
  let formattedCurrency = '';
  if (validAmount !== '') {
    formattedCurrency = parseFloat(validAmount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return formattedCurrency;
}

export function decodeDollarsToDigits(usd) {
  let usdCurrency = usd;
  if (!usd) {
    return '';
  }
  if (usd.indexOf('.') > 0) {
    usdCurrency = usd.substring(0, usd.indexOf('.'));
  }
  if (usdCurrency) {
    return usdCurrency.replace(/[^\d]/g, '');
  }
  return '';
}

export function getCountryCode(countryCode) {
  const cc = countryCode.split(' ')[1];
  return cc.substring(2, cc.length - 1);
}

const colors = {
  ordered: {
    text: 'green',
    bg: 'green',
  },
  active: {
    text: '#0A4933',
    bg: '#D7F5EA',
  },
  expired: {
    text: '#6F2323',
    bg: '#FFE0E0',
  },
  draft: {
    text: '#45400E',
    bg: '#FBF8DE',
  },
};

export function getTagColor(status) {
  if (status && status !== '') {
    let color;
    switch (status) {
      case 'QUO_DRAFT':
        color = colors.draft.bg;
        break;
      case 'QUO_CREATED':
        color = colors.active.bg;
        break;
      case 'QUO_EXPIRED':
        color = colors.expired.bg;
        break;
      case 'QUOTES_ARCHIVED':
        color = colors.expired.bg;
        break;
      case 'QUO_ORDERED':
        color = colors.ordered.bg;
        break;
      default:
        color = colors.draft.bg;
    }
    return color;
  }
  return 'orange';
}
export function getTagTextColor(status) {
  if (status && status !== '') {
    let color;
    switch (status) {
      case 'QUO_DRAFT':
        color = colors.draft.text;
        break;
      case 'QUO_CREATED':
        color = colors.active.text;
        break;
      case 'QUO_EXPIRED':
        color = colors.expired.text;
        break;
      case 'QUOTES_ARCHIVED':
        color = colors.expired.text;
        break;
      case 'QUO_ORDERED':
        color = colors.ordered.text;
        break;
      default:
        color = colors.draft.text;
    }
    return color;
  }
  return 'orange';
}

export const formatCurrencyToUSDAmount = amount => {
  const validAmount = amount;
  let formattedCurrency = '';
  if (validAmount !== '') {
    formattedCurrency = parseFloat(validAmount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return formattedCurrency;
};

export const formatUSDToNormalNumber = formattedUSD => {
  if (formattedUSD.lastIndexOf('.') > 0) {
    return formattedUSD.substring(0, formattedUSD.lastIndexOf('.')).replace(/,/g, '');
  }
  // no need to format, its already in usd format
  return formattedUSD;
};
