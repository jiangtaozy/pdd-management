/*
 * Maintained by jemo from 2020.7.3 to now
 * Created by jemo on 2020.7.3 17:08:48
 * 1688 Order
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';

function Order1688() {

  const [ orderList, setOrderList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });
  const { open, message } = snackbarState;

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const { data } = await axios.get('/order1688List');
        setOrderList(data);
      }
      catch(err) {
        console.error('order-1688-fetch-order-list-error: ', err);
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

  const onDrop = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0])
      await axios.post('/upload1688OrderFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      const fetchOrderList = async () => {
        try {
          const { data } = await axios.get('/order1688List');
          setOrderList(data);
        }
        catch(err) {
          console.error('order-1688-fetch-order-list-error: ', err);
          handleOpenSnackbar({
            message: `出错了：${err.message}`,
          });
        }
      }
      fetchOrderList();
    }
    catch(err) {
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
      console.error("OrderOnDropError: ", err);
    }
  }, []);

  const onDropHznz = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0])
      await axios.post('/uploadHznzcnOrderFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      const fetchOrderList = async () => {
        try {
          const { data } = await axios.get('/order1688List');
          setOrderList(data);
        }
        catch(err) {
          console.error('order-1688-fetch-order-list-error: ', err);
          handleOpenSnackbar({
            message: `出错了：${err.message}`,
          });
        }
      }
      fetchOrderList();
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

  const {
    getRootProps: getRootPropsHznz,
    getInputProps: getInputPropsHznz,
    isDragActive: isDragActiveHznz,
  } = useDropzone({onDrop: onDropHznz});

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
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
              const {
                productTitle,
                price,
                amount,
              } = rowData;
              return (
                <div style={{
                  width: 200,
                }}>
                  <div style={{
                    fontSize: 12,
                  }}>
                    {productTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#888888',
                    }}>
                    单价：￥{price}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#888888',
                    }}>
                    数量：{amount}
                  </div>
                </div>
              );
            },
          },
          {
            title: "订单状态",
            field: "orderStatus",
            lookup: {
              0: '待付款',
              1: '待发货',
              2: '待收货',
              3: '已收货',
              4: '交易成功',
              5: '已退换货',
              6: '交易关闭',
            },
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "实付金额(元)",
            render: rowData => {
              const {
                actualPayment,
                totalPrice,
                shippingFare,
                discount,
              } = rowData;
              return (
                <div>
                  <div style={{
                    fontSize: 12,
                  }}>
                    ￥{actualPayment}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#888888',
                  }}>
                    <div>
                      总价: ￥{totalPrice}
                    </div>
                    <div>
                      运费: ￥{shippingFare}
                    </div>
                    <div>
                      折扣: ￥{discount}
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
                orderCreatedTime,
                orderPaymentTime,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  color: '#888888',
                  width: 150,
                }}>
                  <div>
                    订单创建时间:
                  </div>
                  <div>
                    {orderCreatedTime}
                  </div>
                  <div>
                    订单支付时间:
                  </div>
                  <div>
                    {orderPaymentTime}
                  </div>
                </div>
              );
            },
          },
          {
            title: "收货信息",
            render: rowData => {
              const {
                receiver,
                phone,
                shippingAddress,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  width: 150,
                }}>
                  <div>
                    收件人: {`${receiver} ${phone}`}
                  </div>
                  <div>
                    联系地址: {shippingAddress}
                  </div>
                </div>
              );
            },
          },
          {
            title: "物流信息",
            render: rowData => {
              const {
                courierCompany,
                trackingNumber,
              } = rowData;
              return (
                <div
                  style={{
                    fontSize: 12,
                    width: 150,
                  }}>
                  <div>
                    快递公司: {courierCompany}
                  </div>
                  <div>
                    快递单号: {trackingNumber}
                  </div>
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
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>1688 订单文件拖拽到这里</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                marginTop: 10,
              }}>
              选择 1688 订单文件
            </Button>
        }
      </div>
      <div {...getRootPropsHznz()}>
        <input {...getInputPropsHznz()} />
        {
          isDragActiveHznz ?
            <p>女装网订单文件拖拽到这里</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                marginTop: 10,
              }}>
              选择女装网订单文件
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

export default Order1688;
