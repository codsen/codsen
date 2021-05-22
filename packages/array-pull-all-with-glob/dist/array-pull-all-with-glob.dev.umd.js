/**
 * @name array-pull-all-with-glob
 * @fileoverview Like _.pullAll but with globs (wildcards)
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-pull-all-with-glob/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arrayPullAllWithGlob = {}));
}(this, (function (exports) { 'use strict';

var matcher$1 = {exports: {}};

var escapeStringRegexp$1 = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};

const escapeStringRegexp = escapeStringRegexp$1;

const regexpCache = new Map();

function sanitizeArray(input, inputName) {
	if (!Array.isArray(input)) {
		switch (typeof input) {
			case 'string':
				input = [input];
				break;
			case 'undefined':
				input = [];
				break;
			default:
				throw new TypeError(`Expected '${inputName}' to be a string or an array, but got a type of '${typeof input}'`);
		}
	}

	return input.filter(string => {
		if (typeof string !== 'string') {
			if (typeof string === 'undefined') {
				return false;
			}

			throw new TypeError(`Expected '${inputName}' to be an array of strings, but found a type of '${typeof string}' in the array`);
		}

		return true;
	});
}

function makeRegexp(pattern, options) {
	options = {
		caseSensitive: false,
		...options
	};

	const cacheKey = pattern + JSON.stringify(options);

	if (regexpCache.has(cacheKey)) {
		return regexpCache.get(cacheKey);
	}

	const negated = pattern[0] === '!';

	if (negated) {
		pattern = pattern.slice(1);
	}

	pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '[\\s\\S]*');

	const regexp = new RegExp(`^${pattern}$`, options.caseSensitive ? '' : 'i');
	regexp.negated = negated;
	regexpCache.set(cacheKey, regexp);

	return regexp;
}

matcher$1.exports = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return [];
	}

	const isFirstPatternNegated = patterns[0][0] === '!';

	patterns = patterns.map(pattern => makeRegexp(pattern, options));

	const result = [];

	for (const input of inputs) {
		// If first pattern is negated we include everything to match user expectation.
		let matches = isFirstPatternNegated;

		for (const pattern of patterns) {
			if (pattern.test(input)) {
				matches = !pattern.negated;
			}
		}

		if (matches) {
			result.push(input);
		}
	}

	return result;
};

matcher$1.exports.isMatch = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return false;
	}

	return inputs.some(input => {
		return patterns.every(pattern => {
			const regexp = makeRegexp(pattern, options);
			const matches = regexp.test(input);
			return regexp.negated ? !matches : matches;
		});
	});
};

var matcher = matcher$1.exports;

var version$1 = "5.0.16";

const version = version$1;
/**
 * Like _.pullAll but with globs (wildcards)
 */
function pull(originalInput, originalToBeRemoved, originalOpts) {
    // insurance
    if (!originalInput.length) {
        return [];
    }
    if (!originalInput.length || !originalToBeRemoved.length) {
        return Array.from(originalInput);
    }
    const toBeRemoved = typeof originalToBeRemoved === "string"
        ? [originalToBeRemoved]
        : Array.from(originalToBeRemoved);
    // opts are mirroring matcher's at the moment, can't promise that for the future
    const defaults = {
        caseSensitive: true,
    };
    const opts = { ...defaults, ...originalOpts };
    const res = Array.from(originalInput).filter((originalVal) => !toBeRemoved.some((remVal) => matcher.isMatch(originalVal, remVal, {
        caseSensitive: opts.caseSensitive,
    })));
    return res;
}

exports.pull = pull;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
