/*
 * Maintained by jemo from 2020.5.27 to now
 * Created by jemo on 2020.5.27 15:49:42
 * Ad Unit Data
 * 推广单元数据
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function AdUnitData () {

  const [ unitData, setUnitData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const [ unitDataList, setUnitDataList ] = useState([]);
  const [ adUnit, setAdUnit ] = useState([]);
  const { message, open } = snackbarState;
  const { id } = useParams();

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

  async function handleUnitDataButtonClick() {
    if(!unitData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/adUnitData', {
        unitData,
        adId: id,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setUnitData('');
      fetchAdUnitDataList();
    }
    catch(err) {
      console.error('AdUnitDataUploadAdUnitDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  useEffect(() => {
    const fetchAdUnitDataList = async () => {
      try {
        const { data } = await axios.get('/adUnitDataList', {
          params: {
            adId: id,
          },
        });
        setUnitDataList(data);
      }
      catch(err) {
        console.error('ad-unit-data-fetch-ad-unit-data-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    const fetchAdUnit = async () => {
      try {
        const { data } = await axios.get('/adUnit', {
          params: {
            adId: id,
          },
        });
        setAdUnit(data);
      }
      catch(err) {
        console.error('ad-unit-data-fetch-ad-unit-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    }
    fetchAdUnitDataList();
    fetchAdUnit();
  }, [id]);

  const fetchAdUnitDataList = async () => {
    try {
      const { data } = await axios.get('/adUnitDataList', {
        params: {
          adId: id,
        },
      });
      setUnitDataList(data);
    }
    catch(err) {
      console.error('ad-unit-data-fetch-ad-unit-data-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  };

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        data={unitDataList}
        title={
          <div
            style={{
              display: 'flex',
            }}>
            <img
              src={adUnit.thumbUrl}
              alt=""
              width="60"
              height="60"
              style={{
                marginTop: 10,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 12,
                justifyContent: 'center',
                padding: 10,
                marginTop: 10,
              }}>
              <div>
                { adUnit.adName }
              </div>
              <div>
                { adUnit.goodsName }
              </div>
            </div>
          </div>
        }
        columns={[
          {
            title: '日期',
            field: 'date',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '曝光量',
            field: 'impression',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '点击量',
            field: 'click',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '点击率',
            field: 'ctr',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { ctr } = rowData;
              return (
                <div>
                  {(ctr * 100).toFixed(2)}%
                </div>
              );
            }
          },
          /*
          {
            title: '交易花费',
            field: 'transactionCost',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { transactionCost } = rowData;
              return (
                <div>
                  {(transactionCost / 1000).toFixed(2)}
                </div>
              );
            },
          },
          */
          {
            title: '花费',
            field: 'spend',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { spend } = rowData;
              return (
                <div>
                  {(spend / 1000).toFixed(2)}
                </div>
              );
            },
          },
          {
            title: '投入产出比',
            field: 'roi',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { roi } = rowData;
              return (
                <div>
                  {(roi).toFixed(2)}
                </div>
              );
            },
          },
          {
            title: '订单量',
            field: 'orderNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '平均点击花费',
            field: 'cpc',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cpc } = rowData;
              return (
                <div>
                  {(cpc / 1000).toFixed(2)}
                </div>
              );
            },
          },
          {
            title: '点击转化率',
            field: 'cvr',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cvr } = rowData;
              return (
                <div>
                  {(cvr * 100).toFixed(2)}%
                </div>
              );
            }
          },
          {
            title: '交易额',
            field: 'gmv',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { gmv } = rowData;
              return (
                <div>
                  {gmv / 1000}
                </div>
              );
            },
          },
          /*
          {
            title: '千次曝光花费',
            field: 'cpm',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const { cpm } = rowData;
              return (
                <div>
                  {(cpm / 1000).toFixed(2)}
                </div>
              );
            },
          },
          */
          {
            title: '店铺关注量',
            field: 'mallFavNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '商品收藏量',
            field: 'goodsFavNum',
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
          {
            title: '查询量',
            field: 'inquiryNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          /*
          {
            title: 'uniqueView',
            field: 'uniqueView',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'rankAverage',
            field: 'rankAverage',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'rankMedian',
            field: 'rankMedian',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'avgPayAmount',
            field: 'avgPayAmount',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'appActivateNum',
            field: 'appActivateNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'costPerAppActivate',
            field: 'costPerAppActivate',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'appActivateRate',
            field: 'appActivateRate',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'appRegisterNum',
            field: 'appRegisterNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'costPerAppRegister',
            field: 'costPerAppRegister',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'appPayNum',
            field: 'appPayNum',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: 'costPerAppPay',
            field: 'costPerAppPay',
            cellStyle: {
              fontSize: 12,
            },
          },
          */
        ]}
      />
      <TextField
        label="输入推广单元数据(90天/queryDailyReport)"
        fullWidth
        value={unitData}
        onChange={(event) => {
          setUnitData(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleUnitDataButtonClick}
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

export default AdUnitData;
