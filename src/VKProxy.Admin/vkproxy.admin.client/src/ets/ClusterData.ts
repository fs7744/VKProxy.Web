import { isString, isArray, isNumber, filter, isBoolean,map } from 'lodash';

export class ClusterData {
  Key: string
  Destinations: {Address:string,Host: string}[]
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key: null
    this.Destinations = isArray(data.Destinations) ? filter(map(data.Destinations, i=> {
      if(i && isString(i.Address)) {
        return {Address:i.Address, Host: isString(i.Host) ? i.Host : null}
      } else {
        return null
      }
    }), i => i !== null) : []
  }
}
