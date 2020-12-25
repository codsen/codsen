import { version } from "../package.json";
declare type Output = "html" | "xhtml" | null;
declare function detectIsItHTMLOrXhtml(input: string): Output;
export { detectIsItHTMLOrXhtml, version };
