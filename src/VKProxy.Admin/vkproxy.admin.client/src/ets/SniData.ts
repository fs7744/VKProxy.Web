import { isString, isArray, isNumber, filter, isBoolean, isInteger } from 'lodash';
import { SslProtocols } from './ClusterData';
import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';

export enum ClientCertificateMode {
  NoCertificate = 0,
  AllowCertificate = 1,
  RequireCertificate = 2,
  DelayCertificate = 3
}

export class CertificateConfig {
  PEM: string | null
  PEMKey: string | null
  Path: string | null
  KeyPath: string | null
  Password: string | null
  Subject: string | null
  Store: string | null
  Location: string | null
  AllowInvalid: string | null
  constructor(data: any) {
    this.Path = isString(data.Path) ? data.Path : null
    this.KeyPath = isString(data.KeyPath) ? data.KeyPath : null
    this.PEM = isString(data.PEM) ? data.PEM : null
    this.PEMKey = isString(data.PEMKey) ? data.PEMKey : null
    this.Password = isString(data.Password) ? data.Password : null
    this.Subject = isString(data.Subject) ? data.Subject : null
    this.Store = isString(data.Store) ? data.Store : null
    this.Location = isString(data.Location) ? data.Location : null
    this.AllowInvalid = isBoolean(data.AllowInvalid) ? data.AllowInvalid : null
  }
}

export class SniData {
  Key: string
  Order: number
  Host: string[]
  Passthrough: boolean
  HandshakeTimeout: number
  Protocols: SslProtocols
  CheckCertificateRevocation: boolean
  ClientCertificateMode: ClientCertificateMode
  RouteId: string | null
  Certificate: CertificateConfig | null
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key : null
    this.Order = isInteger(data.Order) ? data.Order : 0
    this.Passthrough = isBoolean(data.Passthrough) ? data.Passthrough : false
    this.CheckCertificateRevocation = isBoolean(data.CheckCertificateRevocation) ? data.CheckCertificateRevocation : true
    this.Protocols = data.Protocols ? data.Protocols as SslProtocols : SslProtocols.None
    this.ClientCertificateMode = data.ClientCertificateMode ? data.ClientCertificateMode as ClientCertificateMode : ClientCertificateMode.DelayCertificate
    this.RouteId = isString(data.RouteId) ? data.RouteId : null
    let t = data.HandshakeTimeout ? parseTimeSpanSeconds(data.HandshakeTimeout) : null
    this.HandshakeTimeout = t ? t : 10
    this.Host = isArray(data.Host) ? filter(data.Host, isString) : []
    this.Certificate = data.Certificate ? new CertificateConfig(data.Certificate) : (this.Passthrough ? null : new CertificateConfig({}))
  }
}

export function toServiceSni(data: SniData): any {
  return {
    Key: data.Key,
    Order: data.Order,
    Host: data.Host,
    Passthrough: data.Passthrough,
    Protocols: data.Protocols,
    CheckCertificateRevocation: data.CheckCertificateRevocation,
    ClientCertificateMode: data.ClientCertificateMode,
    RouteId: data.RouteId,
    HandshakeTimeout: toSecondsTimeSpan(data.HandshakeTimeout),
    Certificate: data.Certificate
  }
}
