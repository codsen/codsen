import path from "node:path";
import {
  deleteGeneratedFile,
  readIfPresent,
  writeGeneratedFile,
} from "../../helpers/generatedFiles.js";
import { formatGeneratedContents } from "../../helpers/generatedFormatting.js";
import { PACKAGE_KINDS } from "../../helpers/packageKinds.js";

const STANDARD_INCLUDES = [
  "src/**/*",
  "src/**/*.json",
  "package.json",
  "../../ops/typedefs/common.ts",
];
const RETIRED_STANDARD_INCLUDES = new Set(["../../ops/typedefs/common.d.ts"]);

// writes TS configs
async function tsconfig({ mode, state }) {
  const filename = path.join(state.root, "tsconfig.json");
  // Preserve the established policy: non-library workspaces do not keep this
  // generated file.
  if (state.packageKind !== PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
    const deleted = await deleteGeneratedFile({
      filename,
      fixCommand: "npm run lect",
      mode,
    });
    if (deleted) {
      console.log(
        `lect tsconfig.json ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`,
      );
    }
    return null;
  }

  // read the old config and preserve custom include entries
  let oldIncludes;
  const source = await readIfPresent(filename);
  if (source !== undefined) {
    const contents = JSON.parse(source);
    oldIncludes = contents.include;
    // console.log(
    //   `${`\u001b[${33}m${`oldIncludes`}\u001b[${39}m`} = ${JSON.stringify(
    //     oldIncludes,
    //     null,
    //     4
    //   )}`
    // );
  }
  if (!Array.isArray(oldIncludes)) {
    oldIncludes = [];
  }
  const preservedIncludes = oldIncludes.filter(
    (include) => !RETIRED_STANDARD_INCLUDES.has(include),
  );

  const newTsConfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      outDir: "dist",
    },
    include: [...new Set([...STANDARD_INCLUDES, ...preservedIncludes])],
    exclude: [".git", "node_modules"],
  };
  try {
    await writeGeneratedFile({
      contents: formatGeneratedContents({
        contents: `${JSON.stringify(newTsConfig, null, 2)}\n`,
        filename,
        repositoryRoot: state.repositoryRoot,
      }),
      filename,
      fixCommand: "npm run lect",
      mode,
    });
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfigs - ${err}`);
    return Promise.reject(err);
  }
}

export default tsconfig;
