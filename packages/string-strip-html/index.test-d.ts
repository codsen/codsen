import { expectType, expectAssignable } from "tsd";
import stringStripHtml = require(".");

expectType<{ timeTakenInMilliseconds: number }>(stringStripHtml("<a>").log);
expectType<number>(stringStripHtml("<a>").log.timeTakenInMilliseconds);
expectType<string>(stringStripHtml("<a>").result);

expectType<readonly [number, number, (string | null)?][] | null>(
  stringStripHtml("abc").ranges
);
expectType<readonly [number, number, (string | null)?][] | null>(
  stringStripHtml("<div>zzz</div>").ranges
);
expectType<readonly [number, number, (string | null)?][] | null>(
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
