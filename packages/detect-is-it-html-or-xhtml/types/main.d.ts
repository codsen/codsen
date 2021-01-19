declare const version: string;
declare type Output = "html" | "xhtml" | null;
declare function detectIsItHTMLOrXhtml(input: string): Output;

export { detectIsItHTMLOrXhtml, version };
