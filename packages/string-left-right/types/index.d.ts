declare const version: string;
declare function right(str: string, idx?: number | null): number | null;
declare function rightStopAtNewLines(str: string, idx: number): number | null;
declare function rightStopAtRawNbsp(str: string, idx: number): number | null;
declare function left(str: string, idx?: number | null): number | null;
declare function leftStopAtNewLines(str: string, idx: number): number | null;
declare function leftStopAtRawNbsp(str: string, idx: number): number | null;
interface SeqOutput {
  gaps: [number, number][];
  leftmostChar: number;
  rightmostChar: number;
}
declare function leftSeq(
  str: string,
  idx: number,
  ...args: any[]
): SeqOutput | null;
declare function rightSeq(
  str: string,
  idx: number,
  ...args: any[]
): SeqOutput | null;
declare function chompLeft(
  str: string,
  idx: number,
  ...args: any[]
): number | null;
declare function chompRight(
  str: string,
  idx: number,
  ...args: any[]
): number | null;

export {
  chompLeft,
  chompRight,
  left,
  leftSeq,
  leftStopAtNewLines,
  leftStopAtRawNbsp,
  right,
  rightSeq,
  rightStopAtNewLines,
  rightStopAtRawNbsp,
  version,
};
