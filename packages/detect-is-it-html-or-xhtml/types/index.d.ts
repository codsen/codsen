declare const version: string;
type Output = "html" | "xhtml" | null;
declare function detectIsItHTMLOrXhtml(input: string): Output;

export { detectIsItHTMLOrXhtml, version };
export type { Output };
