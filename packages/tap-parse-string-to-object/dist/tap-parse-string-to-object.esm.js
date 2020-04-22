/**
 * tap-parse-string-to-object
 * Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object
 * Version: 1.2.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/tap-parse-string-to-object
 */

import isStream from 'isstream';
import split2 from 'split2';
import through2 from 'through2';

function stringPingLineByLine(str, cb) {
  let start = null;
  for (let i = 0, len = str.length; i < len; i++) {
    if (["\n", "\r"].includes(str[i])) {
      if (start !== null) {
        cb(str.slice(start, i));
        start = null;
      }
    }
    else if (start === null) {
      start = i;
    }
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
      suitesFailed: 0,
    };
  }
  readLine(lineStr) {
    if (!this.doNothing && lineStr.trim() === "---") {
      this.doNothing = true;
    }
    if (this.doNothing && lineStr.trim() === "...") {
      this.doNothing = false;
    }
    else if (!this.doNothing && this.canCount) {
      if (
        lineStr.trim().startsWith("ok") ||
        lineStr.trim().startsWith("not ok")
      ) {
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
    }
    if (!this.doNothing && lineStr.trim() === "{") {
      this.total.suitesTotal += 1;
      if (this.thereWereFailuresInThisSuite !== null) {
        if (this.thereWereFailuresInThisSuite) {
          this.total.suitesFailed += 1;
        } else {
          this.total.suitesPassed += 1;
        }
      }
      this.thereWereFailuresInThisSuite = false;
    }
    const magicKeyw = "# Subtest";
    if (!this.doNothing && !this.canCount && lineStr.includes(magicKeyw)) {
      this.canCount = true;
      if (lineStr.slice(0, lineStr.indexOf(magicKeyw)).trim().endsWith("{")) {
        this.total.suitesTotal += 1;
        if (this.thereWereFailuresInThisSuite === null) {
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
    return { ...this.total };
  }
}

function externalApi(something) {
  if (isStream(something)) {
    return new Promise((resolve, reject) => {
      const counter = new Counter();
      something.pipe(split2()).pipe(
        through2.obj((line, encoding, next) => {
          counter.readLine(line);
          next();
        })
      );
      something.on("end", () => {
        return resolve(counter.getTotal());
      });
      something.on("error", reject);
    });
  }
  if (typeof something === "string") {
    if (!something.length) {
      return {
        ok: true,
        assertsTotal: 0,
        assertsPassed: 0,
        assertsFailed: 0,
        suitesTotal: 0,
        suitesPassed: 0,
        suitesFailed: 0,
      };
    }
    const counter = new Counter();
    stringPingLineByLine(something, (line) => {
      counter.readLine(line);
    });
    return counter.getTotal();
  }
  throw new Error(
    "tap-parse-string-to-object: [THROW_ID_01] inputs should be either string or stream"
  );
}

export default externalApi;
