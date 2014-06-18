/**
 * @name Unit tests of atom-helpers
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 * @link https://github.com/Nicolab/atom-helpers
 * @license MIT https://github.com/Nicolab/atom-helpers/blob/master/LICENSE
 */

var test    = require('unit.js');
var helpers  = require('../');


describe('utils', function(){

  it('should extend with vanilla JS like `extends` of CoffeeScript', function(){

    var child;

    function Parent() {
      this.a = 'parent.a';
      this.b = 'parent.b';
    }

    Parent.prototype.protoA = 'Parent.protoA';
    Parent.prototype.protoB = 'Parent.protoB';

    function Child() {
      this.b = 'child.b';
      this.c = 'child.c';
    }

    Child.prototype.protoB = 'Child.protoB';
    Child.prototype.protoC = 'Child.protoC';

    test
      .function(helpers.extends)

      .given(function() {
        helpers.extends(Child, Parent); 
      })

      .then('prototype inheritance (CoffeeScript behavior)', function() {
        test
          .string(Child.prototype.protoA)
            .is('Parent.protoA')

          .string(Child.prototype.protoB)
            .is('Parent.protoB')

          .undefined(Child.prototype.protoC)
        ;
      })

      .when('prototype overload', function() {

        Child.prototype.protoB = 'Child.protoB';
        Child.prototype.protoC = 'Child.protoC';
        child = new Child();
      })

      .then('prototype (overloaded) inheritance', function() {
        test
          .string(Child.prototype.protoA)
            .is('Parent.protoA')

          .string(Child.prototype.protoB)
            .is('Child.protoB')

          .string(Child.prototype.protoC)
            .is('Child.protoC')
        ;
      })
    ;
  });
});