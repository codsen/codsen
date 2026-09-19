import { readFileSync } from "node:fs";

import { declarationEntries } from "../../ops/helpers/declarationEntries.js";

export default () =>
  declarationEntries(
    JSON.parse(
      readFileSync(new URL("./package.json", import.meta.url), "utf8"),
    ),
  );
