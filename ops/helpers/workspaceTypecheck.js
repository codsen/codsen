import path from "node:path";

import ts from "typescript";

function fail(message) {
  throw new Error(message);
}

function readTypeScriptConfig(filename) {
  const read = ts.readConfigFile(filename, ts.sys.readFile);
  if (read.error) {
    return { diagnostics: [read.error], filename };
  }
  const parsed = ts.parseJsonConfigFileContent(
    read.config,
    ts.sys,
    path.dirname(filename),
    { noEmit: true, pretty: false },
    filename,
  );
  return {
    diagnostics: parsed.errors,
    fileNames: parsed.fileNames,
    filename,
    options: parsed.options,
    projectReferences: parsed.projectReferences,
  };
}

function compilerProfile(options) {
  const {
    configFilePath: _configFilePath,
    outDir: _outDir,
    rootDir: _rootDir,
    ...semanticOptions
  } = options;
  function stable(value) {
    if (Array.isArray(value)) {
      return value.map(stable);
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, stable(value[key])]),
      );
    }
    return value;
  }
  return JSON.stringify(stable(semanticOptions));
}

function groupCompatibleConfigs(configs) {
  const groups = new Map();
  for (const config of configs) {
    if (config.diagnostics.length > 0) {
      continue;
    }
    const profile = compilerProfile(config.options);
    const group = groups.get(profile) ?? [];
    group.push(config);
    groups.set(profile, group);
  }
  return [...groups.values()];
}

function createCachingCompilerHost(options, sourceFiles) {
  const host = ts.createCompilerHost(options);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (
    filename,
    languageVersionOrOptions,
    onError,
    shouldCreateNewSourceFile,
  ) => {
    const key = path.resolve(filename);
    if (!shouldCreateNewSourceFile && sourceFiles.has(key)) {
      return sourceFiles.get(key);
    }
    const sourceFile = originalGetSourceFile(
      filename,
      languageVersionOrOptions,
      onError,
      shouldCreateNewSourceFile,
    );
    if (sourceFile && !shouldCreateNewSourceFile) {
      sourceFiles.set(key, sourceFile);
    }
    return sourceFile;
  };
  return host;
}

function typecheckConfigGroup(configs, sourceFiles = new Map()) {
  if (!Array.isArray(configs) || configs.length === 0) {
    fail("Typecheck config group must contain at least one parsed config");
  }
  const options = {
    ...configs[0].options,
    noEmit: true,
    outDir: undefined,
    rootDir: undefined,
  };
  const rootNames = [
    ...new Set(configs.flatMap((config) => config.fileNames)),
  ].sort();
  const projectReferences = configs.flatMap(
    (config) => config.projectReferences ?? [],
  );
  const host = createCachingCompilerHost(options, sourceFiles);
  const program = ts.createProgram({
    host,
    options,
    projectReferences,
    rootNames,
  });
  return ts.getPreEmitDiagnostics(program);
}

function typecheckWorkspaces(configFilenames) {
  if (
    !Array.isArray(configFilenames) ||
    configFilenames.some((filename) => typeof filename !== "string")
  ) {
    fail("Workspace typecheck requires an array of config filenames");
  }
  const configs = configFilenames.map((filename) =>
    readTypeScriptConfig(path.resolve(filename)),
  );
  const diagnostics = configs.flatMap((config) => config.diagnostics);
  const sourceFiles = new Map();
  for (const group of groupCompatibleConfigs(configs)) {
    diagnostics.push(...typecheckConfigGroup(group, sourceFiles));
  }
  return {
    configCount: configs.length,
    diagnostics,
    groupCount: groupCompatibleConfigs(configs).length,
  };
}

export {
  compilerProfile,
  groupCompatibleConfigs,
  readTypeScriptConfig,
  typecheckConfigGroup,
  typecheckWorkspaces,
};
