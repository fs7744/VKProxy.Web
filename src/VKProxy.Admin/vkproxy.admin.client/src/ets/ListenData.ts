import { GatewayProtocols } from "./GatewayProtocols"
import { isString, isArray, isNumber, filter, isBoolean } from 'lodash';
import { RouteData, toServiceRoute } from "./RouteData";
import { SniData, toServiceSni } from "./SniData";

export class ListenData {
  Key: string
  Protocols: GatewayProtocols
  Address: string[]
  UseSni: boolean
  SniId: string | null
  RouteId: string | null
  Route: RouteData | null
  Sni: SniData | null
  constructor(data: any) {
    if (!data) data = {}
    this.Key = isString(data.Key) ? data.Key: null
    this.Protocols = isNumber(data.Protocols) ? data.Protocols as GatewayProtocols : GatewayProtocols.HTTP1
    this.Address = isArray(data.Address) ? filter(data.Address, isString) : []
    this.UseSni = isBoolean(data.UseSni) ? data.UseSni : false
    this.SniId = isString(data.SniId) ? data.SniId: null
    this.RouteId = isString(data.RouteId) ? data.RouteId: null
    this.Route = data.Route ? new RouteData(data.Route): null
    this.Sni = data.Sni ? new SniData(data.Sni): null
  }
}

export function toServiceListen(data: ListenData): any {
  return {
    Key: data.Key,
    Protocols: data.Protocols,
    Address: data.Address,
    UseSni: data.UseSni,
    SniId: data.SniId,
    RouteId: data.RouteId,
    Route: data.Route ? toServiceRoute(data.Route) : null,
    Sni: data.Sni ? toServiceSni(data.Sni) : null
  }
}
