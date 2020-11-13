/*
 * Maintained by jemo from 2020.6.26 to now
 * Created by jemo on 2020.6.26 09:36:38
 * Dash Board
 * 看板
 */

import React from 'react';
import ItemCountChart from './ItemCountChart';
import AdDataChart from './AdDataChart';
import OrderStatistics from './order/OrderStatistics';
//import SaveAdUnitData from './SaveAdUnitData';
import SaveHarFile from './SaveHarFile';

function DashBoard() {

  return (
    <div>
      <OrderStatistics />
      <SaveHarFile />
      {/*
      <SaveAdUnitData />
      */}
      <AdDataChart />
      <ItemCountChart />
    </div>
  );
}

export default DashBoard;
