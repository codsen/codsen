const BEGIN = "; BEGIN generated Codsen release-age exclusions";
const END = "; END generated Codsen release-age exclusions";

function renderNpmReleaseAgeAllowlist(currentContents, workspaces) {
  const newline = currentContents.includes("\r\n") ? "\r\n" : "\n";
  const lines = currentContents.split(newline);
  const start = lines.indexOf(BEGIN);
  const end = lines.indexOf(END);
  if (
    (start === -1) !== (end === -1) ||
    (start !== -1 &&
      (start >= end ||
        lines.lastIndexOf(BEGIN) !== start ||
        lines.lastIndexOf(END) !== end))
  ) {
    throw new Error(
      "Malformed generated release-age exclusion block in .npmrc",
    );
  }

  const names = workspaces
    .filter(({ manifest }) => !manifest.private)
    .map(({ manifest }) => manifest.name)
    .sort();
  const block = [
    BEGIN,
    "; Regenerate with npm run ci:generate:npmrc",
    ...names.map((name) => `min-release-age-exclude[]=${name}`),
    END,
  ];

  if (start !== -1) {
    lines.splice(start, end - start + 1, ...block);
    return lines.join(newline);
  }
  const prefix = currentContents
    ? `${currentContents}${currentContents.endsWith(newline) ? "" : newline}${newline}`
    : "";
  return `${prefix}${block.join(newline)}${newline}`;
}

export { renderNpmReleaseAgeAllowlist };
