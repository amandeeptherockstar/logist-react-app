import { List, Switch } from 'antd';
import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi-plugin-locale';

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren={formatMessage({
          id: 'user-accountsetting.settings.open',
        })}
        unCheckedChildren={formatMessage({
          id: 'user-accountsetting.settings.close',
        })}
        defaultChecked
      />
    );
    return [
      {
        title: formatMessage(
          {
            id: 'user-accountsetting.notification.password',
          },
          {},
        ),
        description: formatMessage(
          {
            id: 'user-accountsetting.notification.password-description',
          },
          {},
        ),
        actions: [Action],
      },
      {
        title: formatMessage(
          {
            id: 'user-accountsetting.notification.messages',
          },
          {},
        ),
        description: formatMessage(
          {
            id: 'user-accountsetting.notification.messages-description',
          },
          {},
        ),
        actions: [Action],
      },
      {
        title: formatMessage(
          {
            id: 'user-accountsetting.notification.todo',
          },
          {},
        ),
        description: formatMessage(
          {
            id: 'user-accountsetting.notification.todo-description',
          },
          {},
        ),
        actions: [Action],
      },
    ];
  };

  render() {
    const data = this.getData();
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default NotificationView;
