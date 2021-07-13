/*
 * Maintained by jemo from 2021.7.13 to now
 * Created by jemo on 2021.7.13 15:37:20
 * After Sales Order
 * 售后订单
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import { TimeFormat } from './utils/Time';

function AfterSalesOrder() {
  const [ list, setList ] = useState([]);
  const [ showLoading, setShowLoading ] = useState(false);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;
  /*
  const openSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 2000, // 毫秒
    });
  }
  */
  const openErrorSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: null,
    });
  }
  const closeSnackbar = () => {
    setSnackbarState({
      open: false,
    });
  }
  const fetchList = async () => {
    setShowLoading(true);
    try {
      const { data } = await axios.get('/afterSalesOrder');
      setList(data);
    }
    catch(err) {
      console.error('after-sales-order-fetch-list-catch-error: ', err);
      openErrorSnackbar({
        message: `出错了：${err.message}`,
      });
    }
    setShowLoading(false);
  }
  useEffect(() => {
    fetchList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [ columns ] = useState([
    {
      title: "售后原因",
      field: "afterSalesReasonDesc",
    },
    {
      title: "售后状态",
      field: "afterSalesStatus",
    },
    {
      title: "售后状态描述",
      field: "afterSalesTitle",
    },
    {
      title: "售后类型",
      field: "afterSalesType",
    },
    {
      title: "订单号",
      field: "orderSn",
    },
    {
      title: "售后物流状态",
      field: "sellerAfterSalesShippingStatus",
    },
    {
      title: "售后物流状态描述",
      field: "sellerAfterSalesShippingStatusDesc",
    },
    {
      title: "售后申请时间",
      field: "createdAt",
      render: rowData => {
        const {
          createdAt,
        } = rowData;
        return (
          <div>
            {TimeFormat(new Date(createdAt * 1000), 'yyyy/MM/dd')}
          </div>
        );
      },
    },
    {
      title: "女装网订单号",
      field: "outerOrderId",
    },
    {
      title: "女装网售后状态描述",
      field: "womenAfterSaleStatusStr",
    },
  ]);
  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={list}
        title="售后订单"
        options={{
          filtering: true,
        }}
      />
      <Backdrop
        style={{
          zIndex: 11,
          color: "#fff",
        }}
        open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={closeSnackbar}
        message={message}
      />
    </div>
  );
}

export default AfterSalesOrder;
