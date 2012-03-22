

var burrito = require('burrito');

function parse(path, fn) {
   var src = require('fs').readFileSync(path).toString('utf8'),
       lines = src.split('\n'),
       cursor = 0;

   var ret = burrito(src, function(node) {
      if (node.name == 'defun' || node.name == 'function') {
         if (node.start.line < cursor) { cursor = _cursor; }

         var jsdoc_match = /\/\*\*([^\/]+)\*\//.exec(lines.slice(cursor, node.start.line).join('')),
             jsdoc = (jsdoc_match) ? jsdoc_match[1] : null,
             attrib_regex = /@([a-zA-Z0-9]+)([^@\*]*)/g,
             type_regex = /^\{([A-Za-z0-9]+)\}/,
             fn_name = node.label(),
             params = { },
             match, attrib_type, attrib_body,
             param_match, return_match, type_match, optional, arg;

         if (jsdoc) {
            while (match = attrib_regex.exec(jsdoc)) {
               attrib_name = match[1];
               attrib_body = match[2].trim();
               attrib_type = (type_match = type_regex.exec(attrib_body)) ? type_match[1] : null;

               if (attrib_type) attrib_body = attrib_body.substr(type_match[0].length).trim();

               switch (attrib_name) {
                  case 'param':
                     arg = (param_match = /^([A-Za-z0-9\[\]]+)/.exec(attrib_body)) ? param_match[1] : null;

                     if (arg) {
                        optional = arg[0] === '[';

                        if (optional) arg = arg.replace(/\[|\]/g, '');

                        params[arg] = { 
                           type: attrib_type,
                           optional: optional
                        };
                     }
                     break;
                  case 'return':
                  case 'returns':
                     return_match = /\{([A-Za-z0-9]+)\}/.exec(attrib_body);
                     break;
               }
            }

            node.wrap(function(s) { 
               var fn_match = /\(([ A-Za-z0-9,]+)\)\{(.*)\}$/.exec(s),
                   args = fn_match[1].split(',').map(function(a) { return a.trim(); }),
                   body = fn_match[2],
                   checks = [ ],
                   out = '', arg;

               for (var i = 0, l = args.length; i < l; i++) {
                  arg = args[i];

                  if (params[arg]) {
                     checks.push('if(' + (params[arg].optional ? (arg + ' && ') : '') + 'typeof ' + arg + '!=="' + params[arg].type.toLowerCase() + 
                           '"){throw new Error("Type check failed in function ' + fn_name + ' typeof ' + arg + ' === \\"" + (typeof ' + arg + 
                           ') + "\\" typeof ' + arg + ' !== \\"' + params[arg].type.toLowerCase() + '\\", ' + 
                           arg + '=" + JSON.stringify(' + arg + '));}');
                  }
               }

               body = checks.join('else ') + 'else{' + body + '}';

               out += s.substring(0, fn_match.index);
               out += '(' + args.join(', ') + '){';
               out += body;
               out += '}';

               return out;
            });
         }

         cursor = node.end.line;
         _cursor = node.start.line;
      }
   });

   fn && fn(ret);

}

module.exports = {
   parse: parse
};
