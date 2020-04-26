import tap from "tap";
import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm";

tap.test(`1 - cjs - there are 702 attrib names`, (t) => {
  t.ok(allHtmlAttribs.has("href"));
  t.ok(allHtmlAttribs.size > 700);
  t.end();
});

// remember to update the readme too
