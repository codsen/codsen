function decodeContent(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/&#x7B;/g, "{").replace(/&#x7D;/g, "}");
}

module.exports = decodeContent;
