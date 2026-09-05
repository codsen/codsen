const objectToString = Object.prototype.toString;
const localGlobal = typeof self === "object" ? self : global;
// Preserve native labels even when a non-string value shadows toStringTag.
// All of these prototypes exist on our Node and Chromium floors.
const prototypeLabels = new Map<object | null, string>([
  [null, "Object"],
  [Date.prototype, "Date"],
  [RegExp.prototype, "RegExp"],
  [Promise.prototype, "Promise"],
  [Map.prototype, "Map"],
  [Set.prototype, "Set"],
  [WeakMap.prototype, "WeakMap"],
  [WeakSet.prototype, "WeakSet"],
  [DataView.prototype, "DataView"],
  [Object.getPrototypeOf(new Map().entries()), "Map Iterator"],
  [Object.getPrototypeOf(new Set().entries()), "Set Iterator"],
  [Object.getPrototypeOf([][Symbol.iterator]()), "Array Iterator"],
  [Object.getPrototypeOf(""[Symbol.iterator]()), "String Iterator"],
]);

// Internal labels for reference equality and schema diagnostics. Keep native
// casing: reference checks distinguish boxed primitives and custom tag casing.
// Schemas and diagnostics normalize the label at their existing call sites.
export function typeLabel(value: unknown): string {
  const primitiveType = typeof value;
  if (primitiveType !== "object") return primitiveType;
  if (value === null) return "null";
  if (value === localGlobal) return "global";

  const object = value as object;
  if (Array.isArray(object) && !(Symbol.toStringTag in object)) return "Array";

  // Preserve browser schema labels, including the distinct table-cell labels
  // that native toString does not distinguish.
  if (typeof window === "object" && window !== null) {
    if (object === window.location) return "Location";
    if (object === window.document) return "Document";
    if (object === window.navigator?.mimeTypes) return "MimeTypeArray";
    if (object === window.navigator?.plugins) return "PluginArray";
    if (
      typeof window.HTMLElement === "function" &&
      object instanceof window.HTMLElement
    ) {
      if (object.tagName === "BLOCKQUOTE") return "HTMLQuoteElement";
      if (object.tagName === "TD") return "HTMLTableDataCellElement";
      if (object.tagName === "TH") return "HTMLTableHeaderCellElement";
    }
  }

  const tag = (object as { [Symbol.toStringTag]?: unknown })[
    Symbol.toStringTag
  ];
  if (typeof tag === "string") return tag;

  // Native toString covers other built-ins, subclasses and foreign realms.
  return (
    prototypeLabels.get(Object.getPrototypeOf(object)) ??
    objectToString.call(object).slice(8, -1)
  );
}
