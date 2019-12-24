const t = require("tap");
const { allHtmlAttribs } = require("../dist/html-all-known-attributes.cjs");

t.test(`1 - cjs - there are 699 attrib names`, t => {
  t.ok(allHtmlAttribs.length === 699);
  t.end();
});
