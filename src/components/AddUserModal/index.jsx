import React, { useEffect, useRef } from 'react';
import { Input, Modal, Form, Button, Icon, Spin, List } from 'antd';
import { connect } from 'dva';
import ZCPPartyListItem from '@/pages/Quotes/CreateQuote/Components/ZCPPartyListItem';

const { Search } = Input;

const AddUserModal = props => {
  const { visible, selectedUsers, setSelectedUsers, setAddUserModal, setData, data } = props;
  const scrollParentRef = useRef(null);

  let modifiedpartyList = [];

  const selectedPocs = selectedUsers.map(poc => poc.partyId);

  modifiedpartyList =
    data &&
    data.map(el => {
      if (selectedPocs.includes(el.partyId)) {
        return {
          ...el,
          checked: true,
        };
      }
      return {
        ...el,
        checked: false,
      };
    });

  useEffect(() => {
    if (props.currentUser.orgId) {
      props.dispatch({
        type: 'globalemployee/getAllEmployees',
        payload: {
          displayName: '',
          employerId: props.currentUser.orgId,
          viewSize: 50,
          startIndex: 0,
          showInActiveEmployees: true,
        },
        cb: res => {
          setData(res.partyList);
        },
      });
    }
  }, []);

  const handleSubmit = () => {
    props.dispatch({
      type: 'globalemployee/addUser',
      payload: {
        partyId: '10520',
      },
    });
  };

  // const action = (text, selRecords, partyList) => {
  //   // call to the api will only happen if the span between two key press is > 400
  //   fetchRecords(text, selRecords, partyList);
  // };
  // function debounce(func, wait) {
  //   let timeout;
  //   return (...args) => {
  //     const context = this;
  //     if (timeout) clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       timeout = null;
  //       func.apply(context, args);
  //     }, wait);
  //   };
  // }

  // const debounceSearch = React.useCallback(debounce(action, 400), []);

  const handlePartyItemClick = item => {
    if (!item.checked) {
      const checkedItem = {
        designation: item.designation,
        displayName: item.displayName,
        emailAddress: item.emailAddress,
        partyId: item.partyId,
        thumbNailUrl: item.thumbNailUrl,
      };
      setSelectedUsers(prevRecords => [...prevRecords, checkedItem]);
    } else {
      // remove the item from partyPoc
      setSelectedUsers(prevRecords => {
        const copiedPartyPoc = [...prevRecords];
        const index = copiedPartyPoc.findIndex(pl => pl.partyId === item.partyId);
        copiedPartyPoc.splice(index, 1);
        return copiedPartyPoc;
      });
    }
  };
  return (
    <Modal
      width="640px"
      destroyOnClose
      title="Add user"
      className="zcp-fancy-modal"
      visible={visible}
      onCancel={() => {
        setAddUserModal(false);
      }}
      maskClosable={false}
      footer={
        <div>
          <Button onClick={handleSubmit} type="primary">
            Add
          </Button>
        </div>
      }
    >
      <div className="p-4 border-b">
        <Search
          allowClear
          size="large"
          className="zcp-modal-search-input"
          placeholder="Search contacts"
          // onChange={e => debounceSearch(e.target.value)}
        />
      </div>
      <Spin spinning={null} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
        <div
          id="browsePOCSearchKeywordInputWrapper"
          className="zcp-responsive-modal-content-body"
          ref={scrollParentRef}
        >
          <Form>
            <div className="zcp-search-results-wrapper">
              <div>
                <ul className="zcp-modal-search-results">
                  <List
                    itemLayout="horizontal"
                    dataSource={modifiedpartyList}
                    renderItem={item => (
                      <ZCPPartyListItem onListItemClick={handlePartyItemClick} item={item} />
                    )}
                  />
                </ul>
              </div>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};
const mapStateToProps = ({ user, globalemployee, loading, collections }) => ({
  currentUser: user.currentUser,
  listOfEmployees: globalemployee.listOfEmployees,
  totalEmployees: globalemployee.totalEmployees,
  loading: loading.effects['globalemployee/getAllEmployees'],
  treeOfCollections: collections.treeOfCollections || [],
  loadingCollections: loading.effects['collections/getChildItemsAndCollections'],
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(AddUserModal);
