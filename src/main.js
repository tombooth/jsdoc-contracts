

var burrito = require('burrito'),
    Fn = require('./fn.js');

function parse(path, fn) {
   var src = require('fs').readFileSync(path).toString('utf8'),
       lines = src.split('\n'),
       cursor = 0;

   var out = burrito(src, function(node) {
      if (node.name == 'defun' || node.name == 'function') {
         if (node.start.line < cursor) { cursor = _cursor; } // to handle the case of functions in functions

         var fn = Fn.parse(node, lines.slice(cursor, node.start.line).join(''));

         if (fn.should_wrap) node.wrap(fn.out);

         cursor = node.end.line;
         _cursor = node.start.line;
      }
   });

   fn && fn(out);
}

module.exports = {
   parse: parse
};
