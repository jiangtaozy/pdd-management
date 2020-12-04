/*
 * Maintained by jemo from 2020.12.3 to today
 * Created by jemo on 2020.12.3 15:17:17
 * Douyin Order List
 * 抖音订单列表
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { TimeFormat } from '../utils/Time';
import { GetTimeString } from '../utils/Time';
import tableIcons from '../utils/TableIcons';
import MaterialTable from 'material-table';
import Link from '@material-ui/core/Link';

function DyOrder() {

  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;
  const [ list, setList ] = useState([]);
  const [ selectedRow, setSelectedRow ] = useState();

  const handleOpenSnackbar = ({ message }) => {
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

  const handleSyncDyOrderData = async () => {
    try {
      const now = new Date();
      const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      const { data } = await axios.get('/syncDyOrderData', {
        params: {
          startTime: TimeFormat(yesterday, 'yyyy/MM/dd hh:mm:ss'),
          endTime: TimeFormat(now, 'yyyy/MM/dd hh:mm:ss'),
        },
      });
      console.log("data: ", data);
      handleOpenSnackbar({
        message: '同步成功',
      });
    }
    catch(err) {
      console.error('dy-order-sync-dy-order-data-error-response: ', err.response)
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axios.get('/dyOrderList');
        setList(data);
      }
      catch(err) {
        console.error('dy-order-fetch-list-error: ', err);
        handleOpenErrorSnackbar({
          message: `出错了：${err.response && err.response.data}`,
        });
      }
    };
    fetchList();
  }, []);

  const [ columns ] = useState([
    {
      title: '商品信息',
      field: 'name',
      render: rowData => {
        const {
          productPic,
          productId,
          productName,
          detailUrl,
          code,
        } = rowData;
        return (
          <div
            style={{
              display: 'flex',
            }}>
            <img alt=''
              src={productPic}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 10,
                fontSize: 12,
              }}>
              <div
                style={{
                  color: '#666',
                }}>
                {productId}
              </div>
              <div>
                {productName}
              </div>
              <div>
                <Link
                  href={detailUrl}
                  target='_blank'>
                  {code}
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '售价',
      field: 'discountPrice',
      headerStyle: {
        color: '#3333FF',
      },
      render: rowData => {
        const {
          totalAmount,
        } = rowData;
        return (
          <div>
            {totalAmount / 100}
          </div>
        );
      },
    },
    {
      title: '编码',
      field: 'code',
    },
    {
      title: '女装网Id',
      field: 'outProductId',
    },
    {
      title: '创建时间',
      field: 'createTime',
      render: rowData => {
        const {
          createTime,
        } = rowData;
        return (
          <div>
            {GetTimeString(createTime)}
          </div>
        );
      },
    },
    {
      title: '订单id',
      field: 'orderId',
    },
  ]);

  return (
    <div>
      <MaterialTable
        title='抖音订单列表'
        icons={tableIcons}
        columns={columns}
        data={list}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        options={{
          filtering: false,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (
              selectedRow &&
              selectedRow.tableData.id === rowData.tableData.id
            ) ? '#EEE' : '#fff',
          }),
        }}
      />
      <Button
        variant='outlined'
        color='primary'
        onClick={handleSyncDyOrderData}>
        同步昨天抖店订单数据
      </Button>
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default DyOrder;
