function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

module.exports = arrayiffy;
