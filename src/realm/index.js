import Realm from 'realm'

export const initReal = (schema) => {
  let realm = new Realm({schema: [schema]})
}

export const addRealmData = (schema, list) => {
  try {
    let realm = new Realm({schema: [schema]})
    realm.write(()=> {
      list.map((item) => {
        realm.create(schema.name, item)
      })
    })
    return true
  } catch (e) {
    return false
  }
}

export const updateRealmData = (schema, list) => {
  try {
    let realm = new Realm({schema: [schema]})
    realm.write(()=> {
      list.map((item) => {
        alert(JSON.stringify(item))
        realm.create(schema.name, item, true)
      })
    })
    return true
  } catch (e) {
    return false
  }
}

export const deleteAllRealmData = (schema) => {
  try {
    let realm = new Realm({schema: [schema]});
    realm.write(()=> {
      let deleteSchema = realm.objects(schema.name)
      realm.delete(deleteSchema); 
    })
    return true
  } catch (e) {
    return false
  }
}

export const deleteOneRealmData = (schema, filtered) => {
  try {
    let realm = new Realm({schema: [schema]})
    realm.write(()=> {
      let data = realm.objects(schema.name).filtered(filtered)
      realm.delete(data)
    })
    return true
  } catch (e) {
    return false
  }
}

export const fetchAllRealmData = (schema) => {
  let realm = new Realm({schema: [schema]})
  let data = realm.objects(schema.name)
  let arr = []
  data.map((item) => {
    arr.push(item)
  })
  return arr
}

export const fetchRealmData = (schema, filtered) => {
  let realm = new Realm({schema: [schema]})
  let data = realm.objects(schema.name).filtered(filtered)
  let obj = new Object
  Object.keys(data).forEach((key) => {
    obj[key] = data[key]
  })
  return obj
}