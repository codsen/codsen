import {
  eligiblePackageNamesForMajor,
  supportedNodeEngines,
  supportedNodeMajors,
} from "./nodeCompatibility.js";

function exactVersionForMajor(nodeMajor) {
  const engine = supportedNodeEngines.get(nodeMajor);
  const match = engine?.match(/^>=(\d+\.\d+\.\d+)$/);
  if (!match) {
    throw new TypeError(`Node ${nodeMajor} has no canonical exact patch`);
  }
  return match[1];
}

function assertCanonicalNodeVersion(nodeMajor, actualVersion) {
  const expectedVersion = exactVersionForMajor(nodeMajor);
  if (actualVersion !== expectedVersion) {
    throw new TypeError(
      `Verification requested canonical Node ${expectedVersion}; received ${actualVersion}`,
    );
  }
  return expectedVersion;
}

function localCompatibilityLanePlan(records) {
  const completePlan = supportedNodeMajors.map((nodeMajor) => ({
    nodeMajor,
    exactVersion: exactVersionForMajor(nodeMajor),
    packageCount: eligiblePackageNamesForMajor(records, nodeMajor).length,
  }));
  const firstEligibleLane = completePlan.findIndex(
    ({ packageCount }) => packageCount > 0,
  );
  if (firstEligibleLane === -1) {
    throw new TypeError("No workspace is eligible for a supported Node lane");
  }
  return completePlan.slice(firstEligibleLane);
}

export {
  assertCanonicalNodeVersion,
  exactVersionForMajor,
  localCompatibilityLanePlan,
};
