/*
 * Maintained by jemo from 2020.6.26 to now
 * Created by jemo on 2020.6.26 09:36:38
 * Dash Board
 * 看板
 */

import React from 'react';
import ItemCountChart from './ItemCountChart';
import AdDataChart from './AdDataChart';

function DashBoard() {


  return (
    <div>
      <ItemCountChart />
      <AdDataChart />
    </div>
  );
}

export default DashBoard;
