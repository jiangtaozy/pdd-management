/*
 * Maintained by jemo from 2020.9.10 to now
 * Created by jemo on 2020.9.10 15:59:30
 * Douyin Item List
 * 抖音商品列表
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import tableIcons from '../utils/TableIcons';
import MaterialTable from 'material-table';
import { GetTimeString } from '../utils/Time';
import Link from '@material-ui/core/Link';

function DyItem() {

  const [ list, setList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;
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

  const fetchList = async () => {
    try {
      const { data } = await axios.get('/dyItemList');
      setList(data);
    }
    catch(err) {
      console.error('dy-item-fetch-list-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSyncDyData = async () => {
    try {
      const { data } = await axios.get('/syncDyItemData');
      console.log("data: ", data);
      fetchList();
      handleOpenSnackbar({
        message: '同步成功',
      });
    }
    catch(err) {
      console.error('dy-item-sync-dy-data-error.response: ', err.response);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      });
    }
  }

  const [ columns ] = useState([
    {
      title: '商品信息',
      field: 'name',
      render: rowData => {
        const {
          img,
          name,
          productIdStr,
          outProductId,
          detailUrl,
          womenName,
        } = rowData;
        return (
          <div
            style={{
              display: 'flex',
            }}>
            <div>
              <img alt=''
                src={img}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 10,
                fontSize: 12,
                width: 150,
              }}>
              <div
                style={{
                  color: '#666',
                }}>
                {productIdStr}
              </div>
              <div>
                {name}
              </div>
              <div>
                {outProductId}
              </div>
              <div>
                <Link
                  href={detailUrl}
                  target='_blank'>
                  {womenName}
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
          discountPrice,
        } = rowData;
        return (
          <div>
            {discountPrice / 100}
          </div>
        );
      },
    },
    {
      title: '状态',
      field: 'status',
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
      title: '女装网名称',
      field: 'womenName',
    },
    {
      title: '商品id',
      field: 'productIdStr',
    },
    {
      title: '女装网id',
      field: 'outProductId',
    },
    {
      title: '商品状态',
      field: 'status',
      lookup: {
        0: '上架',
        1: '下架',
      },
      defaultFilter: ['0'],
    },
    {
      title: '审核状态',
      field: 'checkStatus',
      lookup: {
        1: '未提审',
        2: '审核中',
        3: '审核通过',
        4: '审核驳回',
        5: '封禁',
      },
      defaultFilter: ['3'],
    },
  ]);

  return (
    <div>
      <MaterialTable
        title='抖音商品列表'
        icons={tableIcons}
        columns={columns}
        data={list}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        options={{
          filtering: true,
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
        onClick={handleSyncDyData}>
        同步抖音商品数据
      </Button>
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

export default DyItem;
