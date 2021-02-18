/*
 * Maintained by jemo from 2021.2.13 to now
 * Created by jemo on 2021.2.13 17:08:35
 * Item Stock Check
 * 商品库存检查
 */

import React, { useState, useEffect } from 'react';
import tableIcons from '../utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

function ItemStockCheck() {

  const [ list, setList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;
  const [ selectedRow, setSelectedRow ] = useState();

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await axios.get('/itemStockList');
      const data = response.data || [];
      setList(data);
    }
    catch(err) {
      console.error('ItemStockCheck.js-fetch-list-catch-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  const handleSyncCloudWarehouseStock = async () => {
    try {
      const { data } = await axios.get('/syncCloudWarehouseStock');
      if(data === 'ok') {
        handleOpenSnackbar({
          message: '同步成功',
        });
      } else {
        console.error('ItemStockCheck.js-handleSyncCloudWarehouseStock-ok-error-data: ', data)
        handleOpenErrorSnackbar({
          message: `出错了：${data}`,
        });
      }
    }
    catch(err) {
      console.error('ItemStockCheck.js-handleSyncCloudWarehouseStock-catch-error-response: ', err.response)
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  const handleOpenSnackbar = ({message}) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 2000,
    });
  }

  const handleOpenErrorSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: null,
    });
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({
      open: false,
    });
  }

  const [ columns ] = useState([
    {
      title: 'pddId',
      field: 'pddId',
    },
    {
      title: '是否预售',
      field: 'isPreSale',
      type: 'boolean',
    },
    {
      title: '是否云仓',
      field: 'isCloudWarehouse',
      type: 'boolean',
    },
    {
      title: '是否上架',
      field: 'isOnShelf',
      type: 'boolean',
    },
    /*
    {
      title: 'outGoodsSn',
      field: 'outGoodsSn',
    },
    {
      title: 'groupPrice',
      field: 'groupPrice',
    },
    {
      title: 'isOnSale',
      field: 'isOnSale',
    },
    {
      title: 'normalPrice',
      field: 'normalPrice',
    },
    {
      title: 'outSkuSn',
      field: 'outSkuSn',
    },
    */
    /*
    {
      title: 'skuSoldQuantity',
      field: 'skuSoldQuantity',
    },
    */
    {
      title: 'skuQuantity',
      field: 'skuQuantity',
      type: 'numeric',
    },
    /*
    {
      title: 'searchId',
      field: 'searchId',
    },
    {
      title: 'productId',
      field: 'productId',
    },
    */
    {
      title: 'ycAvailNum',
      field: 'ycAvailNum',
      type: 'numeric',
    },
    {
      title: 'ycStockTips',
      field: 'ycStockTips',
    },
    {
      title: 'spec',
      field: 'spec',
    },
    {
      title: 'skuDesc',
      field: 'skuDesc',
    },
    {
      title: 'specColor',
      field: 'specColor',
    },
    {
      title: 'skuColor',
      field: 'skuColor',
    },
    {
      title: 'specSize',
      field: 'specSize',
    },
    {
      title: 'skuSize',
      field: 'skuSize',
    },
  ]);

  return (
    <div>
      <MaterialTable
        title='库存检查'
        data={list}
        icons={tableIcons}
        options={{
          filtering: true,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
        }}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        columns={columns}
      />
      <Button
        variant='outlined'
        color='primary'
        style={{
          marginTop: 10,
        }}
        onClick={handleSyncCloudWarehouseStock}>
        同步全部云仓库存
      </Button>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default ItemStockCheck;
