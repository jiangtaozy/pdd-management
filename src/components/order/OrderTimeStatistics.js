/*
 * Maintained by jemo from 2020.11.6 to now
 * Created by jemo on 2020.11.6 19:33:31
 * Order Time Statistics
 * 订单时间统计
 */

import React, { useState, useEffect } from 'react';
import HourlyChart from '../utils/HourlyChart';

function OrderTimeStatistics(props) {

  const list = [];
  const data = props.data;
  let total = 0;
  for(let i = 0; i < data.length; i++) {
    const order = data[i];
    if(order.orderStatus === '2') {
      continue;
    }
    const time = new Date(order.paymentTime);
    const hour = time.getHours();
    let hasInList = false;
    for(let j = 0; j < list.length; j++) {
      if(list[j].hour === hour) {
        list[j].orderNumber++;
        hasInList = true;
        break;
      }
    }
    if(!hasInList) {
      list.push({
        hour,
        orderNumber: 1,
      });
    }
    total++;
  }
  list.sort((a, b) => a.hour - b.hour);
  for(let i = 0; i < list.length; i++) {
    list[i].orderPercentage = list[i].orderNumber / total;
  }

  return (
    <div>
      <HourlyChart
        data={list}
        defaultYKey={'orderNumber'}
        ykeyList={[
          {
            value: 'orderNumber',
            label: `总订单量: ${total}`,
          },
          {
            value: 'orderPercentage',
            label: '订单占比',
          },
        ]}
      />
    </div>
  );
}

export default OrderTimeStatistics;
