/**
 * tap-parse-string-to-object
 * Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object
 * Version: 2.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/tap-parse-string-to-object/
 */

import isStream from 'isstream';
import split2 from 'split2';
import through2 from 'through2';

// pings each line to the callback cb()
function stringPingLineByLine(str, cb) {
  // console.log(
  //   `004 ${`\u001b[${33}m${`█`}\u001b[${39}m`} stringPingLineByLine() called!`
  // );
  let start = null;

  for (let i = 0, len = str.length; i < len; i++) {
    if (["\n", "\r"].includes(str[i])) {
      if (start !== null) {
        cb(str.slice(start, i));
        start = null; // console.log(
        //   `020 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = null`
        // );
      }
    } // not a linebreak character
    else if (start === null) {
        start = i; // console.log(
        //   `028 ${`\u001b[${33}m${`█`}\u001b[${39}m`} ${`\u001b[${32}m${`SET `}\u001b[${39}m`} start = ${start}`
        // );
      } // if an end is reached, ping the remainder


    if (start !== null && !str[i + 1]) {
      cb(str.slice(start, i + 1));
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
      suitesFailed: 0
    };
  }

  readLine(lineStr) { // catch the --- to ...

    if (!this.doNothing && lineStr.trim() === "---") {
      this.doNothing = true; // this.canCount = false;
    }

    if (this.doNothing && lineStr.trim() === "...") {
      this.doNothing = false;
    } // catch the assertion result lines
    else if (!this.doNothing && this.canCount) {
        if (lineStr.trim().startsWith("ok") || lineStr.trim().startsWith("not ok")) {
          if (lineStr.trim().startsWith("ok")) {
            this.total.assertsPassed += 1;
          } else if (lineStr.trim().startsWith("not ok")) {
            this.total.assertsFailed += 1;

            if (!this.thereWereFailuresInThisSuite) {
              this.thereWereFailuresInThisSuite = true;
            }
          }

          this.total.assertsTotal += 1;
        } else {
          this.canCount = false;
        }
      } // if { is on a separate line, bump the suite count and reset the this.thereWereFailuresInThisSuite


    if (!this.doNothing && lineStr.trim() === "{") {
      this.total.suitesTotal += 1;

      if (this.thereWereFailuresInThisSuite !== null) {
        // second suite onwards already has a gathered result
        if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed += 1;
        } else {
          this.total.suitesPassed += 1;
        }
      } // reset:


      this.thereWereFailuresInThisSuite = false;
    } // "# Subtest" opens the gates


    const magicKeyw = "# Subtest";

    if (!this.doNothing && !this.canCount && lineStr.includes(magicKeyw)) {
      this.canCount = true; // if suite's opening curlie is on the same line, for example:
      //
      // ok 1 - test/test.js # time=22.582ms { # Subtest: ...
      //
      // then bump the suite count

      if (lineStr.slice(0, lineStr.indexOf(magicKeyw)).trim().endsWith("{")) {
        this.total.suitesTotal += 1; // we must skip the first opening curlies and count suite passing
        // for all others

        if (this.thereWereFailuresInThisSuite === null) {
          // if it's first suite's opening curlie
          this.thereWereFailuresInThisSuite = false;
        } else if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed += 1;
          this.thereWereFailuresInThisSuite = false;
        } else {
          this.total.suitesPassed += 1;
        }
      }
    }
  }

  getTotal() {
    if (this.thereWereFailuresInThisSuite) {
      this.total.suitesFailed += 1;
      this.thereWereFailuresInThisSuite = false;
    } else if (this.total.suitesTotal) {
      this.total.suitesPassed += 1;
    }

    if (!this.total.suitesTotal && this.total.assertsTotal) {
      this.total.suitesTotal = 1;

      if (this.thereWereFailuresInThisSuite) {
        this.total.suitesFailed = 1;
      } else {
        this.total.suitesPassed = 1;
      }
    }
    return { ...this.total
    };
  }

}

var version = "2.0.2";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version$1 = version;

function parseTap(something) {

  if (isStream(something)) {
    return new Promise((resolve, reject) => {
      const counter = new Counter();
      something.pipe(split2()).pipe(through2.obj((line, _encoding, next) => {
        // console.log(
        //   `${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
        //     line,
        //     null,
        //     4
        //   )}`
        // );
        counter.readLine(line);
        next();
      }));
      something.on("end", () => {
        return resolve(counter.getTotal());
      });
      something.on("error", reject);
    });
  } else if (typeof something === "string") {

    if (!something.length) {
      return {
        ok: true,
        assertsTotal: 0,
        assertsPassed: 0,
        assertsFailed: 0,
        suitesTotal: 0,
        suitesPassed: 0,
        suitesFailed: 0
      };
    } // in which case, synchronously traverse the string and slice and ping line by
    // line


    const counter = new Counter();
    stringPingLineByLine(something, line => {
      counter.readLine(line);
    });
    return counter.getTotal();
  }

  throw new Error("tap-parse-string-to-object: [THROW_ID_01] inputs should be either string or stream");
}

export { parseTap, version$1 as version };
