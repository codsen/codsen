declare module "picomatch" {
  interface PicomatchOptions {
    dot?: boolean;
    nocase?: boolean;
    posix?: boolean;
    strictSlashes?: boolean;
  }

  interface Picomatch {
    makeRe(pattern: string, options?: PicomatchOptions): RegExp;
  }

  const picomatch: Picomatch;
  export default picomatch;
}
