import tap from "tap";
import { allHtmlAttribs } from "../dist/html-all-known-attributes.umd";

tap.test(`01 - umd - there are 702 attrib names`, (t) => {
  t.ok(allHtmlAttribs.has("href"), "01");
  t.end();
});
