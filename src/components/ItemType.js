/*
 * Maintained by jemo from 2022.4.18 to now
 * Created by jemo on 2022.4.18 10:11:45
 * 商品类型
 */

import React, { useState, useEffect } from 'react';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';

function ItemType() {

  const [ itemTypeList, setItemTypeList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });

  const { message, open } = snackbarState;

  useEffect(() => {
    fetchItemTypeList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchItemTypeList = async () => {
    try {
      const { data } = await axios.get('/itemTypeList');
      setItemTypeList(data || []);
    }
    catch(err) {
      console.error('ItemTypeFetchError: ', err);
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
        title="商品类型"
        data={itemTypeList}
        icons={tableIcons}
        options={{
          actionsColumnIndex: -1,
          paging: false,
        }}
        localization={{
          header: {
            actions: '操作',
          },
        }}
        columns={[
          {
            title: '名称',
            field: 'typeName',
          },
          {
            title: '编码',
            field: 'typeNum',
          },
        ]}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/itemType', newData);
              handleOpenSnackbar({
                message: '操作成功',
              })
              fetchItemTypeList();
              resolve();
            }
            catch(err) {
              console.error('ItemTypeAddError: ', err);
              handleOpenSnackbar({
                message: `出错了：${err.message}`,
              })
            }
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/itemType', newData);
                handleOpenSnackbar({
                  message: '操作成功',
                })
                fetchItemTypeList();
                resolve();
              }
              catch(err) {
                console.error('ItemTypeUpdateError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
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

export default ItemType;
