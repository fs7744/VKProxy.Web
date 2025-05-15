import { http } from './http';

class StorageService {
  getListen(prefix: string) {
    return http(`/api/listen?prefix=${prefix}`)
  }
}

export const storageService = new StorageService();
