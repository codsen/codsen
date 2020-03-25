// decrements the last chunk in the string path from:
// 9.children.3
// to
// 9.children.2
// the path notation is object-path
function pathPrev(str) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  const extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  } else if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${
      +str.slice(str.lastIndexOf(".") + 1) - 1
    }`;
  } else if (/^\d*$/.test(str)) {
    return `${+str - 1}`;
  }
  return null;
}

export default pathPrev;
