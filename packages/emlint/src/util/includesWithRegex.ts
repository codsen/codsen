import isRegExp from "lodash.isregexp";

interface Opts {
  caseInsensitive: boolean;
}
const defaults: Opts = {
  caseInsensitive: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function includesWithRegex(
  arr: (string | RegExp)[],
  whatToMatch: string,
  originalOpts?: Partial<Opts>
): boolean {
  let opts = { ...defaults, ...originalOpts };
  DEV && console.log(" ---------- ");
  DEV &&
    console.log(
      `022 includesWithRegex() called to match ${JSON.stringify(
        whatToMatch,
        null,
        0
      )} against:\n${JSON.stringify(arr, null, 4)}; opts = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  if (!Array.isArray(arr) || !arr.length) {
    // definitely does not include
    DEV && console.log(`034 includesWithRegex() quick end, return false`);
    return false;
  }
  // DEV && console.log(
  //   `017 includesWithRegex(): ${`\u001b[${33}m${`whatToMatch`}\u001b[${39}m`} = ${JSON.stringify(
  //     whatToMatch,
  //     null,
  //     4
  //   )}`
  // );

  return arr.some(
    (val) =>
      (isRegExp(val) && whatToMatch.match(val)) ||
      (typeof val === "string" &&
        ((!opts.caseInsensitive && whatToMatch === val) ||
          (opts.caseInsensitive &&
            whatToMatch.toLowerCase() === val.toLowerCase())))
  );
}

export default includesWithRegex;
