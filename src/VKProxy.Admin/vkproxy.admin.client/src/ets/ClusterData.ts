import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';
import { isString, isArray, isNumber, filter, isBoolean, map, isInteger, keys, reduce } from 'lodash';

export type KV = {
  Key: string
  Value: string
}

export function toServiceKV(kvs: KV[] | null): any {
  if (!kvs || kvs.length === 0) return null;
  const r = {} as any;
  kvs.forEach(element => {
    if (element.Key === 'XForwarded') {
      r['X-Forwarded'] = element.Value;
    } else {
      r[element.Key] = element.Value;
    }

  });
  return r;
}

export class PassiveHealthCheckConfig {
  MinimalTotalCountThreshold: number
  FailureRateLimit: number
  DetectionWindowSize: number
  ReactivationPeriod: number
  constructor(data: any) {
    if (!data) data = {}

    if (isInteger(data.MinimalTotalCountThreshold) && data.MinimalTotalCountThreshold > 0) {
      this.MinimalTotalCountThreshold = data.MinimalTotalCountThreshold
    } else {
      this.MinimalTotalCountThreshold = 10
    }

    if (isNumber(data.FailureRateLimit) && data.FailureRateLimit > 0 && data.FailureRateLimit <= 1) {
      this.FailureRateLimit = data.FailureRateLimit
    } else {
      this.FailureRateLimit = 0.3
    }

    let t = data.DetectionWindowSize ? parseTimeSpanSeconds(data.DetectionWindowSize) : null
    this.DetectionWindowSize = t ? t : 60

    t = data.ReactivationPeriod ? parseTimeSpanSeconds(data.ReactivationPeriod) : null
    this.ReactivationPeriod = t ? t : 60
  }

}

export class ActiveHealthCheckConfig {
  Interval: number
  Timeout: number
  Policy: string
  Passes: number
  Fails: number
  Path: string | null
  Query: string | null
  Method: string | null
  constructor(data: any) {
    if (!data) data = {}
    if (isInteger(data.Passes) && data.Passes > 0) {
      this.Passes = data.Passes
    } else {
      this.Passes = 1
    }
    if (isInteger(data.Fails) && data.Fails > 0) {
      this.Fails = data.Fails
    } else {
      this.Fails = 1
    }
    this.Path = isString(data.Path) ? data.Path : null
    this.Query = isString(data.Query) ? data.Query : null
    this.Method = isString(data.Method) ? data.Method : null
    this.Policy = isString(data.Policy) ? data.Policy.toLocaleLowerCase() : 'connect'
    let t = data.Interval ? parseTimeSpanSeconds(data.Interval) : null
    this.Interval = t ? t : 60
    t = data.Timeout ? parseTimeSpanSeconds(data.Timeout) : null
    this.Timeout = t ? t : 10
  }
}

export type HealthCheckConfig = {
  Passive: PassiveHealthCheckConfig | null
  Active: ActiveHealthCheckConfig | null
} | null

export enum SslProtocols {
  None = 0,
  Ssl2 = 12,
  Ssl3 = 48,
  Tls = 192,
  Default = 240,
  Tls11 = 768,
  Tls12 = 3072,
  Tls13 = 12288
}

export class WebProxy {
  Address: string
  BypassOnLocal: boolean
  UseDefaultCredentials: boolean
  constructor(data: any) {
    if (!data) data = {}
    this.Address = isString(data.Address) ? data.Address : null
    this.BypassOnLocal = isBoolean(data.BypassOnLocal) ? data.BypassOnLocal : false
    this.UseDefaultCredentials = isBoolean(data.UseDefaultCredentials) ? data.UseDefaultCredentials : false
  }
}

