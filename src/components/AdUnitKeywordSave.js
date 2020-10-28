/*
 * Maintained by jemo from 2020.8.14 to now
 * Created by jemo on 2020.8.14 15:51:28
 * Ad Unit Keyword
 * 保存推广单元关键词列表
 */

import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function AdUnitKeywordSave (props) {

  const [ keywordData, setKeywordData ] = useState('');

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

  async function handleKeywordDataButtonClick() {
    if(!keywordData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/adUnitKeywordCreate', {
        keywordData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setKeywordData('');
      if(props.refreshData) {
        props.refreshData();
      }
    }
    catch(err) {
      console.error('ad-unit-keyword-save-post-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  return (
    <div>
      <TextField
        label="请输入某个推广单元某天的关键词数据(/listKeywordPage)"
        multiline
        fullWidth
        value={keywordData}
        onChange={(event) => {
          setKeywordData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth={true}
        style={{
          marginTop: 20,
        }}
        onClick={handleKeywordDataButtonClick}>
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

export default AdUnitKeywordSave;
