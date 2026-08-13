import { promises as fs } from "node:fs";
import path from "node:path";
import writeFileAtomic from "write-file-atomic";
import { PACKAGE_KINDS } from "../../helpers/packageKinds.js";

// writes TS configs
async function tsconfig({ state }) {
  const filename = path.join(state.root, "tsconfig.json");
  // Preserve the established policy: non-library workspaces do not keep this
  // generated file.
  if (state.packageKind !== PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
    try {
      await fs.unlink(filename);
      console.log(
        `lect tsconfig.json ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`,
      );
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    return null;
  }

  // read the old config and preserve custom include entries
  let oldIncludes;
  try {
    const contents = JSON.parse(await fs.readFile(filename, "utf8"));
    oldIncludes = contents.include;
    // console.log(
    //   `${`\u001b[${33}m${`oldIncludes`}\u001b[${39}m`} = ${JSON.stringify(
    //     oldIncludes,
    //     null,
    //     4
    //   )}`
    // );
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  if (!Array.isArray(oldIncludes)) {
    oldIncludes = [];
  }

  const newTsConfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      outDir: "dist",
    },
    include: [
      ...new Set([
        "src/**/*",
        "src/**/*.json",
        "package.json",
        "../../ops/typedefs/common.d.ts",
        ...oldIncludes,
      ]),
    ],
    exclude: [".git", "node_modules"],
  };
  try {
    await writeFileAtomic(
      filename,
      `${JSON.stringify(newTsConfig, null, 2)}\n`,
    );
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfigs - ${err}`);
    return Promise.reject(err);
  }
}

export default tsconfig;
