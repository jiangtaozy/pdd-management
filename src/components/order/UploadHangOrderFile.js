/*
 * Maintained by jemo from 2020.10.18 to now
 * Created by jemo on 2020.10.18 17:14:04
 * Upload Hang Order File
 * 上传杭州女装网订单文件
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

function UploadHangOrderFile(props) {

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

  const onDropHznz = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0])
      await axios.post('/uploadHznzcnOrderFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      if(props.refresh) {
        props.refresh();
      }
    }
    catch(err) {
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
      console.error("OrderOnDropError: ", err);
    }
  }, []);

  const {
    getRootProps: getRootPropsHznz,
    getInputProps: getInputPropsHznz,
    isDragActive: isDragActiveHznz,
  } = useDropzone({onDrop: onDropHznz});

  return (
    <div>
      <div {...getRootPropsHznz()}>
        <input {...getInputPropsHznz()} />
        {
          isDragActiveHznz ?
            <p>女装网订单文件拖拽到这里</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                marginTop: 10,
              }}>
              选择女装网订单文件
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

export default UploadHangOrderFile;
