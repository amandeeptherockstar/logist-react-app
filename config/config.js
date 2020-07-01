import slash from 'slash2';
import { truncate } from 'fs';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'en-US',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            manifestOptions: {
              srcPath: 'src/manifest.json',
            },
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
              swSrc: 'src/service-worker.js', // swDest: 'my-dest-sw.js',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      authority: ['guest'],
      routes: [
        {
          path: '/user/login',
          authority: ['guest'],
          name: 'user.login',
          component: './User/UserLogin',
        },
        {
          path: '/user/logout',
          name: 'user.logout',
          component: './User/UserLogout',
        },
        {
          path: '/user/register',
          authority: ['guest'],
          name: 'user.register',
          component: './User/UserRegister',
        },
        {
          path: '/user/verify',
          authority: ['guest'],
          name: 'user.verify',
          component: './User/SendVerificationEmail',
        },
        {
          path: '/user/forgot',
          authority: ['guest'],
          name: 'user.forgot',
          component: './User/ForgotPassword',
        },
        {
          path: '/user/verified',
          name: 'user.verified',
          component: './User/EmailVerified',
        },
        {
          name: 'inviteduserlogin',
          path: '/user/invitedUserLogin',
          component: './User/InvitedUserLogin',
        },
        {
          name: 'resetpassword',
          path: '/user/resetPassword',
          component: './User/ResetPassword',
        },
      ],
    },
    {
      path: '/server-unreachable',
      name: 'serverUnderMaintenance',
      component: './ServerUnderMaintenance',
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['ORG_ADMIN', 'ORG_EMPLOYEE', 'ORG_MANAGER', 'guest'],
      routes: [
        {
          name: 'account.settings',
          path: '/account/settings',
          component: './User/AccountSetting',
          routes: [
            {
              path: '/account/settings',
              redirect: '/account/settings/general',
            },
            {
              name: 'general',
              path: '/account/settings/general',
              component: './User/AccountSetting/components/base',
            },
            {
              name: 'pref',
              path: '/account/settings/pref',
              component: './User/AccountSetting/components/Preference',
            },
            {
              name: 'org',
              path: '/account/settings/org',
              component: './User/AccountSetting/components/OrgView',
            },
          ],
          hideInMenu: true,
        },
        {
          name: 'exception-403',
          hideInMenu: true,
          icon: 'smile',
          path: '/exception-403',
          component: './exception-403',
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
};
