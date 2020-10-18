/*
 * Maintained by jemo from 2020.6.13 to now
 * Created by jemo on 2020.6.13 16:01:06
 * Ad Unit List
 * 全部推广单元列表
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import SaveAdUnitData from './SaveAdUnitData';
import AdUnitKeywordSave from './AdUnitKeywordSave';
import SaveAdUnitHourlyData from './ad-unit/SaveAdUnitHourlyData';

function AdUnitList() {

  const [ adUnitList, setAdUnitList ] = useState([]);
  const [ totalData, setTotalData ] = useState({});
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
        let impression = 0;
        let click = 0;
        let orderNum = 0;
        let mallFavNum = 0;
        let goodsFavNum = 0;
        for(let i = 0; i < data.length; i++) {
          impression += data[i].impression;
          click += data[i].click;
          orderNum += data[i].orderNum;
          mallFavNum += data[i].mallFavNum;
          goodsFavNum += data[i].goodsFavNum;
        }
        const ctr = click / impression;
        const cvr = orderNum / click;
        const cmfr = mallFavNum / click;
        const cgfr = goodsFavNum / click;
        setTotalData({
          ctr,
          cvr,
          cmfr,
          cgfr,
        });
        for(let i = 0; i < data.length; i++) {
          data[i].ctrScore = data[i].ctr > ctr;
          data[i].cvrScore = data[i].cvr > cvr;
          data[i].cmfrScore = data[i].cmfr > cmfr;
          data[i].cgfrScore = data[i].cgfr > cgfr;
          data[i].score = data[i].ctrScore + data[i].cvrScore + data[i].cmfrScore + data[i].cgfrScore;
        }
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

  const {
    ctr,
    cvr,
    cmfr,
    cgfr,
  } = totalData;

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
          searchFieldAlignment: 'left',
        }}
        data={adUnitList}
        title={
          <div>
            <div>
              全部推广单元列表 AdUnitList.js
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 12,
                marginTop: 5,
              }}>
              <div
                style={{
                  marginRight: 10,
                }}>
                点击率：{ (ctr * 100).toFixed(2) }%
              </div>
              <div
                style={{
                  marginRight: 10,
                }}>
                转化率：{ (cvr * 100).toFixed(2) }%
              </div>
              <div
                style={{
                  marginRight: 10,
                }}>
                关注率：{ (cmfr * 100).toFixed(2) }%
              </div>
              <div
                style={{
                  marginRight: 10,
                }}>
                收藏率：{ (cgfr * 100).toFixed(2) }%
              </div>
            </div>
          </div>
        }
        columns={[
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
                  <Link to={`/adUnit/${adId}`}>
                    { adName }
                  </Link>
                  <div>
                    商品名：{goodsName}
                  </div>
                  <div>
                    计划名：{planName}
                  </div>
                  <div>
                    计划Id：{planId}
                  </div>
                  <div>
                    单元Id：{adId}
                  </div>
                  <div>
                    商品Id：{goodsId}
                  </div>
                  <Link to={`/keyword/${adId}`}>
                    关键词
                  </Link>
                </div>
              );
            }
          },
          {
            title: '类型',
            field: 'scenesType',
            lookup: {
              0: '多多搜索',
              1: '聚焦展位',
              2: '多多场景',
            },
            defaultFilter: ['0'],
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '曝光量',
            field: 'impression',
            filtering: false,
            defaultSort: 'desc',
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
            title: '订单量',
            field: 'orderNum',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
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
            title: '点击率',
            field: 'ctr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { ctr, ctrScore } = rowData;
              return (
                <div
                  style={{
                    color: ctrScore ? 'green' : 'red',
                  }}>
                  {ctr && `${(ctr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '点击转化率',
            field: 'cvr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cvr, cvrScore } = rowData;
              return (
                <div
                  style={{
                    color: cvrScore ? 'green' : 'red',
                  }}>
                  {cvr && `${(cvr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '点击关注率',
            field: 'cmfr',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cmfr, cmfrScore } = rowData;
              return (
                <div
                  style={{
                    color: cmfrScore ? 'green' : 'red',
                  }}>
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
              const { cgfr, cgfrScore } = rowData;
              return (
                <div
                  style={{
                    color: cgfrScore ? 'green' : 'red',
                  }}>
                  {cgfr && `${(cgfr * 100).toFixed(2)}%`}
                </div>
              )
            }
          },
          {
            title: '数据分',
            field: 'score',
            filtering: false,
            cellStyle: {
              fontSize: 12,
            },
          },
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
            defaultFilter: ['777561295'],
          },
          {
            title: '商品Id',
            field: 'goodsId',
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
            defaultSort: 'desc',
          },
        ]}
      />
      <SaveAdUnitData />
      <SaveAdUnitHourlyData />
      <AdUnitKeywordSave />
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
