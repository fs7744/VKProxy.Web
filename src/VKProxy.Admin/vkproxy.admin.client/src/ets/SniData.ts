import { isString, isArray, isNumber, filter, isBoolean, isInteger } from 'lodash';
import { SslProtocols } from './ClusterData';
import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';
import { RouteData, toServiceRoute } from './RouteData';

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
  Route: RouteData| null
  Certificate: CertificateConfig | null
  constructor(data: any) {
    if (!data) data = {}
    this.Key = isString(data.Key) ? data.Key : null
    this.Order = isInteger(data.Order) ? data.Order : 0
    this.Passthrough = isBoolean(data.Passthrough) ? data.Passthrough : false
    this.CheckCertificateRevocation = isBoolean(data.CheckCertificateRevocation) ? data.CheckCertificateRevocation : true
    this.Protocols = data.Protocols ? data.Protocols as SslProtocols : SslProtocols.None
    this.ClientCertificateMode = data.ClientCertificateMode ? data.ClientCertificateMode as ClientCertificateMode : ClientCertificateMode.DelayCertificate
    this.RouteId = isString(data.RouteId) ? data.RouteId : null
    this.Route = data.Route ? new RouteData(data.Route): null
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
    Route: data.Route ? toServiceRoute(data.Route) : null,
    HandshakeTimeout: toSecondsTimeSpan(data.HandshakeTimeout),
    Certificate: data.Certificate
  }
}

export class AcmeChallenge {
  Key: string
  Pem: string | null
  PemKey: string | null
  Server: string
  DomainNames: string[]
  RenewDaysInAdvance: number | null
  Timeout: number | null
  AllowedChallengeTypes: string
  KeyAlgorithm: string
  KeySize: number| null
  AdditionalIssuers: string[] | null
  AccountKeyPem: string | null
  Contact: string[] | null
  EabKeyId: string | null
  EabKey: string | null
  EabKeyAlg: string | null
  SniKey: string | null
  constructor(data: any) {
    if (!data) data = {}
    this.Key = isString(data.Key) ? data.Key : null
    this.Pem = isString(data.Pem) ? data.Pem : null
    this.PemKey = isString(data.PemKey) ? data.PemKey : null
    this.Server = isString(data.Server) ? data.Server : null
    this.DomainNames = isArray(data.DomainNames) ? filter(data.DomainNames, isString) : []
    this.RenewDaysInAdvance = data.RenewDaysInAdvance ? parseTimeSpanSeconds(data.RenewDaysInAdvance) / (24 * 60 * 60) : null
    this.Timeout = data.Timeout ? parseTimeSpanSeconds(data.Timeout) : null
    this.KeyAlgorithm = isString(data.KeyAlgorithm) ? data.KeyAlgorithm : null
    this.AllowedChallengeTypes = isString(data.AllowedChallengeTypes) ? data.AllowedChallengeTypes : null
    this.KeySize = isInteger(data.KeySize) ? data.KeySize : null
    this.AdditionalIssuers = isArray(data.AdditionalIssuers) ? filter(data.AdditionalIssuers, isString) : []
    this.AccountKeyPem = isString(data.AccountKeyPem) ? data.AccountKeyPem : null
    this.Contact = isArray(data.Contact) ? filter(data.Contact, isString) : []
    this.EabKeyId = isString(data.EabKeyId) ? data.EabKeyId : null
    this.EabKey = isString(data.EabKey) ? data.EabKey : null
    this.EabKeyAlg = isString(data.EabKeyAlg) ? data.EabKeyAlg : null
    this.SniKey = isString(data.SniKey) ? data.SniKey : null
  }
}

export function toServiceAcmeChallenge(data: AcmeChallenge): any {
  return {
    Key: data.Key,
    Pem: data.Pem,
    PemKey: data.PemKey,
    Server: data.Server,
    DomainNames: data.DomainNames,
    RenewDaysInAdvance: data.RenewDaysInAdvance ? toSecondsTimeSpan(data.RenewDaysInAdvance * 24 * 60 * 60) : null,
    Timeout: data.Timeout ? toSecondsTimeSpan(data.Timeout) : null,
    KeyAlgorithm: data.KeyAlgorithm,
    AllowedChallengeTypes: data.AllowedChallengeTypes,
    KeySize: data.KeySize,
    AdditionalIssuers: data.AdditionalIssuers,
    AccountKeyPem: data.AccountKeyPem,
    Contact: data.Contact,
    EabKeyId: data.EabKeyId,
    EabKey: data.EabKey,
    EabKeyAlg: data.EabKeyAlg,
    SniKey: data.SniKey
  }
}
