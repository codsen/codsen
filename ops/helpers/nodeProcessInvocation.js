import path from "node:path";

const BIN_ALIAS_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/u;
const WINDOWS_CMD_META_PATTERN = /[&|<>()^%!"\r\n\0]/u;
const WINDOWS_PATH_EXPANSION_PATTERN = /[%!"\r\n\0]/u;

function nonEmptyPath(value, label) {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0")) {
    throw new TypeError(`${label} must be a non-empty path`);
  }
  return value;
}

function pairedNpmCliCandidates(
  nodeExecutable,
  platform = process.platform,
  explicitNpmCli,
) {
  nonEmptyPath(nodeExecutable, "nodeExecutable");
  const paths = platform === "win32" ? path.win32 : path.posix;
  const directory = paths.dirname(nodeExecutable);
  const besideNode = paths.resolve(
    directory,
    "node_modules/npm/bin/npm-cli.js",
  );
  const sharedPrefix = paths.resolve(
    directory,
    "../lib/node_modules/npm/bin/npm-cli.js",
  );
  const inferred =
    platform === "win32"
      ? [besideNode, sharedPrefix]
      : [sharedPrefix, besideNode];
  if (explicitNpmCli === undefined) {
    return inferred;
  }
  nonEmptyPath(explicitNpmCli, "explicitNpmCli");
  return [...new Set([paths.resolve(explicitNpmCli), ...inferred])];
}

function installedPackageBinInvocation({
  consumerDirectory,
  alias,
  args,
  platform = process.platform,
} = {}) {
  nonEmptyPath(consumerDirectory, "consumerDirectory");
  if (typeof alias !== "string" || !BIN_ALIAS_PATTERN.test(alias)) {
    throw new TypeError(`Unsafe installed package bin alias: ${String(alias)}`);
  }
  if (
    !Array.isArray(args) ||
    args.some(
      (argument) => typeof argument !== "string" || argument.includes("\0"),
    )
  ) {
    throw new TypeError(
      "Installed package bin args must be an array of strings",
    );
  }

  const windows = platform === "win32";
  if (
    windows &&
    args.some((argument) => WINDOWS_CMD_META_PATTERN.test(argument))
  ) {
    throw new TypeError(
      "Installed package bin args contain unsafe Windows cmd metacharacters",
    );
  }
  const paths = windows ? path.win32 : path.posix;
  const filename = paths.resolve(
    consumerDirectory,
    "node_modules/.bin",
    windows ? `${alias}.cmd` : alias,
  );
  if (windows && WINDOWS_PATH_EXPANSION_PATTERN.test(filename)) {
    throw new TypeError(
      "Installed package bin path contains unsafe Windows cmd expansion characters",
    );
  }
  if (windows) {
    const commandArguments = args.map((argument) =>
      argument.length === 0 || /[ \t]/u.test(argument)
        ? `"${argument}"`
        : argument,
    );
    return {
      args: [],
      command: [`"${filename}"`, ...commandArguments].join(" "),
      filename,
      shell: true,
    };
  }
  return {
    args: [...args],
    command: filename,
    filename,
    shell: false,
  };
}

export { installedPackageBinInvocation, pairedNpmCliCandidates };
