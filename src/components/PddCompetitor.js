/*
 * Maintained by jemo from 2021.1.19 to now
 * Created by jemo on 2021.1.19 14:39:33
 * 拼多多竞争对手
 */

import React, { useState, useEffect } from 'react';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';

function PddCompetitor() {

  const [ pddCompetitorList, setPddCompetitorList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });

  const { message, open, autoHideDuration } = snackbarState;

  useEffect(() => {
    fetchPddCompetitorList();
  }, []);

  const fetchPddCompetitorList = async () => {
    try {
      const response = await axios.get('/pddCompetitorList');
      const data = response.data || [];
      setPddCompetitorList(data);
    }
    catch(err) {
      console.error('pdd-competitor-fetch-pdd-competitor-list-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data || err.message}`,
      })
    }
  };

  const handleOpenSnackbar = ({message}) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 2000,
    });
  }

  const handleOpenErrorSnackbar = ({ message }) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: null,
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
        title="竞争对手"
        data={pddCompetitorList}
        icons={tableIcons}
        options={{
          actionsColumnIndex: -1,
          filtering: false,
        }}
        localization={{
          header: {
            actions: '操作',
          },
        }}
        columns={[
          {
            title: 'id',
            field: 'id',
            editable: 'never',
          },
          {
            title: '名称',
            field: 'name',
          },
          {
            title: '优点',
            field: 'advantage',
          },
          {
            title: '缺点',
            field: 'disadvantage',
          },
        ]}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/pddCompetitorSave', newData);
              handleOpenSnackbar({
                message: '操作成功',
              });
              fetchPddCompetitorList();
            }
            catch(err) {
              console.error('pdd-competitor-add-error: ', err);
              handleOpenErrorSnackbar({
                message: `出错了：${err.response && err.response.data}`,
              })
            }
            resolve();
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/pddCompetitorSave', newData);
                handleOpenSnackbar({
                  message: '操作成功',
                });
                fetchPddCompetitorList();
              }
              catch(err) {
                console.error('pdd-competitor-update-error: ', err);
                handleOpenErrorSnackbar({
                  message: `出错了：${err.response && err.response.data}`,
                });
              }
              resolve();
            });
          }
        }}
      />
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        autoHideDuration={autoHideDuration}
        open={open}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
}

export default PddCompetitor;
