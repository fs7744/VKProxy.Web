import { isString, isArray, isNumber, filter, isBoolean, isInteger } from 'lodash';
import { SslProtocols } from './ClusterData';
import { parseTimeSpanSeconds } from '@/service/utils';

export enum ClientCertificateMode {
    NoCertificate = 0,
    AllowCertificate = 1,
    RequireCertificate = 2,
    DelayCertificate = 3
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
  RouteId: string| null
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key: null
    this.Order = isInteger(data.Order) ? data.Order: 0
    this.Passthrough = isBoolean(data.Passthrough) ? data.Passthrough: false
    this.CheckCertificateRevocation = isBoolean(data.CheckCertificateRevocation) ? data.CheckCertificateRevocation: true
    this.Protocols = data.Protocols ? data.Protocols as SslProtocols : SslProtocols.None
    this.ClientCertificateMode = data.ClientCertificateMode ? data.ClientCertificateMode as ClientCertificateMode : ClientCertificateMode.DelayCertificate
    this.RouteId = isString(data.RouteId) ? data.RouteId: null
    let t = data.HandshakeTimeout ? parseTimeSpanSeconds(data.HandshakeTimeout) : null
    this.HandshakeTimeout = t ? t : 10
    this.Host = isArray(data.Host) ? filter(data.Host, isString) : []
  }
}
