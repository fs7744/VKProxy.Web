export function parseTimeSpan(time: string) {
  return Date.parse(`1970-01-01T${time}Z`);
}

export function parseTimeSpanSeconds(time: string) {
  return parseTimeSpan(time) / 1000;
}

export function toSecondsTimeSpan(s: number) {
  return toTimeSpan(s * 1000)
}

export function toTimeSpan(v: number) {
  let ms= v % 1000
  v -= ms
  v /= 1000
  let s = v % 60
  v -= s
  v /= 60
  let m = v %  60
  v -= m
  return `${(v / 60).toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${ms.toString().padStart(3, '0')}`
}
