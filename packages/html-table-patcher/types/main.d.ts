declare const version: string;
interface Opts {
    cssStylesContent: string;
    alwaysCenter: boolean;
}
declare const defaults: Opts;
declare function patcher(str: string, generalOpts?: Partial<Opts>): {
    result: string;
};

export { defaults, patcher, version };
