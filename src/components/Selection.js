/*
 * Maintained by jemo from 2020.5.8 to now
 * Created by jemo on 2020.5.8 8:54
 * Selection
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import { useParams } from 'react-router-dom';
import tableIcons from './utils/TableIcons';
import MaterialTable from 'material-table';
import Link from '@material-ui/core/Link';

function Selection() {

  const [searchTitle, setSearchTitle] = useState('');
  const [searchData, setSearchData] = useState('');
  const [itemList, setItemList] = useState([]);
  const [messageState, setMessageState] = useState({
    open: false,
    message: '',
  });
  const [selectedRow, setSelectedRow] = useState();
  const {
    open,
    message,
  } = messageState;
  const { id } = useParams();

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const { data } = await axios.get('/searchTitleById', {
          params: {
            id: id,
          },
        });
        const { name } = data;
        setSearchTitle(name);
      }
      catch(err) {
        console.error('selection-use-effect-fetch-title-error: ', err);
        handleOpenSnackbar({
          message: `出错了：${err.message}`,
        });
      }
    }
    const fetchItemList = async () => {
      const { data } = await axios.get('/itemListBySearchId', {
        params: {
          searchId: id,
        },
      });
      setItemList(data);
    }
    fetchItemList();
    fetchTitle();
  }, [id]);

  const fetchItemList = async () => {
    const { data } = await axios.get('/itemListBySearchId', {
      params: {
        searchId: id,
      },
    });
    setItemList(data);
  }

  const handleCloseSnackbar = () => {
    setMessageState({
      ...messageState,
      open: false,
    });
  }

  const handleOpenSnackbar = (messageState) => {
    setMessageState({
      ...messageState,
      open: true,
    });
  }

  async function handleSearchDataButtonClick() {
    if(!searchData) {
      return handleOpenSnackbar({
        message: '请输入数据',
      })
    }
    try {
      await axios.post('/searchData', {
        searchData,
        id,
      });
      handleOpenSnackbar({
        message: '操作成功',
      })
      setSearchData('');
      fetchItemList();
    }
    catch(err) {
      console.error('SelectionHandleSearchDataButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      })
    }
  }

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        title={
          <div>
            { searchTitle }
          </div>
        }
        columns={[
          {
            title: "商品信息",
            render: rowData => (
              <Link
                href={rowData.detailUrl}
                target="_blank">
                <div style={{
                  width: 100,
                }}>
                  <img alt="" src={rowData.imgUrlOf100x100 || rowData.imgUrl} style={{width: 100}}/>
                  <div style={{
                    fontSize: 12,
                    lineHeight: '20px',
                    height: 40,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                  }}>
                    {rowData.name}
                  </div>
                </div>
              </Link>
            ),
            editable: "never",
          },
          {
            title: "供应商",
            render: rowData => {
              const {
                supplierCity,
                supplierCreditLevel,
                supplierName,
                supplierProvince,
                supplierShopRepurchaseRate,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  color: '#888888',
                }}>
                  <div>
                    {supplierName}
                  </div>
                  <div>
                    {`${supplierProvince} ${supplierCity}`}
                  </div>
                  <div>
                    信用等级：{supplierCreditLevel}
                  </div>
                  <div>
                    复购率：{`${Math.round(supplierShopRepurchaseRate * 100 *100) / 100}%`}
                  </div>
                </div>
              );
            },
          },
          {
            title: "销售额",
            field: "gmv30dRt",
            render: rowData => {
              const {
                gmv30dRt,
                quantitySumMonth,
                saleQuantity,
              } = rowData;
              return (
                <div style={{
                  fontSize: 12,
                  color: '#888888',
                }}>
                  <div>
                    月成交额：{gmv30dRt}元
                  </div>
                  <div>
                    月成交量： {quantitySumMonth}单
                  </div>
                  <div>
                    总成交量：{saleQuantity}单
                  </div>
                </div>
              );
            },
          },
          {
            title: "最低价格",
            field: "price",
            editable: "never",
          },
          {
            title: "套装价格",
            field: "suitPrice",
            type: "numeric",
          },
          {
            title: "运费",
            field: "shippingPrice",
            type: "numeric",
          },
          {
            title: "套装和运费",
            field: "suitShippingPrice",
            type: "numeric",
            editable: "never",
          },
          {
            title: "是否销售",
            field: "forSell",
            type: "boolean",
            defaultSort: "desc",
          },
        ]}
        data={itemList}
        options={{
          actionsColumnIndex: 11,
          rowStyle: rowData => ({
            backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#fff',
          }),
        }}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
        editable={{
          onRowUpdate: (newData, oldData) => {
            return new Promise(async (resolve, reject) => {
              try {
                await axios.post('/updateItemSuitShippingPrice', newData);
                fetchItemList();
              }
              catch(err) {
                console.error('SelectionUpdateError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
              resolve();
            });
          }
        }}
      />
      <TextField
        label="输入1688搜索商品数据(index.html)"
        multiline
        fullWidth
        value={searchData}
        onChange={(event) => {
          setSearchData(event.target.value)
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleSearchDataButtonClick}
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

export default Selection;