export class HttpClientConfig {
  DangerousAcceptAnyServerCertificate: boolean
  MaxConnectionsPerServer: number | null
  EnableMultipleHttp2Connections: boolean
  EnableMultipleHttp3Connections: boolean
  AllowAutoRedirect: boolean
  RequestHeaderEncoding: string | null
  ResponseHeaderEncoding: string | null
  SslProtocols: SslProtocols
  WebProxy: WebProxy | null
  WebProxyEnable: boolean
  constructor(data: any) {
    if (!data) data = {}
    this.MaxConnectionsPerServer = isInteger(data.MaxConnectionsPerServer) ? data.MaxConnectionsPerServer : null
    this.DangerousAcceptAnyServerCertificate = isBoolean(data.DangerousAcceptAnyServerCertificate) ? data.DangerousAcceptAnyServerCertificate : false
    this.EnableMultipleHttp2Connections = isBoolean(data.EnableMultipleHttp2Connections) ? data.EnableMultipleHttp2Connections : true
    this.EnableMultipleHttp3Connections = isBoolean(data.EnableMultipleHttp3Connections) ? data.EnableMultipleHttp3Connections : true
    this.AllowAutoRedirect = isBoolean(data.AllowAutoRedirect) ? data.AllowAutoRedirect : false
    this.SslProtocols = data.SslProtocols ? data.SslProtocols as SslProtocols : SslProtocols.None
    this.RequestHeaderEncoding = isString(data.RequestHeaderEncoding) ? data.RequestHeaderEncoding : null
    this.ResponseHeaderEncoding = isString(data.ResponseHeaderEncoding) ? data.ResponseHeaderEncoding : null
    this.WebProxy = data.WebProxy ? new WebProxy(data.WebProxy) : null
    this.WebProxyEnable = this.WebProxy !== null
  }
}

export class Destination {
  constructor(public Address: string, public Host: string | null) {
  }

  public toString() {
    return this.Address;
  }
}

export enum HttpVersionPolicy {
  RequestVersionOrLower = 0,
  RequestVersionOrHigher = 1,
  RequestVersionExact = 2
}

export class HttpRequestConfig {
  ActivityTimeout: number
  Version: string
  VersionPolicy: HttpVersionPolicy
  AllowResponseBuffering: boolean
  constructor(data: any) {
    if (!data) data = {}
    this.Version = isString(data.Version) ? data.Version : "2"
    this.AllowResponseBuffering = isBoolean(data.AllowResponseBuffering) ? data.AllowResponseBuffering : true
    this.VersionPolicy = data.VersionPolicy ? data.VersionPolicy as HttpVersionPolicy : HttpVersionPolicy.RequestVersionOrLower
    let t = data.ActivityTimeout ? parseTimeSpanSeconds(data.ActivityTimeout) : null
    this.ActivityTimeout = t ? t : 100
  }
}


export class ClusterData {
  Key: string
  Destinations: Destination[]
  LoadBalancingPolicy: string
  HealthCheck: HealthCheckConfig
  HealthCheckType: 'None' | 'Passive' | 'Active'
  HttpClientConfig: HttpClientConfig | null
  HttpClientConfigEnable: boolean
  HttpRequest: HttpRequestConfig | null
  HttpRequestEnable: boolean
  Metadata: any | null
  constructor(data: any) {
    if (!data) data = {}
    this.Key = isString(data.Key) ? data.Key : null
    this.Destinations = isArray(data.Destinations) ? filter(map(data.Destinations, i => {
      if (i && isString(i.Address)) {
        return new Destination(i.Address, isString(i.Host) ? i.Host : null)
      } else {
        return null
      }
    }), i => i !== null) : []
    this.LoadBalancingPolicy = isString(data.LoadBalancingPolicy) && data.LoadBalancingPolicy !== '' ? data.LoadBalancingPolicy : 'Random'
    this.HealthCheck = data.HealthCheck ? convertHealthCheck(data.HealthCheck) : null
    this.HealthCheckType = this.HealthCheck !== null && (this.HealthCheck.Passive !== null || this.HealthCheck.Active !== null) ? (this.HealthCheck.Passive !== null ? 'Passive' : 'Active') : 'None'
    if (data.HttpClientConfig) {
      this.HttpClientConfig = new HttpClientConfig(data.HttpClientConfig)
      this.HttpClientConfigEnable = true
    } else {
      this.HttpClientConfig = null
      this.HttpClientConfigEnable = false
    }
    if (data.HttpRequest) {
      this.HttpRequest = new HttpRequestConfig(data.HttpRequest)
      this.HttpRequestEnable = true
    } else {
      this.HttpRequest = null
      this.HttpRequestEnable = false
    }

    this.Metadata = data.Metadata && keys(data.Metadata) ? reduce(keys(data.Metadata), (r, k) => {
      const v = data.Metadata[k]
      if (isString(v)) {
        r[k] = v
      }
      return r
    }, {} as any) : null
  }
}

