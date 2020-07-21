/*
 * Maintained by jemo from 2020.7.21 to now
 * Created by jemo on 2020.7.21 17:34:18
 * Pdd Activity
 * 拼多多优惠活动
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';

function PddActivity() {

  const [ pddActivityData, setPddActivityData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  })
  const [ pddActivityList, setPddActivityList ] = useState([]);
  const { message, open } = snackbarState;

  async function handlePddActivityDataButtonClick() {
    if(!pddActivityData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/savePddActivityData', {
        pddActivityData,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setPddActivityData('');
      fetchPddActivity();
    }
    catch(err) {
      console.error('PddActivityUploadPddActivityDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  const handleOpenSnackbar = ({message}) => {
    setSnackbarState({
      message,
      open: true,
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbarState({
      open: false,
    });
  }

  useEffect(() => {
    fetchPddActivity();
  }, []);

  const fetchPddActivity = async () => {
    try {
      const { data } = await axios.get('/pddActivityList');
      setPddActivityList(data);
    }
    catch(err) {
      console.error('pdd-activity-fetch-pdd-goods-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  };

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        options={{
          headerStyle: {
            position: 'sticky',
            top: 0,
          },
        }}
        data={pddActivityList}
        title="拼多多优惠活动列表"
        columns={[
          {
            title: '商品',
            field: 'goodsId',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                goodsId,
                goodsName,
                hdThumbUrl,
              } = rowData;
              return (
                <div
                  style={{
                    display: 'flex',
                  }}>
                  <img alt=""
                    src={hdThumbUrl}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 10,
                      width: 100,
                    }}>
                    <div>
                      {goodsName}
                    </div>
                    <div>
                      {goodsId}
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            title: '活动id',
            field: 'activityId',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '活动名称',
            field: 'activityName',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '类型',
            field: 'activityType',
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
              3: '限量',
            },
          },
          {
            title: '数量',
            field: 'activityQuantity',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '优惠券数量',
            field: 'activityStockQuantity',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '折扣',
            field: 'discount',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                discount,
              } = rowData;
              return (
                <div>
                  <div>
                    {discount / 100}折
                  </div>
                </div>
              );
            },
          },
          {
            title: '价格',
            field: 'maxPreSalePrice',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                minOnSaleGroupPrice,
                maxOnSaleGroupPrice,
                maxPreSalePrice,
                minPreSalePrice,
              } = rowData;
              return (
                <div>
                  <div>
                    原价：{
                      minOnSaleGroupPrice == maxOnSaleGroupPrice ?
                        `${minOnSaleGroupPrice / 100}元` :
                        `${minOnSaleGroupPrice / 100}-${maxOnSaleGroupPrice / 100}元`
                    }
                  </div>
                  <div>
                    现价：{
                      minPreSalePrice ==  maxPreSalePrice ?
                        `${minPreSalePrice / 100}元` :
                        `${minPreSalePrice / 100}-${maxPreSalePrice / 100}元`
                    }
                  </div>
                </div>
              );
            },
          },
          {
            title: '开始时间',
            field: 'startTime',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '结束时间',
            field: 'endTime',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '状态',
            field: 'status',
            cellStyle: {
              fontSize: 12,
            },
            lookup: {
              2: '活动中',
            },
          },
          {
            title: '上架数量',
            field: 'onlineQuantity',
            cellStyle: {
              fontSize: 12,
            },
          },
          {
            title: '是否新品',
            field: 'newGoods',
            cellStyle: {
              fontSize: 12,
            },
            type: 'boolean',
          },
          {
            title: '操作停止时间',
            field: 'endOperationTime',
            cellStyle: {
              fontSize: 12,
            },
          },
        ]}
      />
      <TextField
        label="输入拼多多优惠活动数据(/query)"
        multiline
        fullWidth
        value={pddActivityData}
        onChange={(event) => {
          setPddActivityData(event.target.value)
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handlePddActivityDataButtonClick}>
        确定
      </Button>
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

export default PddActivity;
