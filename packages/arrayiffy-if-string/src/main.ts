// If a string is given, put it into an array. Bypass everything else.
function arrayiffy(something: any) {
  if (typeof something === "string") {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

export { arrayiffy };
