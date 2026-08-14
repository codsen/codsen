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

function runtimeDependencyNames(manifest) {
  return [
    ...new Set(
      runtimeDependencyFields.flatMap((field) =>
        Object.keys(manifest[field] ?? {}),
      ),
    ),
  ];
}

function runtimeDependencyClosureNames(records, seedNames) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new TypeError(
      "Runtime dependency closure records must be a non-empty array",
    );
  }
  const recordsByName = new Map();
  const directories = new Set();
  for (const [index, record] of records.entries()) {
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      !record.manifest ||
      typeof record.manifest !== "object" ||
      Array.isArray(record.manifest) ||
      typeof record.directory !== "string" ||
      record.directory.length === 0 ||
      typeof record.manifest.name !== "string" ||
      record.manifest.name.trim().length === 0
    ) {
      throw new TypeError(
        `Runtime dependency closure contains an invalid package record at index ${index}`,
      );
    }
    const { manifest } = record;
    if (recordsByName.has(manifest.name)) {
      throw new TypeError(
        `Runtime dependency closure contains duplicate package ${manifest.name}`,
      );
    }
    if (directories.has(record.directory)) {
      throw new TypeError(
        `Runtime dependency closure contains duplicate directory ${record.directory}`,
      );
    }
    for (const field of runtimeDependencyFields) {
      const dependencies = manifest[field];
      if (
        dependencies !== undefined &&
        (!dependencies ||
          typeof dependencies !== "object" ||
          Array.isArray(dependencies))
      ) {
        throw new TypeError(
          `Runtime dependency closure package ${manifest.name} has invalid ${field}`,
        );
      }
    }
    directories.add(record.directory);
    recordsByName.set(manifest.name, record);
  }

  if (
    !Array.isArray(seedNames) ||
    seedNames.length === 0 ||
    seedNames.some((name) => typeof name !== "string" || name.length === 0)
  ) {
    throw new TypeError(
      "Runtime dependency closure seeds must be a non-empty array of package names",
    );
  }
  if (new Set(seedNames).size !== seedNames.length) {
    throw new TypeError("Runtime dependency closure seeds must be unique");
  }
  for (const seedName of seedNames) {
    if (!recordsByName.has(seedName)) {
      throw new TypeError(
        `Runtime dependency closure seed ${seedName} is not a workspace package`,
      );
    }
  }

  const closure = new Set();
  const pending = [...seedNames];
  while (pending.length > 0) {
    const name = pending.pop();
    if (closure.has(name)) {
      continue;
    }
    closure.add(name);
    for (const dependencyName of runtimeDependencyNames(
      recordsByName.get(name).manifest,
    )) {
      if (recordsByName.has(dependencyName) && !closure.has(dependencyName)) {
        pending.push(dependencyName);
      }
    }
  }
  return [...closure].sort();
}

function nodeEngineInventory(records, label) {
  if (!Array.isArray(records)) {
    throw new TypeError(`${label} package records must be an array`);
  }
  const inventory = new Map();
  for (const record of records) {
    if (
      !record ||
      typeof record !== "object" ||
      typeof record.directory !== "string" ||
      !record.directory ||
      !record.manifest ||
      typeof record.manifest !== "object" ||
      Array.isArray(record.manifest)
    ) {
      throw new TypeError(`${label} contains an invalid package record`);
    }
    if (inventory.has(record.directory)) {
      throw new TypeError(
        `${label} contains duplicate directory ${record.directory}`,
      );
    }
    inventory.set(record.directory, {
      engine: record.manifest.engines?.node,
      name: record.manifest.name,
    });
  }
  return inventory;
}

function validateUnchangedNodeEngines({ baseRecords, currentRecords }) {
  const base = nodeEngineInventory(baseRecords, "Base");
  const current = nodeEngineInventory(currentRecords, "Current");
  const errors = [];

  for (const directory of [
    ...new Set([...base.keys(), ...current.keys()]),
  ].sort()) {
    const before = base.get(directory);
    const after = current.get(directory);
    const manifestPath =
      directory === "." ? "package.json" : `${directory}/package.json`;
    if (!before || !after) {
      errors.push(
        `${manifestPath}: package ${before ? "was removed" : "was added"}; automated dependency updates must not change the package inventory`,
      );
    } else if (before.engine !== after.engine) {
      errors.push(
        `${manifestPath}: engines.node changed from ${before.engine ?? "<missing>"} to ${after.engine ?? "<missing>"}; automated dependency updates must preserve Node floors`,
      );
    }
  }
  return errors;
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
  runtimeDependencyClosureNames,
  runtimeDependencyFields,
  runtimeDependencyNames,
  supportedNodeEngines,
  supportedNodeMajors,
  validateNodeCompatibility,
  validateUnchangedNodeEngines,
};
