import tap from "tap";
import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm";

tap.test(`01 - cjs - there are 702 attrib names`, (t) => {
  t.ok(allHtmlAttribs.has("href"), "01.01");
  t.ok(allHtmlAttribs.size > 700, "01.02");
  t.end();
});

// remember to update the readme too
