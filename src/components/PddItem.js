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
import { Link } from 'react-router-dom';

function PddItem() {

  const [ pddGoodsData, setPddGoodsData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  })
  const [ pddGoodsList, setPddGoodsList ] = useState([]);

  const { message, open } = snackbarState;

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
            shippingPrice = 4.4;
          }
          const costPrice = Math.round((shippingPrice + suitPrice) * 100) / 100;
          const profit = Math.round((skuGroupPriceMax / 100 - costPrice) * 100) / 100;
          data[i].costPrice = costPrice;
          data[i].profit = profit;
          data[i].conversionThreshold = Math.round(0.1 / profit * 100 * 100) / 100;
          data[i].profitMargin = Math.round(profit / skuGroupPriceMax * 100 * 100 * 100) / 100;
          data[i].promotionProfit = Math.round((skuGroupPriceMax / 100 * (1 - 0.33) - 10 - costPrice) * 100) / 100;
          data[i].limitDiscount = Math.round((1 - (profit - 10 - 5) / (skuGroupPriceMax / 100)) * 10 * 100) / 100;
          data[i].jinbaoCommission = Math.round(((profit - 10 - 5 - 10) / 1.1 / (skuGroupPriceMax / 100)) *100 * 100) / 100;
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
          shippingPrice = 4.4;
        }
        const costPrice = Math.round((shippingPrice + suitPrice) * 100) / 100;
        const profit = Math.round((skuGroupPriceMax / 100 - costPrice) * 100) / 100;
        data[i].costPrice = costPrice;
        data[i].profit = profit;
        data[i].conversionThreshold = Math.round(0.1 / profit * 100 * 100) / 100;
        data[i].profitMargin = Math.round(profit / skuGroupPriceMax * 100 * 100 * 100) / 100;
        data[i].promotionProfit = Math.round((skuGroupPriceMax / 100 * (1 - 0.33) - 10 - costPrice) * 100) / 100;
        data[i].limitDiscount = Math.round((1 - (profit - 10 - 5) / (skuGroupPriceMax / 100)) * 10 * 100) / 100;
        data[i].jinbaoCommission = Math.round(((profit - 10 - 5 - 10) / 1.1 / (skuGroupPriceMax / 100)) *100 * 100) / 100;
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
          headerStyle: {
            position: 'sticky',
            top: 0,
          },
          maxBodyHeight: 650,
        }}
        data={pddGoodsList}
        title="拼多多商品列表"
        columns={[
          {
            title: '店铺',
            field: 'siteType',
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
              1: 'k酱十七',
              2: '牧记衣坊',
            },
          },
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
                      <Link to={`/product/select/${outGoodsSn}`}>
                        商品编码：{outGoodsSn}
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
                  </div>
                </div>
              );
            },
          },
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
          {
            title: '当前价',
            headerStyle: {
              color: '#3333FF',
            },
            render: rowData => {
              const {
                skuGroupPriceMin,
                skuGroupPriceMax,
              } = rowData;
              var currentPrice = skuGroupPriceMin / 100;
              if(skuGroupPriceMin !== skuGroupPriceMax) {
                currentPrice = `${currentPrice}-${skuGroupPriceMax / 100}`;
              }
              return (
                <div
                  style={{
                    fontSize: 12,
                    color: '#3333FF',
                  }}>
                  {currentPrice}
                </div>
              );
            },
          },
          {
            title: '成本价',
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
            title: '限时折扣',
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
          {
            title: '进宝比例',
            field: 'jinbaoCommission',
            cellStyle: {
              fontSize: 12,
              color: '#7D3C98',
            },
            headerStyle: {
              color: '#7D3C98',
            },
            render: rowData => {
              const {
                jinbaoCommission,
              } = rowData;
              return (
                <div>
                  {jinbaoCommission}%
                </div>
              );
            },
          },
          {
            title: '进宝33 10',
            field: 'promotionProfit',
            cellStyle: {
              fontSize: 12,
              color: '#BA4A00',
            },
            headerStyle: {
              color: '#BA4A00',
            },
          },
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
          {
            title: '是否在售',
            field: 'isOnsale',
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
