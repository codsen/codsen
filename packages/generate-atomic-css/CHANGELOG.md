# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.3.0 (2020-11-28)

### Bug Fixes

- closing curlies were not recognised if they were placed on a new line - fixed now ([c81eb14](https://git.sr.ht/~royston/codsen/commits/c81eb1479f4d05cb2eb98ad82a0263ccac7aa86c))
- Don't close the comment blocks above, it's not fully safe ([5ce6230](https://git.sr.ht/~royston/codsen/commits/5ce6230f1a6feb51ae3cb8ef8ae2c0e4a590f82e))
- Fix cases when there is no $$$ in the input and there are heads/tails ([09ceccd](https://git.sr.ht/~royston/codsen/commits/09ceccd52fc7c8dac44b5500afcd069d00e9fceb))
- Fix the case when the only non-whitespace string is at zero index (falsey value) ([76fd296](https://git.sr.ht/~royston/codsen/commits/76fd2969933a0d416186b6b41a331805f2375c92))
- More tests and more improvements to edge case recognition ([4721b20](https://git.sr.ht/~royston/codsen/commits/4721b20259a9dcd0d60ac7bd2eef363495afd5b7))
- Tightened the whitespace management part on the surrounding areas ([551a851](https://git.sr.ht/~royston/codsen/commits/551a85133653a8859208f745804312126513b65c))

### Features

- Add progress-reporting callback function to opts ([82e0d9b](https://git.sr.ht/~royston/codsen/commits/82e0d9bd70f146bf496fe38ed40f5086d3cb1c9d))
- Algorithm improvements to cover more dirty input cases ([70190a6](https://git.sr.ht/~royston/codsen/commits/70190a603dccd74947b30f9f003bd83e02a306f0))
- Complete extractFromToSource with unit tests ([4ac3634](https://git.sr.ht/~royston/codsen/commits/4ac3634046cefde635f3b18d88bbc3debb9330ac))
- Generated digit padding everywhere if possible ([750e853](https://git.sr.ht/~royston/codsen/commits/750e853153dccd7e86d6c65d9690cfdbf7e04e4d))
- Improvements to multiple CSS rule generation and recognition in config ([b780889](https://git.sr.ht/~royston/codsen/commits/b78088962f6527482627e3862f3dba0899e11730))
- Improvements to the padding algorithm ([21ac50f](https://git.sr.ht/~royston/codsen/commits/21ac50f139306b129b2a51b69be584b6356363de))
- Make more unit tests pass ([177f05c](https://git.sr.ht/~royston/codsen/commits/177f05c10e0f6fbe908479eb8f5964f07a40f207))
- opts.pad ([5d3e16a](https://git.sr.ht/~royston/codsen/commits/5d3e16ae3d6cf1678b2f08a1b1d9d5f0e421d490))
- Output the log ([c729689](https://git.sr.ht/~royston/codsen/commits/c72968961db1a35285d9124b427e20e3e1f7367c))
- Separate extractFromToSource() into a standalone, exported function ([af27f89](https://git.sr.ht/~royston/codsen/commits/af27f894a5fc57ce34ffdb0933b237f97fccd37b))
- Tackle input without any $$$ ([1dcaee4](https://git.sr.ht/~royston/codsen/commits/1dcaee44670cf817572afbcfe7f536508c8f24a8))

## 1.2.3 (2019-07-24)

### Bug Fixes

- closing curlies were not recognised if they were placed on a new line - fixed now ([c81eb14](https://gitlab.com/codsen/codsen/commit/c81eb14))

## 1.2.0 (2019-07-15)

### Features

- Complete extractFromToSource with unit tests ([4ac3634](https://gitlab.com/codsen/codsen/commit/4ac3634))
- Improvements to multiple CSS rule generation and recognition in config ([b780889](https://gitlab.com/codsen/codsen/commit/b780889))
- Improvements to the padding algorithm ([21ac50f](https://gitlab.com/codsen/codsen/commit/21ac50f))
- Separate extractFromToSource() into a standalone, exported function ([af27f89](https://gitlab.com/codsen/codsen/commit/af27f89))

## 1.1.0 (2019-07-06)

### Bug Fixes

- Don't close the comment blocks above, it's not fully safe ([5ce6230](https://gitlab.com/codsen/codsen/commit/5ce6230))
- Fix cases when there is no \$\$\$ in the input and there are heads/tails ([09ceccd](https://gitlab.com/codsen/codsen/commit/09ceccd))
- Fix the case when the only non-whitespace string is at zero index (falsey value) ([76fd296](https://gitlab.com/codsen/codsen/commit/76fd296))
- More tests and more improvements to edge case recognition ([4721b20](https://gitlab.com/codsen/codsen/commit/4721b20))
- Tightened the whitespace management part on the surrounding areas ([551a851](https://gitlab.com/codsen/codsen/commit/551a851))

### Features

- Add progress-reporting callback function to opts ([82e0d9b](https://gitlab.com/codsen/codsen/commit/82e0d9b))
- Algorithm improvements to cover more dirty input cases ([70190a6](https://gitlab.com/codsen/codsen/commit/70190a6))
- Generated digit padding everywhere if possible ([750e853](https://gitlab.com/codsen/codsen/commit/750e853))
- Make more unit tests pass ([177f05c](https://gitlab.com/codsen/codsen/commit/177f05c))
- opts.pad ([5d3e16a](https://gitlab.com/codsen/codsen/commit/5d3e16a))
- Output the log ([c729689](https://gitlab.com/codsen/codsen/commit/c729689))
- Tackle input without any \$\$\$ ([1dcaee4](https://gitlab.com/codsen/codsen/commit/1dcaee4))

## 1.0.0 (2018-06-28)

- ✨ First public release
