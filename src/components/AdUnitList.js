/*
 * Maintained by jemo from 2020.6.13 to now
 * Created by jemo on 2020.6.13 16:01:06
 * Ad Unit List
 * 推广单元列表
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';

function AdUnitList() {

  const [ adUnitList, setAdUnitList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;

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
        const { data } = await axios.get('/adUnitListAll');
        setAdUnitList(data);
      }
      catch(err) {
        console.error('ad-unit-list-fetch-ad-unit-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchAdUnitList();
  }, []);

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        options={{
          filtering: true,
        }}
        columns={[
          {
            title: '商家Id',
            field: 'mallId',
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
             654629561: 'k酱十七',
             777561295: '牧记衣坊',
            },
          },
          /*
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
          */
          {
            title: '单元信息',
            field: 'adName',
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
            render: rowData => {
              const {
                planName,
                planId,
                adId,
                adName,
                goodsId,
                goodsName,
              } = rowData;
              return (
                <div style={{
                  width: 150,
                }}>
                  <div>
                    计划名：{planName}
                  </div>
                  <Link to={`/adUnit/${adId}`}>
                    单元名：{ adName }
                  </Link>
                  <div>
                    商品Id：{goodsId}
                  </div>
                  <div>
                    商品名：{goodsName}
                  </div>
                  <div>
                    计划Id：{planId}
                  </div>
                  <div>
                    单元Id：{adId}
                  </div>
                </div>
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
          /*
          {
            title: '商品名称',
            field: 'goodsName',
            cellStyle: {
              fontSize: 12,
            },
          },
          */
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
          {
            title: '曝光量',
            field: 'impression',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '点击量',
            field: 'click',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '花费',
            field: 'spend',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { spend } = rowData;
              return (
                <div>
                  {spend / 1000}
                </div>
              )
            }
          },
          {
            title: '点击率',
            field: 'ctr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { ctr } = rowData;
              return (
                <div>
                  {ctr && `${(ctr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '订单量',
            field: 'orderNum',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '点击转化率',
            field: 'cvr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cvr } = rowData;
              return (
                <div>
                  {cvr && `${(cvr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '交易额',
            field: 'gmv',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { gmv } = rowData;
              return (
                <div>
                  {gmv / 1000}
                </div>
              )
            }
          },
          {
            title: '店铺关注量',
            field: 'mallFavNum',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '商品收藏量',
            field: 'goodsFavNum',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '点击关注率',
            field: 'cmfr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cmfr } = rowData;
              return (
                <div>
                  {cmfr && `${(cmfr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '点击收藏率',
            field: 'cgfr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cgfr } = rowData;
              return (
                <div>
                  {cgfr && `${(cgfr * 100).toFixed(2)}%`}
                </div>
              )
            }
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

export default AdUnitList;
