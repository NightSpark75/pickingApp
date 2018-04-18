const app_name = 'pickingApp'
const app_number = '201'
const major = '000'
const minor = '01'
const build = '07'
const protocol = 'http'
const host = '172.17.100.51'
const url = protocol + '://' + host
const dt = new Date()
const date = dt.getFullYear() + (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1) + (dt.getDate() < 10 ? '0' : '') + dt.getDate()

export default {
  date: date,
  name: app_name,
  app_number: app_number,
  version: parseInt(major) + '.' + parseInt(minor) + '.' + parseInt(build),
  version_number: parseInt(app_number + major + minor + build),
  url_version: 'http://172.17.100.51/api/native/pad/bundle/version/' + app_number,
  url_download: 'http://172.17.100.51/api/native/pad/bundle/download/' + app_number,

  route: {
    login: url + '/api/jwt/login',
    refresh: url + '/api/jwt/refresh',
    pickingList: url + '/api/productWarehouse/picking/list',
    pickingItems: url + '/api/productWarehouse/picking/items/',
    pickingStart: url + '/api/productWarehouse/picking/start',
    pickingEnd: url + '/api/productWarehouse/picking/end',
  },
}