// packages/*/perf/historical.json is JSON with one deviation: numbers carry
// underscore separators, like JS numeric separators, so that ops/sec figures in
// the millions stay readable. Plain JSON.parse chokes on those, so every reader
// and writer of historical.json goes through the two helpers below.

// above this, the fractional part is noise — round it away
let roundAbove = 100;

let marker = "__historicalNumber__";

// strips the underscores outside of string literals, leaving valid JSON
function stripSeparators(str) {
  let res = "";
  let inString = false;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (inString) {
      res += char;
      if (char === "\\") {
        // whatever follows is escaped, copy it verbatim
        res += str[++i] ?? "";
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
      res += char;
    } else if (char !== "_") {
      res += char;
    }
  }
  return res;
}

function groupDigits(digits) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}

export function formatHistoricalNumber(num) {
  if (!Number.isFinite(num)) {
    return String(num);
  }
  let str = String(Math.abs(num) > roundAbove ? Math.round(num) : num);
  // exponential notation is compact already, don't touch it
  if (str.includes("e") || str.includes("E")) {
    return str;
  }
  let [intPart, fracPart] = str.split(".");
  let sign = intPart.startsWith("-") ? "-" : "";
  let grouped = `${sign}${groupDigits(sign ? intPart.slice(1) : intPart)}`;
  return fracPart ? `${grouped}.${fracPart}` : grouped;
}

export function parseHistorical(str) {
  return JSON.parse(stripSeparators(str));
}

// JSON.stringify(obj, null, 2) but with separators in the numbers; mind that
// the result is deliberately not valid JSON — parseHistorical() reads it back
export function stringifyHistorical(obj) {
  return JSON.stringify(
    obj,
    (_key, value) =>
      typeof value === "number"
        ? `${marker}${formatHistoricalNumber(value)}`
        : value,
    2,
  ).replace(new RegExp(`"${marker}([-\\d._eE+]+)"`, "g"), "$1");
}
