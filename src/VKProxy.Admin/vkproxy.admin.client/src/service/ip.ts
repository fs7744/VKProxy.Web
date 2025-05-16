
import { parseInt } from 'lodash';

const ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
const ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

export function isV4Format(ip: string) {
  return ipv4Regex.test(ip);
};

export function isV6Format(ip: string) {
  return ipv6Regex.test(ip);
};

export function parseIpAddress(address: string) {
  if(!address) return null;
  const i = address.lastIndexOf(":")
  if(!i || i <= 0) return null;
  const ips = address.substring(0, i)
  if(!(isV4Format(ips) || isV6Format(ips))) return null;
  const ports = address.substring(i+ 1)
  return { ip: ips, port: parseInt(ports) }
};
