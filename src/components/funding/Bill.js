/*
 * Maintained by jemo from 2020.10.12 to now
 * Created by jemo on 2020.10.12 16:26:23
 * Bill
 * 货款明细
 */

import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

function Bill() {

  const [ billData, setBillData ] = useState('');

  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });

  async function handleBillDataButtonClick() {
    if(!billData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/billDataSave', JSON.parse(billData));
      handleOpenSnackbar({
        message: '操作成功',
      });
      setBillData('');
    }
    catch(err) {
      console.error('BillHandleBillDataButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

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

  return (
    <div>
      <TextField
        label="输入对账中心-货款明细数据(/queryUserDefinedBill)"
        multiline
        fullWidth
        value={billData}
        onChange={(e) => {
          setBillData(e.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleBillDataButtonClick}>
        确定
      </Button>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={2000}
        open={snackbarState.open}
        message={snackbarState.message}
        onClose={handleCloseSnackbar}
      />
    </div>
  );

}

export default Bill;
