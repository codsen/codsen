import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

test("01 - retains selectors used in the body", () => {
  let actual = comb(
    '<style>.a{a:1}.b{b:2}</style><body><p class="a b">x</p></body>',
  );

  equal(
    actual.result,
    '<style>.a{a:1}.b{b:2}</style><body><p class="a b">x</p></body>',
    "01.01",
  );
  equal(actual.deletedFromHead, [], "01.02");
});

test("02 - removes selectors absent from the body", () => {
  let actual = comb("<style>.a{a:1}.b{b:2}</style><body><p>x</p></body>");

  equal(actual.result, "<body><p>x</p></body>", "02.01");
  equal(actual.deletedFromHead, [".a", ".b"], "02.02");
});

test("03 - partitions alternating used and unused selectors", () => {
  let actual = comb(
    '<style>.a{a:1}.b{b:2}.c{c:3}.d{d:4}</style><body><p class="a c">x</p></body>',
  );

  equal(
    actual.result,
    '<style>.a{a:1}.c{c:3}</style><body><p class="a c">x</p></body>',
    "03.01",
  );
  equal(actual.deletedFromHead, [".b", ".d"], "03.02");
});

test("04 - preserves joined-selector semantics", () => {
  let actual = comb(
    '<style>.used.unused{a:1}.used{b:2}</style><body><p class="used">x</p></body>',
  );

  equal(
    actual.result,
    '<style>.used{b:2}</style><body><p class="used">x</p></body>',
    "04.01",
  );
  equal(actual.deletedFromHead, [".unused"], "04.02");
});

test("05 - preserves whitelisted selectors while partitioning", () => {
  let actual = comb(
    '<style>.used,.kept,.gone{a:1}</style><body><p class="used">x</p></body>',
    { whitelist: [".kept"] },
  );

  equal(
    actual.result,
    '<style>.used,.kept{a:1}</style><body><p class="used">x</p></body>',
    "05.01",
  );
  equal(actual.deletedFromHead, [".gone"], "05.02");
});

test.run();
