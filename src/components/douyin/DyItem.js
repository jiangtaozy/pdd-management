/*
 * Maintained by jemo from 2020.9.10 to now
 * Created by jemo on 2020.9.10 15:59:30
 * Douyin Item List
 * 抖音商品列表
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

function DyItem() {

  //const [ list, setList ] = useState([]);
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

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axios.get('/dyItemList');
        console.log("data: ", data);
        handleOpenSnackbar({
          message: '更新成功',
        });
      }
      catch(err) {
        console.error('dy-item-fetch-list-error: ', err);
        handleOpenErrorSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    //fetchList();
  }, []);

  const handleSyncDyData = async () => {
    try {
      const { data } = await axios.get('/syncDyItemData');
      console.log("data: ", data);
    }
    catch(err) {
      console.error('dy-item-sync-dy-data-error.response: ', err.response);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  return (
    <div>
      <Button
        variant='outlined'
        color='primary'
        onClick={handleSyncDyData}>
        同步抖音商品数据
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

export default DyItem;
