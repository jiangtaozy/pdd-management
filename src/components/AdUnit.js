/*
 * Maintained by jemo from 2020.5.27 to now
 * Created by jemo on 2020.5.27 11:02:09
 * Ad Unit
 * 一推广计划的推广单元列表
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HourlyChart from './utils/HourlyChart';

function AdUnit() {

  const [ adUnitList, setAdUnitList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const { id } = useParams();
  const [ planHourlyDataList, setPlanHourlyDataList ] = useState([]);

  const calcHourlyData = (list) => {
    const newList = [];
    for(let i = 0; i < 24; i++) {
      newList.push({
        hour: i,
        impression: 0,
        click: 0,
        spend: 0,
        orderNum: 0,
        gmv: 0,
        goodsFavNum: 0,
        mallFavNum: 0,
      });
    }
    for(let i = 0; i < list.length; i++) {
      for(let j = 0; j < newList.length; j++) {
        if(list[i].hour === newList[j].hour) {
          newList[j].impression += list[i].impression;
          newList[j].click += list[i].click;
          newList[j].spend += list[i].spend;
          newList[j].orderNum += list[i].orderNum;
          newList[j].gmv += list[i].gmv;
          newList[j].goodsFavNum += list[i].goodsFavNum;
          newList[j].mallFavNum += list[i].mallFavNum;
        }
      }
    }
    return newList;
  }
  const calcHourlyDataList = calcHourlyData(planHourlyDataList);

  const calcHourlyDiscount = (list) => {
    let totalImpression = 0;
    let totalClick = 0;
    for(let i = 0; i < list.length; i++) {
      totalImpression += list[i].impression;
      totalClick += list[i].click;
    }
    const totalCtr = totalClick / totalImpression;
    let maxRatio = 0;
    for(let i = 0; i < list.length; i++) {
      list[i].ctrRatio = list[i].click / list[i].impression / totalCtr || 0;
      if(list[i].ctrRatio > maxRatio) {
        maxRatio = list[i].ctrRatio;
      }
    }
    for(let i = 0; i < list.length; i++) {
      list[i].discountTen = 100 + Math.round((list[i].ctrRatio - 1) / (maxRatio - 1) * 10);
      list[i].discountTwenty = 100 + Math.round((list[i].ctrRatio - 1) / (maxRatio - 1) * 20);
      list[i].discountThirty = 100 + Math.round((list[i].ctrRatio - 1) / (maxRatio - 1) * 30);
    }
  }
  calcHourlyDiscount(calcHourlyDataList);

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
        const { data } = await axios.get('/adUnitList', {
          params: {
            planId: id,
          },
        });
        setAdUnitList(data);
      }
      catch(err) {
        console.error('ad-unit-fetch-ad-unit-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    const fetchPlanHourlyDataList = async () => {
      try {
        const { data } = await axios.get('/planHourlyDataList', {
          params: {
            planId: id,
          },
        });
        setPlanHourlyDataList(data);
      }
      catch(err) {
        console.error('ad-unit-fetch-plan-hourly-data-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchAdUnitList();
    fetchPlanHourlyDataList();
  }, [id]);

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: '商家Id',
            field: 'mallId',
            cellStyle: {
              fontSize: 12,
            },
          },
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
          {
            title: '单元名称',
            field: 'adName',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                adId,
                adName,
              } = rowData;
              return (
                <Link to={`/adUnit/${adId}`}>
                  { adName }
                </Link>
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
          {
            title: '商品名称',
            field: 'goodsName',
            cellStyle: {
              fontSize: 12,
            },
          },
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
        ]}
        data={adUnitList}
        title="推广单元列表"
      />
      <HourlyChart
        data={calcHourlyDataList}
        defaultYKey={'discountTen'}
        ykeyList={[
          {
            value: 'impression',
            label: '曝光量',
          },
          {
            value: 'click',
            label: '点击量',
          },
          {
            value: 'ctr',
            label: '点击率',
            ratio: true,
            x: 'click',
            y: 'impression',
          },
          {
            value: 'spend',
            label: '花费',
          },
          {
            value: 'orderNum',
            label: '订单量',
          },
          {
            value: 'gmv',
            label: '交易额',
          },
          {
            value: 'goodsFavNum',
            label: '收藏量',
          },
          {
            value: 'mallFavNum',
            label: '关注量',
          },
          {
            value: 'discountTen',
            label: '10%折扣',
          },
          {
            value: 'discountTwenty',
            label: '20%折扣',
          },
          {
            value: 'discountThirty',
            label: '30%折扣',
          },
        ]}
      />
      <MaterialTable
        icons={tableIcons}
        data={calcHourlyDataList}
        title="折扣列表"
        options={{
          pageSize: 24,
          pageSizeOptions: [24],
        }}
        columns={[
          {
            title: '小时',
            field: 'hour',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '10%折扣',
            field: 'discountTen',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '20%折扣',
            field: 'discountTwenty',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '30%折扣',
            field: 'discountThirty',
            cellStyle: {
              fontSize: 12,
            },
          },
        ]}
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

export default AdUnit;
