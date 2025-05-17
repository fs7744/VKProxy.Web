import { isString, isArray, isNumber, filter, isBoolean } from 'lodash';

export class SniData {
  Key: string
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key: null
  }
}
