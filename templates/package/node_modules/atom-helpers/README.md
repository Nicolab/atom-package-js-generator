# atom-helpers

[![Actual version published on NPM](https://badge.fury.io/js/atom-helpers.png)](https://www.npmjs.org/package/atom-helpers)

A Node.JS package that provides helpers for Atome.io packages development.


## Install

```shell
npm install atom-helpers
```


## Usage

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
