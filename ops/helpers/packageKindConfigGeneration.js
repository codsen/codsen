import { GENERATION_MODES, writeGeneratedFile } from "./generatedFiles.js";
import { formatGeneratedContents } from "./generatedFormatting.js";
import { turboConfigForPackageKinds } from "./packageKinds.js";

const FIX_COMMAND = "npm run ci:generate:package-kind-config";

function packageKindConfigContents({
  filename,
  formatContents = formatGeneratedContents,
  registry,
  repositoryRoot,
  turboConfig,
}) {
  const projected = turboConfigForPackageKinds(turboConfig, registry);
  return formatContents({
    contents: `${JSON.stringify(projected, null, 2)}\n`,
    filename,
    repositoryRoot,
  });
}

async function writePackageKindConfig({
  filename,
  formatContents = formatGeneratedContents,
  mode = GENERATION_MODES.WRITE,
  registry,
  repositoryRoot,
  turboConfig,
  writeGenerated = writeGeneratedFile,
}) {
  const contents = packageKindConfigContents({
    filename,
    formatContents,
    registry,
    repositoryRoot,
    turboConfig,
  });
  return writeGenerated({
    contents,
    filename,
    fixCommand: FIX_COMMAND,
    mode,
  });
}

export { FIX_COMMAND, packageKindConfigContents, writePackageKindConfig };
