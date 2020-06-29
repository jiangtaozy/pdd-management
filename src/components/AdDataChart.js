/*
 * Maintained by jemo from 2020.6.27 to now
 * Created by jemo on 2020.6.27 22:42:38
 * Ad Data Chart
 * 广告数据图
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function AdDataChart() {

  const [adDataList, setAdDataList] = useState([]);
  const [chartType, setChartType] = useState('total');
  const [tooltipDisplay, setTooltipDisplay] = useState('none');
  const [tooltipTransform, setTooltipTransform] = useState('');
  const [tooltipXValue, setTooltipXValue] = useState('');
  const [tooltipYValue, setTooltipYValue] = useState('');
  let startDate;
  let endDate;
  for(let i = 0; i < adDataList.length; i++) {
    const itemCount = adDataList[i];
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
  let data = adDataList;
  //console.log("data: ", data);
  // todo
  /*
  if(chartType === 'month') {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const monthDifference = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + endMonth.getMonth() - startMonth.getMonth() + 1;
    data = [];
    for(let i = 0; i < monthDifference; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      let monthCount = 0;
      for(let j = 0; j < adDataList.length; j++) {
        const itemCount = adDataList[j];
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
    for(let i = 0; i < adDataList.length; i++) {
      const {
        date,
        count,
      } = adDataList[i];
      total += count;
      data.push({
        date,
        count: total,
      });
    }
  }
  */
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
    .domain([0, d3.max(data, d => d.click)])
    .range([h, margin])
  const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.click))
    //.curve(d3.curveCatmullRom.alpha(0.1))
  const xFormat = d3.timeFormat('%Y-%m-%d')
  //const yFormat = d3.format('.2')
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
    y(d) > 10 && y(d) < h ?
      <g transform={`translate(${margin}, ${y(d)})`}
        key={d}>
        <text
          x="-20"
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
    const fetchAdDataList = async () => {
      try {
        const { data } = await axios.get('/adDayData');
        setAdDataList(data);
      }
      catch(err) {
        console.error('ad-data-chart-use-effect-fetch-ad-data-list-error: ', err);
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
    const d = data[i - 1];
    setTooltipTransform(`translate(${x(new Date(d.date))},${y(d.click)})`);
    setTooltipXValue(d.date);
    setTooltipYValue(d.click);
  }

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
            广告数据
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
    </div>
  );
}

export default AdDataChart;
