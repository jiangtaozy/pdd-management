/*
 * Maintained by jemo from 2020.6.29 to now
 * Created by jemo on 2020.6.29 11:25:58
 * Save Ad Unit Data
 * 保存广告单元数据
 */

import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function SaveAdUnitData() {

  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [ date, setDate ] = useState(yesterday);
  const [ unitListData, setUnitListData ] = useState('');
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

  async function handleUnitListDataButtonClick() {
    if(!unitListData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/saveAdUnitDataOfDate', {
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        unitListData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setUnitListData('');
    }
    catch(err) {
      console.error('AdUnitDataUploadAdUnitDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  return (
    <div>
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}>
        <DatePicker
          style={{
            marginTop: 10,
          }}
          value={date}
          onChange={setDate}
          format="yyyy-MM-dd"
        />
      </MuiPickersUtilsProvider>
      <TextField
        label="输入推广单元列表数据(昨天/listPage(推广单元-推广中-50页))"
        multiline
        fullWidth
        value={unitListData}
        onChange={(event) => {
          setUnitListData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth={true}
        style={{
          marginTop: 10,
        }}
        onClick={handleUnitListDataButtonClick}>
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

export default SaveAdUnitData;
