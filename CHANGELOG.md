# Changelog

## Next Release

* All `Field`s now accept a label parameter on `__init__()`
* All `Field`s now accept a default parameter on `__init__()` and pass this value out to the JavaScript if it is set.
* Allowed the Python StreamField to determine `Block` type by name to allow conversion from Wagtail `StreamField`s
* Created a React Component for UnknownBlock and caused StreamBlock to use it if the type is `UnknownBlock`.
* Added more classes and functions to the `window.asf` object for use by derivative applications.

## 0.0.4

* added ReadOnlyCharField
* added StructBlockField
* added PageChooserField including new chooser url to retrieve page data.

## 0.0.3

Initial release.