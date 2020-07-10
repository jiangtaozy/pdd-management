/*
 * Maintained by jemo from 2020.7.9 to now
 * Created by jemo on 2020.7.9 17:41:09
 * Ad Unit Data Chart
 * 推广单元数据图表
 */

import React, { useState } from 'react';
import * as d3 from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function AdUnitDataChart (props) {

  const [chartType, setChartType] = useState('total');
  const [yKey, setYKey] = useState('cvr');
  const [tooltipDisplay, setTooltipDisplay] = useState('none');
  const [tooltipTransform, setTooltipTransform] = useState('');
  const [tooltipXValue, setTooltipXValue] = useState('');
  const [tooltipYValue, setTooltipYValue] = useState('');
  const adDataList = [];
  let {
    shippingPrice,
    siteType,
    skuGroupPriceMax,
    suitPrice,
    thumbUrl,
    adName,
    goodsName,
  } = props.adUnit;
  if(siteType === 2) {
    shippingPrice = 4.4;
  }
  const profit = skuGroupPriceMax / 100 - suitPrice - shippingPrice || 0;
  const conversionThreshold = profit && Math.round(0.1 / profit * 100 *100) / 100;
  for(let i = 0; i < props.data.length; i++) {
    let {
      impression,
      click,
      spend,
      orderNum,
      gmv,
      mallFavNum,
      goodsFavNum,
      date,
    } = props.data[i];
    spend = Math.round(spend / 10) / 100;
    gmv = Math.round(gmv / 10) / 100;
    const ctr = click > 0 ? Math.round(click / impression * 100 * 100) / 100 : 0;
    const cvr = click > 0 ? Math.round(orderNum / click * 100 * 100) / 100 : 0;
    const cmfr = click > 0 ? Math.round(mallFavNum / click * 100 * 100) / 100 : 0;
    const cgfr = click > 0 ? Math.round(goodsFavNum / click * 100 * 100) / 100 : 0;
    adDataList.push({
      impression,
      click,
      orderNum,
      mallFavNum,
      goodsFavNum,
      spend,
      gmv,
      ctr,
      cvr,
      cmfr,
      cgfr,
      date,
    })
  }
  let startDate;
  let endDate;
  for(let i = 0; i < adDataList.length; i++) {
    const date = new Date(adDataList[i].date);
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
  if(chartType === 'month') {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const monthDifference = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + endMonth.getMonth() - startMonth.getMonth() + 1;
    data = [];
    for(let i = 0; i < monthDifference; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      let spend = 0;
      let gmv = 0;
      let impression = 0;
      let click = 0;
      let orderNum = 0;
      let mallFavNum = 0;
      let goodsFavNum = 0;
      for(let j = 0; j < adDataList.length; j++) {
        const adDataItem = adDataList[j];
        const date = new Date(adDataItem.date);
        if(date.getFullYear() === month.getFullYear() &&
          date.getMonth() === month.getMonth()) {
          spend += adDataItem.spend;
          gmv += adDataItem.gmv;
          impression += adDataItem.impression;
          click += adDataItem.click;
          orderNum += adDataItem.orderNum;
          mallFavNum += adDataItem.mallFavNum;
          goodsFavNum += adDataItem.goodsFavNum;
        }
      }
      const monthData = {
        impression,
        click,
        orderNum,
        mallFavNum,
        goodsFavNum,
        spend: Math.round(spend * 100) / 100,
        gmv: Math.round(gmv * 100) / 100,
        ctr: impression && Math.round(click / impression * 100 * 100) / 100,
        cvr: click && Math.round(orderNum / click * 100 * 100) / 100,
        cmfr: click && Math.round(mallFavNum / click * 100 * 100) / 100,
        cgfr: click && Math.round(goodsFavNum / click * 100 * 100) / 100,
        date: `${month.getFullYear()}-${month.getMonth() + 1}-${month.getDate()}`,
      }
      data.push(monthData);
    }
    startDate = startMonth;
    endDate = endMonth;
  } else if(chartType === 'total') {
    data = [];
    let spend = 0;
    let gmv = 0;
    let impression = 0;
    let click = 0;
    let orderNum = 0;
    let mallFavNum = 0;
    let goodsFavNum = 0;
    for(let i = 0; i < adDataList.length; i++) {
      spend += adDataList[i].spend;
      gmv += adDataList[i].gmv;
      impression += adDataList[i].impression;
      click += adDataList[i].click;
      orderNum += adDataList[i].orderNum;
      mallFavNum += adDataList[i].mallFavNum;
      goodsFavNum += adDataList[i].goodsFavNum;
      const totalData = {
        impression,
        click,
        orderNum,
        mallFavNum,
        goodsFavNum,
        spend: Math.round(spend * 100) / 100,
        gmv: Math.round(gmv * 100) / 100,
        ctr: impression && Math.round(click / impression * 100 * 100) / 100,
        cvr: click && Math.round(orderNum / click * 100 * 100) / 100,
        cmfr: click && Math.round(mallFavNum / click * 100 * 100) / 100,
        cgfr: click && Math.round(goodsFavNum / click * 100 * 100) / 100,
        date: adDataList[i].date,
      }
      data.push(totalData);
    }
  }
  const height = 500;
  const width = 1200;
  const margin = 60;
  const w = width - 2 * margin;
  const h = height - 2 * margin;
  const x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([margin, w])
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yKey])])
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
    y(d) > 10 && y(d) < h ?
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
            stroke: '#A6ACAF',
          }}
        />
        <line
          x1='0'
          x2={w - margin}
          y1='0'
          y2='0'
          transform="translate(-5, 0)"
          style={{
            stroke: '#A6ACAF',
          }}
        />
      </g>
    : null
  ))

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value)
  }

  const handleYKeyChange = (event) => {
    setYKey(event.target.value)
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
    const i = bisectDate(data, x0, 1);
    const d = data[i - 1] || {};
    setTooltipTransform(`translate(${x(new Date(d.date))},${y(d[yKey])})`);
    setTooltipXValue(d.date);
    setTooltipYValue(d[yKey]);
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
          width: 1200,
        }}>
        <img
          src={thumbUrl}
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
            {adName}
          </div>
          <div>
            {goodsName}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <div>
              价格：{skuGroupPriceMax / 100}
            </div>
            <div>
              成本价：{suitPrice + shippingPrice}
            </div>
            <div>
              利润：{profit}
            </div>
            <div>
              转化阈值：{conversionThreshold}
            </div>
          </div>
        </div>
      </div>
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
            value='impression'
            control={<Radio />}
            label='曝光量'
          />
          <FormControlLabel
            value='click'
            control={<Radio />}
            label='点击量'
          />
          <FormControlLabel
            value='spend'
            control={<Radio />}
            label='花费'
          />
          <FormControlLabel
            value='orderNum'
            control={<Radio />}
            label='订单量'
          />
          <FormControlLabel
            value='gmv'
            control={<Radio />}
            label='交易额'
          />
          <FormControlLabel
            value='mallFavNum'
            control={<Radio />}
            label='店铺关注量'
          />
          <FormControlLabel
            value='goodsFavNum'
            control={<Radio />}
            label='商品收藏量'
          />
          <FormControlLabel
            value='ctr'
            control={<Radio />}
            label='点击率'
          />
          <FormControlLabel
            value='cvr'
            control={<Radio />}
            label='点击转化率'
          />
          <FormControlLabel
            value='cmfr'
            control={<Radio />}
            label='点击关注店铺率'
          />
          <FormControlLabel
            value='cgfr'
            control={<Radio />}
            label='点击收藏商品率'
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
        {yKey === 'cvr' &&
          <g
            transform={`translate(${margin}, ${y(conversionThreshold) || 0})`}>
            <text
              x="-30"
              y="5"
              style={{
                fill: '#000',
                fillOpacity: 0.9,
                fontSize: '12px',
                textAnchor: 'middle',
              }}>
              {conversionThreshold}
            </text>
            <line
              x1='0'
              x2='5'
              y1='0'
              y2='0'
              transform="translate(-5, 0)"
              style={{
                stroke: '#FF5722',
              }}
            />
            <line
              x1='0'
              x2={w - margin}
              y1='0'
              y2='0'
              transform="translate(-5, 0)"
              style={{
                stroke: '#FF5722',
              }}
            />
          </g>
        }
      </svg>
    </div>
  );
}

export default AdUnitDataChart;
