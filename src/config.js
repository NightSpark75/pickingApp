const app_name = 'pickingApp'
const app_number = '201'
const major = '000'
const minor = '03'
const build = '05'
const protocol = 'http'
const host = 'ppm.standard.com.tw'
const url = protocol + '://' + host
const dt = new Date()
const date = dt.getFullYear() + (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1) + (dt.getDate() < 10 ? '0' : '') + dt.getDate()
const programID = 'MPMF0010'

export default {
  date: date,
  name: app_name,
  app_number: app_number,
  version: parseInt(major) + '.' + parseInt(minor) + '.' + parseInt(build),
  version_number: parseInt(app_number + major + minor + build),
  url_version: 'http://ppm.standard.com.tw/api/native/pad/bundle/version/' + app_number,
  url_download: 'http://ppm.standard.com.tw/native/pad/bundle/download/' + app_number,
  programID: programID,

  route: {
    login: url + '/api/jwt/login',
    refresh: url + '/api/jwt/refresh',
    pickingList: url + '/api/productWarehouse/picking/list',
    pickingItem: url + '/api/productWarehouse/picking/item/',
    pickingItems: url + '/api/productWarehouse/picking/items/',
    pickingStart: url + '/api/productWarehouse/picking/start',
    pickingEnd: url + '/api/productWarehouse/picking/end',
    pickingPause: url + '/api/productWarehouse/picking/pause',
    pickup: url + '/api/productWarehouse/picking/pickup',
  },
}