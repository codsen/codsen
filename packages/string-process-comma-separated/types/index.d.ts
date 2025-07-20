import { JSONValue } from "codsen-utils";

declare const version: string;
type ErrCb = (
  indexes: [from: number, to: number, whatToAdd?: JSONValue][],
  explanation: string,
  isFixable: boolean,
) => void;
interface Obj {
  [key: string]: any;
}
interface Opts {
  from: number;
  to: number;
  offset: number;
  leadingWhitespaceOK: boolean;
  trailingWhitespaceOK: boolean;
  oneSpaceAfterCommaOK: boolean;
  innerWhitespaceAllowed: boolean;
  separator: string;
  cb: null | ((from: number, to: number) => void);
  errCb: null | ErrCb;
}
declare function processCommaSep(str: string, opts?: Partial<Opts>): void;

export { processCommaSep, version };
export type { ErrCb, Obj, Opts };
