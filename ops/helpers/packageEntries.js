// A flat exports object describes the root entry. A subpath map retains that
// entry under "." and maps each additional ./name to src/name.ts.
function rootExport(manifest) {
  return manifest.exports?.["."] ?? manifest.exports;
}

function libraryEntries(manifest) {
  const exportsMap = manifest.exports;
  const entries =
    exportsMap &&
    typeof exportsMap === "object" &&
    Object.keys(exportsMap).some((key) => key.startsWith("."))
      ? Object.entries(exportsMap)
      : [[".", exportsMap]];

  if (!entries.some(([subpath]) => subpath === ".")) {
    throw new Error(`${manifest.name}: library exports require a root entry`);
  }
  const outputPaths = new Set();
  return entries.map(([subpath, targets]) => {
    if (subpath !== "." && !/^\.\/[a-z][a-z0-9-]*$/u.test(subpath)) {
      throw new Error(
        `${manifest.name}: unsupported library subpath ${subpath}`,
      );
    }
    const conditions =
      typeof targets === "string" ? { default: targets } : targets;
    if (
      !conditions ||
      typeof conditions !== "object" ||
      Array.isArray(conditions)
    ) {
      throw new Error(
        `${manifest.name}: invalid library exports for ${subpath}`,
      );
    }
    for (const condition of ["default", "script", "types"]) {
      const target = conditions[condition];
      const directory = condition === "types" ? "types" : "dist";
      if (
        target !== undefined &&
        (typeof target !== "string" ||
          !new RegExp(`^\\./${directory}/[a-zA-Z0-9_.-]+$`, "u").test(target))
      ) {
        throw new Error(
          `${manifest.name}: ${subpath} ${condition} must name a file in ${directory}/`,
        );
      }
      if (target !== undefined) {
        if (outputPaths.has(target)) {
          throw new Error(
            `${manifest.name}: duplicate library output ${target}`,
          );
        }
        outputPaths.add(target);
      }
    }
    if (subpath !== "." && conditions.script) {
      throw new Error(
        `${manifest.name}: subpath browser scripts need an explicit browser contract`,
      );
    }
    return {
      subpath,
      source: subpath === "." ? "src/main.ts" : `src/${subpath.slice(2)}.ts`,
      default: conditions.default,
      script: conditions.script,
      types: conditions.types,
    };
  });
}

export { libraryEntries, rootExport };