function convertHealthCheck(HealthCheck: any): HealthCheckConfig {
  const r: HealthCheckConfig = {
    Passive: null,
    Active: null
  };
  if (HealthCheck.Passive) {
    r.Passive = new PassiveHealthCheckConfig(HealthCheck.Passive)
  }
  if (HealthCheck.Active) {
    r.Active = new ActiveHealthCheckConfig(HealthCheck.Active)
  }
  return r;
}

export function toServiceCluster(data: ClusterData): any {
  return {
    Key: data.Key,
    Destinations: data.Destinations,
    LoadBalancingPolicy: data.LoadBalancingPolicy,
    HealthCheck: toServiceHealthCheck(data.HealthCheck),
    HttpClientConfig: data.HttpClientConfig,
    HttpRequest: data.HttpRequest ? {
      ActivityTimeout: toSecondsTimeSpan(data.HttpRequest.ActivityTimeout),
      Version: data.HttpRequest.Version,
      VersionPolicy: data.HttpRequest.VersionPolicy,
      AllowResponseBuffering: data.HttpRequest.AllowResponseBuffering
    } : null,
    Metadata: data.Metadata,
  }
}

function toServiceHealthCheck(data: HealthCheckConfig): any {
  if (!data) return null
  return {
    Active: toServiceHealthCheckActive(data.Active),
    Passive: toServiceHealthCheckPassive(data.Passive),
  }
}

function toServiceHealthCheckActive(data: ActiveHealthCheckConfig | null) {
  if (!data) return null
  const p = data.Policy ? data.Policy.toLocaleLowerCase() : data.Policy
  const isHttp = p === 'http'
  return {
    Interval: toSecondsTimeSpan(data.Interval),
    Timeout: toSecondsTimeSpan(data.Timeout),
    Policy: p,
    Passes: data.Passes,
    Fails: data.Fails,
    Path: isHttp ? data.Path : null,
    Query: isHttp ? data.Query : null,
    Method: isHttp && data.Method ? data.Method.toLocaleUpperCase() : null
  }
}

function toServiceHealthCheckPassive(data: PassiveHealthCheckConfig | null) {
  if (!data) return null
  return {
    MinimalTotalCountThreshold: data.MinimalTotalCountThreshold,
    FailureRateLimit: data.FailureRateLimit,
    DetectionWindowSize: toSecondsTimeSpan(data.DetectionWindowSize),
    ReactivationPeriod: toSecondsTimeSpan(data.ReactivationPeriod),
  }
}

export function toSslProtocols(v: SslProtocols) {
  const vv = []
  if (v & SslProtocols.None) {
    vv.push(SslProtocols.None)
  }
  if (v & SslProtocols.Ssl2) {
    vv.push(SslProtocols.Ssl2)
  }
  if (v & SslProtocols.Ssl3) {
    vv.push(SslProtocols.Ssl3)
  }
  if (v & SslProtocols.Tls) {
    vv.push(SslProtocols.Tls)
  }
  if (v & SslProtocols.Tls11) {
    vv.push(SslProtocols.Tls11)
  }
  if (v & SslProtocols.Tls12) {
    vv.push(SslProtocols.Tls12)
  }
  if (v & SslProtocols.Tls13) {
    vv.push(SslProtocols.Tls13)
  }
  return vv
}

export function unionSslProtocols(v: SslProtocols[]) {
  let i;
  for (const vv of v) {
    if (i) {
      i |= vv;
    } else {
      i = vv;
    }
  }
  return i;
}
