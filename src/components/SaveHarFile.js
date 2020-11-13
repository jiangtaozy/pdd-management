/*
 * Maintained by jemo from 2020.11.11 to now
 * Created by jemo on 2020.11.11 12:06:46
 * Save Har File
 */

import React, {
  useState,
  useCallback,
} from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

function SaveHarFile() {

  const onDrop = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0])
      await axios.post('/saveHarFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      console.error("OrderOnDropError: ", err);
    }

  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({onDrop});

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

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>HAR文件</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                marginTop: 10,
              }}>
              保存HAR文件
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

export default SaveHarFile;
