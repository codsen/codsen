// decrements the last chunk in the string path from:
// 9.children.3
// to
// 9.children.2
// the path notation is object-path
function pathPrev(str: string): null | string {
  if (!str) {
    return null;
  }
  let extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  }
  if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${
      +str.slice(str.lastIndexOf(".") + 1) - 1
    }`;
  }
  if (/^\d*$/.test(str)) {
    return `${+str - 1}`;
  }
  return null;
}

export default pathPrev;
