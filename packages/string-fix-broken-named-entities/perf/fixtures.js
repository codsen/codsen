// Immutable setup shared by the tracked workload and supplementary measurements.
export const fastPath = "&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound";
export const successfulTypo = "&twoheadrigharrow;";
export const blockOmission = "&CounterClockwiseContIntegral;";
export const ambiguousTypo = "&sqr;";
export const absentTypo = "&zzzzzzzzzz;";

const prose = "This paragraph explains the example in plain text. ".repeat(40);
export const contextTypo = `${prose}${successfulTypo} ${prose}`;
export const mixedDocument = [
  contextTypo,
  blockOmission,
  ambiguousTypo,
  absentTypo,
].join("\n");
export const repeatedEntities = "&nbsp;".repeat(1000);
