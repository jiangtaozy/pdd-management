/*
 * Maintained by jemo from 2020.5.26 to now
 * Created by jemo on 2020.5.26 9:08:20
 * Ad Data
 * 广告数据
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function AdData () {

  const [ adPlanData, setAdPlanData ] = useState('');
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
  });
  const [ adPlanList, setAdPlanList ] = useState([]);
  const [ scenesType, setScenesType ] = useState(0);
  const { message, open } = snackbarState;

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

  async function handleAdPlanDataButtonClick() {
    if(!adPlanData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/uploadAdPlanData', {
        adPlanData,
        scenesType,
      });
      handleOpenSnackbar({
        message: '操作成功',
      });
      setAdPlanData('');
      fetchAdPlanList();
    }
    catch(err) {
      console.error('AdDataUploadAdPlanDataError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  useEffect(() => {
    const fetchAdPlanList = async () => {
      try {
        const { data } = await axios.get('/adPlanList');
        setAdPlanList(data);
      }
      catch(err) {
        console.error('ad-data-fetch-ad-plan-list-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    };
    fetchAdPlanList();
  }, []);

  const fetchAdPlanList = async () => {
    try {
      const { data } = await axios.get('/adPlanList');
      setAdPlanList(data);
    }
    catch(err) {
      console.error('ad-data-fetch-ad-plan-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  };

  const handleScenesTypeChange = (event) => {
    setScenesType(event.target.value);
  }

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: '商家Id',
            field: 'mallId',
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: '计划Id',
            field: 'planId',
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: '计划名称',
            field: 'planName',
            cellStyle: {
              fontSize: 12,
            },
            render: rowData => {
              const {
                planId,
                planName,
              } = rowData;
              return (
                <Link to={`/adPlan/${planId}`}>
                  {planName}
                </Link>
              );
            },
          },
          {
            title: 'isStick',
            field: 'isStick',
            type: 'boolean',
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: 'stickTime',
            field: 'stickTime',
            cellStyle: {
              fontSize: 12,
            },
            filtering: false,
          },
          {
            title: '类型',
            field: 'scenesType',
            lookup: {
              0: '多多搜索',
              1: '聚焦展位',
              2: '多多场景',
            },
            cellStyle: {
              fontSize: 12,
            },
          },
        ]}
        data={adPlanList}
        title="推广计划列表"
        options={{
          filtering: true,
        }}
      />
      <TextField
        label="输入推广计划数据(/planMap)"
        fullWidth
        value={adPlanData}
        onChange={(event) => {
          setAdPlanData(event.target.value);
        }}
      />
      <div>
        <Select
          label="选择类型"
          id="select-scenes-type"
          value={scenesType}
          onChange={handleScenesTypeChange}
        >
          <MenuItem value={0}>
            多多搜索
          </MenuItem>
          <MenuItem value={2}>
            多多场景
          </MenuItem>
          <MenuItem value={1}>
            聚焦展位
          </MenuItem>
        </Select>
      </div>
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleAdPlanDataButtonClick}
      >
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

export default AdData;
