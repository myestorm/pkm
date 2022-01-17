import { localStorageToken } from '../../config'

export default {
  action: '/api/file/upload',
  headers: {
    Authorization: `Bearer ${localStorage.getItem(localStorageToken) || ''}`
  }
}
