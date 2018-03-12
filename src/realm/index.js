import Realm from 'realm'

export const initReal = (schema) => {
  let realm = new Realm({schema: [schema]})
}

export const addRealmData = (schema, list) => {
  try {
    let realm = new Realm({schema: [schema]})
    realm.write(()=> {
        list.map((item, index) => {
          realm.create(schema.name, item)
        })
    })
    return true
  } catch (e) {
    return e
  }
}

export const updateRealmData = (schema, list) => {
  try {
    let realm = new Realm({schema: [schema]})
    realm.write(()=> {
      list.map((item, index) => {
        realm.create(schema.name, item)
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
  return data
}

export const fetchRealmData = (schema, filtered) => {
  let realm = new Realm({schema: [schema]})
  let data = realm.objects(schema.name).filtered(filtered)
  return data
}