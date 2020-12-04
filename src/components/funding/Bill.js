/*
 * Maintained by jemo from 2020.10.12 to now
 * Created by jemo on 2020.10.12 16:26:23
 * Bill
 * 货款明细
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from '../utils/TableIcons';
import { GetTimeString } from '../utils/Time';

function Bill() {

  const [ billData, setBillData ] = useState('');
  const [ billList, setBillList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    open: false,
    message: '',
  });

  const fetchBillList = async () => {
    try {
      const { data } = await axios.get('/billList');
      console.log("data: ", data);
      setBillList(data);
    }
    catch(err) {
      console.error('bill-fetch-bill-list-error: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  useEffect(() => {
    fetchBillList();
  }, []);

  async function handleBillDataButtonClick() {
    if(!billData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      });
    }
    try {
      await axios.post('/billDataSave', JSON.parse(billData));
      handleOpenSnackbar({
        message: '操作成功',
      });
      setBillData('');
      fetchBillList();
    }
    catch(err) {
      console.error('BillHandleBillDataButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      });
    }
  }

  const handleOpenSnackbar = ({ message }) => {
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

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        data={billList}
        title="货款明细"
        options={{
          filtering: true,
          searchFieldAlignment: 'left',
        }}
        columns={[
          {
            title: "入账时间",
            field: "createdAt",
            render: rowData => {
              return (
                <div>
                  {GetTimeString(rowData.createdAt)}
                </div>
              );
            }
          },
          {
            title: "商户订单号",
            field: "orderSn",
          },
          {
            title: "账务类型",
            field: "classId",
            lookup: {
              1: "交易收入",
              2: "优惠券结算",
              3: "退款",
              5: "技术服务费",
              7: "扣款",
              8: "其他",
              9: "多多进宝",
              10: "转账",
              11: "其他软件服务",
            },
          },
          {
            title: "收支金额（元）",
            field: "amount",
            render: rowData => {
              return (
                <div
                  style={{
                    color: rowData.amount > 0 ? '#3498db' : '#d63031',
                  }}>
                  {`${rowData.amount > 0 ? '+' : ''}${rowData.amount / 100}`}
                </div>
              );
            }
          },
          {
            title: "备注",
            field: "note",
          },
        ]}
      />
      <TextField
        label="输入对账中心-货款明细数据(/queryUserDefinedBill)"
        multiline
        fullWidth
        value={billData}
        onChange={(e) => {
          setBillData(e.target.value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleBillDataButtonClick}>
        确定
      </Button>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={2000}
        open={snackbarState.open}
        message={snackbarState.message}
        onClose={handleCloseSnackbar}
      />
    </div>
  );

}

export default Bill;
