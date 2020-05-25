/*
 * Maintained by jemo from 2020.5.6 to now
 * Created by jemo on 2020.5.6 18:45:08
 * Authorize
 */

import React from 'react';
import Link from '@material-ui/core/Link';

function Authorize() {

  const pddOpenUrl = 'https://mms.pinduoduo.com/open.html';
  const responseType = 'code';
  const clientId = '';
  const redirectUri = '';
  const state = '1';

  const oauthUrl = `${pddOpenUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  console.log('oauthUrl: ', oauthUrl);

  return (
    <div>
      <Link href={oauthUrl}>
        Link
      </Link>
    </div>
  )
}

export default Authorize;
