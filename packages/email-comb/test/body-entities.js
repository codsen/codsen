import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

test("01 - matches decimal and hexadecimal attribute references", () => {
  const source =
    '<style>.used{color:red}#target{display:block}</style><body><div class="us&#101;d" id="tar&#x67;et">x</div></body>';
  const actual = comb(source);

  equal(actual.result, source, "01.01");
  equal(actual.allInHead, [".used", "#target"], "01.02");
  equal(actual.allInBody, [".used", "#target"], "01.03");
});

test("02 - matches named references with escaped CSS selectors", () => {
  const source = String.raw`<style>.caf\e9{color:red}</style><body><div class="caf&eacute;">x</div></body>`;
  const actual = comb(source);

  equal(actual.result, source, "02.01");
  equal(actual.allInHead, [".café"], "02.02");
  equal(actual.allInBody, [".café"], "02.03");
});

test("03 - uses canonical identities for whitelists and reports", () => {
  const whitelisted = comb(
    '<body><div class="us&#101;d">x</div></body>',
    { whitelist: [".used"] },
  );
  const deleted = comb(
    '<body><div class="gh&#111;st">x</div></body>',
  );

  equal(
    whitelisted.result,
    '<body><div class="us&#101;d">x</div></body>',
    "03.01",
  );
  equal(whitelisted.allInBody, [".used"], "03.02");
  equal(deleted.result, "<body><div>x</div></body>", "03.03");
  equal(deleted.deletedFromBody, [".ghost"], "03.04");
});

test("04 - preserves encoded ids referenced by for attributes", () => {
  const source =
    '<style>#used{color:red}</style><body><label for="u&#115;ed">x</label><input id="u&#115;ed"></body>';
  const actual = comb(source, { uglify: true });

  equal(actual.result, source, "04.01");
  equal(actual.allInBody, ["#used"], "04.02");
  equal(actual.log.uglified, [], "04.03");
});

test("05 - uglifies canonical selectors at original source ranges", () => {
  const actual = comb(
    '<style>.used{color:red}</style><body><div class="us&#101;d">x</div></body>',
    { uglify: true },
  );

  equal(
    actual.result,
    '<style>.l{color:red}</style><body><div class="l">x</div></body>',
    "05.01",
  );
  equal(actual.log.uglified, [[".used", ".l"]], "05.02");
});

test.run();
