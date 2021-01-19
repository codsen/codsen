declare const version: string;
declare function cleanChangelogs(changelogContents: string): {
    version: string;
    res: string;
};

export { cleanChangelogs, version };
