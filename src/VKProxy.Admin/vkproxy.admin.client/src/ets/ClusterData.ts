import { parseTimeSpanSeconds, toSecondsTimeSpan } from '@/service/utils';
import { isString, isArray, isNumber, filter, isBoolean, map } from 'lodash';

export class PassiveHealthCheckConfig {
  MinimalTotalCountThreshold: number
  FailureRateLimit: number
  DetectionWindowSize: number
  ReactivationPeriod: number
  constructor(data: any) {
    if (!data) data = {}

    if (isNumber(data.MinimalTotalCountThreshold) && data.MinimalTotalCountThreshold > 0) {
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
  constructor(data: any) {
    if (!data) data = {}
  }
}

export type HealthCheckConfig = {
  Passive: PassiveHealthCheckConfig | null
  Active: ActiveHealthCheckConfig | null
} | null

export class ClusterData {
  Key: string
  Destinations: { Address: string, Host: string }[]
  LoadBalancingPolicy: string
  HealthCheck: HealthCheckConfig
  HealthCheckType: 'None' | 'Passive' | 'Active'
  constructor(data: any) {
    this.Key = isString(data.Key) ? data.Key : null
    this.Destinations = isArray(data.Destinations) ? filter(map(data.Destinations, i => {
      if (i && isString(i.Address)) {
        return { Address: i.Address, Host: isString(i.Host) ? i.Host : null }
      } else {
        return null
      }
    }), i => i !== null) : []
    this.LoadBalancingPolicy = isString(data.LoadBalancingPolicy) && data.LoadBalancingPolicy !== '' ? data.LoadBalancingPolicy : 'Random'
    this.HealthCheck = data.HealthCheck ? convertHealthCheck(data.HealthCheck) : null
    this.HealthCheckType = this.HealthCheck !== null && (this.HealthCheck.Passive !== null || this.HealthCheck.Active !== null) ? (this.HealthCheck.Passive !== null ? 'Passive' : 'Active') : 'None'
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
    HealthCheck: toServiceHealthCheck(data.HealthCheck)
  }
}

function toServiceHealthCheck(data: HealthCheckConfig): any {
  if(!data) return null
  return {
    Active: toServiceHealthCheckActive(data.Active),
    Passive: toServiceHealthCheckPassive(data.Passive),
  }
}

function toServiceHealthCheckActive(data: ActiveHealthCheckConfig | null) {
  if(!data) return null
  return {
  }
}

function toServiceHealthCheckPassive(data: PassiveHealthCheckConfig | null) {
  if(!data) return null
  return {
    MinimalTotalCountThreshold: data.MinimalTotalCountThreshold,
    FailureRateLimit: data.FailureRateLimit,
    DetectionWindowSize: toSecondsTimeSpan(data.DetectionWindowSize),
    ReactivationPeriod: toSecondsTimeSpan(data.ReactivationPeriod),
  }
}
