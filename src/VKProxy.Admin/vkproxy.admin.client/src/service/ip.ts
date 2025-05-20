
import { parseInt } from 'lodash';

const word = '[a-fA-F\\d:]';

const boundry = (options: any) => options && options.includeBoundaries
	? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))`
	: '';

const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

const v6segment = '[a-fA-F\\d]{1,4}';

const v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

// Pre-compile only the exact regexes because adding a global flag make regexes stateful
const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
const v4exact = new RegExp(`^${v4}$`);
const v6exact = new RegExp(`^${v6}$`);

export const ipRegex = (options: any) => options && options.exact
	? v46Exact
	: new RegExp(`(?:${boundry(options)}${v4}${boundry(options)})|(?:${boundry(options)}${v6}${boundry(options)})`, 'g');

ipRegex.v4 = (options: any) => options && options.exact ? v4exact : new RegExp(`${boundry(options)}${v4}${boundry(options)}`, 'g');
ipRegex.v6 = (options: any) => options && options.exact ? v6exact : new RegExp(`${boundry(options)}${v6}${boundry(options)}`, 'g');

const v6t = ipRegex.v6({exact: false})


export function parseIpAddress(address: string) {
  if(!address) return null;
  const i = address.lastIndexOf(":")
  if(!i || i <= 0) return null;
  let ips = address.substring(0, i)
  if(ips.startsWith('[') && ips.endsWith(']'))
    ips = ips.substring(1, ips.length - 1)
  if(!(v46Exact.test(ips) || v6t.test(ips))) return null;
  const ports = address.substring(i+ 1)
  return { host: ips, port: parseInt(ports) }
}

export function parseAddress(address: string, replaceHost: string) {
  if(!address) return null;
  const i = URL.parse(address)
  if(i) {
    return { protocol: i.protocol ? i.protocol.toLocaleLowerCase()+ '//' : i.protocol, host: i.hostname,port: i.port ? parseInt(i.port) :(i.protocol && i.protocol.toLocaleLowerCase() === 'https:' ? 443  : 80), pathname :i.pathname && i.pathname !== '/' ? i.pathname : null, search: i.search ?i.search: null,replaceHost: replaceHost === '' ? null : replaceHost}
  } else {
    const j = parseIpAddress(address)
    return j ? { host: j.host,port: j.port,replaceHost: replaceHost === '' ? null : replaceHost } : null
  }
}


export function isIp(address: string) {
  if(!address) return false;
  return v46Exact.test(address) || v6t.test(address)
}

export function isIpv6(address: string) {
  if(!address) return false;
  return v6exact.test(address) || v6t.test(address)
}

export function isIpv4(address: string) {
  if(!address) return false;
  return v4exact.test(address)
}
