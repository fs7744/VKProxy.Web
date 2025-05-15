export enum GatewayProtocols {
  TCP = 1,
  UDP = 2,
  HTTP1 = 4,
  HTTP2 = 8,
  HTTP3 = 16,
}

export function toGatewayProtocolsNames(v: GatewayProtocols) {
  const vv = []
  if (v & GatewayProtocols.TCP) {
    vv.push("TCP")
  }

  if (v & GatewayProtocols.UDP) {
    vv.push("UDP")
  }
  if (v & GatewayProtocols.HTTP1) {
    vv.push("HTTP1")
  }
  if (v & GatewayProtocols.HTTP2) {
    vv.push("HTTP2")
  }
  if (v & GatewayProtocols.HTTP3) {
    vv.push("HTTP3")
  }
  return vv
}
