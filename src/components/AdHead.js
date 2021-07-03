/*
 * Maintained by jemo from 2020.7.14 to now
 * Created by jemo on 2020.7.14 15:42:26
 * Ad Head
 * 推广团长
 */

import React, { useState, useEffect } from 'react';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';

function AdHead() {

  const [ adHeadList, setAdHeadList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });

  const { message, open } = snackbarState;

  useEffect(() => {
    fetchAdHeadList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAdHeadList = async () => {
    try {
      const response = await axios.get('/adHeadList');
      const data = response.data || [];
      setAdHeadList(data);
    }
    catch(err) {
      console.error('ad-head-fetch-ad-head-list-error: ', err);
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
        title="团长列表"
        data={adHeadList}
        icons={tableIcons}
        options={{
          actionsColumnIndex: -1,
          filtering: false,
        }}
        localization={{
          header: {
            actions: '操作',
          },
        }}
        columns={[
          {
            title: 'id',
            field: 'id',
          },
          {
            title: '团长id',
            field: 'headId',
          },
          {
            title: '团长名称',
            field: 'headName',
          },
          {
            title: '多多客佣金',
            field: 'dodokCommission',
            type: 'numeric',
          },
          {
            title: '团长佣金',
            field: 'headCommission',
            type: 'numeric',
          },
          {
            title: '优惠券金额',
            field: 'coupon',
            type: 'numeric',
          },
          {
            title: '微信昵称',
            field: 'wechatNickname',
          },
          {
            title: '微信号',
            field: 'wechatNumber',
          },
          {
            title: '拼多多昵称',
            field: 'pddNickname',
          },
        ]}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/adHead', newData);
              handleOpenSnackbar({
                message: '操作成功',
              })
              fetchAdHeadList();
            }
            catch(err) {
              console.error('ad-head-add-error: ', err);
              handleOpenSnackbar({
                message: `出错了：${err.message}`,
              })
            }
            resolve();
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/adHead', newData);
                fetchAdHeadList();
              }
              catch(err) {
                console.error('ad-head-update-error: ', err);
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

export default AdHead;
