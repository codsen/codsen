import tap from "tap";
import detect from "../dist/detect-templating-language.esm";

tap.test(`01 - throws`, (t) => {
  t.throws(() => {
    detect(true);
  }, /THROW_ID_01/gm);

  function fn() {
    return "zzz";
  }
  t.throws(() => {
    detect(fn);
  }, /THROW_ID_01/gm);

  t.throws(() => {
    detect({ a: "b" });
  }, /THROW_ID_01/gm);

  t.throws(() => {
    detect(null);
  }, /THROW_ID_01/gm);

  t.end();
});

tap.test("02 - no templating tags at all", (t) => {
  t.match(detect(``), { name: null }, "02.01");
  t.match(detect(`abc`), { name: null }, "02.02");
  t.match(detect(`<div>`), { name: null }, "02.03");
  t.match(detect(`<div></div>`), { name: null }, "02.04");
  t.end();
});

tap.test("03 - Nunjucks", (t) => {
  t.match(
    detect(`<div>{% if something %}do this{% else %}do that{% endif %}</div>`),
    { name: "Nunjucks" },
    "03"
  );
  t.end();
});

tap.test("04 - JSP", (t) => {
  t.match(
    detect(`<c:set var="someList" value="\${jspProp.someList}" />`),
    { name: "JSP" },
    "04"
  );
  t.end();
});
