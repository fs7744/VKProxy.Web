import { isString, isArray, isNumber, filter, isBoolean } from 'lodash';

export class RouteData {
  Key: string
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key: null
  }
}
