import { GatewayProtocols } from "./GatewayProtocols"
import { isString, isArray, isNumber, filter, isBoolean } from 'lodash';

export class ListenData {
  Key: string
  Protocols: GatewayProtocols
  Address: string[]
  UseSni: boolean
  SniId: string
  RouteId: string
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key: null
    this.Protocols = isNumber(data.Protocols) ? data.Protocols as GatewayProtocols : GatewayProtocols.HTTP1
    this.Address = isArray(data.Address) ? filter(data.Address, isString) : []
    this.UseSni = isBoolean(data.UseSni) ? data.UseSni : false
    this.SniId = isString(data.SniId) ? data.SniId: null
    this.RouteId = isString(data.RouteId) ? data.RouteId: null
  }
}
