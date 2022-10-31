import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test(`01 - throws`, () => {
  throws(() => {
    detectLang(true);
  }, /THROW_ID_01/gm);

  function fn() {
    return "zzz";
  }
  throws(() => {
    detectLang(fn);
  }, /THROW_ID_01/gm);

  throws(() => {
    detectLang({ a: "b" });
  }, /THROW_ID_01/gm);

  throws(() => {
    detectLang(null);
  }, /THROW_ID_01/gm);
});

test("02 - no templating tags at all", () => {
  equal(detectLang(``), { name: null }, "02.01");
  equal(detectLang(`abc`), { name: null }, "02.02");
  equal(detectLang(`<div>`), { name: null }, "02.03");
  equal(detectLang(`<div></div>`), { name: null }, "02.04");
});

test("03 - Nunjucks", () => {
  equal(
    detectLang(
      `<div>{% if something %}do this{% else %}do that{% endif %}</div>`
    ),
    { name: "Nunjucks" },
    "03.01"
  );
});

test("04 - Jinja - with Python namespaces", () => {
  equal(
    detectLang(`<div>{%- set ns1 = namespace(utility_providers=0) -%}</div>`),
    { name: "Jinja" },
    "04.01"
  );
});

test("05 - Jinja - with Python backwards declarations", () => {
  equal(
    detectLang(`<div>{{'oodles' if crambles else 'brambles'}}</div>`),
    { name: "Jinja" },
    "05.01"
  );
  equal(
    detectLang(`<div>{{"oodles" if crambles else "brambles"}}</div>`),
    { name: "Jinja" },
    "05.02"
  );
});

test("06 - JSP", () => {
  equal(
    detectLang(`<c:set var="someList" value="\${jspProp.someList}" />`),
    { name: "JSP" },
    "06.01"
  );
});

test.run();
