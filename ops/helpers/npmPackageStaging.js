import { createHash } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import path from "node:path";
import {
  entrypointTargets,
  forbiddenPackedPath,
  localSpecifiers,
  packageTarget,
  wildcardRegExp,
} from "./npmPackagePayload.js";
import { safeRepositoryPath } from "./npmReleasePlan.js";

const DOC_FILES = ["CHANGELOG.md", "LICENSE", "README.md"];

function fail(message) {
  throw new Error(message);
}

function walkFiles(directory, relative = "") {
  const files = [];
  for (const entry of readdirSync(path.join(directory, relative), {
    withFileTypes: true,
  })) {
    const child = relative ? `${relative}/${entry.name}` : entry.name;
    if (forbiddenPackedPath(child)) {
      continue;
    }
    if (entry.isSymbolicLink()) {
      fail(`Package payload cannot contain a symbolic link: ${child}`);
    }
    if (entry.isDirectory()) {
      files.push(...walkFiles(directory, child));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files;
}

function resolveLocalSpecifier(packageDirectory, fromRelative, specifier) {
  const clean = specifier.split(/[?#]/, 1)[0];
  if (!clean.startsWith(".")) {
    return null;
  }
  const fromDirectory = path.posix.dirname(fromRelative);
  const candidate = path.posix.normalize(path.posix.join(fromDirectory, clean));
  packageTarget(candidate, `local import in ${fromRelative}`);
  const attempts = [
    candidate,
    `${candidate}.js`,
    `${candidate}.mjs`,
    `${candidate}.cjs`,
    `${candidate}.json`,
    `${candidate}.d.ts`,
    `${candidate}/index.js`,
    `${candidate}/index.mjs`,
    `${candidate}/index.cjs`,
    `${candidate}/index.json`,
    `${candidate}/index.d.ts`,
  ];
  let resolved = null;
  for (const attempt of attempts) {
    const absolute = path.join(packageDirectory, ...attempt.split("/"));
    if (existsSync(absolute) && statSync(absolute).isFile()) {
      resolved = attempt;
      break;
    }
  }
  const results = new Set(resolved ? [resolved] : []);
  if (fromRelative.endsWith(".d.ts")) {
    const declarationCandidates = [
      clean.replace(/\.(?:mjs|cjs|js)$/, ".d.ts"),
      `${clean}.d.ts`,
    ];
    if (clean.endsWith(".mjs")) {
      declarationCandidates.push(clean.replace(/\.mjs$/, ".d.mts"));
    } else if (clean.endsWith(".cjs")) {
      declarationCandidates.push(clean.replace(/\.cjs$/, ".d.cts"));
    }
    for (const declaration of declarationCandidates) {
      const relative = path.posix.normalize(
        path.posix.join(fromDirectory, declaration),
      );
      packageTarget(relative, `type import in ${fromRelative}`);
      const absolute = path.join(packageDirectory, ...relative.split("/"));
      if (existsSync(absolute) && statSync(absolute).isFile()) {
        results.add(relative);
      }
    }
  }
  if (results.size === 0) {
    fail(`${fromRelative} imports missing local file ${specifier}`);
  }
  return [...results];
}

function payloadFiles(packageDirectory, targets) {
  const allFiles = targets.some((target) => target.includes("*"))
    ? walkFiles(packageDirectory)
    : [];
  const queue = [];
  for (const target of targets) {
    if (target.includes("*")) {
      const matches = allFiles.filter((file) =>
        wildcardRegExp(target).test(file),
      );
      if (matches.length === 0) {
        fail(`Package target pattern ${target} matched no files`);
      }
      queue.push(...matches);
    } else {
      const absolute = path.join(packageDirectory, ...target.split("/"));
      if (!existsSync(absolute) || !statSync(absolute).isFile()) {
        fail(`Package entrypoint does not exist: ${target}`);
      }
      queue.push(target);
    }
  }

  const files = new Set();
  while (queue.length > 0) {
    const relative = queue.shift();
    if (files.has(relative)) {
      continue;
    }
    if (forbiddenPackedPath(relative)) {
      fail(`Entrypoint closure reaches forbidden package path: ${relative}`);
    }
    files.add(relative);
    if (/\.(?:[cm]?js|ts|tsx|jsx)$/.test(relative)) {
      const source = readFileSync(
        path.join(packageDirectory, ...relative.split("/")),
        "utf8",
      );
      for (const specifier of localSpecifiers(source)) {
        const dependencies = resolveLocalSpecifier(
          packageDirectory,
          relative,
          specifier,
        );
        for (const dependency of dependencies) {
          queue.push(dependency);
        }
      }
    }
  }
  return [...files].sort();
}

function copyPayloadFile(sourceDirectory, stagingDirectory, relative) {
  const source = path.join(sourceDirectory, ...relative.split("/"));
  const destination = path.join(stagingDirectory, ...relative.split("/"));
  const sourceStat = lstatSync(source);
  if (!sourceStat.isFile()) {
    fail(`Package payload must be a regular file: ${relative}`);
  }
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  chmodSync(destination, sourceStat.mode & 0o777);
}

function createStagingPackage(item, manifest, temporaryRoot, repositoryRoot) {
  const sourceDirectory = safeRepositoryPath(
    item.directory,
    `${item.name} directory`,
    repositoryRoot,
  );
  const nameHash = createHash("sha256")
    .update(item.name)
    .digest("hex")
    .slice(0, 12);
  const stagingDirectory = path.join(
    temporaryRoot,
    `${item.name.replaceAll("/", "__").replaceAll("@", "_")}-${nameHash}`,
  );
  mkdirSync(stagingDirectory, { recursive: true });
  const targets = entrypointTargets(manifest);
  const payload = payloadFiles(sourceDirectory, targets);
  const staged = new Set(["package.json", ...payload]);
  copyPayloadFile(sourceDirectory, stagingDirectory, "package.json");
  for (const document of DOC_FILES) {
    if (existsSync(path.join(sourceDirectory, document))) {
      copyPayloadFile(sourceDirectory, stagingDirectory, document);
      staged.add(document);
    } else if (
      document === "LICENSE" &&
      existsSync(path.join(repositoryRoot, document))
    ) {
      copyPayloadFile(repositoryRoot, stagingDirectory, document);
      staged.add(document);
    }
  }
  for (const file of payload) {
    copyPayloadFile(sourceDirectory, stagingDirectory, file);
  }
  return { payload, staged, stagingDirectory, targets };
}

export { createStagingPackage, walkFiles };
