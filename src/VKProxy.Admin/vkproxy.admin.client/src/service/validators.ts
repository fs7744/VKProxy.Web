
import { GatewayProtocols } from '../ets/GatewayProtocols'
import { t } from './confirm'
import { isIp } from './ip'
import { isInteger, isBoolean } from 'lodash'

export const protocolsValidator = {
  validator: (rule: any, value: GatewayProtocols, callback: any) => {
    let isL4 = false;
    let isL7 = false;
    if (value & GatewayProtocols.TCP) {
      isL4 = true;
    }

    if (value & GatewayProtocols.UDP) {
      isL4 = true;
    }
    if (value & GatewayProtocols.HTTP1) {
      isL7 = true;
    }
    if (value & GatewayProtocols.HTTP2) {
      isL7 = true;
    }
    if (value & GatewayProtocols.HTTP3) {
      isL7 = true;
    }

    if (isL4 && isL7) {
      callback(new Error(t('bothL47')))
    } else {
      callback()
    }
  }, trigger: 'blur'
}

export const checkIp = {
  validator: (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error(t('required')))
    } else {
      if (!value.host || !isIp(value.host)) {
        return callback(new Error(t('wrongIp')))
      }
      if (!value.port || !isInteger(value.port) || value <= 0 || value > 65535) {
        return callback(new Error(t('wrongPort')))
      }

      callback()
    }
  }, trigger: 'blur'
}
