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
        }}
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
            },
          },
          {
            title: '商品编码',
            field: 'outGoodsSn',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '商品名称',
            field: 'name',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '当前价',
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
                  }}>
                  {currentPrice}
                </div>
              );
            },
          },
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
          {
            title: '创建时间',
            field: 'createdAt',
            cellStyle: {
              fontSize: 12,
            },
            type: 'date',
          },
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
        ]}
        data={pddGoodsList}
        title="拼多多商品列表"
      />
      <TextField
        label="输入拼多多商品数据(/goodsList)"
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
