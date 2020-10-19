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
  const [ keywordId, setKeywordId ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const { message, open } = snackbarState;
  const { id } = useParams();

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
      const list = getRefactoredList(data || []);
      if(list.length > 0) {
        setKeywordId(list[0].keywordId.toString());
      }
      setKeywordList(list);
    }
    catch(err) {
      console.error('keyword-fetch-keyword-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  useEffect(() => {
    fetchKeywordList();
  }, [id]);

  const getRefactoredList = (keywordList) => {
    const refactoredList = [];
    for(let i = 0; i < keywordList.length; i++) {
      keywordList[i].spend = keywordList[i].spend / 1000;
      keywordList[i].cpm = keywordList[i].cpm / 1000;
      keywordList[i].gmv = keywordList[i].gmv / 1000;
      keywordList[i].bid = keywordList[i].bid / 1000;
      keywordList[i].bidPremiumValue = keywordList[i].bidPremiumValue / 1000;
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
    // sum
    for(let i = 0; i < refactoredList.length; i++) {
      const keyword = refactoredList[i];
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
      for(let j = 0; j < data.length; j++) {
        impression += data[j].impression;
        click += data[j].click;
        spend += data[j].spend;
        goodsFavNum += data[j].goodsFavNum;
        mallFavNum += data[j].mallFavNum;
        orderNum += data[j].orderNum;
        gmv += data[j].gmv;
        bid += data[j].bid;
        qualityScore += data[j].qualityScore;
      }
      if(data.length > 0) {
        bid = Math.round(bid / data.length * 100) / 100;
        qualityScore = Math.round(qualityScore / data.length * 100) / 100;
      }
      keyword.impression = impression;
      keyword.click = click;
      keyword.ctr = Math.round(click / impression * 10000) / 100;
      keyword.spend = Math.round(spend * 100) / 100;
      keyword.goodsFavNum = goodsFavNum;
      keyword.gfvr = Math.round(goodsFavNum / click * 10000) / 100;
      keyword.mallFavNum = mallFavNum;
      keyword.mfvr = Math.round(mallFavNum / click * 10000) / 100;
      keyword.orderNum = orderNum;
      keyword.cvr = Math.round(orderNum / click * 10000) / 100;
      keyword.gmv = gmv;
      keyword.bid = bid;
      keyword.qualityScore = qualityScore;
    }
    return refactoredList;
  }

  const handleKeywordIdChange = (e) => {
    setKeywordId(e.target.value);
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

  const data = getKeywordListData(keywordList, keywordId);

  return (
    <div>
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
      <MaterialTable
        icons={tableIcons}
        data={keywordList}
        title="关键字列表"
        options={{
          searchFieldAlignment: 'left',
          rowStyle: rowData => ({
            backgroundColor: (keywordId === rowData.keywordId.toString()) ? '#EEE' : '#fff',
          }),
        }}
        onRowClick={onRowClick}
        columns={[
          {
            title: "关键字",
            field: "keyword",
          },
          {
            title: "花费",
            field: "spend",
            defaultSort: "desc",
          },
          {
            title: "点击率",
            field: "ctr",
            render: rowData => {
              return (
                <div>
                  {rowData.ctr}%
                </div>
              );
            },
          },
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
            title: "曝光量",
            field: "impression",
          },
          {
            title: "点击量",
            field: "click",
          },
          {
            title: "出价",
            field: "bid",
          },
          {
            title: "订单量",
            field: "orderNum",
          },
          {
            title: "交易额",
            field: "gmv",
          },
          {
            title: "收藏量",
            field: "goodsFavNum",
          },
          {
            title: "关注量",
            field: "mallFavNum",
          },
          {
            title: "质量分",
            field: "qualityScore",
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
