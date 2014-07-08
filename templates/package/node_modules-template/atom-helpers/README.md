# atom-helpers

[![Actual version published on NPM](https://badge.fury.io/js/atom-helpers.png)](https://www.npmjs.org/package/atom-helpers)

A Node.JS package that provides helpers for Atom.io packages development.


## Install

```shell
npm install atom-helpers
```


## Usage

### extends

`extends` of coffeeScript
```coffee
class MyView extends View
```

to vanilla JS
```js
var helpers = require('atom-helpers');

helpers.extends(MyView, View);
```

See an example of behavior in the [unit tests file](https://github.com/Nicolab/atom-helpers/blob/master/test/index.js#L14).


### editor

#### editor.getCurrentBuffer()

Get the current pane buffer.
Returns the buffer `atom.workspace.activePaneItem.buffer` or `null`.

```js
var buffer = helpers.editor.getCurrentBuffer();
```

`buffer` === `atom.workspace.activePaneItem.buffer`


#### editor.getCurrentFile()

Get the current `File` instance.
Returns an instance of [File](https://atom.io/docs/api/v0.110.0/api/classes/File.html) or `null`.

```js
// Object: File
var currentFile = helpers.editor.getCurrentFile();
```

`currentFile` is an instance of [File](https://atom.io/docs/api/v0.110.0/api/classes/File.html).


#### editor.getCurrentFilePath()

Get the current file path.
Returns the absolute file path (`string`) or `null`

```js
// string: /my-project/the-current-active-file.js
var currentFilePath = helpers.editor.getCurrentFilePath();
```

`currentFilePath` is the absolute path of the current active file.


## Unit tests

`atom-helpers` is unit tested with [Unit.js](https://github.com/unitjs/unit.js)

Run the tests
```shell
cd node_modules/atom-helpers

npm test
```


## LICENSE

[MIT license](https://github.com/Nicolab/atom-helpers/blob/master/LICENSE)


## Author

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Support via Gittip](http://img.shields.io/gittip/Nicolab.svg)](https://www.gittip.com/Nicolab/) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC)
