import axios from 'axios'
import config from '../config'
import { loadToken } from '../lib'

export function getPickingList(success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token;
  axios.get(config.route.pickingList + '/' + config.date, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function getPickingItems(ststop, success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token
  axios.get(config.route.pickingItems + ststop + '/' + config.date, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((error) => {
    error(err)
  })
}

export function pickingStart(stop, success, error) {
  let formData = new FormData()
  formData.append('stop', stop)
  formData.append('date', config.date)
  let token = loadToken()
  const Auth = 'Bearer ' + token;
  axios.post(config.route.pickingStart, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function removePicking() {
  let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
  realm.write(() => {
    let deletePicking = realm.objects(pickingRealm.name)
    realm.delete(deletePicking)
    let deleteItems = realm.objects(itemsRealm.name)
    realm.delete(deleteItems)
  })
  realm.close()
}

export function pickingEnd(stop, success, error) {
  let formData = new FormData()
  formData.append('stop', stop)
  formData.append('date', config.date)
  let token = loadToken()
  const Auth = 'Bearer ' + token;
  axios.post(config.route.pickingEnd, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}
