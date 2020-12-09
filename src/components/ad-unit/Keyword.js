/*
 * Maintained by jemo from 2020.10.16 to now
 * Created by jemo on 2020.10.16 11:01:41
 * Keyword
 * 推广单元关键字数据
 */

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chart from '../utils/Chart';
import AdUnitKeywordSave from '../AdUnitKeywordSave';
import MaterialTable from 'material-table';
import tableIcons from '../utils/TableIcons';

function Keyword() {

  const [ keywordList, setKeywordList ] = useState([]);
  const [ keywordId, setKeywordId ] = useState('0');
  const [ timeLimit, setTimeLimit ] = useState('ninetyDay');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const { id } = useParams();
  const [ mallTotalCtr, setMallTotalCtr ] = useState(0);

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

  const fetchKeywordList = async () => {
    try {
      const { data } = await axios.get('/keywordList', {
        params: {
          adId: id,
        },
      });
      const { data: orderList } = await axios.get('/orderListByAdId', {
        params: {
          adId: id,
        },
      });
      const list = getRefactoredList(data || [], orderList || []);
      calcSumData(list);
      setKeywordList(list);
    }
    catch(err) {
      console.error('keyword-fetch-keyword-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  const fetchMallTotalData = async () => {
    try {
      const { data: list } = await axios.get('/mallTotalAdData');
      for(let i = 0; i < list.length; i++) {
        if(list[i].mallId === 777561295 &&
          list[i].scenesType === 0) {
          setMallTotalCtr(list[i].click / list[i].impression);
        }
      }
    }
    catch(err) {
      console.error('keyword-fetch-mall-total-data-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  useEffect(() => {
    fetchKeywordList();
    fetchMallTotalData();
  }, [id]);

  const getRefactoredList = (keywordList, orderList) => {
    const refactoredList = [];
    for(let i = 0; i < keywordList.length; i++) {
      keywordList[i].spend = keywordList[i].spend / 1000;
      keywordList[i].cpm = keywordList[i].cpm / 1000;
      keywordList[i].gmv = keywordList[i].gmv / 1000;
      keywordList[i].bid = keywordList[i].bid / 1000;
      keywordList[i].bidPremiumValue = keywordList[i].bidPremiumValue / 1000;
      calcKeywordProfit(keywordList[i], orderList);
      const {
        keyword,
        keywordId,
      } = keywordList[i];
      let hasInRefactoredList = false;
      for(let j = 0; j < refactoredList.length; j++) {
        if(refactoredList[j].keywordId === keywordId) {
          hasInRefactoredList = true;
          refactoredList[j].data.push(keywordList[i]);
          break;
        }
      }
      if(!hasInRefactoredList) {
        refactoredList.push({
          keyword,
          keywordId,
          data: [keywordList[i]],
        });
      }
    }
    return refactoredList;
  }

  const calcKeywordProfit = (keyword, orderList) => {
    const {
      date,
      orderNum,
      spend,
    } = keyword;
    if(!orderNum) {
      keyword.profit = 0;
      keyword.realOrderNum = 0;
      keyword.netProfit = -spend;
      return;
    }
    const keywordDate = new Date(date);
    let realOrderNum = 0;
    let profit = 0;
    for(let i = 0; i < orderList.length; i++) {
      const {
        userPaidAmount,
        platformDiscount,
        actualPayment,
        orderStatus,
        afterSaleStatus,
        paymentTime,
      } = orderList[i];
      const orderDate = new Date(paymentTime);
      if(keywordDate.getFullYear() === orderDate.getFullYear() &&
        keywordDate.getMonth() === orderDate.getMonth() &&
        keywordDate.getDate() === orderDate.getDate() &&
        orderStatus === "1" &&
        (afterSaleStatus === 0 || afterSaleStatus === 6 || afterSaleStatus === 12 || afterSaleStatus === 16) && 
        realOrderNum < orderNum) {
        realOrderNum++;
        profit += (userPaidAmount + platformDiscount) / 100 - actualPayment;
      }
    }
    keyword.profit = Math.round(profit * 100) / 100;
    keyword.realOrderNum = realOrderNum;
    keyword.netProfit = Math.round((profit - spend) * 100) / 100;
  }

  const calcSumData = (list) => {
    const sumKeywordData = {
      keyword: "全部",
      keywordId: 0,
      data: [],
    }
    const sumKeywordDataList = sumKeywordData.data;
    for(let i = 0; i < list.length; i++) {
      const keywordDataList = list[i].data;
      for(let j = 0; j < keywordDataList.length; j++) {
        const keywordData = keywordDataList[j];
        const date = new Date(keywordData.date);
        let hasInList = false;
        for(let k = 0; k < sumKeywordDataList.length; k++) {
          const sumKeywordData = sumKeywordDataList[k];
          const sumDate = new Date(sumKeywordData.date);
          if(date.getFullYear() === sumDate.getFullYear() &&
            date.getMonth() === sumDate.getMonth() &&
            date.getDate() === sumDate.getDate()) {
            sumKeywordData.click += keywordData.click;
            sumKeywordData.gmv += keywordData.gmv;
            sumKeywordData.goodsFavNum += keywordData.goodsFavNum;
            sumKeywordData.impression += keywordData.impression;
            sumKeywordData.mallFavNum += keywordData.mallFavNum;
            sumKeywordData.netProfit += keywordData.netProfit;
            sumKeywordData.orderNum += keywordData.orderNum;
            sumKeywordData.profit += keywordData.profit;
            sumKeywordData.realOrderNum += keywordData.realOrderNum;
            sumKeywordData.spend += keywordData.spend;
            hasInList = true;
            break;
          }
        }
        if(!hasInList) {
          sumKeywordDataList.push({
            date: keywordData.date,
            click: keywordData.click,
            gmv: keywordData.gmv,
            goodsFavNum: keywordData.goodsFavNum,
            impression: keywordData.impression,
            mallFavNum: keywordData.mallFavNum,
            netProfit: keywordData.netProfit,
            orderNum: keywordData.orderNum,
            profit: keywordData.profit,
            realOrderNum: keywordData.realOrderNum,
            spend: keywordData.spend,
          });
        }
      }
    }
    sumKeywordDataList.sort((a, b) => new Date(a.date) - new Date(b.date));
    list.push(sumKeywordData);
  }

  const handleKeywordIdChange = (e) => {
    setKeywordId(e.target.value);
  }

  const handleTimeLimitChange = (e) => {
    setTimeLimit(e.target.value);
  }

  const onRowClick = (evt, selectedRow) => {
    setKeywordId(selectedRow.keywordId.toString());
  }

  const getKeywordListData = (keywordList, keywordId) => {
    for(let i = 0; i < keywordList.length; i++) {
      if(keywordList[i].keywordId.toString() === keywordId) {
        return keywordList[i].data;
      }
    }
    return [];
  }

  const getTableData = (list) => {
    const newList = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let totalCtr = 0;
    for(let i = 0; i < list.length; i++) {
      const keyword = list[i];
      const data = keyword.data;
      let impression = 0;
      let click = 0;
      let spend = 0;
      let goodsFavNum = 0;
      let mallFavNum = 0;
      let orderNum = 0;
      let gmv = 0;
      let bid = 0;
      let qualityScore = 0;
      let profit = 0;
      let realOrderNum = 0;
      let count = 0;
      for(let j = 0; j < data.length; j++) {
        const date = new Date(data[j].date);
        const days = (today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
        const timeMap = {
          yesterday: 2,
          sevenDay: 8,
          thirtyDay: 31,
          ninetyDay: 91,
          total: Number.MAX_VALUE,
        };
        let inTimeLimit = days < timeMap[timeLimit];
        if(inTimeLimit) {
          impression += data[j].impression;
          click += data[j].click;
          spend += data[j].spend;
          goodsFavNum += data[j].goodsFavNum;
          mallFavNum += data[j].mallFavNum;
          orderNum += data[j].orderNum;
          gmv += data[j].gmv;
          bid += data[j].bid;
          qualityScore += data[j].qualityScore;
          profit += data[j].profit;
          realOrderNum += data[j].realOrderNum;
          count++;
        }
      }
      let yesterdayImpressionGreaterThanZero = false;
      if(data.length > 0) {
        bid = Math.round(bid / count * 100) / 100;
        qualityScore = Math.round(qualityScore / count * 100) / 100;
        const lastDate = new Date(data[data.length - 1].date);
        const today = new Date();
        if(today - lastDate < 24 * 60 * 60 * 1000) {
          yesterdayImpressionGreaterThanZero = true;
        }
      }
      const tableData = {
        keyword: keyword.keyword,
        keywordId: keyword.keywordId,
        impression,
        click,
        ctr: Math.round(click / impression * 10000) / 100 || 0,
        spend: Math.round(spend * 100) / 100,
        goodsFavNum,
        gfvr: Math.round(goodsFavNum / click * 10000) / 100 || 0,
        mallFavNum,
        mfvr: Math.round(mallFavNum / click * 10000) / 100 || 0,
        orderNum,
        cvr: Math.round(orderNum / click * 10000) / 100 || 0,
        gmv: Math.round(gmv * 100) / 100,
        roi: Math.round(gmv / spend * 100) / 100,
        bid,
        qualityScore,
        profit: Math.round(profit * 100) / 100,
        realOrderNum,
        netProfitSpendRatio: Math.round((profit - spend) / spend * 100) / 100,
        netProfit: Math.round((profit - spend) * 100) / 100,
        impressionGreaterThanTen: impression >= 10,
        impressionGreaterThanThousand: impression >= 1000,
        yesterdayImpressionGreaterThanZero,
        netProfitSpendRatioSmallerThanThreshold: (profit - spend) / spend < 1,
        ctrSmallerThanMallTotalCtr: click / impression < mallTotalCtr,
      }
      if(keyword.keywordId === 0) {
        totalCtr = tableData.ctr;
      }
      newList.push(tableData);
    }
    for(let i = 0; i < newList.length; i++) {
      newList[i].ctrSmallerThanTotal = newList[i].ctr <= totalCtr;
    }
    return newList;
  }

  const data = getKeywordListData(keywordList, keywordId);
  const tableDataList = getTableData(keywordList);

  const [ columns ] = useState([
    {
      title: "关键字",
      field: "keyword",
      cellStyle: {
        color: '#ff4757'
      },
      headerStyle: {
        color: '#ff4757'
      },
    },
    {
      title: "曝光量",
      field: "impression",
      defaultSort: "desc",
      cellStyle: {
        color: '#747d8c'
      },
      headerStyle: {
        color: '#747d8c'
      },
    },
    {
      title: "点击量",
      field: "click",
      cellStyle: {
        color: '#2f3542'
      },
      headerStyle: {
        color: '#2f3542'
      },
    },
    {
      title: "点击率",
      field: "ctr",
      cellStyle: {
        color: '#eb4d4b'
      },
      headerStyle: {
        color: '#eb4d4b'
      },
      render: rowData => {
        return (
          <div>
          {rowData.ctr}%
          </div>
        );
      },
    },
    {
      title: "花费",
      field: "spend",
      cellStyle: {
        color: '#70a1ff'
      },
      headerStyle: {
        color: '#70a1ff'
      },
      defaultSort: "desc",
    },
    /*
    {
      title: "点击转化率",
      field: "cvr",
      render: rowData => {
        return (
          <div>
            {rowData.cvr}%
          </div>
        );
      },
    },
    {
      title: "点击收藏率",
      field: "gfvr",
      render: rowData => {
        return (
          <div>
            {rowData.gfvr}%
          </div>
        );
      },
    },
    {
      title: "点击关注率",
      field: "mfvr",
      render: rowData => {
        return (
          <div>
            {rowData.mfvr}%
          </div>
        );
      },
    },
    {
      title: "出价",
      field: "bid",
    },
    */
    {
      title: "净利润花费比",
      field: "netProfitSpendRatio",
      cellStyle: {
        color: '#44bd32'
      },
      headerStyle: {
        color: '#44bd32'
      },
    },
    {
      title: "实际利润",
      field: "profit",
      cellStyle: {
        color: '#2ed573'
      },
      headerStyle: {
        color: '#2ed573'
      },
    },
    {
      title: "实际净利润",
      field: "netProfit",
      cellStyle: {
        color: '#4cd137'
      },
      headerStyle: {
        color: '#4cd137'
      },
    },
    {
      title: "实际订单量",
      field: "realOrderNum",
      cellStyle: {
        color: '#22a6b3'
      },
      headerStyle: {
        color: '#22a6b3'
      },
    },
    {
      title: "订单量",
      field: "orderNum",
      cellStyle: {
        color: '#686de0'
      },
      headerStyle: {
        color: '#686de0'
      },
    },
    /*
    {
      title: "交易额",
      field: "gmv",
      cellStyle: {
        color: '#5352ed'
      },
      headerStyle: {
        color: '#5352ed'
      },
    },
    {
      title: "产出投入比",
      field: "roi",
      cellStyle: {
        color: '#ff7979'
      },
      headerStyle: {
        color: '#ff7979'
      },
    },
    {
      title: "收藏量",
      field: "goodsFavNum",
      cellStyle: {
        color: '#30336b'
      },
      headerStyle: {
        color: '#30336b'
      },
    },
    {
      title: "关注量",
      field: "mallFavNum",
      cellStyle: {
        color: '#f9ca24'
      },
      headerStyle: {
        color: '#f9ca24'
      },
    },
    */
    {
      title: '总曝光大于10',
      field: 'impressionGreaterThanTen',
      type: 'boolean',
      //defaultFilter: 'checked',
    },
    {
      title: '点击率小于平均',
      field: 'ctrSmallerThanTotal',
      type: 'boolean',
    },
    {
      title: '点击率小于店铺平均',
      field: 'ctrSmallerThanMallTotalCtr',
      type: 'boolean',
      //defaultFilter: 'checked',
    },
    {
      title: '昨天曝光量大于零',
      field: 'yesterdayImpressionGreaterThanZero',
      type: 'boolean',
      //defaultFilter: 'checked',
    },
    {
      title: '总曝光大于1000',
      field: 'impressionGreaterThanThousand',
      type: 'boolean',
    },
    {
      title: '净利润花费比小于阈值1',
      field: 'netProfitSpendRatioSmallerThanThreshold',
      type: 'boolean',
    },
    /*
    {
      title: "质量分",
      field: "qualityScore",
      cellStyle: {
        color: '#130f40'
      },
      headerStyle: {
        color: '#130f40'
      },
    },
    */
  ]);

  return (
    <div>
      <div>
        总点击率：{mallTotalCtr}
      </div>
      <RadioGroup
        row
        value={timeLimit}
        onChange={handleTimeLimitChange}>
          <FormControlLabel
            key="yesterday"
            value="yesterday"
            control={<Radio />}
            label="昨天"
          />
          <FormControlLabel
            key="sevenDay"
            value="sevenDay"
            control={<Radio />}
            label="7天"
          />
          <FormControlLabel
            key="thirtyDay"
            value="thirtyDay"
            control={<Radio />}
            label="30天"
          />
          <FormControlLabel
            key="ninetyDay"
            value="ninetyDay"
            control={<Radio />}
            label="90天"
          />
          <FormControlLabel
            key="total"
            value="total"
            control={<Radio />}
            label="全部"
          />
      </RadioGroup>
      <MaterialTable
        icons={tableIcons}
        data={tableDataList}
        title="关键字列表"
        options={{
          filtering: true,
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (keywordId === rowData.keywordId.toString()) ? '#EEE' : '#fff',
          }),
        }}
        onRowClick={onRowClick}
        columns={columns}
      />
      <Chart
        data={data}
        defaultYKey={'impression'}
        defaultChartType={'day'}
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
            label: '推广花费(元)',
          },
          {
            value: 'profit',
            label: '实际利润',
          },
          {
            value: 'netProfit',
            label: '实际净利润',
          },
          {
            value: 'realOrderNum',
            label: '实际订单',
          },
          {
            value: 'cpm',
            label: '千次曝光花费(元)',
          },
          {
            value: 'orderNum',
            label: '订单量',
          },
          {
            value: 'gmv',
            label: '交易额(元)',
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
            value: 'bid',
            label: '出价(元)',
          },
          {
            value: 'bidPremium',
            label: '精确匹配溢价(万分之一)',
          },
          {
            value: 'bidPremiumValue',
            label: '精确匹配出价(元)',
          },
          {
            value: 'keywordAdIdxOri',
            label: '90天roi平均排名',
          },
          {
            value: 'qualityScore',
            label: '质量分',
          },
        ]}
      />
      <RadioGroup
        row
        value={keywordId}
        onChange={handleKeywordIdChange}>
        {
          keywordList.map((obj) =>
            <FormControlLabel
              key={obj.keywordId}
              value={obj.keywordId.toString()}
              control={<Radio />}
              label={obj.keyword}
            />
          )
        }
      </RadioGroup>
      <AdUnitKeywordSave
        refreshData={fetchKeywordList}
      />
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

export default Keyword;
