/*
 * Maintained by jemo from 2020.7.7 to now
 * Created by jemo on 2020.7.7 17:02:41
 * Order Data Chart
 * 订单数据图
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function AdDataChart() {

  const [dataList, setDataList] = useState([]);
  const [chartType, setChartType] = useState('total');
  const [yKey, setYKey] = useState('netProfitRate');
  const [tooltipDisplay, setTooltipDisplay] = useState('none');
  const [tooltipTransform, setTooltipTransform] = useState('');
  const [tooltipXValue, setTooltipXValue] = useState('');
  const [tooltipYValue, setTooltipYValue] = useState('');
  let startDate;
  let endDate;
  for(let i = 0; i < dataList.length; i++) {
    const date = new Date(dataList[i].date);
    if(i === 0) {
      startDate = date;
      endDate = date;
    } else {
      if(date < startDate) {
        startDate = date;
      }
      if(date > endDate) {
        endDate = date;
      }
    }
  }
  let data = dataList;
  if(chartType === 'month') {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const monthDifference = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + endMonth.getMonth() - startMonth.getMonth() + 1;
    data = [];
    for(let i = 0; i < monthDifference; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      let monthTotal = 0;
      let netProfit = 0;
      let profit = 0;
      let spend = 0;
      let click = 0;
      let totalOrderNumber = 0;
      let realOrderNumber = 0;
      for(let j = 0; j < dataList.length; j++) {
        const adDataItem = dataList[j];
        const date = new Date(adDataItem.date);
        if(date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()) {
          monthTotal += adDataItem[yKey];
          netProfit += adDataItem.netProfit;
          profit += adDataItem.profit;
          spend += adDataItem.spend;
          click += adDataItem.click;
          totalOrderNumber += adDataItem.totalOrderNumber;
          realOrderNumber += adDataItem.orderNumber;
        }
      }
      const monthData = {
        date: month,
      }
      monthTotal = Math.round(monthTotal * 100) / 100;
      monthData[yKey] = monthTotal;
      monthData.netProfitRate = 0;
      monthData.perClickProfit = 0;
      monthData.perClickSpend = 0;
      monthData.perClickProfitSpend = 0;
      monthData.afterSaleRate = 0;
      if(spend !== 0) {
        monthData.netProfitRate = netProfit / spend || 0;
        monthData.perClickProfitSpend = profit / spend || 0;
      }
      if(click !== 0) {
        monthData.perClickProfit = profit / click || 0;
        monthData.perClickSpend = spend / click || 0;
      }
      if(totalOrderNumber !== 0) {
        monthData.afterSaleRate = (totalOrderNumber - realOrderNumber) / totalOrderNumber;
      }
      data.push(monthData);
    }
    startDate = startMonth;
    endDate = endMonth;
  } else if(chartType === 'total') {
    data = [];
    let total = 0;
    let netProfit = 0;
    let profit = 0;
    let spend = 0;
    let click = 0;
    let totalOrderNumber = 0;
    let realOrderNumber = 0;
    for(let i = 0; i < dataList.length; i++) {
      total += dataList[i][yKey];
      netProfit += dataList[i].netProfit;
      profit += dataList[i].profit;
      spend += dataList[i].spend;
      click += dataList[i].click;
      totalOrderNumber += dataList[i].totalOrderNumber;
      realOrderNumber += dataList[i].orderNumber;
      const totalData = {
        date: dataList[i].date,
      }
      total = Math.round(total * 10000) / 10000;
      totalData[yKey] = total;
      totalData.netProfitRate = 0;
      totalData.perClickProfit = 0;
      totalData.perClickSpend = 0;
      totalData.perClickProfitSpend = 0;
      totalData.afterSaleRate = 0;
      if(spend !== 0) {
        totalData.netProfitRate = netProfit / spend || 0;
        totalData.perClickProfitSpend = profit / spend || 0;
      }
      if(click !== 0) {
        totalData.perClickProfit = profit / click || 0;
        totalData.perClickSpend = spend / click || 0;
      }
      if(totalOrderNumber !== 0) {
        totalData.afterSaleRate = (totalOrderNumber - realOrderNumber) / totalOrderNumber;
      }
      data.push(totalData);
    }
  }
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const height = 500;
  const width = 1200;
  const margin = 60;
  const w = width - 2 * margin;
  const h = height - 2 * margin;
  const x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([margin, w])
  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d[yKey]), d3.max(data, d => d[yKey])])
    .range([h, margin])
  const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d[yKey]))
  const xFormat = d3.timeFormat('%Y-%m-%d')
  const xTicks = x.ticks(6).map(d => {
    return (
      <g transform={`translate(${x(d)}, ${h + 20})`}
        key={d}>
        <text
          style={{
            fill: '#000',
            fillOpacity: 0.9,
            fontSize: '12px',
            textAnchor: 'middle',
          }}>
          {xFormat(d)}
        </text>
        <line
          x1='0'
          x2='0'
          y1='0'
          y2='5'
          transform={`translate(0, -20)`}
          style={{
            stroke: '#000',
          }}
        />
      </g>
    );
  })
  const yTicks = y.ticks(5).map(d => (
    <g transform={`translate(${margin}, ${y(d)})`}
      key={d}>
      <text
        x="-30"
        y="5"
        style={{
          fill: '#000',
          fillOpacity: 0.9,
          fontSize: '12px',
          textAnchor: 'middle',
        }}>
        {d}
      </text>
      <line
        x1='0'
        x2='5'
        y1='0'
        y2='0'
        transform="translate(-5, 0)"
        style={{
          stroke: '#000',
        }}
      />
      <line
        x1='0'
        x2={w - margin}
        y1='0'
        y2='0'
        transform="translate(-5, 0)"
        style={{
          stroke: '#000',
        }}
      />
    </g>
  ))

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

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value)
  }

  const handleYKeyChange = (event) => {
    setYKey(event.target.value)
  }

  useEffect(() => {
    const fetchAdDataList = async () => {
      try {
        const { data } = await axios.get('/orderStatistics');
        const { data: adData } = await axios.get('/adDayData');
        let start = new Date();
        for(let i = 0; i < data.length; i++) {
          const {
            userPaidAmount,
            actualPayment,
            paymentTime,
            platformDiscount,
          } = data[i];
          data[i].userPaidAmount = (userPaidAmount + platformDiscount) / 100;
          data[i].profit = (userPaidAmount + platformDiscount) / 100 - actualPayment;
          let date = new Date(paymentTime);
          if(date < start) {
            start = date;
          }
        }
        for(let i = 0; i < adData.length; i++) {
          const {
            spend,
            date,
          } = adData[i];
          adData[i].spend = Math.round(spend / 10) / 100;
          if(new Date(date) < start) {
            start = new Date(date);
          }
        }
        const now = new Date();
        const days = Math.round((now - start) / (1000 * 60 * 60 * 24)) + 1;
        const orderDataList = [];
        for(let i = 0; i < days; i++) {
          const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          const orderData = {
            date: day,
            userPaidAmount: 0,
            actualPayment: 0,
            profit: 0,
            spend: 0,
            click: 0,
            orderNumber: 0,
            totalOrderNumber: 0,
          }
          for(let j = 0; j < data.length; j++) {
            const time = new Date(data[j].paymentTime);
            if(time.getFullYear() === day.getFullYear() &&
              time.getMonth() === day.getMonth() &&
              time.getDate() === day.getDate()) {
              // 无售后订单
              orderData.totalOrderNumber++;
              if(!data[j].afterSaleStatus) {
                orderData.userPaidAmount += data[j].userPaidAmount;
                orderData.actualPayment += data[j].actualPayment;
                orderData.profit += data[j].profit;
                orderData.userPaidAmount = Math.round(orderData.userPaidAmount * 100) / 100;
                orderData.actualPayment = Math.round(orderData.actualPayment * 100) / 100;
                orderData.profit = Math.round(orderData.profit * 100) / 100;
                orderData.orderNumber++;
              }
            }
          }
          for(let k = 0; k < adData.length; k++) {
            const time = new Date(adData[k].date);
            if(time.getFullYear() === day.getFullYear() &&
              time.getMonth() === day.getMonth() &&
              time.getDate() === day.getDate()) {
              orderData.spend += adData[k].spend;
              orderData.click += adData[k].click;
            }
          }
          orderData.netProfit = Math.round((orderData.profit - orderData.spend) * 100) / 100;
          orderData.netProfitRate = 0;
          if(orderData.spend !== 0) {
            orderData.netProfitRate = Math.round((orderData.netProfit / orderData.spend) * 100) / 100;
          }
          orderData.perClickProfit = 0;
          orderData.perClickSpend = 0;
          if(orderData.click !== 0) {
            orderData.perClickProfit = Math.round(orderData.profit / orderData.click * 100) / 100;
            orderData.perClickSpend = Math.round(orderData.spend / orderData.click * 100) / 100;
          }
          orderData.perClickProfitSpend = 0;
          if(orderData.perClickSpend !== 0) {
            orderData.perClickProfitSpend = Math.round(orderData.profit / orderData.spend * 100) / 100
          }
          orderData.afterSaleRate = 0;
          if(orderData.totalOrderNumber !== 0) {
            orderData.afterSaleRate = Math.round((orderData.totalOrderNumber - orderData.orderNumber) / orderData.totalOrderNumber * 100) / 100;
          }
          orderDataList.push(orderData);
        }
        setDataList(orderDataList);
      }
      catch(err) {
        console.error('order-data-chart-use-effect-fetch-order-data-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchAdDataList();
  }, []);

  const tooltipOnMouseOver = () => {
    setTooltipDisplay(null);
  }

  const tooltipOnMouseOut = () => {
    setTooltipDisplay('none');
  }

  const bisectDate = d3.bisector(d => new Date(d.date)).right;

  const tooltipOnMouseMove = (e) => {
    const x0 = x.invert(d3.clientPoint(e.target, e)[0]);
    const i = bisectDate(data, x0, 1);
    const d = data[i - 1] || {};
    const date = new Date(d.date);
    setTooltipTransform(`translate(${x(date)},${y(d[yKey])})`);
    setTooltipXValue(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    setTooltipYValue(d[yKey]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50,
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: width,
        }}>
        <RadioGroup
          row
          value={yKey}
          onChange={handleYKeyChange}>
          <FormControlLabel
            value='totalOrderNumber'
            control={<Radio />}
            label='总订单量'
          />
          <FormControlLabel
            value='orderNumber'
            control={<Radio />}
            label='无售后订单量'
          />
          <FormControlLabel
            value='afterSaleRate'
            control={<Radio />}
            label='退货率'
          />
          <FormControlLabel
            value='userPaidAmount'
            control={<Radio />}
            label='交易额'
          />
          <FormControlLabel
            value='actualPayment'
            control={<Radio />}
            label='成本'
          />
          <FormControlLabel
            value='spend'
            control={<Radio />}
            label='广告花费'
          />
          <FormControlLabel
            value='profit'
            control={<Radio />}
            label='利润'
          />
          <FormControlLabel
            value='netProfit'
            control={<Radio />}
            label='净利润'
          />
          <FormControlLabel
            value='click'
            control={<Radio />}
            label='点击量'
          />
          <FormControlLabel
            value='perClickProfit'
            control={<Radio />}
            label='单次点击利润'
          />
          <FormControlLabel
            value='perClickSpend'
            control={<Radio />}
            label='单次点击花费'
          />
          <FormControlLabel
            value='perClickProfitSpend'
            control={<Radio />}
            label='利润花费比'
          />
          <FormControlLabel
            value='netProfitRate'
            control={<Radio />}
            label='净利润花费比'
          />
        </RadioGroup>
        <RadioGroup
          row
          value={chartType}
          onChange={handleChartTypeChange}>
          <FormControlLabel
            value='day'
            control={<Radio />}
            label='天'
          />
          <FormControlLabel
            value='month'
            control={<Radio />}
            label='月'
          />
          <FormControlLabel
            value='total'
            control={<Radio />}
            label='累计'
          />
        </RadioGroup>
      </div>
      <svg
        style={{
          zIndex: 1,
        }}
        width={width}
        height={height}>
        <line
          style={{
            stroke: '#000',
          }}
          x1={margin}
          y1={h}
          x2={w}
          y2={h}
        />
        <line
          style={{
            stroke: '#000',
          }}
          x1={margin}
          y1={margin}
          x2={margin}
          y2={h}
        />
        <text
          style={{
            fontSize: 12,
          }}
          y={12}>
          订单数据
        </text>
        <path
          style={{
            stroke: 'steelblue',
            strokeWidth: '2px',
            fill: 'none',
          }}
          d={line(data)}
        />
        <g>
          {xTicks}
        </g>
        <g>
          {yTicks}
        </g>
        <g
          transform={tooltipTransform}
          style={{
            display: tooltipDisplay,
          }}>
          <circle
            style={{
              fill: 'steelblue',
            }}
            r='5'
          />
          <rect
            width='100'
            height='50'
            x='10'
            y='-22'
            rx='4'
            ry='4'
            style={{
              fill: 'white',
              stroke: '#000',
            }}
          />
          <text
            x='18'
            y='-2'>
            {tooltipYValue}
          </text>
          <text
            x='18'
            y='18'>
            {tooltipXValue}
          </text>
        </g>
        <rect
          style={{
            fill: 'none',
            pointerEvents: 'all',
          }}
          width={width}
          height={h}
          onMouseOver={tooltipOnMouseOver}
          onMouseOut={tooltipOnMouseOut}
          onMouseMove={tooltipOnMouseMove}
        />
      </svg>
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

export default AdDataChart;
