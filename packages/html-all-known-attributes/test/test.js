const t = require("tap");
const { allHtmlAttribs } = require("../dist/html-all-known-attributes.cjs");

t.test(`1 - cjs - there are 702 attrib names`, (t) => {
  t.ok(allHtmlAttribs.has("href"));
  t.ok(allHtmlAttribs.size > 700);
  t.end();
});

// remember to update the readme too
