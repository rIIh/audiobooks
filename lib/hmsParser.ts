export function hmsParse(str: string) {
  var p = str.split(':'),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop() ?? '', 10);
    m *= 60;
  }

  return s;
}

export const prettyTime = function (fromSeconds: number, explicit: boolean = false): string {
  let hours   = Math.floor(fromSeconds / 3600);
  let minutes = Math.floor((fromSeconds - (hours * 3600)) / 60);
  let seconds = Math.round(fromSeconds - (hours * 3600) - (minutes * 60));
  let resultHours = hours.toString();
  let resultMinutes = minutes.toString();
  let resultSeconds = seconds.toString();

  if (hours   < 10) { resultHours =   `0${hours}`;  }
  if (minutes < 10) { resultMinutes = `0${minutes}`; }
  if (seconds < 10) { resultSeconds = `0${seconds}`; }
  let stop = false;
  return [resultHours, resultMinutes, resultSeconds].filter(val => {
    if (explicit) return true;
    if (!stop && val != '00') { stop = true }
    // return true;
    return stop || val != '00';
  }).join(':');
}
