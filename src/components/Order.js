/*
 * Maintained by jemo from 2020.5.17 to now
 * Created by jemo on 2020.5.17 21:11:35
 * Order
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import Button from '@material-ui/core/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function Order() {

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  });
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const { data } = await axios.get('/orderList');
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

  const { open, message } = snackbarState;

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
      await axios.post('/uploadPddOrderFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      const fetchOrderList = async () => {
        try {
          const { data } = await axios.get('/orderList');
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

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          /*
          {
            title: "id",
            field: "id",
          },
          */
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
            field: "orderStatus",
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "售后状态",
            field: "afterSaleStatus",
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
          },
          {
            title: "商品总价(元)",
            field: "productTotalPrice",
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: "实收金额(元)",
            render: rowData => {
              return (
                <div>
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
            title: "收货信息",
            render: rowData => {
              const {
                receiver,
                phone,
                province,
                city,
                district,
                street,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  width: 200,
                }}>
                  <div>
                    收件人: {`${receiver} ${phone}`}
                  </div>
                  <div>
                    联系地址: {`${province}${city}${district} ${street}`}
                  </div>
                  <CopyToClipboard
                    text={`${receiver} ${phone} ${province}${city}${district} ${street}`}
                    onCopy={() => handleOpenSnackbar({
                      message: '复制成功',
                    })}>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{
                        marginTop: 10,
                      }}>
                      复制
                    </Button>
                  </CopyToClipboard>
                </div>
              );
            },
          },
        ]}
        data={orderList}
        title="订单列表"
      />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>拼多多订单文件拖拽到这里</p> :
            <Button
              variant="outlined"
              size="large"
              style={{
                marginTop: 10,
              }}>
              选择拼多多订单文件
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

export default Order;
