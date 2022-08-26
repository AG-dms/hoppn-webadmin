import axios from 'axios';
import { instance } from './interceptors';

const mapKey;

export function apiGetCoordinate(coordinate) {
  const params = {
    latlng: coordinate,
    key: mapKey,
  };

  const query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  return fetch('https://maps.googleapis.com/maps/api/geocode/json?' + query, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json',
    //   // 'Access-Control-Allow-Origin': '*',
    //   // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
    //   // 'Access-Control-Allow-Headers': '*',
    //   // 'Access-Control-Allow-Credentials': 'true',

    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
  });

  // axios({});
  // return await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
  //   headers: {
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
  // 'Access-Control-Allow-Headers': '*',
  // 'Access-Control-Allow-Credentials': 'true',
  //     // Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     // 'cache-control': 'no-cache, must-revalidate',
  //   },
  //   params: {
  //     latlng: coordinate,
  //     key: mapKey,
  //   },
  //   // withCredentials: true,
  // });
}
