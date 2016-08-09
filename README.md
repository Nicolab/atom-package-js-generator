# package-js-generator package

> __No longer maintained:__ Now the official Atom package generator support the Javascript!

[A package for Atom.io](https://atom.io/packages/package-js-generator)

Generate Atom.io packages in Javascript.

The command `package-generator:generate-package` provided by Atom generate a package in CoffeeScript.
_package-js-generator_ package provides the command `package-js-generator:generate-package`
that generates a package in Javascript.

The package generated contains the "node_modules/[atom-helpers](https://github.com/Nicolab/atom-helpers)",
in order to facilitate some cases of package development (`extends(MyView, View)`, get current file, get current buffer, ...).


## Install

```sh
apm install package-js-generator
```
Or Settings ➔ Packages ➔ Search for `package-js-generator`


## LICENSE

[MIT](https://github.com/Nicolab/atom-package-js-generator/blob/master/LICENSE.md)


## Author

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |
