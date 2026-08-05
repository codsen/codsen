const supportedTypes = [
  "extlang",
  "grandfathered",
  "language",
  "redundant",
  "region",
  "script",
  "variant",
];

function asciiSort(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function parseRegistry(ianaSpec) {
  const valuesByType = Object.fromEntries(
    supportedTypes.map((type) => [type, new Set()]),
  );
  const prefixes = {
    extlang: {},
    variant: {},
  };
  const ranged = [];
  const rangedKeys = new Set();

  for (const rawRecord of ianaSpec.split("%%")) {
    const lines = rawRecord.split("\n").filter((line) => line.trim());
    const typeLines = lines.filter((line) => line.startsWith("Type:"));

    if (!typeLines.length) {
      continue;
    }

    if (typeLines.length !== 1) {
      throw new Error(
        `is-language-code/parseRegistry(): [THROW_ID_01] Expected one Type field, found ${typeLines.length}.`,
      );
    }

    const type = typeLines[0].slice(5).trim().toLowerCase();
    if (!supportedTypes.includes(type)) {
      throw new Error(
        `is-language-code/parseRegistry(): [THROW_ID_02] Unsupported registry type "${type}".`,
      );
    }

    const valueField =
      type === "grandfathered" || type === "redundant" ? "Tag:" : "Subtag:";
    const valueLines = lines.filter((line) => line.startsWith(valueField));

    if (valueLines.length !== 1) {
      throw new Error(
        `is-language-code/parseRegistry(): [THROW_ID_03] Expected one ${valueField.slice(0, -1)} field for type "${type}", found ${valueLines.length}.`,
      );
    }

    const value = valueLines[0].slice(valueField.length).trim().toLowerCase();
    const valuePrefixes = lines
      .filter((line) => line.startsWith("Prefix:"))
      .map((line) => line.slice(7).trim().toLowerCase())
      .sort(asciiSort);

    if (value.includes("..")) {
      const rangeMatch = /^([a-z]+)\.\.([a-z]+)$/.exec(value);

      if (!rangeMatch || rangeMatch[1].length !== rangeMatch[2].length) {
        throw new Error(
          `is-language-code/parseRegistry(): [THROW_ID_04] Invalid ranged subtag "${value}".`,
        );
      }

      if (rangeMatch[1] > rangeMatch[2]) {
        throw new Error(
          `is-language-code/parseRegistry(): [THROW_ID_05] Descending ranged subtag "${value}".`,
        );
      }

      const rangedKey = `${type}/${value}`;
      if (rangedKeys.has(rangedKey)) {
        throw new Error(
          `is-language-code/parseRegistry(): [THROW_ID_06] Duplicate ranged subtag "${rangedKey}".`,
        );
      }

      rangedKeys.add(rangedKey);
      ranged.push({ type, value });
      continue;
    }

    if (valuesByType[type].has(value)) {
      throw new Error(
        `is-language-code/parseRegistry(): [THROW_ID_07] Duplicate ${type} value "${value}".`,
      );
    }

    valuesByType[type].add(value);

    if (type === "extlang") {
      if (valuePrefixes.length !== 1) {
        throw new Error(
          `is-language-code/parseRegistry(): [THROW_ID_08] Extlang "${value}" must have exactly one Prefix field.`,
        );
      }
      prefixes.extlang[value] = valuePrefixes;
    } else if (type === "variant") {
      prefixes.variant[value] = valuePrefixes;
    }
  }

  return {
    valuesByType: Object.fromEntries(
      supportedTypes.map((type) => [
        type,
        [...valuesByType[type]].sort(asciiSort),
      ]),
    ),
    prefixes: Object.fromEntries(
      Object.entries(prefixes).map(([type, values]) => [
        type,
        Object.fromEntries(
          Object.entries(values).sort(([a], [b]) => asciiSort(a, b)),
        ),
      ]),
    ),
    ranged: ranged.sort(
      (a, b) => asciiSort(a.type, b.type) || asciiSort(a.value, b.value),
    ),
    types: [...supportedTypes].sort(asciiSort),
  };
}

export { parseRegistry };
