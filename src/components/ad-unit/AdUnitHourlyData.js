/*
 * Maintained by jemo from 2020.8.29 to now
 * Created by jemo on 2020.8.29 10:05:59
 * Ad Unit Hourly Data
 * 推广单元小时数据
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';

function AdUnitHourlyData(props) {

  const [ hourlyData, setHourlyData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;

  const handleOpenSnackbar = ({message}) => {
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

  async function handleHourlyDataButtonClick() {
    if(!hourlyData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      const data = JSON.parse(hourlyData);
      await axios.post('/adUnitHourlyDataSave', data);
      handleOpenSnackbar({
        message: '操作成功',
      });
      setHourlyData('');
    }
    catch(err) {
      console.error('AdUnitHourlyDataSaveUploadError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  return (
    <div
      style={{
        marginBottom: 100,
      }}>
      <TextField
        label="输入推广单元小时数据(按日期/queryHourlyReport)"
        multiline
        fullWidth
        value={hourlyData}
        onChange={(event) => {
          setHourlyData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleHourlyDataButtonClick}>
        确定
      </Button>
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

export default AdUnitHourlyData;
