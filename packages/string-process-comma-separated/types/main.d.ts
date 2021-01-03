import { version } from "../package.json";
declare type ErrCb = (indexes: [from: number, to: number][], explanation: string, isFixable: boolean) => void;
interface Opts {
    from?: number;
    to?: number;
    offset: number;
    leadingWhitespaceOK: boolean;
    trailingWhitespaceOK: boolean;
    oneSpaceAfterCommaOK: boolean;
    innerWhitespaceAllowed: boolean;
    separator?: string;
    cb?: null | ((from: number, to: number) => void);
    errCb?: null | ErrCb;
}
declare function processCommaSep(str: string, originalOpts?: Opts): void;
export { processCommaSep, version };
