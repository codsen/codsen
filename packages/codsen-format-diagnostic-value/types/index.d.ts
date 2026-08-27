/**
 * Safely formats untrusted input for an error message.
 *
 * The result is JSON-like rather than JSON: values which JSON cannot express
 * use explicit diagnostic tokens. Object accessors are described without
 * running them, circular references are marked, and reflection failures are
 * contained. Output is capped at 2,000 UTF-16 code units, five object levels,
 * and 50 array items or object properties across the whole value.
 */
declare function formatDiagnosticValue(
  value: unknown,
  indentation?: 0 | 4,
): string;

export { formatDiagnosticValue };
