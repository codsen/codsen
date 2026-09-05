export function workspaceSpecPrefix(parsedSpec) {
  return parsedSpec.kind === "workspace-alias"
    ? `workspace:${parsedSpec.targetName}@`
    : "workspace:";
}

export function updatedDependencySpec(parsedSpec, currentSpec, version) {
  if (parsedSpec.kind === "registry") {
    return `^${version}`;
  }
  if (parsedSpec.kind === "workspace-path") {
    return currentSpec;
  }

  let workspaceRange = parsedSpec.selector;
  if (["*", "^", "~"].includes(workspaceRange)) {
    return currentSpec;
  }
  let firstVersionDigit = workspaceRange.search(/\d/);
  if (firstVersionDigit === -1) {
    return currentSpec;
  }
  let rangePrefix = workspaceRange.slice(0, firstVersionDigit);
  return `${workspaceSpecPrefix(parsedSpec)}${rangePrefix}${version}`;
}

export function major(versNum) {
  if (typeof versNum === "string") {
    return versNum.match(/^(?:workspace:)?[^\d]*(\d+)(?:\.|$)/)?.[1] ?? versNum;
  }
  return versNum;
}
