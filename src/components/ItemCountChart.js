/*
 * Maintained by jemo from 2020.6.27 to now
 * Created by jemo on 2020.6.27 22:26:45
 * Item Count Chart
 * 商品统计图
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function ItemCountChart() {

  const [itemCountList, setItemCountList] = useState([]);
  const [chartType, setChartType] = useState('total');
  let startDate;
  let endDate;
  for(let i = 0; i < itemCountList.length; i++) {
    const itemCount = itemCountList[i];
    const date = new Date(itemCount.date);
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
  let data = itemCountList;
  if(chartType === 'month') {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const monthDifference = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + endMonth.getMonth() - startMonth.getMonth() + 1;
    data = [];
    for(let i = 0; i < monthDifference; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      let monthCount = 0;
      for(let j = 0; j < itemCountList.length; j++) {
        const itemCount = itemCountList[j];
        const date = new Date(itemCount.date);
        if(date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()) {
          monthCount += itemCount.count;
        }
      }
      const itemMonthCount = {
        date: month,
        count: monthCount,
      }
      data.push(itemMonthCount);
    }
    startDate = startMonth;
    endDate = endMonth;
  } else if(chartType === 'total') {
    data = [];
    let total = 0;
    for(let i = 0; i < itemCountList.length; i++) {
      const {
        date,
        count,
      } = itemCountList[i];
      total += count;
      data.push({
        date,
        count: total,
      });
    }
  }
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const height = 500;
  const width = 1200;
  const margin = 20;
  const w = width - 2 * margin;
  const h = height - 2 * margin;
  const x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([margin, w])
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([h, margin])
  const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.count))
    //.curve(d3.curveCatmullRom.alpha(0.1))
  const xFormat = d3.timeFormat('%Y-%m-%d')
  const yFormat = d3.format('.2')
  const xTicks = x.ticks(6).map(d => {
    return (
      <g transform={`translate(${x(d)}, ${h + margin})`}
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
          transform="translate(0, -20)"
          style={{
            stroke: '#000',
          }}
        />
      </g>
    );
  })
  const yTicks = y.ticks(5).map(d => (
    y(d) > 10 && y(d) < h ?
      <g transform={`translate(${margin}, ${y(d)})`}
        key={d}>
        <text
          x="-12"
          y="5"
          style={{
            fill: '#000',
            fillOpacity: 0.9,
            fontSize: '12px',
            textAnchor: 'middle',
          }}>
          {yFormat(d)}
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
    : null
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

  useEffect(() => {
    const fetchItemCountList = async () => {
      try {
        const { data } = await axios.get('/countingItemByCreatedTime');
        setItemCountList(data);
      }
      catch(err) {
        console.error('dashboard-use-effect-fetch-item-count-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchItemCountList();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
        <RadioGroup
          row
          value={chartType}
          onChange={handleChartTypeChange}>
          <FormControlLabel
            value='total'
            control={<Radio />}
            label='累计'
          />
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
        </RadioGroup>
        <svg
          style={{
            fill: '#000',
            fillOpacity: 0.3,
          }}
          width={width}
          height={height}>
          <line
            style={{
              stroke: '#000',
            }}
            x1={margin}
            x2={w}
            y1={h}
            y2={h}
          />
          <line
            style={{
              stroke: '#000',
            }}
            x1={margin}
            x2={margin}
            y1={margin}
            y2={h}
          />
          <text
            style={{
              fontSize: 12,
            }}
            y={12}
          >
          上传商品数量
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
    </div>
  );
}

export default ItemCountChart;
