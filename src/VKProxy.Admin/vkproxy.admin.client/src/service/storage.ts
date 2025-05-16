import { http } from './http';

class StorageService {
  getListen(prefix: string) {
    return http(`/api/listen?prefix=${prefix}`)
  }

  removeListen(key: string) {
    return http(`/api/listen?key=${key}`, { method: 'DELETE'})
  }

  updateListen(config: any) {
    return http(`/api/listen`, { method: 'POST', body: JSON.stringify(config), headers: {
    "Content-Type": "application/json",
  }})
  }
}

export const storageService = new StorageService();
