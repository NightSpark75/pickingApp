import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { 
  addRealmData, 
  updateRealmData,
  deleteAllRealmData, 
  deleteOneRealmData,
  fetchAllRealmData, 
  fetchRealmData,
} from '../../realm'

export function setCurrentPicking(picking, items) {
  let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
  realm.write(() => {
    let deletePicking = realm.objects(pickingRealm.name)
    realm.delete(deletePicking)
    realm.create(pickingRealm.name, picking)

    let deleteItems = realm.objects(itemsRealm.name)
    realm.delete(deleteItems)
    items.map((row) => {
      realm.create(itemsRealm.name, row)
    })
  })
  realm.close()
}

export function getAllItems() {
  let realm = new Realm({ schema: [itemsRealm] })
  let data = realm.objects(itemsRealm.name)
  let items = []
  data.map((item) => items.push(item))
  realm.close()
  return items
}

export function picked(pickValue) {
  let realm = new Realm({ schema: [itemsRealm] })
  realm.write(() => {
    let obj = realm.objects(itemsRealm.name)
    let data = obj.filtered('psrmk == "' + pickValue[0] + '" AND pslitm == "' + pickValue[1] + '" AND pslotn == "' + pickValue[2] + '"')
    data[0].picked = 1
  })
  realm.close()
}

export function checkFinished(items, styles) {
  let realm = new Realm({ schema: [itemsRealm] })
  let obj = realm.objects(itemsRealm.name)
  let data = obj.filtered('picked == 0')
  if (data.length > 0) {
    let obj = new Object()
    let pickValue = []
    pickValue.push(data[0].psrmk)
    pickValue.push(data[0].pslitm)
    pickValue.push(data[0].pslotn)
    obj.pslocn = data[0].pslocn
    obj.pickValue = pickValue
    obj.pssoqs = data[0].pssoqs
    obj.psuom = data[0].psuom
    obj.scan = 0
    obj.scanStyle_0 = styles.scanInfo
    obj.scanStyle_1 = styles.scanInfo
    obj.scanStyle_2 = styles.scanInfo
    obj.s_pssoqs = ''
    obj.passing = false
    realm.close()
    return obj
  }
  realm.close()
  return null
}

export function getPickingInfo() {
  let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
  let data = realm.objects(pickingRealm.name)
  let obj = new Object()
  obj.sticu = data[0].sticu
  obj.ststop = data[0].ststop
  obj.staddj = data[0].staddj
  realm.close()
  return obj
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
