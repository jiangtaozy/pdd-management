/*
 * Maintained by jemo from 2020.8.29 to now
 * Created by jemo on 2020.8.29 16:44:22
 * Ad Unit Hourly Data
 * 推广单元小时数据
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import HourlyChart from '../utils/HourlyChart';

function AdUnitHourlyData(props) {

  const [ hourlyData, setHourlyData ] = useState([]);
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
    const fetchHourlyData = async () => {
      try {
        const { data } = await axios.get('/adUnitHourlyDataList', {
          params: {
            id: props.id,
          },
        })
        for(let i = 0; i < data.length; i++) {
          data[i].gmv = data[i].gmv / 1000;
          data[i].spend = data[i].spend / 1000;
        }
        setHourlyData(data);
      }
      catch(err) {
        console.error("ad-unit-hourly-data-fetch-error: ", err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    }
    fetchHourlyData();
  }, [props.id]);

  return (
    <div>
      <HourlyChart
        data={hourlyData}
        defaultYKey={'cvr'}
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
            value: 'orderNum',
            label: '订单量',
          },
          {
            value: 'cvr',
            label: '点击转化率',
            ratio: true,
            x: 'orderNum',
            y: 'click',
          },
          {
            value: 'gmv',
            label: '交易额',
          },
          {
            value: 'goodsFavNum',
            label: '商品收藏量',
          },
          {
            value: 'cgfv',
            label: '点击收藏率',
            ratio: true,
            x: 'goodsFavNum',
            y: 'click',
          },
          {
            value: 'mallFavNum',
            label: '店铺关注量',
          },
          {
            value: 'cmfv',
            label: '点击关注率',
            ratio: true,
            x: 'mallFavNum',
            y: 'click',
          },
          {
            value: 'spend',
            label: '推广花费',
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

export default AdUnitHourlyData;
