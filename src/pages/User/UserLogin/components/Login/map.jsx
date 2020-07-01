export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      placeholder: 'jonh.appleseed@yourmail.com',
      type: 'email',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
};
