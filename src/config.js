/*
 * Maintained by jemo from 2020.5.8
 * Created by jemo on 2020.5.8 10:00:21
 * config
 */

const productionENV = process.env.NODE_ENV === 'production';
const productionURL = '';
const developmentURL = 'http://localhost:7000';

export const apiUrl = productionENV ? productionURL : developmentURL;
