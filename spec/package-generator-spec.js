/**
 * @name package-js-generator (spec)
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/atom-package-js-generator
 * @license MIT https://github.com/Nicolab/atom-package-js-generator/blob/master/LICENSE.md
 */

var path           = require('path');
var fs             = require('fs-plus');
var temp           = require('temp');
var WorkspaceView  = require('atom').WorkspaceView;

describe('Package Generator', function() {

  var activationPromise = [][0];

  beforeEach(function() {
    atom.workspaceView = new WorkspaceView();
    atom.workspaceView.openSync('sample.js');

    activationPromise = atom.packages.activatePackage('package-js-generator');

    return activationPromise;
  });

  describe('when package-js-generator:generate-package is triggered', function() {

    it('displays a miniEditor with the correct text and selection', function() {

      atom.workspaceView.trigger('package-js-generator:generate-package');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {

        var base;
        var fullPath;

        var packageJsGeneratorView = atom.workspaceView.find('.package-js-generator').view();
        var packageName = packageJsGeneratorView.miniEditor.editor.getSelectedText();

        expect(packageName).toEqual('my-package');

        fullPath = packageJsGeneratorView.miniEditor.editor.getText();
        base     = atom.config.get('package-js-generator.packagesPath');

        expect(fullPath).toEqual(path.join(base, 'my-package'));
      });
    });
  });

  describe('when core:cancel is triggered', function() {

    it('detaches from the DOM and focuses the the previously focused element', function() {

      atom.workspaceView.attachToDom();
      atom.workspaceView.trigger('package-js-generator:generate-package');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {

        var packageJsGeneratorView = atom.workspaceView
          .find('.package-js-generator').view();

        expect(packageJsGeneratorView.miniEditor.isFocused).toBeTruthy();
        expect(atom.workspaceView.getActiveView().isFocused).toBeFalsy();

        packageJsGeneratorView.trigger('core:cancel');

        expect(packageJsGeneratorView.hasParent()).toBeFalsy();
        expect(atom.workspaceView.getActiveView().isFocused).toBeTruthy();
      });

    });
  });

  describe('when a package is generated', function() {

    var packageName, packagePath, packageRoot, packageJsGeneratorView;

    beforeEach(function() {

      spyOn(atom, 'open');

      packageRoot = temp.mkdirSync('atom');
      packageName = 'sweet-package-dude';
      packagePath = path.join(packageRoot, packageName);

      return fs.removeSync(packageRoot);
    });

    afterEach(function() {
      return fs.removeSync(packageRoot);
    });

    it("forces the package's name to be lowercase with dashes", function() {

      packageName = 'CamelCaseIsForTheBirds';
      packagePath = path.join(path.dirname(packagePath), packageName);

      atom.workspaceView.trigger('package-js-generator:generate-package');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {

        var pgExecute;

        packageJsGeneratorView = atom.workspaceView.find('.package-js-generator').view();

        packageJsGeneratorView.getPackagesDirectory = function() {
          return packageRoot;
        };

        packageJsGeneratorView.miniEditor.setText(packagePath);

        pgExecute = spyOn(packageJsGeneratorView, 'initPackage');

        packageJsGeneratorView.trigger('core:confirm');

        expect(pgExecute).toHaveBeenCalled();
        expect(pgExecute.mostRecentCall.args[0]).toEqual(path.join(path.dirname(packagePath), 'camel-case-is-for-the-birds'));
      });
    });

    describe('when creating a package', function() {

      beforeEach(function() {

        atom.workspaceView.trigger('package-js-generator:generate-package');

        waitsForPromise(function() {
          return activationPromise;
        });
      });


      describe('when the package is created inside the packages directory', function() {

        it('calls `initPackage`', function() {

          var pgExecute;
          var packageJsGeneratorView = atom.workspaceView.find('.package-js-generator').view();

          expect(packageJsGeneratorView.hasParent()).toBeTruthy();

          packageJsGeneratorView.miniEditor.setText(packagePath);

          pgExecute = spyOn(packageJsGeneratorView, 'initPackage').andCallFake(function(packagePath, callback) {

            return process.nextTick(function() {
              return callback();
            });
          });

          packageJsGeneratorView.trigger('core:confirm');

          waitsFor(function() {
            return atom.open.callCount;
          });

          runs(function() {
            expect(pgExecute.argsForCall[0][0]).toEqual(packagePath);
            expect(atom.open.argsForCall[0][0].pathsToOpen[0]).toBe(packagePath);

            expect(pgExecute.argsForCall[1]).toBeUndefined();
          });
        });
      });
    });

    it('displays an error when the package path already exists', function() {

      atom.workspaceView.attachToDom();
      fs.makeTreeSync(packagePath);
      atom.workspaceView.trigger('package-js-generator:generate-package');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {

        var packageJsGeneratorView = atom.workspaceView
          .find('.package-js-generator').view();

        packageJsGeneratorView.getPackagesDirectory = function() {
          return packageRoot;
        };

        expect(packageJsGeneratorView.hasParent()).toBeTruthy();
        expect(packageJsGeneratorView.error.text()).toBe('');

        packageJsGeneratorView.miniEditor.setText(packagePath);
        packageJsGeneratorView.trigger('core:confirm');

        expect(packageJsGeneratorView.hasParent()).toBeTruthy();
        expect(packageJsGeneratorView.error.text().length > 1).toBe(true);
      });
    });

    it('opens the package', function() {

      atom.workspaceView.trigger('package-js-generator:generate-package');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {
        var pgExecute, loadPackage;
        var packageJsGeneratorView = atom.workspaceView
          .find('.package-js-generator').view();

        packageJsGeneratorView.miniEditor.setText(packagePath);

        pgExecute = spyOn(packageJsGeneratorView, 'initPackage')
          .andCallFake(function(packagePath, callback) {

          return process.nextTick(function() {
            return callback();
          });
        });

        loadPackage = spyOn(atom.packages, 'loadPackage');

        packageJsGeneratorView.trigger('core:confirm');
      });

      waitsFor(function() {
        return atom.open.callCount === 1;
      });

      runs(function() {
        return expect(atom.open).toHaveBeenCalledWith({
          pathsToOpen: [packagePath]
        });
      });
    });
  });
});
