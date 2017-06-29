## [0.13.4] - 2017-06-26

* VerticalManager: sanitise `id` before using it as DOM attribute.

## [0.13.3] - 2017-06-13

* FileInput: add support for `mdl` theme, including `skipTheme` prop (#11).

## [0.13.2] - 2017-06-09

* DataTable: `onChangeManualOrder` prop now receives an object as second argument, including the row that has been dragged (if applicable) as `draggedId`.
* DataTable: add `disableDragging` prop to temporarily disable dragging, even if the manual-sorting column is displayed and even selected.
* Bugfix: FileInput does not work with children (#10).

## [0.13.1] - 2017-06-03

* DataTable: remove hidden rows (due to a filter) from the selection
* Bugfix: VirtualScroller: fix a sporadic issue that surfaced when filtering DataTable rows (incorrect trimming of shown indexes)

## [0.13.0] - 2017-05-30

* DataTable: add `animated` prop (**disabled by default**) to enable the `top` animation on rows. Notes:
    * This has no effect on row animation during drag & drop when ordering manually.
    * This animation works perfectly fine to react to columns that change their height (e.g. due to changing contents or to window resizing/zoom). It is even advisable to enable it, since it helps the user keep track of rows, since they move slowly. However, this animation doesn't work so well in the more general case when the sort criterion changes and a lot of rows shuffle up and down; that's why it has been disabled by default. **Recommendation: use `animated` when you have such columns which may change height dynamically**.

## [0.12.3] - 2017-05-29

* Modal buttons: in MDL, make default buttons 'primary' (instead of 'accent') and other buttons 'plain' (#8).
* DataTable: add optional `emptyIndicator` prop (shown when no rows are displayed). By default, a LargeMessage reading **No items** is shown.
* DataTable: when sort order changes, keep selected item visible.
* Bugfixes:
    * DataTable: refresh float positions when sort order changes

## [0.12.2] - 2017-05-22

* Modal: honor `plain` and `disabled` props on modal buttons (might be useful in the MDL theme) (#6).
* Modal: remove lines above and below the main contents.
* DataTable header: restrict clickable area to the column title only (not the whitespace).
* Select: improve default title styles (ellipsized by default; height is also easier to configure now, with `styleTitle` and `maxWidth`)
* Bugfixes:
    * Spinner: Fix creation after initial page load (#4).
    * Notification: Fix default icon when using MDL (#5).
    * Input HOC: Reset validation errors upon REVERT.

## [0.12.1] - 2017-05-15

* SelectCustom: hide caret when input is disabled.
* DataTable: add `neverFilterIds`, for those rows that MUST be shown, no matter what.
* DataTable: add `customPositions`, to tweak the position of certain rows.

## [0.12.0] - 2017-05-11

* DataTable: select a row when user focuses on an input in that row (e.g. via TAB).
* DataTable: add `isItemSelected` to the props received by all column render functions.
* DataTable: add `onRowDoubleClick` prop
* DataTable: prevent rendering extra rows on selection change (the new callback, `getSpecificRowProps()`, also adds more flexibility for future improvements)
* VirtualScroller: improve responsiveness by drawing X pixels above and below the viewport.
* New HeightMeasurer component: measures the height of its parent and passes it down to its function-as-a-child. **HeightMeasurer MUST BE the direct child of an element with an "extrinsic" height (ie. a height that is not determined by its children, but rather by its parents, e.g. a flex item with `overflow: hidden`)**
* Add `simplifyString()` to public API (useful for simplistic sorting and filtering).
* Bugfix: DataTable: Discard bubbled keyDown events when focus is on an input.

## [0.11.1] - 2017-05-10

* SelectCustom: add `styleTitle` prop (merged with the title span)

## [0.11.0] - 2017-05-08

* Simplify inclusion of Material Design Light: just `import 'giu/lib/mdl';` and wrap your application in `<Giu theme="mdl">`
* Add `skipTheme` prop to TextInput, NumberInput, PasswordInput + DateInput (#3)
* **Bugfixes**:
    - DataTable: Tolerate undefined/null raw values when filtering.
    - DataTable: Remove unwanted logs in the console.
    - DataTable: Refresh floats on scroll and after dragging a row.
    - Select: Fix imperative API (forward validateAndGetValue() to the inner input).
    - DateInput: Fix imperative API (moved to a class-based outer React component).
    - FileInput: Fix incorrect update when selecting a file again, after clearing the input.
* DataTable: add draft docs.
* Examples: DataTable: add "alternative-layout" (not-so-tabular) example.
* Internal: **convert to a monorepo** (with [oao](https://github.com/guigrpa/oao)) with `giu` and `giu-examples`.

## [0.10.2] - 2017-03-13

* Expose tinycolor in the public API.
* **Bugfix**: honor `onClick` props in notifications.

## [0.10.1] - 2017-02-24

* [M] Input HOC: multiple bugfixes (esp. concerning validation lifecycles)

## [0.10.0] - 2017-02-22

* [M] Add partial **Material Design Lite** support
* [m] DatePicker: when clicking on Today button, always change to the current month (even if today is already selected)
* Internal:
    - Use Typefaces to include fonts as a package

## [0.9.2] - 2016-12-15

* Remove external-facing Flow types for the time being

## [0.9.1] - 2016-12-12

* *Internal*: publish source in order to support always-up-to-date Flow types, using flow-copy-source

## [0.9.0] - 2016-12-01

* [M] Makes **moment an optional dependency**. Only include it in your project if you use DateInput or the date utilities
* [M] **Bugfix**: Redux stores (Notifications, Hints, Floats) are now lazily initialised
* [m] Pass through disabled property to native checkbox
* [m] Backdrop: add small transition when it appears
- [M] Ongoing internal work adding Flow types

## [0.8.1] - 2016-09-21

* [m] **Bugfix**: Hints: fix incorrect initialisation
* [m] Remove legacy peer dependency: react-addons-pure-render-mixin

## [0.8.0] - 2016-09-21

* [M] **Add DataTable component**
* [M] **Add VirtualScroller component**
* [M] **Add language support to components with `items` props (Select, RadioGroup, DropDownMenu)**. Components now refresh when language changes, and item `label` members can now be functions.
* [m] Protect JSON-based inputs (SelectNative, SelectCustom, RadioGroup) against invalid contents pasted in. They no longer throw and put themselves in an unstable state, but rather show a warning in the console and reset their contents.
* [m] Compact demo: split in multiple sub-demos (it was becoming too big!)
* [m] ColorInput: tweak vertical alignment (hopefully fix it once and for all!)
* [m] **Bugfix**: Textarea: check for null refs before accessing offsetHeight (this could interfere with unit tests with a fake/mocked DOM)

## [0.7.1] - 2016-07-29

* [m] Modal: allow customising button style.

## [0.7.0] - 2016-07-28

* [M] Bump deps, including React (to 15.2.x)
* [m] ColorInput: initial values can be in any format supported by [tinycolor2](https://github.com/bgrins/TinyColor). Note that v1.4.1 of this library is aligned to CSS 4 color specification RRGGBBAA (previously AARRGGBB). In any case, the values provided by this input are in the browser-ready `rgba(r, g, b, a)` format
* [m] Input HOC: allow simultaneously setting a new value prop and reverting to it
* **Bugfix**: Prevent bubbling `click` events from blurring components within Modals.
* **Bugfix**: Fix ColorInput's vertical positioning when inline.

## [0.6.0] - 2016-06-08

* [M] **Add iOS support**, with some limitations, most notably:
    - When the user focuses on an input *inside a Modal*, the browser scrolls to the top of the page. This is a known issue with Mobile Safari that appeared years ago (!!).
    - The `FOCUS` and `BLUR` commands on Inputs do not work correctly in Mobile Safari. Apparently `focus()` can only be called from within a `click` event handler, but I couldn't find the way to trigger the `click` handler programmatically.
    - *Any suggestion on how to solve these issues is welcome!*
* [M] DateInput: when the `lang` prop is used, the component changes its internal value whenever `lang` changes, to reflect the new applicable format.
* LargeMessage: allow style customisation.
* Bugfixes:
    - SelectCustom: fix bug where keyboard shortcuts were unregistered when props changed.
    - SelectCustom: fix value provided to the `onClickItem` handler.
    - ListPicker: don't highlight the Select's current value when hovering a separator.
    - HOCs: fix `displayName`.

## [0.5.0] - 2016-05-25

* [M] **Add SSR support**:
    - Prevent access to `document` or `window` at the server side, at least in unsafe parts (not event handlers, module initialisation, etc.)
    - Initialise Textarea input's height to a very low value, so that it does not render in SSR very large and then shrink in the browser

## [0.4.2] - 2016-05-25

* **Bugfix**: Reposition floats for inputs in modals.

## [0.4.1] - 2016-05-22

* **Bugfix**: Execute `FOCUS` and `BLUR` commands asynchronously, so that owner of Input component doesn't find a `null` ref in a `focus`/`blur` handler.
* **Bugfix**: Correct validation error colors (compare against last validated value).
* **Bugfix**: Correct repositioning of error message floats when anchor resizes.
* **Bugfix**: Correct pass/stop behaviour for ESC/RETURN keys within modals.
* Add `stopPropagation()` helper function.

## [0.4.0] - 2016-05-22

* **Breaking**: Hints: merge `arrows` and `labels` props into a single `elements` prop.
* **Bugfix**: Hints: upon `hintShow()`, only add a hint screen to the disabled list if not already there.

## [0.3.1] - 2016-05-21

* Style override for both SelectNative and SelectCustom is now called the same: `style`.
* Documentation tweaks.

## 0.3.0 - 2016-05-20

* First public release.

[0.13.4]: https://github.com/guigrpa/giu/compare/v0.13.3...v0.13.4
[0.13.3]: https://github.com/guigrpa/giu/compare/v0.13.2...v0.13.3
[0.13.2]: https://github.com/guigrpa/giu/compare/v0.13.1...v0.13.2
[0.13.1]: https://github.com/guigrpa/giu/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/guigrpa/giu/compare/v0.12.3...v0.13.0
[0.12.3]: https://github.com/guigrpa/giu/compare/v0.12.2...v0.12.3
[0.12.2]: https://github.com/guigrpa/giu/compare/v0.12.1...v0.12.2
[0.12.1]: https://github.com/guigrpa/giu/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/guigrpa/giu/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/guigrpa/giu/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/guigrpa/giu/compare/v0.10.2...v0.11.0
[0.10.2]: https://github.com/guigrpa/giu/compare/v0.10.1...v0.10.2
[0.10.1]: https://github.com/guigrpa/giu/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/guigrpa/giu/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/guigrpa/giu/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/guigrpa/giu/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/guigrpa/giu/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/guigrpa/giu/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/guigrpa/giu/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/guigrpa/giu/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/guigrpa/giu/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/guigrpa/giu/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/guigrpa/giu/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/guigrpa/giu/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/guigrpa/giu/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/guigrpa/giu/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/guigrpa/giu/compare/v0.3.0...v0.3.1
