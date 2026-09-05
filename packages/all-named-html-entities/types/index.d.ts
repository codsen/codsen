/*!
 * Generated from WHATWG HTML entities.json (2026-09-05).
 * Source: https://html.spec.whatwg.org/entities.json
 * SHA-256: d741d877ac77c4194c4ad526b5b4a19aef8dfe411ab840a466891cdbb9f362e6
 * Copyright © WHATWG (Apple, Google, Mozilla, Microsoft).
 * BSD 3-Clause License
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
declare const allNamedEntitiesSetOnly: Set<string>;
declare const allNamedEntitiesSetOnlyCaseInsensitive: Set<string>;
declare const minLength = 2;
declare const maxLength = 31;

type EntityLookup = Record<string, string>;
type EntityAffixLookup = Record<string, Record<string, string[]>>;
type UncertainEntityLookup = Record<
  string,
  {
    addAmpIfSemiPresent: boolean | string;
    addSemiIfAmpPresent: boolean | string;
  }
>;
declare const version: string;
declare const allNamedEntities: EntityLookup;
declare const brokenNamedEntities: EntityLookup;
declare const entStartsWith: EntityAffixLookup;
declare const entEndsWith: EntityAffixLookup;
declare const entStartsWithCaseInsensitive: EntityAffixLookup;
declare const entEndsWithCaseInsensitive: EntityAffixLookup;
declare const uncertain: UncertainEntityLookup;
declare function decode(ent: string): string | null;

export {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  decode,
  entEndsWith,
  entEndsWithCaseInsensitive,
  entStartsWith,
  entStartsWithCaseInsensitive,
  maxLength,
  minLength,
  uncertain,
  version,
};
