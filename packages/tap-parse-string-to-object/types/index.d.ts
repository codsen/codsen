declare const version: string;
interface Res {
  ok: boolean;
  assertsTotal: number;
  assertsPassed: number;
  assertsFailed: number;
  suitesTotal: number;
  suitesPassed: number;
  suitesFailed: number;
}
interface StreamInterface extends NodeJS.ReadWriteStream {
  read(size?: number): any;
}
declare function parseTap(
  something: string | StreamInterface
): Res | Promise<Res>;

export { Res, StreamInterface, parseTap, version };
