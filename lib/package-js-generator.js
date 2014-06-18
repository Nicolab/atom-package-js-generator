/**
 * @name package-js-generator (main)
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/atom-package-js-generator
 * @license MIT https://github.com/Nicolab/atom-package-js-generator/blob/master/LICENSE
 */

var PackageJsGeneratorView = require('./package-js-generator-view');
var path = require('path');

module.exports = {
  packageJsGeneratorView: null,

  configDefaults: {
    packagesPath: path.join(__dirname, '..', '..')
  },


  activate: function(state) {
    return this.packageJsGeneratorView =
      new PackageJsGeneratorView(state.packageJsGeneratorViewState);
  },

  deactivate: function() {
    return this.packageJsGeneratorView.destroy();
  },

  serialize: function() {
    return {
      packageJsGeneratorViewState: this.packageJsGeneratorView.serialize()
    };
  }
};
