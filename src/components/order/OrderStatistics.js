/*
 * Maintained by jemo from 2020.9.28 to now
 * Created by jemo on 2020.9.28 14:55:46
 * Order Statistics
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from '../utils/Chart';

function OrderStatistics() {

  const [ data, setData ] = useState([]);

  useEffect(() => {
    const fetchDataList = async () => {
      try {
        const { data } = await axios.get('/orderStatistics');
        const { data: adData } = await axios.get('/adDayData');
        const { data: billList } = await axios.get('/billList');
        let start = new Date();
        // order
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
        // ad
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
            impression: 0,
            orderNumber: 0,
            totalOrderNumber: 0,
            signedUserPaidAmount: 0,
            signedActualPayment: 0,
            signedProfit: 0,
            signedOrderNumber: 0,
            afterSaleOrderNumber: 0,
            techServiceFee: 0, // 技术服务费
            deduction: 0, // 扣款
            merchantSmallPayment: 0, // 商家小额打款
            jinbao: 0, // 多多进宝
            returnFee: 0, // 退货包运费
          }
          // order
          for(let j = 0; j < data.length; j++) {
            const time = new Date(data[j].paymentTime);
            if(time.getFullYear() === day.getFullYear() &&
              time.getMonth() === day.getMonth() &&
              time.getDate() === day.getDate()) {
              // 无售后订单
              orderData.totalOrderNumber++;
              if(data[j].afterSaleStatus === 0 ||
                data[j].afterSaleStatus === 6 || // 买家撤销
                data[j].afterSaleStatus === 12 || // 售后取消，退款失败
                data[j].afterSaleStatus === 16 // 换货成功
              ) {
                orderData.userPaidAmount += data[j].userPaidAmount;
                orderData.actualPayment += data[j].actualPayment;
                orderData.profit += data[j].profit;
                orderData.userPaidAmount = Math.round(orderData.userPaidAmount * 100) / 100;
                orderData.actualPayment = Math.round(orderData.actualPayment * 100) / 100;
                orderData.profit = Math.round(orderData.profit * 100) / 100;
                orderData.orderNumber++;
              }
              if(data[j].orderStatusStr === '已签收') {
                orderData.signedUserPaidAmount += data[j].userPaidAmount;
                orderData.signedActualPayment += data[j].actualPayment;
                orderData.signedProfit += data[j].profit;
                orderData.signedOrderNumber++;
              }
            }
            // 申请售后订单量
            const afterSaleApplyTime = new Date(data[j].afterSaleApplyTime);
            if(afterSaleApplyTime.getFullYear() === day.getFullYear() &&
              afterSaleApplyTime.getMonth() === day.getMonth() &&
              afterSaleApplyTime.getDate() === day.getDate()) {
              if(data[j].afterSaleStatus === 5 || // 退款成功
                data[j].afterSaleStatus === 10 || // 待买家发货
                data[j].afterSaleStatus === 11 // 用户已发货
              ) {
                orderData.afterSaleOrderNumber++;
              }
            }
          }
          // ad
          for(let k = 0; k < adData.length; k++) {
            const time = new Date(adData[k].date);
            if(time.getFullYear() === day.getFullYear() &&
              time.getMonth() === day.getMonth() &&
              time.getDate() === day.getDate()) {
              orderData.spend += adData[k].spend;
              orderData.click += adData[k].click;
              orderData.impression += adData[k].impression;
            }
          }
          // bill
          for(let l = 0; l < billList.length; l++) {
            const bill = billList[l];
            const time = new Date(bill.createdAt);
            if(time.getFullYear() === day.getFullYear() &&
              time.getMonth() === day.getMonth() &&
              time.getDate() === day.getDate()) {
              if(bill.classId === 5) {
                orderData.techServiceFee += (bill.amount / 100);
              } else if(bill.classId === 7) {
                orderData.deduction += (bill.amount / 100);
              } else if(bill.classId === 8 && bill.amount < 0) {
                orderData.merchantSmallPayment += (bill.amount / 100);
              } else if(bill.classId === 9) {
                orderData.jinbao += (bill.amount / 100);
              } else if(bill.classId === 11) {
                orderData.returnFee += (bill.amount / 100);
              }
            }
          }
          orderData.afterSaleReturnFee = orderData.afterSaleOrderNumber * 5.5;
          const {
            profit,
            spend,
            techServiceFee,
            deduction,
            merchantSmallPayment,
            jinbao,
            returnFee,
            afterSaleReturnFee,
            signedProfit,
          } = orderData;
          const totalSpend = - spend + techServiceFee + deduction + merchantSmallPayment + jinbao + returnFee - afterSaleReturnFee;
          orderData.netProfit = Math.round((profit + totalSpend) * 100) / 100;
          orderData.signedNetProfit = Math.round((signedProfit + totalSpend) * 100) / 100;
          orderData.totalMinusAfterSaleOrderNumber = orderData.totalOrderNumber - orderData.afterSaleOrderNumber;
          orderDataList.push(orderData);
        }
        setData(orderDataList);
      }
      catch(err) {
        console.error('order-statistics-use-effect-fetch-order-data-list-error: ', err);
      }
    };
    fetchDataList();
  }, []);

  return (
    <div>
      <Chart
        data={data}
        defaultYKey={'signedNetProfitSpendRate'}
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
            value: 'spend',
            label: '推广花费',
          },
          {
            value: 'techServiceFee',
            label: '技术服务费',
          },
          {
            value: 'returnFee',
            label: '退货包运费',
          },
          {
            value: 'afterSaleReturnFee',
            label: '退货运费损失',
          },
          {
            value: 'deduction',
            label: '扣款',
          },
          {
            value: 'merchantSmallPayment',
            label: '商家小额打款',
          },
          {
            value: 'jinbao',
            label: '多多进宝佣金',
          },
          {
            value: 'perImpressionSpend',
            label: '单次曝光花费',
            ratio: true,
            x: 'spend',
            y: 'impression',
          },
          {
            value: 'perImpressionProfit',
            label: '单次曝光利润',
            ratio: true,
            x: 'profit',
            y: 'impression',
          },
          {
            value: 'perImpressionNetProfit',
            label: '单次曝光净利润',
            ratio: true,
            x: 'netProfit',
            y: 'impression',
          },
          {
            value: 'perClickSpend',
            label: '单次点击花费',
            ratio: true,
            x: 'spend',
            y: 'click',
          },
          {
            value: 'perClickPrifit',
            label: '单次点击利润',
            ratio: true,
            x: 'profit',
            y: 'click',
          },
          {
            value: 'perClickNetPrifit',
            label: '单次点击净利润',
            ratio: true,
            x: 'netProfit',
            y: 'click',
          },
          {
            value: 'totalOrderNumber',
            label: '总订单量',
          },
          {
            value: 'orderNumber',
            label: '无售后订单量',
          },
          {
            value: 'afterSaleOrderNumber',
            label: '申请售后订单量',
          },
          {
            value: 'totalMinusAfterSaleOrderNumber',
            label: '总订单减去申请售后订单量',
          },
          {
            value: 'noAfterSaleRate',
            label: '无售后率',
            ratio: true,
            x: 'orderNumber',
            y: 'totalOrderNumber',
          },
          {
            value: 'userPaidAmount',
            label: '无售后交易额',
          },
          {
            value: 'actualPayment',
            label: '无售后成本',
          },
          {
            value: 'profit',
            label: '无售后利润',
          },
          {
            value: 'netProfit',
            label: '无售后净利润',
          },
          {
            value: 'profitSpendRate',
            label: '利润花费比',
            ratio: true,
            x: 'profit',
            y: 'spend',
          },
          {
            value: 'netProfitSpendRate',
            label: '净利润花费比',
            ratio: true,
            x: 'netProfit',
            y: 'spend',
          },
          {
            value: 'signedOrderNumber',
            label: '已签收订单量',
          },
          {
            value: 'signedRate',
            label: '签收率',
            ratio: true,
            x: 'signedOrderNumber',
            y: 'orderNumber',
          },
          {
            value: 'signedProfit',
            label: '已签收利润',
          },
          {
            value: 'signedNetProfit',
            label: '已签收净利润',
          },
          {
            value: 'signedProfitSpendRate',
            label: '已签收利润花费比',
            ratio: true,
            x: 'signedProfit',
            y: 'spend',
          },
          {
            value: 'signedNetProfitSpendRate',
            label: '已签收净利润花费比',
            ratio: true,
            x: 'signedNetProfit',
            y: 'spend',
          },
        ]}
      />
    </div>
  );
}

export default OrderStatistics;
