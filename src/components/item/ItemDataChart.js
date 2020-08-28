/*
 * Maintained by jemo from 2020.8.27 to now
 * Created by jemo on 2020.8.27 09:09:15
 * Item Data Chart
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chart from '../utils/Chart';

function ItemDataChart (props) {

  const [ data, setData ] = useState([]);
  const { id } = useParams();

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
            impression,
            click,
            spend,
            realOrderNum,
            platformDiscount,
            userPaidAmount,
            actualPayment,
          } = dateData;
          dateData.ctr = (click / impression) || 0;
          dateData.cvr = (realOrderNum / click) || 0;
          dateData.spend = (spend / 1000) || 0;
          dateData.profit = ((userPaidAmount + platformDiscount) / 100 - actualPayment) || 0;
          dateData.perClickSpend = (spend / 1000 / click) || 0;
          dateData.perClickProfit = (dateData.profit / click) || 0;
          dateData.perClickProfitSpend = (dateData.profit / (spend / 1000)) || 0;
          if(!dateData.realOrderNum) {
            dateData.realOrderNum = 0;
          }
        }
        setData(data);
      }
      catch(err) {
        console.error('item-data-chart-fetch-item-data-error: ', err);
      }
    }
    fetchItemData();
  }, [id]);

  return (
    <div>
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
            value: 'perClickProfitSpend',
            label: '点击利润花费比',
            ratio: true,
            x: 'profit',
            y: 'spend',
          },
        ]}
      />
    </div>
  );
}

export default ItemDataChart;
