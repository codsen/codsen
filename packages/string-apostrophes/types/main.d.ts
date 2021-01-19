declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

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
declare function convertAll(str: string, opts?: Inputs): {
    result: string;
    ranges: Ranges;
};

export { convertAll, convertOne, version };
