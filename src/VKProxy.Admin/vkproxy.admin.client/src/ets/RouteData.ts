import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';
import { isString, isArray, isNumber, filter, isInteger, type Dictionary, map, keys, reduce } from 'lodash';
import { ClusterData, toServiceCluster, toServiceKV, type KV } from './ClusterData';

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

export class RateLimit {
  By: string | null
  Policy: string | null
  Header: string | null
  Cookie: string | null
  PermitLimit: number | null
  QueueLimit: number | null
  SegmentsPerWindow: number | null
  TokensPerPeriod: number | null
  Window: number | null
  constructor(data: any) {
    if (!data) data = {}
    this.By = isString(data.By) ? data.By : null
    this.Policy = isString(data.Policy) ? data.Policy : null
    this.Header = isString(data.Header) ? data.Header : null
    this.Cookie = isString(data.Cookie) ? data.Cookie : null
    this.PermitLimit = isInteger(data.PermitLimit) ? data.PermitLimit : null
    this.QueueLimit = isInteger(data.QueueLimit) ? data.QueueLimit : null
    this.SegmentsPerWindow = isInteger(data.SegmentsPerWindow) ? data.SegmentsPerWindow : null
    this.TokensPerPeriod = isInteger(data.TokensPerPeriod) ? data.TokensPerPeriod : null
    this.Window = data.Window ? parseTimeSpanSeconds(data.Window) : null
  }
}

export function toServiceLimit(data: RateLimit) {
  return {
    By: data.By,
    Policy: data.Policy,
    Header: data.Header,
    Cookie: data.Cookie,
    PermitLimit: data.PermitLimit,
    QueueLimit: data.QueueLimit,
    SegmentsPerWindow: data.SegmentsPerWindow,
    TokensPerPeriod: data.TokensPerPeriod,
    Window: data.Window ? toSecondsTimeSpan(data.Window) : null,
  }
}

export class RouteData {
  Key: string
  Order: number
  Timeout: number
  UdpResponses: number
  ClusterId: string | null
  Cluster: ClusterData | null
  Metadata: KV[] | null
  Transforms: any[] | null
  Match: RouteMatch | null
  Limit: RateLimit | null
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
    this.Limit = data.Limit ? new RateLimit(data.Limit) : null
    this.Metadata = data.Metadata && keys(data.Metadata) ? reduce(keys(data.Metadata), (r, k) => {
      const v = data.Metadata[k]
      if (isString(v)) {
        r.push({ Key: k, Value: v })
      }
      return r
    }, [] as KV[]) : null

    this.Transforms = data.Transforms && isArray(data.Transforms) ?
      filter(map(data.Transforms, v => {
        if (v) {
          const d = reduce(keys(v), (r, k) => {
            const vv = v[k]
            if (isString(vv)) {
              if (k === 'X-Forwarded') {
                r.XForwarded = vv
              } else {
                r[k] = vv
              }
            }
            return r
          }, {} as any)
          return d
        } else {
          return null
        }
      }), i => i !== null)
      : null
  }
}

export function toServiceRoute(data: RouteData): any {
  const d = filter(data.Transforms, i => i != null);
  return {
    Key: data.Key,
    Order: data.Order,
    Timeout: toSecondsTimeSpan(data.Timeout),
    UdpResponses: data.UdpResponses,
    Metadata: toServiceKV(data.Metadata),
    Transforms: !d || d.length === 0 ? null : d,
    Match: data.Match,
    ClusterId: data.ClusterId,
    Cluster: data.Cluster ? toServiceCluster(data.Cluster) : null,
    Limit: data.Limit ? toServiceLimit(data.Limit) : null
  }
}
