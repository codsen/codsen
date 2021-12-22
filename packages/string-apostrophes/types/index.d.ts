import { Ranges } from 'ranges-apply';

declare const version: string;
interface Inputs {
    from: number;
    to?: number;
    value?: string;
    convertEntities?: boolean;
    convertApostrophes?: boolean;
    offsetBy?: (amount: number) => void;
}
declare function convertOne(str: string, { from, to, value, convertEntities, convertApostrophes, offsetBy, }: Inputs): Ranges;
/**
 * Typographically-correct the apostrophes and single/double quotes
 */
declare function convertAll(str: string, opts?: Inputs): {
    result: string;
    ranges: Ranges;
};

export { convertAll, convertOne, version };
