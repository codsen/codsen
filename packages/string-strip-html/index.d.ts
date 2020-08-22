declare namespace stringStripHtml {
  interface Options {
    /**
		Ignore any tags upon request.
		@default []
		*/
    readonly ignoreTags?: string[];
  }

  // ---------

  interface Output {
    log: { timeTakenInMilliseconds: number };
    result: string;
    ranges: null | readonly [number, number, string?][];
    allTagLocations: readonly [number, number][];
    filteredTagLocations: readonly [number, number][];
  }
}

declare const stringStripHtml: {
  /** 
  Strips HTML tags from strings. No parser, accepts mixed sources.

  @param input - String to strip HTML tags from
  
  */
  (inputs: string, options?: stringStripHtml.Options): stringStripHtml.Output;
};

export = stringStripHtml;
