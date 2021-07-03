/*
 * Maintained by jemo from 2021.1.19 to now
 * Created by jemo on 2021.1.19 15:52:00
 * 拼多多竞争对手商品
 */

import React, { useState, useEffect } from 'react';
import tableIcons from '../utils/TableIcons';
import MaterialTable from 'material-table';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import { useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

function PddCompetitorItem() {

  const [ pddCompetitorItemList, setPddCompetitorItemList ] = useState([]);
  const [ competitorList, setCompetitorList ] = useState([]);
  const [ snackbarState, setSnackbarState ] = useState({
    message: '',
    open: false,
    autoHideDuration: null,
  });
  const [ selectedRow, setSelectedRow ] = useState();

  const { message, open, autoHideDuration } = snackbarState;

  useEffect(() => {
    fetchPddCompetitorItemList();
    fetchCompetitorList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { itemId } = useParams();

  const fetchPddCompetitorItemList = async () => {
    try {
      const response = await axios.get('/pddCompetitorItemList', {
        params: {
          itemId,
        },
      });
      const data = response.data || [];
      setPddCompetitorItemList(data);
    }
    catch(err) {
      console.error('pdd-competitor-item-fetch-pdd-competitor-item-list-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
      })
    }
  };

  const fetchCompetitorList = async () => {
    try {
      const response = await axios.get('/pddCompetitorList');
      const data = response.data || [];
      const competitorLookup = {};
      for(let i = 0; i < data.length; i++) {
        competitorLookup[data[i].id] = data[i].name;
      }
      setCompetitorList(competitorLookup);
    }
    catch(err) {
      console.error('pdd-competitor-item-fetch-competitor-list-error: ', err);
      handleOpenErrorSnackbar({
        message: `出错了：${err.response && err.response.data}`,
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
        title="竞争对手商品"
        data={pddCompetitorItemList}
        icons={tableIcons}
        options={{
          actionsColumnIndex: -1,
          filtering: false,
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
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
            title: '价格',
            field: 'price',
          },
          {
            title: '商品id',
            field: 'goodsId',
            render: rowData => {
              const {
                goodsId,
                sale = [],
              } = rowData;
              return (
                <div>
                  <Link
                    href={`https://mobile.yangkeduo.com/goods2.html?goods_id=${goodsId}`}
                    target="_blank">
                    {goodsId}
                  </Link>
                  <div>
                    <RouterLink to={`/pddCompetitorItemSale/${goodsId}`}>
                      销量: {sale.length > 0 && sale[sale.length - 1]}
                    </RouterLink>
                  </div>
                </div>
              );
            },
          },
          {
            title: '竞争对手id',
            field: 'competitorId',
            lookup: competitorList,
          },
          {
            title: '关联商品id',
            field: 'relatedItemId',
            initialEditValue: itemId,
            editable: 'never',
          },
        ]}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        editable={{
          onRowAdd: newData => new Promise(async (resolve, reject) => {
            try {
              await axios.post('/pddCompetitorItemSave', newData);
              handleOpenSnackbar({
                message: '操作成功',
              });
              fetchPddCompetitorItemList();
            }
            catch(err) {
              console.error('pdd-competitor-item-add-error: ', err);
              handleOpenErrorSnackbar({
                message: `出错了：${err.response && err.response.data}`,
              })
            }
            resolve();
          }),
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/pddCompetitorItemSave', newData);
                handleOpenSnackbar({
                  message: '操作成功',
                });
                fetchPddCompetitorItemList();
              }
              catch(err) {
                console.error('pdd-competitor-item-update-error: ', err);
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

export default PddCompetitorItem;
