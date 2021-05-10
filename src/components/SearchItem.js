/*
 * Maintained by jemo from 2020.5.9 to now
 * Created by jemo on 2020.5.9 16:10
 * Search Item
 * 商品
 */

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function SearchItem() {

  const [searchTitle, setSearchTitle] = useState('');
  const [state, setState] = useState({
    open: false,
    message: '',
  });
  const {
    open,
    message,
  } = state;
  const [itemList, setItemList] = useState([]);
  const [ womenItemListUrl, setWomenItemListUrl ] = useState('');

  const fetchItemList = async () => {
    try {
      const { data } = await axios.get('/searchTitleList');
      for(let i = 0; i < data.length; i++) {
        data[i].sellPrice = (data[i].price + 5.5 + 6) * 2;
      }
      setItemList(data);
    }
    catch(err) {
      console.error('SearchItemGetItemListError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      })
    }
  }

  useEffect(() => {
    fetchItemList();
  }, []);

  async function handleSearchTitleButtonClick() {
    if(!searchTitle) {
      handleOpenSnackbar({
        message: '请输入商品标题',
      })
      return
    }
    try {
      const { data } = await axios.post('/searchTitle', {
        searchTitle,
      });
      if(data === 'ok') {
        handleOpenSnackbar({
          message: '操作成功',
        })
        setSearchTitle('');
        fetchItemList();
      } else {
        handleOpenSnackbar({
          message: `出错了：${data}`,
        })
      }
    }
    catch(err) {
      console.error('SearchItemHandleSearchTitleButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      })
    }
  }

  async function handleWomenItemListUrlButtonClick() {
    if(!womenItemListUrl) {
      handleOpenSnackbar({
        message: '请输入女装网商品列表地址',
      })
      return
    }
    try {
      const { data } = await axios.post('/womenItemListUrl', {
        womenItemListUrl,
      });
      if(data === 'ok') {
        handleOpenSnackbar({
          message: '操作成功',
        })
        setWomenItemListUrl('');
        fetchItemList();
      } else {
        handleOpenSnackbar({
          message: `出错了：${data}`,
        })
      }
    }
    catch(err) {
      console.error('SearchItemHandleWomenItemListUrlButtonClickError: ', err);
      handleOpenSnackbar({
        message: `出错了：${err.message}`,
      })
    }
  }

  const handleCloseSnackbar = () => {
    setState({
      ...state,
      open: false,
    });
  }

  const handleOpenSnackbar = (state) => {
    setState({
      ...state,
      open: true,
    });
  }

  const [ columns ] = useState([
    {
      title: "searchId",
      field: "searchId",
      type: "numeric",
      editable: "never",
      render: rowData => {
        const {
          searchId,
        } = rowData;
        return (
          <div>
            <RouterLink to={`/product/select/${searchId}`}>
              {searchId}
            </RouterLink>
            <CopyToClipboard
              text={searchId}
              onCopy={() =>
                handleOpenSnackbar({
                  message: '已复制',
                })
              }>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {searchId}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: "主图",
      field: "imgUrl",
      render: rowData => {
        const {
          imgUrl,
        } = rowData;
        return (
          <div>
            <img
              src={imgUrl}
              width='100'
              height='100'
              alt=''
            />
          </div>
        );
      },
    },
    {
      title: "标题",
      field: "name",
      render: rowData => {
        const {
          detailUrl,
          name,
        } = rowData;
        return (
          <div>
            <Link
              href={detailUrl}
              target='_blank'>
              {name}
            </Link>
          </div>
        );
      },
    },
    {
      title: "关键词",
      field: "keyName",
    },
    {
      title: "价格",
      field: "price",
      render: rowData => {
        const {
          price,
        } = rowData;
        return (
          <div>
            {price}
          </div>
        );
      },
    },
    {
      title: "毛利率28.7%零售价格",
      field: "price10",
      render: rowData => {
        const {
          price,
        } = rowData;
        const sellPrice = Math.round((price + 5.5 + 6) / (1 - 0.287 - 0.006));
        const bidPrice = Math.round(sellPrice * 0.187 / 2);
        return (
          <div>
            <CopyToClipboard
              text={sellPrice}
              onCopy={() =>
                handleOpenSnackbar({
                  message: '已复制',
                })
              }>
              <Button
                variant='outlined'
                size='small'>
                {sellPrice}
              </Button>
            </CopyToClipboard>
            <CopyToClipboard
              text={bidPrice}
              onCopy={() =>
                handleOpenSnackbar({
                  message: '已复制',
                })
              }>
              <Button
                variant='outlined'
                size='small'>
                出价：{bidPrice}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    /*
    {
      title: "毛利率50%零售价格",
      field: "sellPrice",
      render: rowData => {
        const {
          sellPrice,
        } = rowData;
        return (
          <div>
            <div>
            {sellPrice}
            </div>
          </div>
        );
      },
    },
    */
    /*
    {
      title: "抖音设置利润",
      render: rowData => {
        const {
          price,
          sellPrice,
        } = rowData;
        return (
          <div>
            <div>
              设置利润：{sellPrice - price}
            </div>
            <div>
              佣金：{sellPrice * 0.4}
            </div>
            <div>
              利润：{sellPrice * 0.1}
            </div>
            <div>
              佣金比例：40%
            </div>
          </div>
        );
      },
    },
    */
    {
      title: "女装网id",
      field: "womenProductId",
      type: "numeric",
    },
    {
      title: "拼多多标题",
      field: "goodsName",
    },
    {
      title: "获取数据",
      field: "getData",
      render: rowData => {
        const {
          detailUrl,
          id,
        } = rowData;
        return (
          <div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              style={{
                marginTop: 10,
              }}
              onClick={async () => {
                try {
                  const { data } = await axios.post('/getWomenDetailData', {
                    id,
                    detailUrl,
                  });
                  if(data === 'ok') {
                    handleOpenSnackbar({
                      message: '操作成功',
                    })
                  } else {
                    console.error('SearchItemGetDataErrorData: ', data);
                    handleOpenSnackbar({
                      message: `出错了：${data}`,
                    })
                  }
                }
                catch(err) {
                  console.error('SearchItemGetDataCatchError: ', err);
                  handleOpenSnackbar({
                    message: `出错了：${err.message}`,
                  })
                }
              }}>
              获取数据
            </Button>
          </div>
        );
      },
    },
  ]);

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        options={{
          filtering: true,
          actionsColumnIndex: -1,
        }}
        columns={columns}
        data={itemList}
        title="商品列表"
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/updateSearchTitle', newData);
                if(data === 'ok') {
                  itemList[itemList.indexOf(oldData)] = newData;
                  handleOpenSnackbar({
                    message: '操作成功',
                  })
                } else {
                  handleOpenSnackbar({
                    message: `出错了：${data}`,
                  })
                }
              }
              catch(err) {
                console.error('SearchItemUpdateSearchTitleError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
              resolve();
            }),
          onRowDelete: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/deleteSearchTitle', newData);
                if(data === 'ok') {
                  itemList.splice(itemList.indexOf(newData), 1)
                  setItemList(itemList);
                  handleOpenSnackbar({
                    message: '操作成功',
                  })
                } else {
                  handleOpenSnackbar({
                    message: `出错了：${data}`,
                  })
                }
              }
              catch(err) {
                console.error('DeleteItemUpdateSearchTitleError: ', err);
                handleOpenSnackbar({
                  message: `出错了：${err.message}`,
                })
              }
              resolve();
            })
        }}
      />
      <TextField
        label="输入女装网商品列表地址"
        fullWidth
        value={womenItemListUrl}
        onChange={(event) => {
          setWomenItemListUrl(event.target.value)
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        style={{
          marginTop: 10,
        }}
        onClick={handleWomenItemListUrlButtonClick}
      >
        确定
      </Button>
      <TextField
        label="输入商品标题"
        fullWidth
        value={searchTitle}
        onChange={(event) => {
          setSearchTitle(event.target.value)
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{
          marginTop: 10,
        }}
        onClick={handleSearchTitleButtonClick}
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

export default SearchItem;
