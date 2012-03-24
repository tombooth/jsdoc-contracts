
var Attribute = require('./attribute.js');


function Fn(name, source, pre, post, ignore) {
   this.out = this.out.bind(this);

   this.name = name;
   this.source = source;
   this.pre = pre;
   this.post = post;

   this.should_wrap = !ignore && ((this.pre && this.pre.length > 0) || 
                                     (this.post && this.post.length > 0));

   //console.log('new function', name, source, pre, post, this.should_wrap);
}


Fn.prototype.out = function(s) { 
   var fn_match = /\{(.*)\}$/.exec(this.source),
       return_regexp = /([^_]?)return([^;\}]*);?/g,
       body = fn_match[1],
       return_var = this._get_return_var(),
       out = '',
       predicates, statements, wrapped;

   /*console.log('------------------------\n\nwrapping');
   console.log('body', body);*/

   if (this.pre && this.pre.length > 0) {
      predicates = this.pre.map(function(attr) { return attr.predicate; });
      statements = predicates.map(function(p) { return 'if(' + p + '){throw new Error();}' }).join('else ');

      //console.log('pre', statements);

      body = statements + 'else{' + body + '}';
   }

   if (this.post && this.post.length > 0) {
      predicates = this.post.map(function(attr) { return attr.predicate.replace(/##out##/g, return_var); });
      statements = predicates.map(function(p) { return 'if(' + p + '){throw new Error();}' }).join('else ');

      //console.log('post', statements);

      while (return_match = return_regexp.exec(body)) {

         wrapped = '{var ' + return_var + ' =' + return_match[2] + ';';
         wrapped += statements + 'else{return ' + return_var + '}}';

         body = body.substring(0, return_match.index + return_match[1].length) + wrapped + body.substr(return_match.index + return_match[0].length);

         return_regexp.lastIndex += wrapped.length - return_match[0].length;
      }
   }

   out += this.source.substring(0, fn_match.index + 1);
   out += body;
   out += '}';

   //console.log('\n--------------------------\n\n');

   return out;
}


Fn.prototype._get_return_var = function() {
   return '___return';
};


Fn.parse = function(node, text_before) {
   var jsdoc_match = /\/\*\*([^\/]+)\*\/[\s]*$/.exec(text_before),
       jsdoc = (jsdoc_match) ? jsdoc_match[1] : null,
       pre = [ ], post = [ ], ignore = false;
       

   if (jsdoc) {
      while (attribute = Attribute.parse(jsdoc)) {
         switch (attribute.type) {
            case 'param':
            case 'pre':
               pre.push(attribute);
               break;

            case 'return':
            case 'returns':
            case 'post':
               post.push(attribute);
               break;

            case 'ignore':
               ignore = true;
               break;
         }
      }
   }

   return new Fn(node.label(), node.source(), pre, post, ignore);
};


module.exports = Fn;
