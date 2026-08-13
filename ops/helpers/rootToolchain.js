import { readFileSync } from "node:fs";
import path from "node:path";

const EXACT_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function rendered(value) {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

function exactVersion(value, label) {
  if (typeof value !== "string" || !EXACT_VERSION_PATTERN.test(value)) {
    throw new TypeError(
      `${label} must be an exact x.y.z version; received ${rendered(value)}`,
    );
  }
  return value;
}

function selectedNodeVersion(source) {
  return exactVersion(source?.trim(), ".node-version");
}

function selectedNpmVersion(packageManager) {
  if (
    typeof packageManager !== "string" ||
    !packageManager.startsWith("npm@")
  ) {
    throw new TypeError(
      `packageManager must select npm with an exact version; received ${rendered(packageManager)}`,
    );
  }
  return exactVersion(packageManager.slice(4), "packageManager npm version");
}

function rootToolchainPolicy({
  actualNodeVersion,
  actualNpmVersion,
  lockRoot,
  manifest,
  nodeVersionSource,
}) {
  const errors = [];
  let nodeVersion;
  let npmVersion;

  try {
    nodeVersion = selectedNodeVersion(nodeVersionSource);
  } catch (error) {
    errors.push(error.message);
  }
  try {
    npmVersion = selectedNpmVersion(manifest?.packageManager);
  } catch (error) {
    errors.push(error.message);
  }

  if (nodeVersion) {
    const expectedEngine = `>=${nodeVersion}`;
    if (manifest?.engines?.node !== expectedEngine) {
      errors.push(
        `root engines.node must mirror .node-version as ${expectedEngine}; received ${rendered(manifest?.engines?.node)}`,
      );
    }
    if (actualNodeVersion !== undefined) {
      let parsedActual;
      try {
        parsedActual = exactVersion(
          actualNodeVersion.replace(/^v/, ""),
          "running Node version",
        );
      } catch (error) {
        errors.push(error.message);
      }
      if (parsedActual && parsedActual !== nodeVersion) {
        errors.push(
          `running Node ${parsedActual} does not match the pinned ${nodeVersion}`,
        );
      }
    }
  }

  if (npmVersion) {
    const expectedEngine = `>=${npmVersion}`;
    if (manifest?.engines?.npm !== expectedEngine) {
      errors.push(
        `root engines.npm must mirror packageManager as ${expectedEngine}; received ${rendered(manifest?.engines?.npm)}`,
      );
    }
    if (actualNpmVersion !== undefined) {
      let parsedActual;
      try {
        parsedActual = exactVersion(actualNpmVersion, "running npm version");
      } catch (error) {
        errors.push(error.message);
      }
      if (parsedActual && parsedActual !== npmVersion) {
        errors.push(
          `running npm ${parsedActual} does not match the pinned ${npmVersion}`,
        );
      }
    }
  }

  for (const tool of ["node", "npm"]) {
    const manifestEngine = manifest?.engines?.[tool];
    const lockedEngine = lockRoot?.engines?.[tool];
    if (lockedEngine !== manifestEngine) {
      errors.push(
        `package-lock root engines.${tool} ${rendered(lockedEngine)} does not match package.json ${rendered(manifestEngine)}`,
      );
    }
  }

  return {
    errors,
    nodeVersion,
    npmSpec: npmVersion ? `npm@${npmVersion}` : undefined,
    npmVersion,
  };
}

function readRootToolchainPolicy(
  repositoryRoot,
  { actualNodeVersion, actualNpmVersion } = {},
) {
  const manifest = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
  );
  const packageLock = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package-lock.json"), "utf8"),
  );
  return rootToolchainPolicy({
    actualNodeVersion,
    actualNpmVersion,
    lockRoot: packageLock.packages?.[""],
    manifest,
    nodeVersionSource: readFileSync(
      path.join(repositoryRoot, ".node-version"),
      "utf8",
    ),
  });
}

export {
  exactVersion,
  readRootToolchainPolicy,
  rootToolchainPolicy,
  selectedNodeVersion,
  selectedNpmVersion,
};
