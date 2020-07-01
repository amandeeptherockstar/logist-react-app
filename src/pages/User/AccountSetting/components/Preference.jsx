import React from 'react';
import { Switch, List } from 'antd';
import { connect } from 'dva';

const Preference = props => {
  const { dispatch, currentTheme, navCollapsed } = props;

  const changeThemeMode = value => {
    dispatch({
      type: 'settings/changeTheme',
      payload: value ? 'dark' : 'light',
    });
  };
  const changeSidebarMenu = value => {
    dispatch({
      type: 'settings/changeCollapsed',
      payload: value,
    });
  };

  const getData = () => [
    {
      title: 'Theme',
      description: 'Toggle to switch the theme of your workspace',
      actions: [
        <Switch
          checked={currentTheme === 'dark'}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          onChange={changeThemeMode}
        />,
      ],
    },
    {
      title: 'Sidebar Menu',
      description: 'Toggle to switch the state of your workspace sidebar menu (Expand/Collapsed)',
      actions: [
        <Switch
          checked={navCollapsed}
          checkedChildren="Collapsed"
          unCheckedChildren="Expanded"
          onChange={changeSidebarMenu}
        />,
      ],
    },
  ];
  return (
    <List
      itemLayout="horizontal"
      dataSource={getData()}
      renderItem={item => (
        <List.Item actions={item.actions}>
          <List.Item.Meta title={item.title} description={item.description} />
        </List.Item>
      )}
    />
  );
};

const mapStateToProps = state => ({
  currentTheme: state.settings.navTheme,
  navCollapsed: state.settings.collapsed,
});

export default connect(mapStateToProps)(Preference);
