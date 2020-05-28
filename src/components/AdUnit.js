/*
 * Maintained by jemo from 2020.5.27 to now
 * Created by jemo on 2020.5.27 11:02:09
 * Ad Unit
 * 推广单元
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdUnit() {

  const [ adUnitList, setAdUnitList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const { id } = useParams();

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

  useEffect(() => {
    const fetchAdUnitList = async () => {
      try {
        const { data } = await axios.get('/adUnitList', {
          params: {
            planId: id,
          },
        });
        setAdUnitList(data);
      }
      catch(err) {
        console.error('ad-unit-fetch-ad-unit-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchAdUnitList();
  }, [id]);

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: '商家Id',
            field: 'mallId',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '计划Id',
            field: 'planId',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '单元Id',
            field: 'adId',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '单元名称',
            field: 'adName',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                adId,
                adName,
              } = rowData;
              return (
                <Link to={`/adUnit/${adId}`}>
                  { adName }
                </Link>
              );
            }
          },
          {
            title: '商品Id',
            field: 'goodsId',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '商品名称',
            field: 'goodsName',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '类型',
            field: 'scenesType',
            lookup: {
              0: '多多搜索',
              1: '聚焦展位',
              2: '多多场景',
            },
            cellStyle: {
              fontSize: 12,
            },
          },
        ]}
        data={adUnitList}
        title="推广单元列表"
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

export default AdUnit;
