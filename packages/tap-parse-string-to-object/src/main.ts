/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import isStream from "isstream";
import split2 from "split2";
import through2 from "through2";

import { stringPingLineByLine, Counter } from "./util";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Res {
  ok: boolean;
  assertsTotal: number;
  assertsPassed: number;
  assertsFailed: number;
  suitesTotal: number;
  suitesPassed: number;
  suitesFailed: number;
}

export interface StreamInterface extends NodeJS.ReadWriteStream {
  read(size?: number): any;
}

function parseTap(something: string | StreamInterface): Res | Promise<Res> {
  DEV && console.log(`029 parseTap called!`);
  if (isStream(something)) {
    DEV && console.log(`stream was given`);
    return new Promise((resolve, reject) => {
      let counter = new Counter();

      (something as StreamInterface).pipe(split2()).pipe(
        through2.obj((line, _encoding, next) => {
          // DEV && console.log(
          //   `${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
          //     line,
          //     null,
          //     4
          //   )}`
          // );
          counter.readLine(line as string);
          next();
        }),
      );

      (something as StreamInterface).on("end", () => {
        resolve(counter.getTotal());
      });

      (something as StreamInterface).on("error", reject);
    });
  } else if (typeof something === "string") {
    DEV && console.log(`not a stream but string was given`);
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
    // in which case, synchronously traverse the string and slice and ping line by
    // line

    let counter = new Counter();
    stringPingLineByLine(something, (line) => {
      counter.readLine(line);
    });

    return counter.getTotal();
  }
  throw new Error(
    "tap-parse-string-to-object: [THROW_ID_01] inputs should be either string or stream",
  );
}

export { parseTap, version };
