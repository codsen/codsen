const packageNodeEngine = ">=22";

function applyNodeEnginePolicy(content) {
  return {
    ...content,
    engines: {
      ...content.engines,
      node: packageNodeEngine,
    },
  };
}

export { applyNodeEnginePolicy };
