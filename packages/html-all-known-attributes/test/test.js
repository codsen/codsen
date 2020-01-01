const t = require("tap");
const { allHtmlAttribs } = require("../dist/html-all-known-attributes.cjs");

t.test(`1 - cjs - there are 701 attrib names`, t => {
  t.ok(allHtmlAttribs.length === 701);
  t.end();
});

// remember to update the readme too
