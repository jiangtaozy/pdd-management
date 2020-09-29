/*
 * Maintained by jemo from 2020.9.29 to now
 * Created by jemo on 2020.9.29 16:55:52
 * 数字横坐标图表
 */

import React, { useState } from 'react';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function NumberChart(props) {

  const {
    data,
    defaultYKey,
    ykeyList,
    xKey,
  } = props;
  const [ yKey, setYKey ] = useState(defaultYKey);
  const [ tooltipDisplay, setTooltipDisplay ] = useState('none');
  const [ tooltipTransform, setTooltipTransform ] = useState('');
  const [ tooltipXValue, setTooltipXValue ] = useState('');
  const [ tooltipYValue, setTooltipYValue ] = useState('');
  let ykeyObj;
  for(let j = 0; j < ykeyList.length; j++) {
    if(ykeyList[j].value === yKey) {
      ykeyObj = ykeyList[j];
      break;
    }
  }
  for(let i = 0; i < data.length; i++) {
    if(ykeyObj.ratio) {
      const xValue = data[i][ykeyObj.x];
      const yValue = data[i][ykeyObj.y];
      if(!yValue) {
        data[i][yKey] = 0;
      } else {
        data[i][yKey] = xValue / yValue;
      }
    }
  }
  const height = 500;
  const width = 1200;
  const margin = 60;
  const w = width - margin * 2;
  const h = height - margin * 2;
  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d[xKey]), d3.max(data, d => d[xKey])])
    .range([margin, w])
  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d[yKey]), d3.max(data, d => d[yKey])])
    .range([h, margin])
  const line = d3.line()
    .x(d => x(d[xKey]))
    .y(d => y(d[yKey]))
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
          {d}
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
        x='-30'
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

  const handleYKeyChange = (event) => {
    setYKey(event.target.value);
  }

  const tooltipOnMouseOver = () => {
    setTooltipDisplay(null);
  }

  const tooltipOnMouseOut = () => {
    setTooltipDisplay('none');
  }

  const bisectDate = d3.bisector(d => d[xKey]).right;

  const tooltipOnMouseMove = (e) => {
    const x0 = x.invert(d3.clientPoint(e.target, e)[0]);
    const i = bisectDate(data, x0, 1);
    const d = data[i - 1] || {};
    setTooltipTransform(`translate(${x(d[xKey])}, ${y(d[yKey])})`);
    setTooltipXValue(d[xKey]);
    setTooltipYValue(d[yKey]);
  }

  return(
    <div>
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
          x2={margin}
          y1={margin}
          y2={h}
        />
        <text
          style={{
            fontSize: 12,
          }}
          y={12}>
          图表
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
    </div>
  );
}

export default NumberChart;
