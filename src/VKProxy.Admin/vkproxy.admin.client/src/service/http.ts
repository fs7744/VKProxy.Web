/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalLoading } from './global-loading';
import { ElMessage } from 'element-plus'

export const http = async (url: string, op: any) => {
  try {
    if (op?.noLoading !== true) {
        globalLoading.show(0);
    }
    const response = await fetch(url, op);
    const  r = await response.text();
    if(r) {
      return JSON.parse(r)
    }
    return r;
  } catch(error) {
     ElMessage({
        showClose: true,
        type: 'error',
        message: error as any,
        duration: 10000
    });
  } finally {
    globalLoading.hide();
  }
}
