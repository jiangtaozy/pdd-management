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
//import { useDropzone } from 'react-dropzone';
import { GetTimeString } from './utils/Time';
import UploadHangOrderFile from './order/UploadHangOrderFile';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import HangAfterSale from './order/HangAfterSale';
import OrderTimeStatistics from './order/OrderTimeStatistics';

function Order() {

  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });
  const [ orderList, setOrderList ] = useState([]);
  const [ orderData, setOrderData ] = useState('');
  const [ afterSaleOrderData, setAfterSaleOrderData ] = useState('');
  const { open, message } = snackbarState;
  const [ selectedRow, setSelectedRow ] = useState();
  const [ columns ] = useState([
    /*
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
      editable: "never",
    },
    */
    {
      title: "订单编号",
      field: "orderId",
      cellStyle: {
        fontSize: 12,
      },
      editable: "never",
      render: rowData => {
        return (
          <div>
            <CopyToClipboard
              text={rowData.orderId}
              onCopy={() =>
                handleOpenSnackbar({
                  message: '已复制',
                })
              }>
              <Button
                variant="outlined"
                size="small">
                {rowData.orderId}
              </Button>
            </CopyToClipboard>
          </div>
        );
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
            <div style={{
              fontSize: 12,
            }}>
              数量：{rowData.numberOfProducts}
            </div>
            <div style={{
              fontSize: 12,
            }}>
              商品总价：{rowData.productTotalPrice}
            </div>
            <div
              style={{
                fontSize: 12,
              }}>
              <Link
                href={rowData.detailUrl}
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
        '已取消': '已取消',
      },
      cellStyle: {
        fontSize: 12,
      },
      editable: "never",
      defaultFilter: ["待发货"],
    },
    {
      title: "售后状态",
      field: "afterSaleStatus",
      lookup: {
        '0': '无售后',
        '5': '退款成功',
        '10': '商家同意退货退款，待买家发货',
        '11': '用户已发货，待商家处理',
        '12': '售后取消，退款失败',
      },
      cellStyle: {
        fontSize: 12,
      },
      editable: "never",
    },
    {
      title: "女装网订单状态",
      field: "outerOrderStatus",
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
      editable: "never",
    },
    {
      title: "女装网订单商品状态",
      field: "productStatus",
      cellStyle: {
        fontSize: 12,
      },
      editable: "never",
      lookup: {
        '等待配货': '等待配货',
        '配货完成': '配货完成',
        '已发货': '已发货',
        '已收货': '已收货',
      },
    },
    {
      title: "女装网订单售后状态",
      field: "afterSaleStatusStr",
      cellStyle: {
        fontSize: 12,
      },
      editable: "never",
      //lookup: {
      //  '': '',
      //  '已退款': '已退款',
      //  '暂未收到退货包裹（当天签收包裹预计会有3-6小时延时）': '暂未收到退货包裹（当天签收包裹预计会有3-6小时延时）',
      //  '已审核确认，等待退款': '已审核确认，等待退款',
      //  '退货已登记，待售后审核': '退货已登记，待售后审核',
      //  '审核不通过': '审核不通过',
      //},
    },
    /*
    {
      title: "数量",
      field: "numberOfProducts",
      cellStyle: {
        fontSize: 12,
      },
      filtering: false,
      editable: "never",
    },
    {
      title: "商品总价(元)",
      field: "productTotalPrice",
      cellStyle: {
        fontSize: 12,
      },
      filtering: false,
      editable: "never",
    },
    */
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
              <div>
                外部订单支付金额: {rowData.actualPayment}
              </div>
              <div>
                毛利润: {Math.round((rowData.merchantReceivedAmount - rowData.actualPayment) * 100) / 100}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "下单时间",
      render: rowData => {
        const {
          paymentTime,
          //joinSuccessTime,
          //orderConfirmationTime,
          //commitmentDeliveryTime,
          //deliveryTime,
          //confirmDeliveryTime,
          shippingName,
          shippingAddress,
          shippingPhone,
        } = rowData;
        return (
          <div style={{
            fontSize: 12,
            color: '#888888',
            width: 200,
          }}>
            <div>
              支付时间: {GetTimeString(paymentTime)}
            </div>
            {/*
            <div>
              拼单成功时间: {GetTimeString(joinSuccessTime)}
            </div>
            <div>
              订单确认时间: {GetTimeString(orderConfirmationTime)}
            </div>
            <div>
              承诺发货时间: {GetTimeString(commitmentDeliveryTime)}
            </div>
            <div>
              发货时间: {GetTimeString(deliveryTime)}
            </div>
            <div>
              确认收货时间: {GetTimeString(confirmDeliveryTime)}
            </div>
            */}
            <div>
              收货人: {shippingName}
            </div>
            <div>
              地址: {shippingAddress}
            </div>
            <div>
              手机号: {shippingPhone}
            </div>
          </div>
        );
      },
    },
    /*
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
    */
    {
      title: "商品id",
      field: "productId",
      cellStyle: {
        fontSize: 12,
      },
      filtering: false,
      editable: "never",
    },
    {
      title: "外部订单号",
      field: "outerOrderId",
      cellStyle: {
        fontSize: 12,
      },
      filtering: false,
      render: rowData => {
        return (
          <div>
            <CopyToClipboard
              text={rowData.outerOrderId}
              onCopy={() =>
                handleOpenSnackbar({
                  message: '已复制',
                })
              }>
              <Button
                variant="outlined"
                size="small">
                {rowData.outerOrderId}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
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

  async function handleAfterSaleOrderDataButtonClick() {
    if(!afterSaleOrderData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/afterSaleOrderDataSave', {
        afterSaleOrderData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setAfterSaleOrderData('');
      fetchOrderList();
    }
    catch(err) {
      console.error('OrderHandleAfterSaleOrderDataButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  /*
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
    }
    catch(err) {
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
      console.error("OrderOnDropError: ", err);
    }

  }, []);
  */

  /*
  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({onDrop});
  */

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={orderList}
        title="订单列表"
        options={{
          filtering: true,
          actionsColumnIndex: -1,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
        }}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/itemOrderUpdate', newData);
                if(data === 'ok') {
                  orderList[orderList.indexOf(oldData)] = newData;
                  handleOpenSnackbar({
                    message: '操作成功',
                  })
                } else {
                  handleOpenSnackbar({
                    message: `出错了：${data}`,
                  })
                }
              }
              catch(err) {
                console.error('OrderUpdateSearchTitleError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
              resolve();
            }),
        }}
      />
      {/*
        拼多多订单数据
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
        fullWidth
        style={{
          marginTop: 10,
        }}
        onClick={handleOrderDataButtonClick}>
        确定
      </Button>
      */}
      {/*
        女装网订单文件
      */}
      <UploadHangOrderFile
        refresh={fetchOrderList}
      />
      {/*
        拼多多售后订单数据
      <TextField
        label="输入拼多多售后订单数据(/queryList)"
        multiline
        fullWidth
        value={afterSaleOrderData}
        onChange={(event) => {
          setAfterSaleOrderData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        style={{
          marginTop: 10,
        }}
        onClick={handleAfterSaleOrderDataButtonClick}>
        确定
      </Button>
      */}
      {/*
        女装网售后订单文件
      */}
      <div
        style={{
          marginTop: 10,
        }}>
        <HangAfterSale
          refresh={fetchOrderList}
        />
      </div>
      {/*
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
              选择拼多多订单文件(保存快递单号，快递公司)
            </Button>
        }
      </div>
      */}
      <OrderTimeStatistics
        data={orderList}
      />
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
