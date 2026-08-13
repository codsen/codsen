import { isDeepStrictEqual } from "node:util";
import { PACKAGE_KINDS } from "./packageKinds.js";

const thresholdNames = Object.freeze([
  "branches",
  "functions",
  "lines",
  "statements",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function packageNamesFrom(value) {
  return isObject(value) ? Object.keys(value) : [];
}

function coverageConfigForPackage(policy, manifest, { packageKind } = {}) {
  if (!isObject(policy?.profiles?.default)) {
    throw new TypeError("Coverage policy has no default profile");
  }
  if (typeof manifest?.name !== "string" || !manifest.name) {
    throw new TypeError("Cannot resolve coverage without a package name");
  }
  if (
    ![PACKAGE_KINDS.CLI, PACKAGE_KINDS.TYPESCRIPT_LIBRARY].includes(packageKind)
  ) {
    throw new TypeError(
      "Cannot resolve package coverage without a CLI or TypeScript-library kind",
    );
  }

  return {
    ...policy.profiles.default,
    ...(packageKind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY
      ? policy.profiles.rollup
      : policy.profiles.cli),
    ...(policy.fullCoveragePackages?.includes(manifest.name)
      ? policy.profiles.full
      : {}),
    ...(policy.packageOverrides?.[manifest.name] ?? {}),
    ...(policy.waivers?.[manifest.name]?.config ?? {}),
  };
}

function validateThresholds(config, context, errors) {
  for (const threshold of thresholdNames) {
    if (threshold in config) {
      const value = config[threshold];
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        errors.push(`${context}.${threshold} must be a number from 0 to 100`);
      }
    }
  }
}

function validateNamedEntries(entries, context, knownNames, errors) {
  for (const name of entries) {
    if (!knownNames.has(name)) {
      errors.push(`${context} names unknown package ${name}`);
    }
  }
}

function validateProfileKeys(profile, allowedKeys, context, errors) {
  if (!isObject(profile)) {
    return;
  }
  const unsupportedKeys = Object.keys(profile).filter(
    (key) => !allowedKeys.includes(key),
  );
  if (unsupportedKeys.length) {
    errors.push(
      `${context} contains unsupported keys: ${unsupportedKeys.join(", ")}`,
    );
  }
}

function validateCoveragePolicy({
  policy,
  records,
  workspaceRecords = records,
}) {
  const errors = [];
  if (!isObject(policy)) {
    return { errors: ["Coverage policy must be an object"] };
  }
  if (!Array.isArray(records)) {
    return { errors: ["Coverage package records must be an array"] };
  }
  if (!Array.isArray(workspaceRecords)) {
    return { errors: ["Coverage workspace records must be an array"] };
  }

  const knownNames = new Set(records.map(({ manifest }) => manifest.name));
  const knownWorkspaceNames = new Set(
    workspaceRecords.map(({ manifest }) => manifest.name),
  );
  const defaultProfile = policy.profiles?.default;
  const cliProfile = policy.profiles?.cli;
  const fullProfile = policy.profiles?.full;
  const rollupProfile = policy.profiles?.rollup;

  if (!isObject(defaultProfile)) {
    errors.push("profiles.default must be an object");
  } else {
    if (defaultProfile["check-coverage"] !== true) {
      errors.push("profiles.default.check-coverage must be true");
    }
    if (defaultProfile.lines !== 100) {
      errors.push("profiles.default.lines must be 100");
    }
    validateThresholds(defaultProfile, "profiles.default", errors);
    validateProfileKeys(
      defaultProfile,
      ["check-coverage", "exclude", "lines"],
      "profiles.default",
      errors,
    );
    if (
      !Array.isArray(defaultProfile.exclude) ||
      defaultProfile.exclude.length !== 1 ||
      defaultProfile.exclude[0] !== "**/test/**/*.*"
    ) {
      errors.push('profiles.default.exclude must equal ["**/test/**/*.*"]');
    }
  }

  if (!isObject(cliProfile)) {
    errors.push("profiles.cli must be an object");
  } else if (cliProfile.all !== true) {
    errors.push("profiles.cli must set all=true");
  }
  validateProfileKeys(cliProfile, ["all"], "profiles.cli", errors);

  if (!isObject(rollupProfile)) {
    errors.push("profiles.rollup must be an object");
  } else if (
    rollupProfile.all !== true ||
    !Array.isArray(rollupProfile.include) ||
    rollupProfile.include.length !== 1 ||
    rollupProfile.include[0] !== "dist/*.esm.js"
  ) {
    errors.push(
      'profiles.rollup must set all=true and include "dist/*.esm.js"',
    );
  }
  validateProfileKeys(
    rollupProfile,
    ["all", "include"],
    "profiles.rollup",
    errors,
  );

  if (!isObject(fullProfile)) {
    errors.push("profiles.full must be an object");
  } else {
    for (const threshold of ["branches", "functions", "statements"]) {
      if (fullProfile[threshold] !== 100) {
        errors.push(`profiles.full.${threshold} must be 100`);
      }
    }
    validateThresholds(fullProfile, "profiles.full", errors);
    validateProfileKeys(
      fullProfile,
      ["branches", "functions", "statements"],
      "profiles.full",
      errors,
    );
  }

  const fullCoveragePackages = policy.fullCoveragePackages;
  if (!Array.isArray(fullCoveragePackages)) {
    errors.push("fullCoveragePackages must be an array");
  } else {
    const uniqueNames = new Set(fullCoveragePackages);
    if (uniqueNames.size !== fullCoveragePackages.length) {
      errors.push("fullCoveragePackages must not contain duplicates");
    }
    validateNamedEntries(
      fullCoveragePackages,
      "fullCoveragePackages",
      knownNames,
      errors,
    );
  }

  if (!isObject(policy.packageOverrides)) {
    errors.push("packageOverrides must be an object");
  } else {
    for (const [name, override] of Object.entries(policy.packageOverrides)) {
      if (!isObject(override)) {
        errors.push(`packageOverrides.${name} must be an object`);
      } else {
        const unsupportedKeys = Object.keys(override).filter(
          (key) => key !== "reporter",
        );
        if (unsupportedKeys.length) {
          errors.push(
            `packageOverrides.${name} contains unsupported keys: ${unsupportedKeys.join(", ")}`,
          );
        }
      }
    }
  }
  validateNamedEntries(
    packageNamesFrom(policy.packageOverrides),
    "packageOverrides",
    knownNames,
    errors,
  );

  if (!isObject(policy.workspaceExemptions)) {
    errors.push("workspaceExemptions must be an object");
  } else {
    for (const [name, exemption] of Object.entries(
      policy.workspaceExemptions,
    )) {
      if (!knownWorkspaceNames.has(name)) {
        errors.push(`workspaceExemptions names unknown workspace ${name}`);
      }
      if (knownNames.has(name)) {
        errors.push(
          `workspaceExemptions.${name} must not exempt a covered workspace`,
        );
      }
      if (!isObject(exemption)) {
        errors.push(`workspaceExemptions.${name} must be an object`);
        continue;
      }
      if (typeof exemption.reason !== "string" || !exemption.reason.trim()) {
        errors.push(
          `workspaceExemptions.${name}.reason must document the exception`,
        );
      }
      if (
        typeof exemption.followUp !== "string" ||
        !exemption.followUp.trim()
      ) {
        errors.push(
          `workspaceExemptions.${name}.followUp must document the intended follow-up`,
        );
      }
    }
  }

  const exemptWorkspaceNames = new Set(
    packageNamesFrom(policy.workspaceExemptions),
  );
  for (const { manifest } of workspaceRecords) {
    if (
      !knownNames.has(manifest.name) &&
      !exemptWorkspaceNames.has(manifest.name)
    ) {
      errors.push(
        `${manifest.name}: workspace is neither covered nor explicitly exempted`,
      );
    }
  }

  if (!isObject(policy.waivers)) {
    errors.push("waivers must be an object");
  } else {
    for (const [name, waiver] of Object.entries(policy.waivers)) {
      if (!isObject(waiver)) {
        errors.push(`waivers.${name} must be an object`);
        continue;
      }
      if (typeof waiver.reason !== "string" || !waiver.reason.trim()) {
        errors.push(`waivers.${name}.reason must document the exception`);
      }
      if (typeof waiver.followUp !== "string" || !waiver.followUp.trim()) {
        errors.push(
          `waivers.${name}.followUp must document the intended follow-up`,
        );
      }
      if (!isObject(waiver.config)) {
        errors.push(`waivers.${name}.config must be an object`);
        continue;
      }
      const invalidKeys = Object.keys(waiver.config).filter(
        (key) => !thresholdNames.includes(key),
      );
      if (invalidKeys.length) {
        errors.push(
          `waivers.${name}.config contains non-threshold keys: ${invalidKeys.join(", ")}`,
        );
      }
      validateThresholds(waiver.config, `waivers.${name}.config`, errors);
      for (const [threshold, value] of Object.entries(waiver.config)) {
        if (thresholdNames.includes(threshold) && value <= 0) {
          errors.push(
            `waivers.${name}.config.${threshold} must remain positive`,
          );
        }
      }

      const record = records.find(({ manifest }) => manifest.name === name);
      if (record) {
        const baseConfig = {
          ...policy.profiles.default,
          ...(record.packageKind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY
            ? policy.profiles.rollup
            : policy.profiles.cli),
          ...(policy.fullCoveragePackages?.includes(name)
            ? policy.profiles.full
            : {}),
          ...(policy.packageOverrides?.[name] ?? {}),
        };
        const lowersThreshold = thresholdNames.some(
          (threshold) =>
            typeof waiver.config[threshold] === "number" &&
            typeof baseConfig[threshold] === "number" &&
            waiver.config[threshold] < baseConfig[threshold],
        );
        if (!lowersThreshold) {
          errors.push(
            `waivers.${name}.config must lower an applicable threshold`,
          );
        }
      }
    }
  }
  validateNamedEntries(
    packageNamesFrom(policy.waivers),
    "waivers",
    knownNames,
    errors,
  );

  for (const { packageKind, manifest } of records) {
    if (
      ![PACKAGE_KINDS.CLI, PACKAGE_KINDS.TYPESCRIPT_LIBRARY].includes(
        packageKind,
      )
    ) {
      errors.push(
        `${manifest.name}: packageKind must be cli or typescript-library`,
      );
      continue;
    }
    let expected;
    try {
      expected = coverageConfigForPackage(policy, manifest, { packageKind });
    } catch (error) {
      errors.push(`${manifest.name}: ${error.message}`);
      continue;
    }
    if (!isDeepStrictEqual(manifest.c8, expected)) {
      errors.push(
        `${manifest.name}: c8 config differs from centralized policy; expected ${JSON.stringify(expected)}, received ${JSON.stringify(manifest.c8)}`,
      );
    }
    if (expected["check-coverage"] !== true) {
      errors.push(`${manifest.name}: resolved coverage checks must be enabled`);
    }
    if (typeof expected.lines !== "number" || expected.lines <= 0) {
      errors.push(`${manifest.name}: resolved line threshold must be positive`);
    }
    if (packageKind === PACKAGE_KINDS.CLI && expected.all !== true) {
      errors.push(
        `${manifest.name}: resolved CLI-family config must set all=true`,
      );
    }
    if (
      packageKind === PACKAGE_KINDS.TYPESCRIPT_LIBRARY &&
      (expected.all !== true ||
        !Array.isArray(expected.include) ||
        expected.include.length !== 1 ||
        expected.include[0] !== "dist/*.esm.js")
    ) {
      errors.push(
        `${manifest.name}: resolved Rollup config must discover the built ESM file`,
      );
    }
  }

  return { errors };
}

export { coverageConfigForPackage, thresholdNames, validateCoveragePolicy };
