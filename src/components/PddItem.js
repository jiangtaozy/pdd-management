/*
 * Maintained by jemo from 2020.5.24 to now
 * Created by jemo on 2020.5.24 10:17:02
 * Pdd Item
 * 拼多多商品
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

function PddItem() {

  const [ pddGoodsData, setPddGoodsData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  })
  const [ pddGoodsList, setPddGoodsList ] = useState([]);

  const { message, open } = snackbarState;
  const [ selectedRow, setSelectedRow ] = useState();

  async function handlePddGoodsDataButtonClick() {
    if(!pddGoodsData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/uploadPddItemData', {
        pddGoodsData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setPddGoodsData('');
      fetchPddGoods();
    }
    catch(err) {
      console.error('PddItemUploadPddItemDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  const handleOpenSnackbar = ({message}) => {
    setSnackbarState({
      message,
      open: true,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({
      open: false,
    });
  }

  useEffect(() => {
    fetchPddGoods();
  }, []);

  const fetchPddGoods = async () => {
    try {
      const { data } = await axios.get('/pddGoods');
      for(let i = 0; i < data.length; i++) {
        let {
          shippingPrice,
          suitPrice,
          siteType,
          skuGroupPriceMax,
        } = data[i];
        if(siteType === 2) {
          shippingPrice = 5.5;
        }
        const price = skuGroupPriceMax / 100;
        // 运费 + 售价 + 运费险(约 2 元) + 服务费(0.6%)
        const costPrice = Math.round((shippingPrice + suitPrice + 6 + 4.5 + price * 0.006) * 100) / 100;
        const profit = Math.round((price - costPrice) * 100) / 100;
        data[i].costPrice = costPrice;
        data[i].profit = profit;
        data[i].conversionThreshold = Math.round(0.1 / profit * 100 * 100) / 100;
        data[i].profitMargin = Math.round(profit / price * 100 * 100) / 100;
        data[i].promotionProfit = Math.round(((price - 10) * (1 - 0.33) - costPrice) * 100) / 100;
        data[i].limitDiscount = Math.round((1 - profit / price) * 10 * 100) / 100;
        data[i].fiftyProfitPrice = Math.round((suitPrice + shippingPrice + 4.5 + 6) / (1 - 0.006 - 0.5))
        const adList = data[i].adList || [];
        let impression = 0;
        let click = 0;
        let spend = 0;
        for(let i = 0; i < adList.length; i++) {
          const ad = adList[i];
          impression += ad.impression;
          click += ad.click;
          spend += ad.spend;
        }
        data[i].impression = impression;
        data[i].click = click;
        data[i].spend = spend / 1000;
        data[i].ctr = impression ? (click / impression).toFixed(4) : 0;
        const orderList = data[i].orderList || [];
        let orderProfit = 0;
        let totalOrderNum = 0;
        let realOrderNum = 0;
        for(let j = 0; j < orderList.length; j++) {
          const order = orderList[j];
          const {
            orderStatus,
            afterSaleStatus,
            actualPayment,
            platformDiscount,
            userPaidAmount,
          } = order;
          if(orderStatus === 1) {
            totalOrderNum++;
            if(!afterSaleStatus) {
              orderProfit += (platformDiscount + userPaidAmount) / 100 - actualPayment;
              realOrderNum++;
            }
          }
        }
        data[i].orderProfit = Math.round(orderProfit * 100) / 100;
        data[i].perClickProfit = Math.round((orderProfit / click || 0) * 100) / 100;
        data[i].perClickSpend = Math.round((spend / 1000 / click || 0) * 100) / 100;
        data[i].perClickProfitSpend = 0;
        data[i].totalOrderNum = totalOrderNum;
        data[i].realOrderNum = realOrderNum;
        data[i].afterSaleRate = totalOrderNum ? (totalOrderNum - realOrderNum) / totalOrderNum : 0;
        if(spend !== 0) {
          data[i].perClickProfitSpend = Math.round((orderProfit / (spend / 1000) || 0) * 100) / 100;
        }
      }
      setPddGoodsList(data);
    }
    catch(err) {
      console.error('pdd-item-fetch-pdd-goods-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  };

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        options={{
          filtering: true,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
        }}
        data={pddGoodsList}
        title="拼多多商品列表"
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        columns={[
          {
            title: "商品信息",
            field: 'goodsName',
            render: rowData => {
              const {
                thumbUrl,
                pddId,
                goodsInfoScr,
                goodsName,
                outGoodsSn,
                isOnsale,
                name,
                detailUrl,
              } = rowData;
              return (
                <div style={{
                  display: 'flex',
                }}>
                  <img alt=""
                    src={thumbUrl}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 10,
                    fontSize: 12,
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{
                        color: '#666',
                      }}>
                        {pddId}
                      </div>
                      <div>
                        {goodsInfoScr}
                      </div>
                    </div>
                    <div style={{
                      width: 200,
                    }}>
                      {goodsName}
                    </div>
                    <div style={{
                      color: '#666',
                    }}>
                      <RouterLink to={`/product/select/${outGoodsSn}`}>
                        商品编码：{outGoodsSn}
                      </RouterLink>
                    </div>
                    <div
                      style={{
                        width: 200,
                      }}>
                      <Link
                        href={detailUrl}
                        target="_blank">
                        {name}
                      </Link>
                    </div>
                    {!isOnsale ?
                      <div
                        style={{
                          color: 'red',
                        }}>
                        已下架
                      </div> : null
                    }
                    <div style={{
                      color: '#eb4d4b',
                    }}>
                      <RouterLink
                        to={`/product/data/${pddId}`}
                        style={{
                          color: '#eb4d4b',
                        }}>
                        商品数据
                      </RouterLink>
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            title: '售价',
            field: 'skuGroupPriceMin',
            headerStyle: {
              color: '#3333FF',
            },
            render: rowData => {
              const {
                skuGroupPriceMin,
                skuGroupPriceMax,
                costPrice,
                profit,
                fiftyProfitPrice,
                suitPrice,
                shippingPrice,
              } = rowData;
              var currentPrice = skuGroupPriceMin / 100;
              if(skuGroupPriceMin !== skuGroupPriceMax) {
                currentPrice = `${currentPrice}-${skuGroupPriceMax / 100}`;
              }
              return (
                <div
                  style={{
                    fontSize: 10,
                    width: 120,
                  }}>
                  <div
                    style={{
                      color: '#3333FF',
                    }}>
                    售价：{currentPrice}
                  </div>
                  <div
                    style={{
                      color: '#17A589',
                    }}>
                    成本价：{suitPrice}
                  </div>
                  <div
                    style={{
                      color: '#17A589',
                    }}>
                    运费、礼品费、发货费、服务费、运费险：{Math.round((shippingPrice + 6 + 4.5 + currentPrice * 0.006) * 100) / 100}
                  </div>
                  <div
                    style={{
                      color: '#17A589',
                    }}>
                    总成本：{costPrice}
                  </div>
                  <div
                    style={{
                      color: '#d63031',
                    }}>
                    利润：{profit}
                  </div>
                  <div
                    style={{
                      color: '#2ed573',
                    }}>
                    利润率：{(profit / currentPrice * 100).toFixed(1)}%
                  </div>
                  <div
                    style={{
                      color: '#3742fa',
                    }}>
                    毛利润50%售价(包括优惠)：{fiftyProfitPrice}：<span style={{fontSize: 24, color: '#eb2f06'}}>{Math.floor(fiftyProfitPrice / 10) * 10 + 9}</span>
                  </div>
                  <div
                    style={{
                      color: '#EA2027',
                    }}>
                    阈值ROI：{Math.round(currentPrice * 0.9 / profit * 100) / 100}
                  </div>
                  <div
                    style={{
                      color: '#9b59b6',
                    }}>
                    抖音售价：{Math.round((suitPrice + shippingPrice) / (1 - 0.1 - 0.4))}
                  </div>
                  <div
                    style={{
                      color: '#34495e',
                    }}>
                    抖音成本：{suitPrice + shippingPrice}
                  </div>
                  <div
                    style={{
                      color: '#e74c3c',
                    }}>
                    抖音佣金：{Math.round((suitPrice + shippingPrice) / (1 - 0.1 - 0.4) * 0.4)}
                  </div>
                  <div
                    style={{
                      color: '#e84393',
                    }}>
                    抖音利润：{Math.round((suitPrice + shippingPrice) / (1 - 0.1 - 0.4) * 0.1)}
                  </div>
                </div>
              );
            },
          },
          {
            title: '利润',
            field: 'profit',
            cellStyle: {
              fontSize: 12,
              color: '#9B59B6',
            },
            headerStyle: {
              color: '#9B59B6',
            },
          },
          {
            title: '利润率',
            field: 'profitMargin',
            headerStyle: {
              color: '#388E3C',
            },
            render: rowData => {
              const {
                profitMargin,
              } = rowData;
              return (
                <div
                  style={{
                    fontSize: 12,
                    color: '#388E3C',
                  }}>
                  {profitMargin}%
                </div>
              );
            },
          },
          {
            title: '商品名称',
            field: 'name',
            cellStyle: {
              fontSize: 12,
              color: '#9B59B6',
            },
            headerStyle: {
              color: '#9B59B6',
            },
          },
          /*
          {
            title: '单次点击利润',
            field: 'perClickProfit',
            cellStyle: {
              fontSize: 12,
              color: '#e74c3c',
            },
            headerStyle: {
              color: '#e74c3c',
            },
          },
          */
          {
            title: '利润花费比',
            field: 'perClickProfitSpend',
            cellStyle: {
              fontSize: 12,
              color: '#ff0000',
            },
            headerStyle: {
              color: '#ff0000',
            },
          },
          {
            title: '曝光量',
            field: 'impression',
            cellStyle: {
              fontSize: 12,
              color: '#3498db',
            },
            headerStyle: {
              color: '#3498db',
            },
          },
          {
            title: '点击量',
            field: 'click',
            cellStyle: {
              fontSize: 12,
              color: '#3498db',
            },
            headerStyle: {
              color: '#3498db',
            },
          },
          {
            title: '点击率',
            field: 'ctr',
            cellStyle: {
              fontSize: 12,
              color: '#3498db',
            },
            headerStyle: {
              color: '#3498db',
            },
          },
          {
            title: '花费',
            field: 'spend',
            cellStyle: {
              fontSize: 12,
              color: '#9b59b6',
            },
            headerStyle: {
              color: '#9b59b6',
            },
          },
          {
            title: '订单利润',
            field: 'orderProfit',
            cellStyle: {
              fontSize: 12,
              color: '#f1c40f',
            },
            headerStyle: {
              color: '#f1c40f',
            },
          },
          {
            title: '总订单量',
            field: 'totalOrderNum',
            cellStyle: {
              fontSize: 12,
              color: '#f1c40f',
            },
            headerStyle: {
              color: '#f1c40f',
            },
          },
          {
            title: '无售后订单量',
            field: 'realOrderNum',
            cellStyle: {
              fontSize: 12,
              color: '#3333FF',
            },
            headerStyle: {
              color: '#3333FF',
            },
          },
          {
            title: '退货率',
            field: 'afterSaleRate',
            cellStyle: {
              fontSize: 12,
              color: '#eb2f06',
            },
            headerStyle: {
              color: '#eb2f06',
            },
            render: rowData => {
              const {
                afterSaleRate,
              } = rowData;
              return (
                <div>
                  {Math.round(afterSaleRate * 100 * 100) / 100}%
                </div>
              );
            },
          },
          /*
          {
            title: '单次点击花费',
            field: 'perClickSpend',
            cellStyle: {
              fontSize: 12,
              color: '#27ae60',
            },
            headerStyle: {
              color: '#27ae60',
            },
          },
          */
          /*
          {
            title: '成本',
            field: 'costPrice',
            cellStyle: {
              fontSize: 12,
              color: '#17A589',
            },
            headerStyle: {
              color: '#17A589',
            },
          },
          {
            title: '利润',
            field: 'profit',
            cellStyle: {
              fontSize: 12,
              color: '#F1C40F',
            },
            headerStyle: {
              color: '#F1C40F',
            },
          },
          */
          {
            title: '商品id',
            field: 'pddId',
            cellStyle: {
              fontSize: 12,
              color: '#EC7063',
            },
            headerStyle: {
              color: '#EC7063',
            },
          },
          {
            title: '商品编码',
            field: 'outGoodsSn',
            cellStyle: {
              fontSize: 12,
              color: '#9B59B6',
            },
            headerStyle: {
              color: '#9B59B6',
            },
          },
          /*
          {
            title: '折扣阈值',
            field: 'limitDiscount',
            cellStyle: {
              fontSize: 12,
              color: '#707B7C',
            },
            headerStyle: {
              color: '#707B7C',
            },
            render: rowData => {
              const {
                limitDiscount,
              } = rowData;
              return (
                <div
                  style={{
                    fontSize: 12,
                    color: '#707B7C',
                  }}>
                  {limitDiscount}折
                </div>
              );
            },
          },
          */
          /*
          {
            title: '转化阈值',
            headerStyle: {
              color: '#039BE5',
            },
            render: rowData => {
              const {
                conversionThreshold,
              } = rowData;
              return (
                <div
                  style={{
                    fontSize: 12,
                    color: '#039BE5',
                  }}>
                  {conversionThreshold}%
                </div>
              );
            },
          },
          */
          {
            title: '是否在售',
            field: 'isOnsale',
            type: 'boolean',
            defaultFilter: "checked",
            cellStyle: {
              fontSize: 12,
              color: '#9B59B6',
            },
            headerStyle: {
              color: '#9B59B6',
            },
          },
          {
            title: '店铺',
            field: 'siteType',
            defaultFilter: ['2'],
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
              1: '1688',
              2: '女装网',
            },
          },
          /*
          {
            title: '收藏数',
            field: 'favCnt',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '库存',
            field: 'quantity',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '累计销量',
            field: 'soldQuantity',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '30日销量',
            field: 'soldQuantityForThirtyDays',
            cellStyle: {
              fontSize: 12,
            },
          },
          */
          /*
          {
            title: '创建时间',
            field: 'createdAt',
            cellStyle: {
              fontSize: 12,
              color: '#33FF00',
            },
            headerStyle: {
              color: '#33FF00',
            },
            type: 'date',
          },
          */
          /*
          {
            title: '展示权重',
            field: 'displayPriority',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '是否新品',
            field: 'ifNewGoods',
            cellStyle: {
              fontSize: 12,
            },
            type: 'boolean',
          },
          */
        ]}
      />
      <TextField
        label="输入拼多多商品数据(/goodsList)"
        multiline
        fullWidth
        value={pddGoodsData}
        onChange={(event) => {
          setPddGoodsData(event.target.value)
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth={true}
        style={{
          marginTop: 10,
        }}
        onClick={handlePddGoodsDataButtonClick}
      >
        确定
      </Button>
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

export default PddItem;
