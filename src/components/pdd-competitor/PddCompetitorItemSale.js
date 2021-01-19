/*
 * Maintained by jemo from 2021.1.19 to now
 * Created by jemo on 2021.1.19 17:31:43
 * 拼多多竞争对手商品销量
 */

import React, { useState, useEffect } from 'react';
import tableIcons from '../utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import { useParams } from 'react-router-dom';

function PddCompetitorItemSale() {

  const [ pddCompetitorItemSaleList, setPddCompetitorItemSaleList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });

  const { message, open, autoHideDuration } = snackbarState;

  useEffect(() => {
    fetchPddCompetitorItemSaleList();
  }, []);

  const { itemId } = useParams();

  const fetchPddCompetitorItemSaleList = async () => {
    try {
      const response = await axios.get('/pddCompetitorItemSaleList', {
        params: {
          itemId,
        },
      });
      const data = response.data || [];
      setPddCompetitorItemSaleList(data);
    }
    catch(err) {
      console.error('pdd-competitor-item-sale-fetch-pdd-competitor-item-sale-list-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      })
    }
  };

  const handleOpenSnackbar = ({message}) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 2000,
    });
  }

  const handleOpenErrorSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: null,
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
        title="竞争对手商品销量"
        data={pddCompetitorItemSaleList}
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
            title: '商品id',
            field: 'goodsId',
            editable: 'never',
            initialEditValue: itemId,
          },
          {
            title: '日期',
            field: 'date',
            type: 'date',
          },
          {
            title: '销量',
            field: 'sale',
          },
        ]}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/pddCompetitorItemSaleSave', newData);
              handleOpenSnackbar({
                message: '操作成功',
              });
              fetchPddCompetitorItemSaleList();
            }
            catch(err) {
              console.error('pdd-competitor-item-sale-add-error: ', err);
              handleOpenErrorSnackbar({
                message: `出错了：${err.response && err.response.data}`,
              })
            }
            resolve();
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/pddCompetitorItemSaleSave', newData);
                handleOpenSnackbar({
                  message: '操作成功',
                });
                fetchPddCompetitorItemSaleList();
              }
              catch(err) {
                console.error('pdd-competitor-item-sale-update-error: ', err);
                handleOpenErrorSnackbar({
                  message: `出错了：${err.response && err.response.data}`,
                });
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
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default PddCompetitorItemSale;
