// bumps the last chunk in the string path from:
// 9.children.3
// to
// 9.children.4
// the path notation is object-path
function pathNext(str) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(
      str.lastIndexOf(".") + 1
    ) + 1}`;
  } else if (/^\d*$/.test(str)) {
    return `${+str + 1}`;
  }
  return str;
}

export default pathNext;
