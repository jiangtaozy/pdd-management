/*
 * Maintained by jemo from 2020.8.28 to now
 * Created by jemo on 2020.8.28 14:46:57
 * 数据图
 */

import React, { useState } from 'react';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function Chart(props) {

  const {
    data,
    defaultYKey,
    defaultChartType,
    ykeyList,
    radioPosition,
  } = props;
  const [ chartType, setChartType ] = useState(defaultChartType);
  const [ yKey, setYKey ] = useState(defaultYKey);
  const [ tooltipDisplay, setTooltipDisplay ] = useState('none');
  const [ tooltipTransform, setTooltipTransform ] = useState('');
  const [ tooltipXValue, setTooltipXValue ] = useState('');
  const [ tooltipYValue, setTooltipYValue ] = useState('');

  let start = new Date();
  let end = new Date();
  for(let i = 0; i < data.length; i++) {
    const date = new Date(data[i].date);
    if(i === 0) {
      start = date;
      end = date;
    } else {
      if(date < start) {
        start = date;
      }
      if(date > end) {
        end = date;
      }
    }
  }
  let ykeyObj;
  for(let j = 0; j < ykeyList.length; j++) {
    if(ykeyList[j].value === yKey) {
      ykeyObj = ykeyList[j];
      break;
    }
  }
  let list = [];
  if(chartType === 'day') {
    for(let i = 0; i < data.length; i++) {
      const dayData = {
        date: data[i].date,
      }
      if(ykeyObj.ratio) {
        const xValue = data[i][ykeyObj.x];
        const yValue = data[i][ykeyObj.y];
        if(!yValue) {
          dayData[yKey] = 0;
        } else {
          dayData[yKey] = xValue / yValue;
        }
      } else {
        dayData[yKey] = data[i][yKey];
      }
      list.push(dayData);
    }
  } else if(chartType === 'week') {
    const startWeek = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1),
    );
    const endWeek = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() - end.getDay() + (start.getDay() === 0 ? -6 : 1),
    );
    start = startWeek;
    end = endWeek;
    const weekDifference = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 7;
    for(let i = 0; i <= weekDifference; i++) {
      const week = new Date(startWeek.getTime() + 7 * 24 * 60 * 60 * 1000 * i);
      let total = 0;
      let xTotal = 0;
      let yTotal = 0;
      for(let k = 0; k < data.length; k++) {
        const date = new Date(data[k].date);
        if((date.getTime() - week.getTime()) >= 0 &&
          (date.getTime() - week.getTime()) < 7 * 24 * 60 * 60 * 1000) {
          if(ykeyObj.ratio) {
            xTotal += data[k][ykeyObj.x];
            yTotal += data[k][ykeyObj.y];
            if(yTotal !== 0) {
              total = xTotal / yTotal;
            }
          } else {
            total += data[k][yKey];
          }
        }
      }
      const weekData = {
        date: week,
      }
      weekData[yKey] = total;
      list.push(weekData);
    }
  } else if(chartType === 'month') {
    const startMonth = new Date(
      start.getFullYear(),
      start.getMonth(),
      1,
    );
    const endMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      1,
    );
    start = startMonth;
    end = endMonth;
    const monthDifference = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + endMonth.getMonth() - startMonth.getMonth() + 1;
    for(let i = 0; i < monthDifference; i++) {
      const month = new Date(
        startMonth.getFullYear(),
        startMonth.getMonth() + i,
        1,
      );
      let total = 0;
      let xTotal = 0;
      let yTotal = 0;
      for(let k = 0; k < data.length; k++) {
        const date = new Date(data[k].date);
        if(date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()) {
          if(ykeyObj.ratio) {
            xTotal += data[k][ykeyObj.x];
            yTotal += data[k][ykeyObj.y];
            if(yTotal !== 0) {
              total = xTotal / yTotal;
            }
          } else {
            total += data[k][yKey];
          }
        }
      }
      const monthData = {
        date: month,
      }
      monthData[yKey] = total;
      list.push(monthData);
    }
  } else if(chartType === 'total') {
    let total = 0;
    let xTotal = 0;
    let yTotal = 0;
    for(let i = 0; i < data.length; i++) {
      if(ykeyObj.ratio) {
        xTotal += data[i][ykeyObj.x];
        yTotal += data[i][ykeyObj.y];
        if(yTotal !== 0) {
          total = xTotal / yTotal;
        }
      } else {
        total += data[i][yKey];
      }
      const totalData = {
        date: data[i].date,
      }
      totalData[yKey] = total;
      list.push(totalData);
    }
  }

  const height = 500;
  const width = 1200;
  const margin = 40;
  const w = width - margin * 2;
  const h = height - margin * 2;
  const x = d3.scaleTime()
    .domain([start, end])
    .range([margin, w])
  const y = d3.scaleLinear()
    .domain([d3.min(list, d => d[yKey]), d3.max(list, d => d[yKey])])
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
  });
  const yTicks = y.ticks(5).map(d => (
    <g transform={`translate(${margin}, ${y(d)})`}
      key={d}>
      <text
        x={-margin / 2}
        y='5'
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
        transform='translate(-5, 0)'
        style={{
          stroke: '#000',
        }}
      />
      <line
        x1='0'
        x2={w - margin}
        y1='0'
        y2='0'
        transform='translate(-5, 0)'
        style={{
          stroke: '#000',
        }}
      />
    </g>
  ));

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  }

  const handleYKeyChange = (event) => {
    setYKey(event.target.value);
  }

  const tooltipOnMouseOver = () => {
    setTooltipDisplay(null);
  }

  const tooltipOnMouseOut = () => {
    setTooltipDisplay('none');
  }

  const bisectDate = d3.bisector(d => new Date(d.date)).right;

  const tooltipOnMouseMove = (e) => {
    const x0 = x.invert(d3.clientPoint(e.target, e)[0]);
    const i = bisectDate(list, x0, 1);
    const d = list[i - 1] || {};
    const date = new Date(d.date);
    setTooltipTransform(`translate(${x(date)}, ${y(d[yKey])})`);
    setTooltipXValue(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );
    setTooltipYValue(d[yKey]);
  }

  const radioGroup =
    <div
      style={{
        display: 'flex',
          justifyContent: 'space-around',
          width,
      }}>
      <RadioGroup
        row
        value={yKey}
        onChange={handleYKeyChange}>
        {
          ykeyList.map((ykey) =>
            <FormControlLabel
              key={ykey.value}
              value={ykey.value}
              control={<Radio />}
              label={ykey.label}
            />
          )
        }
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
          value='week'
          control={<Radio />}
          label='周'
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

  return(
    <div>
      {
        radioPosition !== 'bottom' ? radioGroup : null
      }
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
          x2={margin}
          y1={margin}
          y2={h}
        />
        <path
          style={{
            stroke: 'steelblue',
            strokeWidth: '2px',
            fill: 'none',
          }}
          d={line(list)}
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
              file: 'steelblue',
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
      {
        radioPosition === 'bottom' ? radioGroup : null
      }
    </div>
  );
}

export default Chart;
