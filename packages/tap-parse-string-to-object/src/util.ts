declare let DEV: boolean;

// pings each line to the callback cb()
function stringPingLineByLine(str: string, cb: (str2: string) => void): void {
  // DEV && console.log(
  //   `004 ${`\u001b[${33}m${`█`}\u001b[${39}m`} stringPingLineByLine() called!`
  // );
  let start = null;

  for (let i = 0, len = str.length; i < len; i++) {
    if (["\n", "\r"].includes(str[i])) {
      if (start !== null) {
        DEV &&
          console.log(
            `015 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`PING`}\u001b[${39}m`} "${`\u001b[${36}m${str.slice(
              start,
              i,
            )}\u001b[${39}m`}"`,
          );
        cb(str.slice(start, i));
        start = null;
        // DEV && console.log(
        //   `020 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = null`
        // );
      }
    }
    // not a linebreak character
    else if (start === null) {
      start = i;
      // DEV && console.log(
      //   `028 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = ${start}`
      // );
    }

    // if an end is reached, ping the remainder
    if (start !== null && !str[i + 1]) {
      cb(str.slice(start, i + 1));
      DEV &&
        console.log(
          `040 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`PING`}\u001b[${39}m`} "${str.slice(
            start,
            i + 1,
          )}"`,
        );
    }
  }
}

interface Total {
  ok: boolean;
  assertsTotal: number;
  assertsPassed: number;
  assertsFailed: number;
  suitesTotal: number;
  suitesPassed: number;
  suitesFailed: number;
}

class Counter {
  canCount: boolean;
  doNothing: boolean;
  thereWereFailuresInThisSuite: null | boolean;
  total: Total;

  constructor() {
    this.canCount = false;
    this.doNothing = false;
    this.thereWereFailuresInThisSuite = null;
    this.total = {
      ok: true,
      assertsTotal: 0,
      assertsPassed: 0,
      assertsFailed: 0,
      suitesTotal: 0,
      suitesPassed: 0,
      suitesFailed: 0,
    };
  }

