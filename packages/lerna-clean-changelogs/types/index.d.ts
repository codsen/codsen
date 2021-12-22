declare const version: string;
declare function cleanChangelogs(changelogContents: string, extras?: boolean): {
    version: string;
    res: string;
};

export { cleanChangelogs, version };
