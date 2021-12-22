import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { setter } from "./util/util.js";
// import { set, del } from "../dist/edit-package-json.esm.js";

// -----------------------------------------------------------------------------
// 03. set - key does not exist
// -----------------------------------------------------------------------------

test.skip(`01 - mvp`, () => {
  let source = `{
  "a": "b",
  "x": "y"
}`;
  let result = `{
  "a": "b",
  "x": "y",
  "c": "e"
}`;
  setter(equal, source, result, "c", "e", "03.01");
});

test.run();
