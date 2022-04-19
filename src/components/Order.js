/*
 * Maintained by jemo from 2020.5.17 to now
 * Created by jemo on 2020.5.17 21:11:35
 * Order
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { GetTimeString } from './utils/Time';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function Order() {

  const [ orderList, setOrderList ] = useState([]);
  const [ selectedRow, setSelectedRow ] = useState();
  const [ columns ] = useState([
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
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant="outlined"
                size="small">
                {rowData.orderId}
              </Button>
            </CopyToClipboard>
            <Link
              href={rowData.detailUrl.startsWith('https') ? rowData.detailUrl : 'https://www.hznzcn.com' + rowData.detailUrl}
              target="_blank">
              <Button
                variant="outlined"
                size="small"
                style={{
                  marginTop: 10,
                  marginLeft: 5,
                }}>
                详情下单
              </Button>
            </Link>
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
                href={`https://mms.pinduoduo.com/orders/detail?type=4399&sn=${rowData.orderId}`}
                target="_blank">
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    marginTop: 10,
                    marginLeft: 5,
                  }}>
                  订单详情
                </Button>
              </Link>
              <Link
                href={`https://detail.1688.com/offer/detail.1688.com/offer/${rowData.originalId}.html.html?sk=consign`}
                target="_blank">
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    marginTop: 10,
                    marginLeft: 5,
                  }}>
                  代发下单
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
      title: "阿里/女装网订单状态",
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
    },
    {
      title: "实收金额(元)",
      render: rowData => {
        return (
          <div
            style={{
              width: 120,
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
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant="outlined"
                size="small">
                {rowData.outerOrderId}
              </Button>
            </CopyToClipboard>
            <Link
              href={`https://mms.pinduoduo.com/orders/detail?type=4399&sn=${rowData.orderId}`}
              target="_blank">
              <Button
                variant="outlined"
                size="small"
                style={{
                  marginTop: 10,
                  marginLeft: 5,
                }}>
                拼多多订单详情
              </Button>
            </Link>
            <Link
              href={`https://trade.1688.com/order/new_step_order_detail.htm?orderId=${rowData.outerOrderId}`}
              target="_blank">
              <Button
                variant="outlined"
                size="small"
                style={{
                  marginTop: 10,
                  marginLeft: 5,
                }}>
                阿里订单详情
              </Button>
            </Link>
          </div>
        );
      },
    },
    {
      title: '是否自己发货',
      field: 'isSelfDelivery',
      type: 'boolean',
      cellStyle: {
        fontSize: 12,
        color: '#9B59B6',
      },
      headerStyle: {
        color: '#9B59B6',
      },
    },
    {
      title: '省',
      field: 'province',
      cellStyle: {
        fontSize: 12,
        color: '#9B59B6',
      },
      headerStyle: {
        color: '#9B59B6',
      },
    },
    {
      title: "下单时间",
      render: rowData => {
        const {
          paymentTime,
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
    {
      title: "商品id",
      field: "productId",
      cellStyle: {
        fontSize: 12,
      },
      filtering: false,
      editable: "never",
    },
  ]);

  useEffect(() => {
    fetchOrderList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrderList = async () => {
    try {
      const { data } = await axios.get('/orderList');
      for(let i = 0; i < data.length; i++) {
        data[i].merchantReceivedAmount = (data[i].productTotalPrice - data[i].storeDiscount) / 100;
        data[i].productTotalPrice = data[i].productTotalPrice / 100;
        data[i].postage = data[i].postage / 100;
        data[i].platformDiscount = data[i].platformDiscount / 100;
        data[i].storeDiscount = data[i].storeDiscount / 100;
        data[i].isSelfDelivery = data[i].productId === '312761354809';
      }
      setOrderList(data);
    }
    catch(err) {
      console.error('order-fetch-order-list-error: ', err);
    }
  }

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={orderList}
        title="订单列表"
        options={{
          filtering: true,
          actionsColumnIndex: 9,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/itemOrderUpdate', newData);
                if(data === 'ok') {
                  orderList[orderList.indexOf(oldData)] = newData;
                  console.log("操作成功: ", );
                } else {
                  console.error("出错了: ", data);
                }
              }
              catch(err) {
                console.error('OrderUpdateSearchTitleError: ', err);
              }
              resolve();
            }),
        }}
      />
    </div>
  );
}

export default Order;
