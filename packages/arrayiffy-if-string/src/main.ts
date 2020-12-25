// If a non-empty string is given, put it into an array.
// If an empty string is given, return an empty array.
// Bypass everything else.

// type signature overloading
function arrayiffy(something: string): [string];
function arrayiffy(something: any): any;
function arrayiffy(something: string | any): [string] | any {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }
    return [];
  }
  return something;
}

export { arrayiffy };
