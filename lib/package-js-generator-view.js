/**
 * @name package-js-generator (view)
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/atom-package-js-generator
 * @license MIT https://github.com/Nicolab/atom-package-js-generator/blob/master/LICENSE.md
 */

var helpers         = require('atom-helpers');
var path            = require('path');
var fs              = require('fs-plus');
var wrench          = require('wrench');
var _               = require('underscore-plus');
var _atom           = require('atom');
var $               = _atom.$;
var BufferedProcess = _atom.BufferedProcess;
var EditorView      = _atom.EditorView;
var View            = _atom.View;
var generator       = {};

/**
 * @constructor
 */
function PackageJsGeneratorView () {
  View.apply(this, arguments);
}

// inheritance like `class PackageJsGeneratorView extends View`
helpers.extends(PackageJsGeneratorView, View);

PackageJsGeneratorView.prototype.previouslyFocusedElement = null;

PackageJsGeneratorView.content = function() {

  return this.div(
    {
      'class': 'package-js-generator overlay from-top'
    },

    function() {

      this.subview('miniEditor', new EditorView({
        mini: true
      }));

      this.div({
        'class': 'error',
        outlet: 'error'
      });

      return this.div({
        'class': 'message',
        outlet: 'message'
      });

    }.bind(this));
};

PackageJsGeneratorView.prototype.initialize = function(serializeState) {

  var _this = this;

  atom.workspaceView.command('package-js-generator:generate-package', function() {
    return _this.attach('package');
  });

  this.miniEditor.hiddenInput.on('focusout', function() {
    return _this.detach();
  });

  this.on('core:confirm', function() {
    return _this.confirm();
  });

  return this.on('core:cancel', function() {
    return _this.detach();
  });
};

PackageJsGeneratorView.prototype.attach = function() {

  this.previouslyFocusedElement = $(':focus');

  this.message.text('Enter package path');

  atom.workspaceView.append(this);

  this.setPathText('my-package');

  return this.miniEditor.focus();
};

PackageJsGeneratorView.prototype.setPathText = function(placeholderName, rangeToSelect) {

  var editor            = this.miniEditor.editor;
  var packagesDirectory = this.getPackagesDirectory();
  var endOfDirectoryIndex;
  var pathLength;

  if (!rangeToSelect) {
    rangeToSelect = [0, placeholderName.length];
  }

  editor.setText(path.join(packagesDirectory, placeholderName));

  pathLength          = editor.getText().length;
  endOfDirectoryIndex = pathLength - placeholderName.length;

  return editor.setSelectedBufferRange([
    [0, endOfDirectoryIndex + rangeToSelect[0]],
    [0, endOfDirectoryIndex + rangeToSelect[1]]
  ]);
};

PackageJsGeneratorView.prototype.detach = function() {

  var focusedElement;

  if (!this.hasParent()) {
    return;
  }

  focusedElement = this.previouslyFocusedElement;

  if (focusedElement) {
    focusedElement.focus();
  }

  return PackageJsGeneratorView.__super__.detach.apply(this, arguments);
};

PackageJsGeneratorView.prototype.destroy = function() {
  return this.detach();
};

PackageJsGeneratorView.prototype.confirm = function() {

  var _this = this;

  if (this.validPackagePath()) {
    return this.createPackageFiles(function(msg) {

      var packagePath;

      packagePath = _this.getPackagePath();

      atom.open({
        pathsToOpen: [packagePath]
      });

      _this.message.text(msg);
      _this.message.show();

      setTimeout(function() {
        _this.detach();
      }, 3000);
    });
  }
};

PackageJsGeneratorView.prototype.getPackagePath = function() {

  var packagePath = this.miniEditor.getText();
  var packageName = _.dasherize(path.basename(packagePath));

  return path.join(path.dirname(packagePath), packageName);
};

PackageJsGeneratorView.prototype.getPackagesDirectory = function() {
  return atom.config.get('package-js-generator.packagesPath');
};

