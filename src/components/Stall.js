/*
 * Maintained by jemo from 2020.5.28 to now
 * Created by jemo on 2020.5.28 17:59:19
 * Stall
 * 档口
 */

import React, { useState, useEffect } from 'react';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';

function Stall() {

  const [ stallList, setStallList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });

  const { message, open } = snackbarState;

  useEffect(() => {
    const fetchStallList = async () => {
      try {
        const { data } = await axios.get('/stallList');
        setStallList(data);
      }
      catch(err) {
        console.error('StallFetchStallListError: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        })
      }
    };
    fetchStallList();
  }, []);

  const fetchStallList = async () => {
    try {
      const { data } = await axios.get('/stallList');
      setStallList(data);
    }
    catch(err) {
      console.error('StallFetchStallListError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      })
    }
  };

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

  return (
    <div>
      <MaterialTable
        title="档口"
        data={stallList}
        icons={tableIcons}
        options={{
          actionsColumnIndex: -1
        }}
        localization={{
          header: {
            actions: '操作',
          },
        }}
        columns={[
          {
            title: '名称',
            field: 'name',
          },
          {
            title: '城市',
            field: 'cityName',
            lookup: {
              '杭州': '杭州',
            },
          },
          {
            title: '商城',
            field: 'mallName',
            lookup: {
              '中纺中心': '中纺中心',
            },
          },
          {
            title: '楼层',
            field: 'floor',
            type: 'numeric',
          },
          {
            title: '档口号',
            field: 'stallNumber',
          },
          {
            title: '手机',
            field: 'phone',
          },
          {
            title: '电话',
            field: 'telephone',
          },
          {
            title: '微信',
            field: 'wechat',
          },
          {
            title: 'qq',
            field: 'qq',
          },
          {
            title: '数据包网址',
            field: 'dataUrl',
            render: rowData => {
              const { dataUrl } = rowData
              return (
                <Link
                  target="_blank"
                  href={`http://${dataUrl}`}>
                  { dataUrl }
                </Link>
              );
            },
          },
          {
            title: '档口网址',
            field: 'stallUrl',
            render: rowData => {
              const { stallUrl } = rowData
              return (
                <Link
                  target="_blank"
                  href={stallUrl}>
                  { stallUrl }
                </Link>
              );
            },
          },
        ]}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/stall', newData);
              handleOpenSnackbar({
                message: '操作成功',
              })
              resolve();
            }
            catch(err) {
              console.error('StallAddError: ', err);
              handleOpenSnackbar({
                message: `出错了：${err.message}`,
              })
            }
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/stall', newData);
                fetchStallList();
              }
              catch(err) {
                console.error('StallUpdateError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
              resolve();
            });
          }
        }}
      />
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

export default Stall;
