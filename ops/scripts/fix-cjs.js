import writeFileAtomic from "write-file-atomic";
import fs from "fs";
import path from "path";
import { removeTbc } from "../lect/plugins/_util.js";

const pkgName = path.resolve(".").split("/").pop();

const cjsBuild = fs.readFileSync(
  path.resolve(`dist/${removeTbc(pkgName)}.cjs.js`),
  "utf8",
);

const MAIN_EXPORTS = `module.exports = __toCommonJS(main_exports);`;

if (!cjsBuild.includes(MAIN_EXPORTS)) {
  throw new Error(
    `ops/scripts/fix-cjs.js: Can't patch the CJS build! module.exports is missing!`,
  );
}

const res =
  cjsBuild
    .split(/(\r?\n)/)
    .filter((row) => row.trim() && !row.includes(MAIN_EXPORTS))
    .join("\n")
    .trim() + "\n\nmodule.exports = main_default;\n";

writeFileAtomic(`dist/${removeTbc(pkgName)}.cjs.js`, res);
