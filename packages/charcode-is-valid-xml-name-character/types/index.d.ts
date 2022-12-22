declare function isProduction4(char: string): boolean;
declare function isProduction4a(char: string): boolean;

export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};
