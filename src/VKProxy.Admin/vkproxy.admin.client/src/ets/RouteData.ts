import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';
import { isString, isArray, isNumber, filter, isInteger, type Dictionary, map, keys, reduce } from 'lodash';
import { ClusterData, toServiceCluster } from './ClusterData';

export class RouteMatch {
  Hosts: string[] | null
  Paths: string[] | null
  Methods: string[] | null
  Statement: string | null
  constructor(data: any) {
    if (!data) data = {}
    this.Statement = isString(data.Statement) ? data.Statement : null
    this.Hosts = isArray(data.Hosts) ? filter(data.Hosts, isString) : null
    this.Paths = isArray(data.Paths) ? filter(data.Paths, isString) : null
    this.Methods = isArray(data.Methods) ? filter(data.Methods, isString) : null
  }
}

export class RouteData {
  Key: string
  Order: number
  Timeout: number
  UdpResponses: number
  ClusterId: string
  Cluster: ClusterData | null
  Metadata: Dictionary<string> | null
  Transforms: Dictionary<string>[] | null
  Match: RouteMatch | null
  constructor(data: any) {
    if (!data) data = {}
    this.Key = isString(data.Key) ? data.Key : null
    this.Order = isInteger(data.Order) ? data.Order : 0
    let t = data.Timeout ? parseTimeSpanSeconds(data.Timeout) : null
    this.Timeout = t ? t : 300
    this.UdpResponses = isInteger(data.UdpResponses) ? data.UdpResponses : 0
    this.ClusterId = isString(data.ClusterId) ? data.ClusterId : null
    this.Cluster = data.Cluster ? new ClusterData(data.Cluster) : null
    this.Match = data.Match ? new RouteMatch(data.Match) : null
    this.Metadata = data.Metadata && keys(data.Metadata) ? reduce(keys(data.Metadata), (r, k) => {
      const v = data.Metadata[k]
      if (isString(v)) {
        r[k] = v
      }
      return r
    }, {} as any) : null

    this.Transforms = data.Transforms && isArray(data.Transforms) ?
      filter(map(data.Transforms, v => {
        if (v) {
          return reduce(keys(v), (r, k) => {
            const vv = v[k]
            if (isString(v)) {
              r[k] = vv
            }
            return r
          }, {} as any)
        } else {
          return null
        }
      }), i => i !== null)
      : null
  }
}

export function toServiceRoute(data: RouteData): any {
  return {
    Key: data.Key,
    Order: data.Order,
    Timeout: toSecondsTimeSpan(data.Timeout),
    UdpResponses: data.UdpResponses,
    Metadata: data.Metadata,
    Transforms: data.Transforms,
    Match: data.Match,
    Cluster: data.Cluster ? toServiceCluster(data.Cluster) : null
  }
}