  readLine(lineStr: string): void {
    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`======================================== readLine() start`}\u001b[${39}m`}`
          : "",
      );
    // catch the --- to ...
    if (!this.doNothing && lineStr.trim() === "---") {
      this.doNothing = true;
      // this.canCount = false;
      DEV &&
        console.log(
          `093 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.doNothing = ${
            this.doNothing
          }; this.canCount = ${this.canCount}`,
        );
    }
    if (this.doNothing && lineStr.trim() === "...") {
      this.doNothing = false;
      DEV &&
        console.log(
          `102 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.doNothing = ${
            this.doNothing
          }`,
        );
    }
    // catch the assertion result lines
    else if (!this.doNothing && this.canCount) {
      if (
        lineStr.trim().startsWith("ok") ||
        lineStr.trim().startsWith("not ok")
      ) {
        if (lineStr.trim().startsWith("ok")) {
          this.total.assertsPassed += 1;
          DEV &&
            console.log(
              `117 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsPassed`}\u001b[${39}m`} = ${
                this.total.assertsPassed
              }`,
            );
        } else if (lineStr.trim().startsWith("not ok")) {
          this.total.assertsFailed += 1;
          DEV &&
            console.log(
              `125 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsFailed`}\u001b[${39}m`} = ${
                this.total.assertsFailed
              }`,
            );
          if (!this.thereWereFailuresInThisSuite) {
            this.thereWereFailuresInThisSuite = true;
            DEV &&
              console.log(
                `133 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${31}m${`this.thereWereFailuresInThisSuite`}\u001b[${39}m`} = ${
                  this.thereWereFailuresInThisSuite
                }`,
              );
          }
        }

        this.total.assertsTotal += 1;
        DEV &&
          console.log(
            `143 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsTotal`}\u001b[${39}m`} = ${
              this.total.assertsTotal
            }`,
          );
      } else {
        this.canCount = false;
        DEV &&
          console.log(
            `151 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${31}m${`this.canCount`}\u001b[${39}m`} = ${
              this.canCount
            }`,
          );
      }
    }

    // if { is on a separate line, bump the suite count and reset the this.thereWereFailuresInThisSuite
    if (!this.doNothing && lineStr.trim() === "{") {
      DEV &&
        console.log(
          `162 ${`\u001b[${35}m${`█`}\u001b[${39}m`} NEW SUITE'S OPENING CURLIE CAUGHT`,
        );
      this.total.suitesTotal += 1;

      if (this.thereWereFailuresInThisSuite !== null) {
        // second suite onwards already has a gathered result
        if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed += 1;
          DEV &&
            console.log(
              `172 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = ${
                this.total.suitesFailed
              }`,
            );
        } else {
          this.total.suitesPassed += 1;
          DEV &&
            console.log(
              `180 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = ${
                this.total.suitesPassed
              }`,
            );
        }
      }

      // reset:
      this.thereWereFailuresInThisSuite = false;

      DEV &&
        console.log(
          `192 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = ${
            this.total.suitesTotal
          }; this.thereWereFailuresInThisSuite = false`,
        );
    }

    // "# Subtest" opens the gates
    let magicKeyw = "# Subtest";
    if (!this.doNothing && !this.canCount && lineStr.includes(magicKeyw)) {
      this.canCount = true;
      DEV &&
        console.log(
          `204 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.canCount = ${
            this.canCount
          }`,
        );

      // if suite's opening curlie is on the same line, for example:
      //
      // ok 1 - test/test.js # time=22.582ms { # Subtest: ...
      //
      // then bump the suite count
      if (lineStr.slice(0, lineStr.indexOf(magicKeyw)).trim().endsWith("{")) {
        this.total.suitesTotal += 1;
        DEV &&
          console.log(
            `218 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = ${
              this.total.suitesTotal
            }`,
          );

        // we must skip the first opening curlies and count suite passing
        // for all others
        if (this.thereWereFailuresInThisSuite === null) {
          // if it's first suite's opening curlie
          this.thereWereFailuresInThisSuite = false;
          DEV &&
            console.log(
              `230 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.thereWereFailuresInThisSuite = ${
                this.thereWereFailuresInThisSuite
              }`,
            );
        } else if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed += 1;
          this.thereWereFailuresInThisSuite = false;
          DEV &&
            console.log(
              `239 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = ${
                this.total.suitesFailed
              }; this.thereWereFailuresInThisSuite = ${
                this.thereWereFailuresInThisSuite
              }`,
            );
        } else {
          this.total.suitesPassed += 1;
          DEV &&
            console.log(
              `249 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = ${
                this.total.suitesPassed
              }`,
            );
        }
      }
    }

    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`---------------------------------------- readLine() end`}\u001b[${39}m`}`
          : "",
      );
    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`this.canCount:`}\u001b[${39}m`} ${`\u001b[${
              this.canCount ? 32 : 31
            }m${this.canCount}\u001b[${39}m`}`
          : "",
      );
    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`this.doNothing:`}\u001b[${39}m`} ${`\u001b[${
              this.doNothing ? 32 : 31
            }m${this.doNothing}\u001b[${39}m`}`
          : "",
      );
    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`this.thereWereFailuresInThisSuite:`}\u001b[${39}m`} ${`\u001b[${
              this.thereWereFailuresInThisSuite ? 32 : 31
            }m${this.thereWereFailuresInThisSuite}\u001b[${39}m`}`
          : "",
      );
    DEV &&
      console.log(
        !this.doNothing
          ? `${`\u001b[${90}m${`this.total:`}\u001b[${39}m`} ${`\u001b[${90}m${JSON.stringify(
              this.total,
              null,
              0,
            )}\u001b[${39}m`}`
          : "",
      );
  }

  getTotal(): Total {
    if (this.thereWereFailuresInThisSuite) {
      this.total.suitesFailed += 1;
      this.thereWereFailuresInThisSuite = false;
      DEV &&
        console.log(
          `305 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} this.total.suitesFailed = ${
            this.total.suitesFailed
          }; this.thereWereFailuresInThisSuite = ${
            this.thereWereFailuresInThisSuite
          }`,
        );
    } else if (this.total.suitesTotal) {
      this.total.suitesPassed += 1;
    }

    if (!this.total.suitesTotal && this.total.assertsTotal) {
      DEV &&
        console.log(
          `318 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${36}m${`SUITE TOTALS ARE ZERO, LET'S FIX THIS`}\u001b[${39}m`}`,
        );
      this.total.suitesTotal = 1;
      DEV &&
        console.log(
          `323 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = 1`,
        );
      if (this.thereWereFailuresInThisSuite) {
        this.total.suitesFailed = 1;
        DEV &&
          console.log(
            `329 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = 1`,
          );
      } else {
        this.total.suitesPassed = 1;
        DEV &&
          console.log(
            `335 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = 1`,
          );
      }
    }
    DEV &&
      console.log(
        `341 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}:\n${JSON.stringify(
          this.total,
          null,
          4,
        )}`,
      );
    return { ...this.total };
  }
}

export { stringPingLineByLine, Counter };
