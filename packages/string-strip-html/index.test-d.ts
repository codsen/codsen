import { expectType, expectAssignable } from "tsd";
import stringStripHtml = require(".");

// output plain object
expectAssignable<object>(stringStripHtml(""));
expectAssignable<object>(stringStripHtml("aaa"));
expectAssignable<object>(stringStripHtml("a <div> b"));

// each key in the output
expectAssignable<object>(stringStripHtml("<a>").log);
expectType<number>(stringStripHtml("<a>").log.timeTakenInMilliseconds);
expectType<string>(stringStripHtml("<a>").result);
expectAssignable<object | null>(stringStripHtml("abc").ranges);

expectType<readonly [number, number, string?][] | null>(
  stringStripHtml("abc").ranges
);
expectType<readonly [number, number, string?][] | null>(
  stringStripHtml("<div>zzz</div>").ranges
);
expectType<readonly [number, number, string?][] | null>(
  stringStripHtml("aaa <bold><span>zzz</span></bold>bbb").ranges
);

expectType<readonly [number, number][]>(stringStripHtml("abc").allTagLocations);
expectType<readonly [number, number][]>(
  stringStripHtml("<div>zzz</div>").allTagLocations
);

expectType<readonly [number, number][]>(
  stringStripHtml("abc").filteredTagLocations
);
expectType<readonly [number, number][]>(
  stringStripHtml("<div>zzz</div>").filteredTagLocations
);

console.log(stringStripHtml("abc"));
