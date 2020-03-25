// pings each line to the callback cb()
function stringPingLineByLine(str, cb) {
  // console.log(
  //   `004 ${`\u001b[${33}m${`█`}\u001b[${39}m`} stringPingLineByLine() called!`
  // );
  let start = null;

  for (let i = 0, len = str.length; i < len; i++) {
    if (["\n", "\r"].includes(str[i])) {
      if (start !== null) {
        console.log(
          `012 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`PING`}\u001b[${39}m`} "${`\u001b[${36}m${str.slice(
            start,
            i
          )}\u001b[${39}m`}"`
        );
        cb(str.slice(start, i));
        start = null;
        // console.log(
        //   `020 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = null`
        // );
      }
    } else {
      // not a linebreak character
      if (start === null) {
        start = i;
        // console.log(
        //   `028 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = ${start}`
        // );
      }
    }

    // if an end is reached, ping the remainder
    if (start !== null && !str[i + 1]) {
      cb(str.slice(start, i + 1));
      console.log(
        `037 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`PING`}\u001b[${39}m`} "${str.slice(
          start,
          i + 1
        )}"`
      );
    }
  }
}

class Counter {
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

  readLine(lineStr) {
    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`======================================== readLine() start`}\u001b[${39}m`}`
        : ""
    );
    // catch the --- to ...
    if (!this.doNothing && lineStr.trim() === "---") {
      this.doNothing = true;
      // this.canCount = false;
      console.log(
        `073 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.doNothing = ${
          this.doNothing
        }; this.canCount = ${this.canCount}`
      );
    }
    if (this.doNothing && lineStr.trim() === "...") {
      this.doNothing = false;
      console.log(
        `081 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.doNothing = ${
          this.doNothing
        }`
      );
    } else {
      // catch the assertion result lines
      if (!this.doNothing && this.canCount) {
        if (
          lineStr.trim().startsWith("ok") ||
          lineStr.trim().startsWith("not ok")
        ) {
          if (lineStr.trim().startsWith("ok")) {
            this.total.assertsPassed = this.total.assertsPassed + 1;
            console.log(
              `095 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsPassed`}\u001b[${39}m`} = ${
                this.total.assertsPassed
              }`
            );
          } else if (lineStr.trim().startsWith("not ok")) {
            this.total.assertsFailed = this.total.assertsFailed + 1;
            console.log(
              `102 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsFailed`}\u001b[${39}m`} = ${
                this.total.assertsFailed
              }`
            );
            if (!this.thereWereFailuresInThisSuite) {
              this.thereWereFailuresInThisSuite = true;
              console.log(
                `109 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${31}m${`this.thereWereFailuresInThisSuite`}\u001b[${39}m`} = ${
                  this.thereWereFailuresInThisSuite
                }`
              );
            }
          }

          this.total.assertsTotal = this.total.assertsTotal + 1;
          console.log(
            `118 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${33}m${`this.total.assertsTotal`}\u001b[${39}m`} = ${
              this.total.assertsTotal
            }`
          );
        } else {
          this.canCount = false;
          console.log(
            `125 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} ${`\u001b[${31}m${`this.canCount`}\u001b[${39}m`} = ${
              this.canCount
            }`
          );
        }
      }
    }

    // if { is on a separate line, bump the suite count and reset the this.thereWereFailuresInThisSuite
    if (!this.doNothing && lineStr.trim() === "{") {
      console.log(
        `136 ${`\u001b[${35}m${`█`}\u001b[${39}m`} NEW SUITE'S OPENING CURLIE CAUGHT`
      );
      this.total.suitesTotal = this.total.suitesTotal + 1;

      if (this.thereWereFailuresInThisSuite !== null) {
        // second suite onwards already has a gathered result
        if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed = this.total.suitesFailed + 1;
          console.log(
            `145 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = ${
              this.total.suitesFailed
            }`
          );
        } else {
          this.total.suitesPassed = this.total.suitesPassed + 1;
          console.log(
            `152 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = ${
              this.total.suitesPassed
            }`
          );
        }
      }

      // reset:
      this.thereWereFailuresInThisSuite = false;

      console.log(
        `163 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = ${
          this.total.suitesTotal
        }; this.thereWereFailuresInThisSuite = false`
      );
    }

    // "# Subtest" opens the gates
    const magicKeyw = "# Subtest";
    if (!this.doNothing && !this.canCount && lineStr.includes(magicKeyw)) {
      this.canCount = true;
      console.log(
        `174 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.canCount = ${
          this.canCount
        }`
      );

      // if suite's opening curlie is on the same line, for example:
      //
      // ok 1 - test/test.js # time=22.582ms { # Subtest: ...
      //
      // then bump the suite count
      if (lineStr.slice(0, lineStr.indexOf(magicKeyw)).trim().endsWith("{")) {
        this.total.suitesTotal = this.total.suitesTotal + 1;
        console.log(
          `187 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = ${
            this.total.suitesTotal
          }`
        );

        // we must skip the first opening curlies and count suite passing
        // for all others
        if (this.thereWereFailuresInThisSuite === null) {
          // if it's first suite's opening curlie
          this.thereWereFailuresInThisSuite = false;
          console.log(
            `198 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.thereWereFailuresInThisSuite = ${
              this.thereWereFailuresInThisSuite
            }`
          );
        } else if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed = this.total.suitesFailed + 1;
          this.thereWereFailuresInThisSuite = false;
          console.log(
            `206 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = ${
              this.total.suitesFailed
            }; this.thereWereFailuresInThisSuite = ${
              this.thereWereFailuresInThisSuite
            }`
          );
        } else {
          this.total.suitesPassed = this.total.suitesPassed + 1;
          console.log(
            `215 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = ${
              this.total.suitesPassed
            }`
          );
        }
      }
    }

    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`---------------------------------------- readLine() end`}\u001b[${39}m`}`
        : ""
    );
    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`this.canCount:`}\u001b[${39}m`} ${`\u001b[${
            this.canCount ? 32 : 31
          }m${this.canCount}\u001b[${39}m`}`
        : ""
    );
    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`this.doNothing:`}\u001b[${39}m`} ${`\u001b[${
            this.doNothing ? 32 : 31
          }m${this.doNothing}\u001b[${39}m`}`
        : ""
    );
    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`this.thereWereFailuresInThisSuite:`}\u001b[${39}m`} ${`\u001b[${
            this.thereWereFailuresInThisSuite ? 32 : 31
          }m${this.thereWereFailuresInThisSuite}\u001b[${39}m`}`
        : ""
    );
    console.log(
      !this.doNothing
        ? `${`\u001b[${90}m${`this.total:`}\u001b[${39}m`} ${`\u001b[${90}m${JSON.stringify(
            this.total,
            null,
            0
          )}\u001b[${39}m`}`
        : ""
    );
  }

  getTotal() {
    if (this.thereWereFailuresInThisSuite) {
      this.total.suitesFailed = this.total.suitesFailed + 1;
      this.thereWereFailuresInThisSuite = false;
      console.log(
        `265 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} this.total.suitesFailed = ${
          this.total.suitesFailed
        }; this.thereWereFailuresInThisSuite = ${
          this.thereWereFailuresInThisSuite
        }`
      );
    } else if (this.total.suitesTotal) {
      this.total.suitesPassed = this.total.suitesPassed + 1;
    }

    if (!this.total.suitesTotal && this.total.assertsTotal) {
      console.log(
        `277 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${36}m${`SUITE TOTALS ARE ZERO, LET'S FIX THIS`}\u001b[${39}m`}`
      );
      this.total.suitesTotal = 1;
      console.log(
        `281 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesTotal = 1`
      );
      if (this.thereWereFailuresInThisSuite) {
        this.total.suitesFailed = 1;
        console.log(
          `286 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesFailed = 1`
        );
      } else {
        this.total.suitesPassed = 1;
        console.log(
          `291 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} this.total.suitesPassed = 1`
        );
      }
    }
    console.log(
      `296 ${`\u001b[${35}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}:\n${JSON.stringify(
        this.total,
        null,
        4
      )}`
    );
    return Object.assign({}, this.total);
  }
}

export { stringPingLineByLine, Counter };
