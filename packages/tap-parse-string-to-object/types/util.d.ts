declare function stringPingLineByLine(
  str: string,
  cb: (str: string) => void
): void;
interface Total {
  ok: boolean;
  assertsTotal: number;
  assertsPassed: number;
  assertsFailed: number;
  suitesTotal: number;
  suitesPassed: number;
  suitesFailed: number;
}
declare class Counter {
  canCount: boolean;
  doNothing: boolean;
  thereWereFailuresInThisSuite: null | boolean;
  total: Total;
  constructor();
  readLine(lineStr: string): void;
  getTotal(): Total;
}
export { stringPingLineByLine, Counter };
