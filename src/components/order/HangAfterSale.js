/*
 * Maintained by jemo from 2020.9.7 to now
 * Created by jemo on 2020.9.7 10:55:40
 * Hang Zhou Women After Sale Order
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from '../utils/TableIcons';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { useDropzone } from 'react-dropzone';

function HangAfterSale() {

  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });
  const { open, message } = snackbarState;

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

  const onDrop = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      await axios.post("/hangAfterSaleOrderUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
    }
    catch(err) {
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
      console.error("HangAfterSaleOnDropError: ", err);
    }
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({onDrop});

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>女装网售后订单文件 return_list</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                textTransform: 'none',
              }}>
              女装网售后订单文件 return_list
            </Button>
        }
      </div>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={2000}
        open={open}
        message={message}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

export default HangAfterSale;
