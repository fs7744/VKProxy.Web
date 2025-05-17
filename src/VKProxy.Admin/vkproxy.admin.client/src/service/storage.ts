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

  getCluster(prefix: string) {
    return http(`/api/cluster?prefix=${prefix}`, {})
  }

  async existsCluster(key: string) {
    const r = await http(`/api/cluster/exists?key=${key}`, {})
    return isBoolean(r) ? r : false
  }

  removeCluster(key: string) {
    return http(`/api/cluster?key=${key}`, { method: 'DELETE' })
  }

  updateCluster(config: any) {
    return http(`/api/cluster`, {
      method: 'POST', body: JSON.stringify(config), headers: {
        "Content-Type": "application/json",
      }
    })
  }

  getRoute(prefix: string) {
    return http(`/api/route?prefix=${prefix}`, {})
  }

  async existsRoute(key: string) {
    const r = await http(`/api/route/exists?key=${key}`, {})
    return isBoolean(r) ? r : false
  }

  removeRoute(key: string) {
    return http(`/api/route?key=${key}`, { method: 'DELETE' })
  }

  updateRoute(config: any) {
    return http(`/api/route`, {
      method: 'POST', body: JSON.stringify(config), headers: {
        "Content-Type": "application/json",
      }
    })
  }

  getSni(prefix: string) {
    return http(`/api/sni?prefix=${prefix}`, {})
  }

  async existsSni(key: string) {
    const r = await http(`/api/sni/exists?key=${key}`, {})
    return isBoolean(r) ? r : false
  }

  removeSni(key: string) {
    return http(`/api/sni?key=${key}`, { method: 'DELETE' })
  }

  updateSni(config: any) {
    return http(`/api/sni`, {
      method: 'POST', body: JSON.stringify(config), headers: {
        "Content-Type": "application/json",
      }
    })
  }
}

export const storageService = new StorageService();
