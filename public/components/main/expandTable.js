import React, { useState, Fragment } from 'react';
//import { formatDate } from '../../../../../src/services/format';
//import { createDataStore } from '../data_store';

import {
  EuiBasicTable,
  EuiButtonIcon,
  EuiHealth,
  EuiButton,
  EuiDescriptionList,
} from '@elastic/eui';

import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';

/*
Example user object:

{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  dateOfBirth: Date.now(),
  nationality: 'NL',
  online: true
}

Example country object:

{
  code: 'NL',
  name: 'Netherlands',
  flag: '🇳🇱'
}
*/

//const store = createDataStore();

export const Main = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  // const onTableChange = ({ page = {}, sort = {} }) => {
  //   const { index: pageIndex, size: pageSize } = page;

  //   const { field: sortField, direction: sortDirection } = sort;

  //   setPageIndex(pageIndex);
  //   setPageSize(pageSize);
  //   setSortField(sortField);
  //   setSortDirection(sortDirection);
  // };

  // const onSelectionChange = selectedItems => {
  //   setSelectedItems(selectedItems);
  // };

  // const onClickDelete = () => {
  //  // store.deleteUsers(...selectedItems.map(user => user.id));

  //   setSelectedItems([]);
  // };

  const renderDeleteButton = () => {
    if (selectedItems.length === 0) {
      return;
    }
    return (
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} Users
      </EuiButton>
    );
  };

  const toggleDetails = item => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {
      const { nationality, online } = item;
     // const country = store.getCountry(nationality);
      const color = online ? 'success' : 'danger';
      const label = online ? 'Online' : 'Offline';
      const listItems = [
        {
          title: 'Nationality',
          description: `Country`,
        },
        {
          title: 'Online',
          description: <EuiHealth color={color}>{label}</EuiHealth>,
        },
      ];
      itemIdToExpandedRowMapValues[item.id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const { pageOfItems, totalItemCount } = {
      pageOfItems: [
          {
            id:1,
              firstName: "ANil",
              lastName: "Joseph",

          },
          {
            id:2,
            firstName: "ANil",
            lastName: "Joseph",

        },
        {
          id:3,
          firstName: "ANil",
          lastName: "Joseph",

      },
      {
        id:4,
        firstName: "ANil",
        lastName: "Joseph",

    }
      ],
      totalItemCount: 5
  }

  //const deleteButton = renderDeleteButton();

  const columns = [
    {
      field: 'firstName',
      name: 'First Name',
      sortable: true,
      truncateText: true,
      mobileOptions: {
        render: item => (
          <span>
            {item.firstName} {item.lastName}
          </span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        fullWidth: true,
      },
    },
    {
      field: 'lastName',
      name: 'Last Name',
      truncateText: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      name: 'Actions',
      actions: [
        {
          name: 'Clone',
          description: 'Clone this person',
          type: 'icon',
          icon: 'copy',
          onClick: () => '',
        },
      ],
    },
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      render: item => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item)}
          aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
          iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
    },
  ];

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [3, 5, 8],
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  // const selection = {
  //   selectable: user => user.online,
  //   selectableMessage: selectable =>
  //     !selectable ? 'User is currently offline' : undefined,
  //   onSelectionChange: onSelectionChange,
  // };

  return (
    <Fragment>
      {/* {deleteButton} */}
      <EuiBasicTable
        items={pageOfItems}
        itemId="id"
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        //isExpandable={true}
        hasActions={true}
        columns={columns}
        //pagination={pagination}
        //sorting={sorting}
        // isSelectable={true}
        // selection={selection}
        // onChange={onTableChange}
      />
    </Fragment>
  );
};

//export default Table;