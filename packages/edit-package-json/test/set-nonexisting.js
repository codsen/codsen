import tap from "tap";
import { setter } from "./util/util";
// import { set, del } from "../dist/edit-package-json.esm";

// -----------------------------------------------------------------------------
// 03. set - key does not exist
// -----------------------------------------------------------------------------

tap.todo(`01 - mvp`, (t) => {
  const source = `{
  "a": "b",
  "x": "y"
}`;
  const result = `{
  "a": "b",
  "x": "y",
  "c": "e"
}`;
  setter(t, source, result, "c", "e", "03.01");
});
