export function removeTbc(str) {
  if (typeof str === "string" && str.endsWith("-tbc")) {
    return str.slice(0, -4);
  }
  return str;
}
