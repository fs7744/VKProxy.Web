/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalLoading } from './global-loading';
import { ElMessage } from 'element-plus'

export const http = async (url: string, op: any = null) => {
  try {
    if (op?.noLoading !== true) {
        globalLoading.show(0);
    }
    const response = await fetch(url);
    const  r = await response.json();
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
