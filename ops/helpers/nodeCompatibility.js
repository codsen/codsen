import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { lowestNodeMajor } from "./nodeEngine.js";

const supportedNodeMajors = Object.freeze([18, 20, 22, 24, 26]);
const supportedNodeEngines = Object.freeze(
  new Map([
    [18, ">=18.20.8"],
    [20, ">=20.19.4"],
    [22, ">=22.21.1"],
    [24, ">=24.19.0"],
    [26, ">=26.7.0"],
  ]),
);
const runtimeDependencyFields = Object.freeze([
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
]);

function expandWorkspacePattern(repositoryRoot, pattern) {
  const normalised = pattern.replaceAll("\\", "/").replace(/\/$/, "");
  if (normalised.endsWith("/*")) {
    const parent = path.resolve(repositoryRoot, normalised.slice(0, -2));
    return readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(parent, entry.name));
  }
  if (normalised.includes("*")) {
    throw new TypeError(`Unsupported workspace pattern: ${pattern}`);
  }
  return [path.resolve(repositoryRoot, normalised)];
}

function runtimeDependencyNames(manifest) {
  return [
    ...new Set(
      runtimeDependencyFields.flatMap((field) =>
        Object.keys(manifest[field] ?? {}),
      ),
    ),
  ];
}

function readPackageRecords(repositoryRoot) {
  const rootManifest = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json")),
  );
  const workspacePatterns = Array.isArray(rootManifest.workspaces)
    ? rootManifest.workspaces
    : rootManifest.workspaces?.packages;
  if (!Array.isArray(workspacePatterns)) {
    throw new TypeError(
      "The root package.json has no supported workspace list",
    );
  }

  const records = workspacePatterns
    .flatMap((pattern) => expandWorkspacePattern(repositoryRoot, pattern))
    .filter((directory) => existsSync(path.join(directory, "package.json")))
    .map((absoluteDirectory) => {
      const directory = path.relative(repositoryRoot, absoluteDirectory);
      return {
        directory,
        manifest: JSON.parse(
          readFileSync(path.join(absoluteDirectory, "package.json")),
        ),
      };
    })
    .sort((left, right) =>
      left.manifest.name.localeCompare(right.manifest.name),
    );

  const names = new Set();
  for (const { directory, manifest } of records) {
    if (typeof manifest.name !== "string" || !manifest.name) {
      throw new TypeError(`Workspace has no package name: ${directory}`);
    }
    if (names.has(manifest.name)) {
      throw new TypeError(`Duplicate workspace package name: ${manifest.name}`);
    }
    names.add(manifest.name);
  }
  return records;
}

function eligiblePackageNamesForMajor(records, nodeMajor) {
  if (!supportedNodeMajors.includes(nodeMajor)) {
    throw new TypeError(
      `Node major must be one of ${supportedNodeMajors.join(", ")}`,
    );
  }
  return records
    .filter(({ manifest }) => {
      try {
        return lowestNodeMajor(manifest.engines?.node) <= nodeMajor;
      } catch (_error) {
        return false;
      }
    })
    .map(({ manifest }) => manifest.name)
    .sort();
}

function githubActionsNodeMatrix(records) {
  let minimumNodeMajor = supportedNodeMajors[0];
  if (records) {
    if (records.length === 0) {
      throw new TypeError("Cannot create a Node matrix without packages");
    }
    minimumNodeMajor = Math.min(
      ...records.map(({ manifest }) => {
        const engine = manifest.engines?.node;
        const nodeMajor = lowestNodeMajor(engine);
        if (supportedNodeEngines.get(nodeMajor) !== engine) {
          throw new TypeError(
            `${manifest.name}: cannot create a Node matrix from unsupported engine ${engine}`,
          );
        }
        return nodeMajor;
      }),
    );
  }
  return {
    include: [...supportedNodeEngines]
      .filter(([nodeMajor]) => nodeMajor >= minimumNodeMajor)
      .map(([nodeMajor, nodeEngine]) => {
        const exactVersion = nodeEngine.match(/^>=(\d+\.\d+\.\d+)$/)?.[1];
        if (
          !exactVersion ||
          Number(exactVersion.slice(0, exactVersion.indexOf("."))) !== nodeMajor
        ) {
          throw new TypeError(
            `Cannot derive an exact Node ${nodeMajor} matrix version from ${nodeEngine}`,
          );
        }
        return {
          "node-version": exactVersion,
          "node-major": nodeMajor,
        };
      }),
  };
}

function validateNodeCompatibility({ records, lockPackages }) {
  const errors = [];
  const recordsByName = new Map(
    records.map((record) => [record.manifest.name, record]),
  );

  for (const { directory, manifest } of records) {
    const engine = manifest.engines?.node;
    let consumerMajor;
    try {
      consumerMajor = lowestNodeMajor(engine);
    } catch (error) {
      errors.push(`${manifest.name}: ${error.message}`);
      continue;
    }

    if (supportedNodeEngines.get(consumerMajor) !== engine) {
      errors.push(
        `${manifest.name}: engines.node must be one of ${[
          ...supportedNodeEngines.values(),
        ].join(", ")}; received ${engine}`,
      );
    }

    for (const dependencyName of runtimeDependencyNames(manifest)) {
      const dependency = recordsByName.get(dependencyName);
      if (!dependency) {
        continue;
      }
      let dependencyMajor;
      try {
        dependencyMajor = lowestNodeMajor(dependency.manifest.engines?.node);
      } catch (_error) {
        continue;
      }
      if (dependencyMajor > consumerMajor) {
        errors.push(
          `${manifest.name}: Node ${consumerMajor} runtime depends on ${dependencyName}, which requires Node ${dependencyMajor}`,
        );
      }
    }

    if (lockPackages) {
      const lockedEngine = lockPackages[directory]?.engines?.node;
      if (lockedEngine !== engine) {
        errors.push(
          `${manifest.name}: package-lock engine ${lockedEngine ?? "<missing>"} does not match manifest engine ${engine}`,
        );
      }
    }
  }

  const eligibleByMajor = Object.fromEntries(
    supportedNodeMajors.map((nodeMajor) => [
      nodeMajor,
      eligiblePackageNamesForMajor(records, nodeMajor),
    ]),
  );
  return { eligibleByMajor, errors };
}

export {
  eligiblePackageNamesForMajor,
  githubActionsNodeMatrix,
  readPackageRecords,
  runtimeDependencyFields,
  runtimeDependencyNames,
  supportedNodeEngines,
  supportedNodeMajors,
  validateNodeCompatibility,
};
