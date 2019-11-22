# Changelog

## Next Release

* Hardened `StreamValue` so that missing "type" or missing "value" does not cause an exception.

## 0.0.5

* All `Field`s now accept a label parameter on `__init__()`
* All `Field`s now accept a default parameter on `__init__()` and pass this value out to the JavaScript if it is set.
* Allowed the Python StreamField to determine `Block` type by name to allow conversion from Wagtail `StreamField`s
* Created a React Component for UnknownBlock and caused StreamBlock to use it if the type is `UnknownBlock`.
* Added more classes and functions to the `window.asf` object for use by derivative applications.
* Allowed `PageChooserField` to receive a `target_model` and `can_choose_root` arguments that are passed to the JavaScript to limit potential pages.

## 0.0.4

* added ReadOnlyCharField
* added StructBlockField
* added PageChooserField including new chooser url to retrieve page data.

## 0.0.3

Initial release.