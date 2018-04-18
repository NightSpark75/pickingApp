import axios from 'axios'
import config from '../config'

export function login(id, password, success, error) {
  let formData = new FormData()
  formData.append('id', id)
  formData.append('password', password)
  formData.append('prg', config.programID)
  axios.post(config.route.login, formData)
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function refreshToken(token, success, error) {
  let form_data = new FormData()
  form_data.append('token', token)
  axios.post(config.route.refresh, form_data)
  .then((res) => {
    success(res.data.token)
  }).catch((err) => {
    error(err)
  })
}