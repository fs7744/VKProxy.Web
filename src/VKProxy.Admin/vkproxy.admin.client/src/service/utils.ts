export function parseTimeSpan(time: string) {
  let i = time.indexOf('.')
  let j = time.indexOf(':')
  if(i > 0 && i < j) {
    return (Number.parseInt(time.substring(0, i)) * 24 * 60 * 60  * 1000)+ Date.parse(`1970-01-01T${time.substring(i+1)}Z`)
  }
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
  v /= 60
  let h = v %  24
  v /= 24
  v -= h
  let time = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${ms.toString().padStart(3, '0')}`
  if(v > 0) {
    return `${v}.${time}`
  } else
    return time
}
