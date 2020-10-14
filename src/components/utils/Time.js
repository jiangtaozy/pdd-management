/*
 * Maintained by jemo from 2020.10.14 to now
 * Created by jemo on 2020.10.14 16:09:17
 * Time utils
 */

function GetTimeString(timeStr) {
  const time = new Date(timeStr);
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
}

export default GetTimeString;
