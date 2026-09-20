import path from "node:path";

import ts from "typescript";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { firstPublishedAt } from "../../../data/sources/firstPublishedAt.ts";
import { packages } from "../../../data/sources/packages.ts";
import { createCodsenPackageLists } from "../codsenPackages.js";
import { readWorkspaceRecords } from "../workspaceInventoryFile.js";

const repositoryRoot = path.resolve(import.meta.dirname, "../../..");

test("01 - generated catalogue follows the shared policy while preserving historical names", () => {
  const lists = createCodsenPackageLists(
    readWorkspaceRecords(repositoryRoot)
      .filter(({ manifest }) => !manifest.private)
      .map(({ manifest }) => manifest.name),
  );
  equal(packages.all, lists.all, "01.01");
  equal(packages.current, lists.current, "01.02");
  equal(packages.historical, lists.historical, "01.03");
  equal(packages.deprecated, lists.deprecated, "01.04");
  equal(
    packages.packagesOutsideMonorepo,
    lists.packagesOutsideMonorepo,
    "01.05",
  );
  equal(packages.totalPackageCount, lists.all.length, "01.06");
  equal(packages.historicalPackageCount, lists.historical.length, "01.07");
  ok(packages.all.includes("bitsausage"), "01.08");
  ok(packages.historical.includes("bitsausage"), "01.09");
  ok(!packages.all.includes("@codsen/data"), "01.10");
  equal(packages.inMonorepo, lists.inMonorepo, "01.11");
  equal(packages.outsideMonorepo, lists.outsideMonorepo, "01.12");
  equal(packages.retired, lists.retired, "01.13");
  equal(packages.libraries, packages.programs, "01.14");
  equal(packages.browserScripts, packages.script, "01.15");
  equal(
    packages.categories.flagshipLibs,
    packages.splitListFlagshipLibs,
    "01.16",
  );
  equal(Object.values(packages.categories).flat().length, 94, "01.17");
});

test("02 - generated publication dates retain the complete historical key set", () => {
  equal(
    Object.keys(firstPublishedAt).sort(),
    [...packages.all].sort(),
    "02.01",
  );
  ok(Object.hasOwn(firstPublishedAt, "bitsausage"), "02.02");
  ok(Object.hasOwn(firstPublishedAt, "object-boolean-combinations"), "02.03");
  ok(!Object.hasOwn(firstPublishedAt, "@codsen/data"), "02.04");
});

test("03 - the generated Package type still accepts deprecated documentation names", () => {
  const filename = path.join(
    repositoryRoot,
    "package-catalogue-type-fixture.ts",
  );
  const contents = `import { packages, type Package } from "./data/sources/packages.ts";
import { firstPublishedAt } from "./data/sources/firstPublishedAt.ts";

const legacy: Package = "bitsausage";
const active: Package = "object-boolean-combinations";
const current: readonly Package[] = packages.all;
const historical: readonly Package[] = packages.historical;
const inMonorepo: readonly Package[] = packages.inMonorepo;
const outsideMonorepo: readonly Package[] = packages.outsideMonorepo;
const retired: readonly Package[] = packages.retired;
const npmDeprecated: readonly Package[] = packages.deprecated;
const libraries: readonly Package[] = packages.libraries;
const browserScripts: readonly Package[] = packages.browserScripts;
const flagshipLibs: readonly Package[] = packages.categories.flagshipLibs;
const dates: Record<Package, number | null> = firstPublishedAt;
const legacyPublication: number | null = dates[legacy];

// @ts-expect-error The auxiliary aggregate is outside the product catalogue.
const auxiliary: Package = "@codsen/data";
// @ts-expect-error An unknown string cannot enter the documented package union.
const unknownPackage: Package = "not-a-codsen-package-fixture";
`;
  const options = {
    allowImportingTsExtensions: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: false,
    strict: true,
    target: ts.ScriptTarget.ES2022,
    types: [],
  };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (sourceFilename, languageVersion, ...rest) =>
    sourceFilename === filename
      ? ts.createSourceFile(filename, contents, languageVersion, true)
      : getSourceFile(sourceFilename, languageVersion, ...rest);
  const program = ts.createProgram([filename], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  equal(
    diagnostics.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    ),
    [],
    "03.01",
  );
});

test.run();
