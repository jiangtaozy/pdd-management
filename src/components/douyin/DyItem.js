/*
 * Maintained by jemo from 2020.9.10 to now
 * Created by jemo on 2020.9.10 15:59:30
 * Douyin Item List
 * 抖音商品列表
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';

function DyItem() {

  //const [ list, setList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;

  const handleOpenSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
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
      }
      catch(err) {
        console.error('dy-item-fetch-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchList();
  }, []);

  return (
    <div>
      抖音商品
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={2000}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default DyItem;
