import { Icon, Input, Modal } from 'antd';
import React, { Component } from 'react';

import debounce from 'lodash/debounce';
import styles from './index.less';

export default class HeaderSearch extends Component {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {},
    onSearch: () => {},
    onChange: () => {},
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false,
    onVisibleChange: () => {},
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }

    return null;
  }

  timeout = undefined;

  inputRef = null;

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: '',
    };
    this.debouncePressEnter = debounce(this.debouncePressEnter, 500, {
      leading: true,
      trailing: false,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { onPressEnter } = this.props;
      const { value } = this.state;
      this.timeout = window.setTimeout(() => {
        onPressEnter(value); // Fix duplicate onPressEnter
      }, 0);
    }
  };

  onChange = value => {
    // alert(1);
    if (typeof value === 'string') {
      const { onSearch, onChange } = this.props;
      this.setState({
        value,
      });

      if (onSearch) {
        onSearch(value);
      }

      if (onChange) {
        onChange(value);
      }
    }
  };

  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState(
      {
        searchMode: true,
      },
      () => {
        const { searchMode } = this.state;

        if (searchMode && this.inputRef) {
          this.inputRef.focus();
        }
      },
    );
  };

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
    });
  };

  debouncePressEnter = () => {
    const { onPressEnter } = this.props;
    const { value } = this.state;
    onPressEnter(value);
  };

  render() {
    const { className, placeholder, open, ...restProps } = this.props;
    const { searchMode, value } = this.state;
    delete restProps.defaultOpen; // for rc-select not affected

    return (
      <span>
        <Icon type="search" key="Icon" onClick={this.enterSearchMode} />
        <Modal
          className={styles.widthModal}
          style={{ top: 20, width: '80% !important' }}
          visible={this.state.searchMode}
          onTransitionEnd={({ propertyName }) => {
            if (propertyName === 'width' && !searchMode) {
              const { onVisibleChange } = this.props;
              onVisibleChange(searchMode);
            }
          }}
          onCancel={this.leaveSearchMode}
          footer={null}
          maskClosable={false}
        >
          <Input
            ref={node => {
              this.inputRef = node;
            }}
            {...restProps}
            value={value}
            onChange={e => {
              this.onChange(e.target.value);
            }}
            style={{ marginTop: '15px' }}
            aria-label={placeholder}
            placeholder={placeholder}
            onKeyDown={this.onKeyDown}
          />
          <div style={{ marginTop: '10px', overflow: 'auto', height: '100%', maxHeight: '500px' }}>
            {' '}
            {this.props.dataSource}
          </div>
        </Modal>
      </span>
    );
  }
}
