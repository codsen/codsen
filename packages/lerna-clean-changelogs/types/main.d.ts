import { version } from "../package.json";
declare function cleanChangelogs(changelogContents: string): {
    version: string;
    res: string;
};
export { cleanChangelogs, version };
