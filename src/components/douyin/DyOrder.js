/*
 * Maintained by jemo from 2020.12.3 to today
 * Created by jemo on 2020.12.3 15:17:17
 * Douyin Order List
 * 抖音订单列表
 */

import React, { useState } from 'react';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

function DyOrder() {
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;

  const handleOpenSnackbar = ({ message }) => {
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

  const handleSyncDyOrderData = async () => {
    try {
      const { data } = await axios.get('/syncDyOrderData');
      console.log("data: ", data);
      handleOpenSnackbar({
        message: '同步成功',
      });
    }
    catch(err) {
      console.error('dy-order-sync-dy-order-data-error-response: ', err.response)
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  return (
    <div>
      抖音订单列表
      <Button
        variant='outlined'
        color='primary'
        onClick={handleSyncDyOrderData}>
        同步抖店订单数据
      </Button>
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default DyOrder;
