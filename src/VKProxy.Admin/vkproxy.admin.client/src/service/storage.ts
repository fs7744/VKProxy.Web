import { http } from './http'
import { isBoolean } from 'lodash'

class StorageService {
  getListen(prefix: string) {
    return http(`/api/listen?prefix=${prefix}`, {})
  }

  async existsListen(key: string) {
    const r = await http(`/api/listen/exists?key=${key}`, {})
    return isBoolean(r) ? r : false
  }

  removeListen(key: string) {
    return http(`/api/listen?key=${key}`, { method: 'DELETE' })
  }

  updateListen(config: any) {
    return http(`/api/listen`, {
      method: 'POST', body: JSON.stringify(config), headers: {
        "Content-Type": "application/json",
      }
    })
  }
}

export const storageService = new StorageService();
