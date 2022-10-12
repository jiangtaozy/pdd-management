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
import MaterialTable from 'material-table';
import tableIcons from './utils/TableIcons';
import Link from '@material-ui/core/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
//import Backdrop from '@material-ui/core/Backdrop';
//import CircularProgress from '@material-ui/core/CircularProgress';

function SearchItem() {

  const [ keyword, setKeyword ] = useState('');
  const [ itemList, setItemList ] = useState([]);
  const [ itemSkuList, setItemSkuList ] = useState([]);
  //const [ pddItemSkuList, setPddItemSkuList ] = useState([]);
  //const [ showLoading, setShowLoading ] = useState(false);

  const fetchItemList = async (keyword) => {
    //setShowLoading(true);
    try {
      let { data } = await axios.get('/searchTitleList', {
        params: {
          keyword,
        },
      });
      setItemList(data || []);
      //setShowLoading(false);
    }
    catch(err) {
      console.error('SearchItemGetItemListError: ', err);
      //setShowLoading(false);
    }
  }

  const fetchItemSkuList = async () => {
    if(itemList.length === 0) {
      return
    }
    const { searchId } = itemList[0];
    try {
      const { data: itemSkuList } = await axios.get('/itemSkuListBySearchId', {
        params: {
          searchId,
        },
      });
      for(let i = 0; i < itemSkuList.length; i++) {
        itemSkuList[i].sellPrice =  Math.round((itemSkuList[i].price / 100 + 3.3 + 0.35) / 0.7 * 100) / 100;
        //itemSkuList[i].discount =  Math.round((itemSkuList[i].price * 2 / 100 + 3.3 + 0.35 + 0.5) / 0.7 / itemSkuList[i].sellPrice / 2  * 100) / 10;
        itemSkuList[i].itemSkuNum = `${itemList[0].itemNum}-${itemSkuList[i].shortSkuNum}`;
        itemSkuList[i].index = i + 1;
      }
      setItemSkuList(itemSkuList || []);
      /*
      if(itemSkuList) {
        const pddItemSkuList = [];
        const skuLength = itemSkuList.length;
        for(let count = 4; count > 0; count--) {
          const countNum = Math.floor(skuLength / count);
          if(countNum >= 1) {
            for(let countNumIndex = 0; countNumIndex < countNum; countNumIndex++) {
              const itemSku = itemSkuList[countNumIndex * count];
              const pddItemSku = {
                skuName: itemSku.shortSkuName,
                skuNum: itemList[0].itemNum + '-' + itemSku.shortSkuNum,
                costPrice: itemSku.price,
              }
              for(let i = countNumIndex * count + 1; i < (countNumIndex + 1) * count; i++) {
                pddItemSku.skuName += '+' + itemSkuList[i].shortSkuName;
                pddItemSku.skuNum += '+' + itemSkuList[i].shortSkuNum;
                pddItemSku.costPrice += itemSkuList[i].price;
              }
              pddItemSku.price = Math.round((pddItemSku.costPrice / 100 + 3.3 + 0.35 + 0.5) / 0.7 * 100) / 100;
              pddItemSku.meanPrice = Math.round(pddItemSku.price / count * 100) / 100;
              pddItemSku.skuName += '【共' + count + '个】';
              pddItemSkuList.push(pddItemSku);
            }
            if(count > 1) {
              pddItemSkuList.push({
                skuName: '【任选' + count + '个】颜色备注',
                skuNum: itemList[0].itemNum + '-' + count,
                price: pddItemSkuList[pddItemSkuList.length - 1].price,
                meanPrice: pddItemSkuList[pddItemSkuList.length - 1].meanPrice,
              });
            }
          }
        }
        setPddItemSkuList(pddItemSkuList);
      }
      */
    }
    catch(err) {
      console.error('SearchItemFetchItemSkuListError: ', err);
    }
  }

  const fetchItemTypeList = async () => {
    try {
      const { data: itemTypeList } = await axios.get('/itemTypeList');
      if(itemTypeList) {
        setColumns([
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
                  <CopyToClipboard
                    text={searchId}
                    onCopy={() => {
                      console.log("已复制");
                    }}>
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
            editable: "never",
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
            editable: "never",
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
            title: "价格",
            field: "price",
            editable: "never",
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
            title: "商品类型",
            field: "itemTypeKey",
            lookup: itemTypeList.reduce(function(acc, cur, i) {
              const {
                id,
                typeName,
              } = cur;
              acc[id]= typeName;
              return acc;
            }, {}),
          },
          {
            title: "商品类型编码",
            field: "itemTypeKey",
            lookup: itemTypeList.reduce(function(acc, cur, i) {
              const {
                id,
                typeNum,
              } = cur;
              acc[id]= typeNum;
              return acc;
            }, {}),
          },
          {
            title: "商品编码",
            field: "itemNum",
          },
          {
            title: "拼多多标题",
            field: "goodsName",
            editable: "never",
          },
          {
            title: "拼多多ID",
            field: "pddId",
            editable: "never",
            render: rowData => {
              const {
                pddId,
              } = rowData;
              return (
                <div>
                  {pddId ?
                    <CopyToClipboard
                      text={pddId}
                      onCopy={() => {
                        console.log("已复制");
                      }}>
                      <Button
                        variant='outlined'
                        size='small'>
                        {pddId}
                      </Button>
                    </CopyToClipboard>
                    : null
                  }
                </div>
              );
            }
          },
        ]);
      }
    }
    catch(err) {
      console.error('SearchItemFetchItemTypeListError: ', err);
    }
  }

  const onRefresh = async () => {
    fetchItemList(keyword);
    fetchItemSkuList();
  }

  useEffect(() => {
    fetchItemList(keyword);
  }, [keyword]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchItemSkuList();
  }, [itemList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchItemTypeList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const [ columns, setColumns ] = useState([]);

  const [ itemSkuListColumns ] = useState([
    {
      title: "id",
      field: "id",
      editable: "never",
    },
    {
      title: "sku",
      field: "skuName",
      editable: "never",
      render: rowData => {
        const {
          skuName,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={skuName}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {skuName}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: "价格",
      field: "price",
      editable: "never",
    },
    {
      title: "售价",
      field: "sellPrice",
      editable: "never",
      render: rowData => {
        const {
          price,
        } = rowData;
        const sellPrice =  Math.round((price / 100 + 3 + 0.35) / 0.6 * 100) / 100;
        const twoSellPrice =  Math.round((price * 2 / 100 + 3 + 0.35) / 0.6 * 100) / 100;
        return (
          <div>
            <CopyToClipboard
              text={sellPrice}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {sellPrice}
              </Button>
            </CopyToClipboard>
            <CopyToClipboard
              text={twoSellPrice}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {twoSellPrice}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    /*
    {
      title: "两件折扣",
      field: "discount",
      editable: "never",
      render: rowData => {
        const {
          discount,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={discount}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {discount}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    */
    {
      title: "库存",
      field: "canBookCount",
      editable: "never",
    },
    {
      title: "简写",
      field: "shortSkuName",
      render: rowData => {
        const {
          shortSkuName,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={shortSkuName}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {shortSkuName}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: "index",
      field: "index",
      editable: "never",
    },
    {
      title: "商品编码",
      field: "itemSkuNum",
      editable: "never",
      render: rowData => {
        const {
          itemSkuNum,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={itemSkuNum}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {itemSkuNum}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: "编码",
      field: "shortSkuNum",
    },
  ]);

  /*
  const [ pddItemSkuListColumns ] = useState([
    {
      title: "sku名称",
      field: "skuName",
      render: rowData => {
        const {
          skuName,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={skuName}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {skuName}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
    {
      title: "sku编码",
      field: "skuNum",
      render: rowData => {
        const {
          skuNum,
        } = rowData;
        return (
          <div>
            <CopyToClipboard
              text={skuNum}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {skuNum}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
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
            <CopyToClipboard
              text={price}
              onCopy={() => {
                console.log("已复制");
              }}>
              <Button
                variant='outlined'
                size='small'
                style={{
                  marginLeft: 10,
                }}>
                {price}
              </Button>
            </CopyToClipboard>
          </div>
        );
      },
    },
  ]);
  */

  return (
    <div>
      <div
        style={{
          display: 'flex',
        }}>
        <TextField
          label="搜索商品"
          fullWidth
          type="search"
          value={keyword}
          style={{
            marginBottom: 10,
          }}
          onChange={(event) => {
            setKeyword(event.target.value.trim())
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Button
        variant='outlined'
        onClick={onRefresh}>
        刷新
      </Button>
      <MaterialTable
        icons={tableIcons}
        options={{
          filtering: true,
          actionsColumnIndex: -1,
          toolbar: false,
          paging: false,
        }}
        columns={columns}
        data={itemList}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/updateSearchTitle', newData);
                if(data === 'ok') {
                  fetchItemList(keyword);
                  console.log("操作成功");
                } else {
                  console.error("出错了: ", data);
                }
              }
              catch(err) {
                console.error('SearchItemUpdateSearchTitleError: ', err);
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
                  console.log("操作成功");
                } else {
                  console.error("出错了: ", data);
                }
              }
              catch(err) {
                console.error('DeleteItemUpdateSearchTitleError: ', err);
              }
              resolve();
            })
        }}
      />
      <MaterialTable
        icons={tableIcons}
        options={{
          search: false,
          filtering: false,
          actionsColumnIndex: -1,
          toolbar: false,
          pageSize: 50,
        }}
        columns={itemSkuListColumns}
        data={itemSkuList}
        style={{
          marginTop: 20,
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post('/itemSkuUpdate', newData);
                if(data === 'ok') {
                  //fetchItemSkuList();
                  console.log("操作成功");
                } else {
                  console.error("出错了: ", data);
                }
              }
              catch(err) {
                console.error('SearchItemItemSkuUpdateError: ', err);
              }
              resolve();
            }),
        }}
      />
      {/*
      <MaterialTable
        icons={tableIcons}
        options={{
          search: false,
          filtering: false,
          actionsColumnIndex: -1,
          toolbar: false,
          paging: false,
        }}
        columns={pddItemSkuListColumns}
        data={pddItemSkuList}
        style={{
          marginTop: 20,
        }}
      />
      */}
      {/*
      <Backdrop
        style={{
          zIndex: 11,
          color: '#fff',
        }}
        open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      */}
    </div>
  );
}

export default SearchItem;