PackageJsGeneratorView.prototype.validPackagePath = function() {

  if (fs.existsSync(this.getPackagePath())) {

    this.error.text("Path already exists at '" + (this.getPackagePath()) + "'");
    this.error.show();

    return false;

  } else {
    return true;
  }
};

PackageJsGeneratorView.prototype.initPackage = function(packagePath, callback) {
  return generator.run(packagePath, callback);
};

PackageJsGeneratorView.prototype.createPackageFiles = function(callback) {
  return this.initPackage(this.getPackagePath(), callback);
};


/*----------------------------------------------------------------------------*\
  Generator
\*----------------------------------------------------------------------------*/

generator.run = function(packagePath, callback) {

  var templatePath;

  if (packagePath && packagePath.length > 0) {

    packagePath  = path.resolve(packagePath);
    templatePath = path.resolve(__dirname, '..', 'templates', 'package');

    this.generateFromTemplate(packagePath, templatePath);

    return callback('Package JS generated :)');

  } else if (packagePath) {
    return callback('You must specify a package path');
  } else {
    return callback('You must specify the package generator.');
  }
};

generator.generateFromTemplate = function(packagePath, templatePath) {

  var childPath;
  var content;
  var contents;
  var relativePath;
  var sourcePath;
  var templateChildPath;
  var files;
  var packageName = path.basename(packagePath);

  fs.makeTreeSync(packagePath);

  files = generator.listRecursive(templatePath);

  for (var i = 0, len = files.length; i < len; i++) {

    childPath         = files[i];
    templateChildPath = path.resolve(templatePath, childPath);

    relativePath = templateChildPath.replace(templatePath, '');
    relativePath = relativePath.replace(/^\//, '');
    relativePath = relativePath.replace(/\.template$/, '');
    relativePath = this.replacePackageNamePlaceholders(relativePath, packageName);
    sourcePath   = path.join(packagePath, relativePath);

    if (fs.existsSync(sourcePath)) {
      continue;
    }

    if (fs.isDirectorySync(templateChildPath)) {

      fs.makeTreeSync(sourcePath);

    } else if (fs.isFileSync(templateChildPath)) {

      fs.makeTreeSync(path.dirname(sourcePath));

      contents = fs.readFileSync(templateChildPath).toString();
      content  = this.replacePackageNamePlaceholders(contents, packageName);

      fs.writeFileSync(sourcePath, content);
    }
  }

  fs.renameSync(
    path.join(packagePath, 'node_modules-template'),
    path.join(packagePath, 'node_modules')
  );
};

generator.replacePackageNamePlaceholders = function(string, packageName) {
  var placeholderRegex = /__(?:(package-name)|([pP]ackageName)|(package_name))__/g;
  var _this = this;

  return string.replace(placeholderRegex, function(match, dash, camel, underscore) {
    if (dash) {
      return _this.dasherize(packageName);

    } else if (camel) {

      if (/[a-z]/.test(camel[0])) {

        packageName = packageName[0].toLowerCase() + packageName.slice(1);
        
      } else if (/[A-Z]/.test(camel[0])) {

        packageName = packageName[0].toUpperCase() + packageName.slice(1);
      }

      return _this.camelize(packageName);

    } else if (underscore) {
      return _this.underscore(packageName);
    }
  });
};

generator.listRecursive = function(directoryPath) {
  return wrench.readdirSyncRecursive(directoryPath);
};

generator.dasherize = function(string) {

  string = string[0].toLowerCase() + string.slice(1);

  return string.replace(/([A-Z])|(_)/g, function(m, letter, underscore) {
    return letter ? '-' + letter.toLowerCase() : '-';
  });
};

generator.camelize = function(string) {
  return string.replace(/[_-]+(\w)/g, function(m) {
    return m[1].toUpperCase();
  });
};

generator.underscore = function(string) {

  string = string[0].toLowerCase() + string.slice(1);

  return string.replace(/([A-Z])|(-)/g, function(m, letter, dash) {
    return letter ? '_' + letter.toLowerCase() : '_';
  });
};



module.exports = PackageJsGeneratorView;
