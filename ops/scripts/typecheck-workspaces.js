#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";
import { typecheckWorkspaces } from "../helpers/workspaceTypecheck.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

if (process.argv.length !== 2) {
  console.error("Usage: node ops/scripts/typecheck-workspaces.js");
  process.exitCode = 1;
} else {
  const packageKinds = readPackageKindResolver(repositoryRoot);
  const configFilenames = readWorkspaceRecords(repositoryRoot)
    .filter(({ manifest }) =>
      new Set([
        PACKAGE_KINDS.GENERATED_DATA,
        PACKAGE_KINDS.TYPESCRIPT_LIBRARY,
      ]).has(packageKinds.kindFor(manifest.name)),
    )
    .map(({ directory }) =>
      path.join(repositoryRoot, directory, "tsconfig.json"),
    );
  const startedAt = performance.now();
  const result = typecheckWorkspaces(configFilenames);
  if (result.diagnostics.length > 0) {
    console.error(
      ts.formatDiagnostics(result.diagnostics, {
        getCanonicalFileName: (filename) => filename,
        getCurrentDirectory: () => repositoryRoot,
        getNewLine: () => "\n",
      }),
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Type-checked ${result.configCount} workspace configs in ${result.groupCount} shared compiler program${result.groupCount === 1 ? "" : "s"} (${Math.round(performance.now() - startedAt)}ms).`,
    );
  }
}
