/*
 * Maintained by jemo from 2020.8.27 to now
 * Created by jemo on 2020.8.27 09:09:15
 * Item Data Chart
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chart from '../utils/Chart';
import NumberChart from '../utils/NumberChart';
import Snackbar from '@material-ui/core/Snackbar';

function ItemDataChart (props) {

  const [ data, setData ] = useState([]);
  const { id } = useParams();
  const [ priceData, setPriceData ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const { message, open, autoHideDuration } = snackbarState;

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const { data = [] } = await axios.get('/pddItemData', {
          params: {
            id,
          },
        });
        for(let i = 0; i < data.length; i++) {
          const dateData = data[i];
          const {
            platformDiscount,
            userPaidAmount,
            actualPayment,
          } = dateData;
          dateData.profit = ((userPaidAmount + platformDiscount) / 100 - actualPayment) || 0;
          dateData.spend = (dateData.spend / 1000) || 0;
          dateData.netProfit = dateData.profit - dateData.spend;
          if(!dateData.realOrderNum) {
            dateData.realOrderNum = 0;
          }
        }
        setData(data);
        // price data
        const newPriceData = [];
        for(let i = 0; i < data.length; i++) {
          const {
            userPaidAmount,
            impression,
            click,
            spend,
            realOrderNum,
            profit,
            netProfit,
          } = data[i];
          if(userPaidAmount > 0) {
            let inNewPriceData = false;
            for(let j = 0; j < newPriceData.length; j++) {
              if(Math.abs(newPriceData[j].price - userPaidAmount / realOrderNum / 100) < 0.01) {
                newPriceData[j].impression += impression;
                newPriceData[j].click += click;
                newPriceData[j].spend += spend;
                newPriceData[j].realOrderNum += realOrderNum;
                newPriceData[j].profit += profit;
                newPriceData[j].netProfit += netProfit;
                inNewPriceData = true;
                break;
              }
            }
            if(!inNewPriceData) {
              newPriceData.push({
                price: userPaidAmount / realOrderNum / 100,
                impression: impression,
                click: click,
                spend: spend,
                realOrderNum: realOrderNum,
                profit: profit,
                netProfit: netProfit,
              });
            }
          } else {
            if(newPriceData.length === 0) {
              newPriceData.push({
                price: 0,
                impression: impression,
                click: click,
                spend: spend,
                realOrderNum: realOrderNum,
                profit: profit,
                netProfit: netProfit,
              });
            } else {
              newPriceData[newPriceData.length - 1].impression += impression;
              newPriceData[newPriceData.length - 1].click += click;
              newPriceData[newPriceData.length - 1].spend += spend;
              newPriceData[newPriceData.length - 1].realOrderNum += realOrderNum;
              newPriceData[newPriceData.length - 1].profit += profit;
              newPriceData[newPriceData.length - 1].netProfit += netProfit;
            }
          }
        }
        if(newPriceData.length > 1) {
          newPriceData[1].impression += newPriceData[0].impression;
          newPriceData[1].click += newPriceData[0].click;
          newPriceData[1].spend += newPriceData[0].spend;
          newPriceData[1].realOrderNum += newPriceData[0].realOrderNum;
          newPriceData[1].profit += newPriceData[0].profit;
          newPriceData[1].netProfit += newPriceData[0].netProfit;
          newPriceData.shift();
        }
        newPriceData.sort((a, b) => a.price - b.price);
        setPriceData(newPriceData);
      }
      catch(err) {
        console.error('item-data-chart-fetch-item-data-error: ', err);
        handleOpenErrorSnackbar({
          message: `出错了：${err.response && err.response.data}`,
        });
      }
    }
    fetchItemData();
  }, [id]);

  const handleOpenSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 2000,
    });
  }

  const handleOpenErrorSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: null,
    });
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({
      open: false,
    });
  }

  return (
    <div>
      <NumberChart
        data={priceData}
        defaultYKey={'netProfitSpend'}
        xKey={'price'}
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
            label: '推广花费',
          },
          {
            value: 'realOrderNum',
            label: '订单量',
          },
          {
            value: 'cvr',
            label: '点击转化率',
            ratio: true,
            x: 'realOrderNum',
            y: 'click',
          },
          {
            value: 'profit',
            label: '利润',
          },
          {
            value: 'profitSpend',
            label: '利润花费比',
            ratio: true,
            x: 'profit',
            y: 'spend',
          },
          {
            value: 'netProfit',
            label: '净利润',
          },
          {
            value: 'netProfitSpend',
            label: '净利润花费比',
            ratio: true,
            x: 'netProfit',
            y: 'spend',
          },
        ]}
      />
      <Chart
        data={data}
        defaultYKey={'perClickProfitSpend'}
        defaultChartType={'total'}
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
            value: 'realOrderNum',
            label: '订单量',
          },
          {
            value: 'cvr',
            label: '点击转化率',
            ratio: true,
            x: 'realOrderNum',
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
            value: 'mallFavNum',
            label: '店铺关注量',
          },
          {
            value: 'spend',
            label: '推广花费',
          },
          {
            value: 'profit',
            label: '利润',
          },
          {
            value: 'netProfit',
            label: '净利润',
          },
          {
            value: 'perClickProfit',
            label: '单次点击利润',
            ratio: true,
            x: 'profit',
            y: 'click',
          },
          {
            value: 'perClickSpend',
            label: '单次点击花费',
            ratio: true,
            x: 'spend',
            y: 'click',
          },
          {
            value: 'perClickNetProfit',
            label: '单次点击净利润',
            ratio: true,
            x: 'netProfit',
            y: 'click',
          },
          {
            value: 'perClickProfitSpend',
            label: '利润花费比',
            ratio: true,
            x: 'profit',
            y: 'spend',
          },
          {
            value: 'netProfitSpend',
            label: '净利润花费比',
            ratio: true,
            x: 'netProfit',
            y: 'spend',
          },
        ]}
      />
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default ItemDataChart;
