/*
 * Maintained by jemo from 2020.5.17 to now
 * Created by jemo on 2020.5.17 21:11:35
 * Order
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';

function Order() {

  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });
  const [ orderList, setOrderList ] = useState([]);
  const [ orderData, setOrderData ] = useState('');
  const { open, message } = snackbarState;

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const { data } = await axios.get('/orderList');
        for(let i = 0; i < data.length; i++) {
          data[i].merchantReceivedAmount = (data[i].productTotalPrice - data[i].storeDiscount) / 100;
          data[i].productTotalPrice = data[i].productTotalPrice / 100;
          data[i].postage = data[i].postage / 100;
          data[i].platformDiscount = data[i].platformDiscount / 100;
          data[i].storeDiscount = data[i].storeDiscount / 100;
        }
        setOrderList(data);
      }
      catch(err) {
        console.error('order-fetch-order-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    }
    fetchOrderList();
  }, []);

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

  const fetchOrderList = async () => {
    try {
      const { data } = await axios.get('/orderList');
      for(let i = 0; i < data.length; i++) {
        data[i].merchantReceivedAmount = (data[i].productTotalPrice - data[i].storeDiscount) / 100;
        data[i].productTotalPrice = data[i].productTotalPrice / 100;
        data[i].postage = data[i].postage / 100;
        data[i].platformDiscount = data[i].platformDiscount / 100;
        data[i].storeDiscount = data[i].storeDiscount / 100;
      }
      setOrderList(data);
    }
    catch(err) {
      console.error('order-fetch-order-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  async function handleOrderDataButtonClick() {
    if(!orderData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/savePddOrderData', {
        orderData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setOrderData('');
      fetchOrderList();
    }
    catch(err) {
      console.error('OrderSavePddOrderDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: "店铺编号",
            field: "mallId",
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
              '654629561': 'k酱十七',
              '777561295': '牧记衣坊',
            },
          },
          {
            title: "订单编号",
            field: "orderId",
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "商品信息",
            render: rowData => {
              return (
                <div style={{
                  width: 200,
                }}>
                  <div style={{
                    fontSize: 12,
                    color: '#888888',
                  }}>
                    ID: {rowData.productId}
                  </div>
                  <div style={{
                    fontSize: 12,
                    lineHeight: '20px',
                    height: 20,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {rowData.productName}
                  </div>
                  <div style={{
                    fontSize: 12,
                  }}>
                    {rowData.productSku}
                  </div>
                </div>
              );
            },
          },
          {
            title: "订单状态",
            field: "orderStatusStr",
            lookup: {
              '待发货': '待发货',
              '已发货，待签收': '已发货，待签收',
              '已签收': '已签收',
              '未发货，退款成功': '未发货，退款成功',
              '已发货，退款成功': '已发货，退款成功',
            },
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "售后状态",
            field: "afterSaleStatus",
            lookup: {
              '0': '无售后',
              '5': '退款成功',
              '12': '售后取消，退款失败',
            },
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "数量",
            field: "numberOfProducts",
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: "商品总价(元)",
            field: "productTotalPrice",
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: "实收金额(元)",
            render: rowData => {
              return (
                <div
                  style={{
                    width: 100,
                  }}>
                  <div style={{
                    fontSize: 12,
                  }}>
                    ￥{rowData.merchantReceivedAmount}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#888888',
                  }}>
                    <div>
                      含配送费: {rowData.postage}
                    </div>
                    <div>
                      含平台优惠券: {rowData.platformDiscount}
                    </div>
                    <div>
                      店铺优惠券: {rowData.storeDiscount}
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            title: "收货人",
            field: "receiver",
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "下单时间",
            render: rowData => {
              const {
                paymentTime,
                joinSuccessTime,
                orderConfirmationTime,
                commitmentDeliveryTime,
                deliveryTime,
                confirmDeliveryTime,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  color: '#888888',
                  width: 200,
                }}>
                  <div>
                    支付时间: {paymentTime}
                  </div>
                  <div>
                    拼单成功时间: {joinSuccessTime}
                  </div>
                  <div>
                    订单确认时间: {orderConfirmationTime}
                  </div>
                  <div>
                    承诺发货时间: {commitmentDeliveryTime}
                  </div>
                  <div>
                    发货时间: {deliveryTime}
                  </div>
                  <div>
                    确认收货时间: {confirmDeliveryTime}
                  </div>
                </div>
              );
            },
          },
          {
            title: "下单",
            render: rowData => {
              const {
                detailUrl,
              } = rowData;
              return (
                <div
                  style={{
                    fontSize: 12,
                  }}>
                  <Link
                    href={detailUrl}
                    target="_blank">
                    <Button
                      variant="outlined"
                      size="small"
                      style={{
                        marginTop: 10,
                        marginLeft: 5,
                      }}>
                      下单
                    </Button>
                  </Link>
                </div>
              );
            },
          },
        ]}
        data={orderList}
        title="订单列表"
        options={{
          filtering: true,
        }}
      />
      <TextField
        label="输入拼多多订单数据(/recentOrderList)"
        multiline
        fullWidth
        value={orderData}
        onChange={(event) => {
          setOrderData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleOrderDataButtonClick}>
        确定
      </Button>
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

export default Order;
