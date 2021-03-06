

function Attribute(type, predicate, message) {

   this.type = type;
   this.predicate = predicate;
   this.message = message;

}




var lastIndicies = { },
    attrib_regex = /@([a-zA-Z0-9]+)([^@\*]*)/g,
    type_regex = /^\{([A-Za-z0-9]+)\}/;

Attribute.type_predicates = {
   'number': 'typeof ##argument## === "number"'
};


Attribute.set_type_predicates = function() { };

Attribute.parse = function(jsdoc) {
   var attribute = null,
       predicate = '',
       match, attrib_type, attrib_body,
       arg_match, return_match, type_match, optional, arg, message;

   attrib_regex.lastIndex = lastIndicies[jsdoc] || 0;

   match = attrib_regex.exec(jsdoc);
   
   if (match) {
      attrib_body = match[2].trim();
      attrib_var_type = (type_match = type_regex.exec(attrib_body)) ? type_match[1].toLowerCase() : null;

      if (attrib_var_type) attrib_body = attrib_body.substr(type_match[0].length).trim();

      switch (match[1]) {
         case 'param':
            arg = (arg_match = /^([A-Za-z0-9\[\]]+)/.exec(attrib_body)) ? arg_match[1] : null;

            if (arg) {
               optional = arg[0] === '[';

               if (optional) {
                  arg = arg.replace(/\[|\]/g, '');
                  predicate += arg + ' !== undefined && ';
               }

               predicate += '!(' + Attribute.type_predicates[attrib_var_type].replace(/##argument##/g, arg) + ')';
               message = 'Type check failed on ' + arg + '. Expected ' + attrib_var_type;
            }
            break;
         case 'return':
         case 'returns':
            predicate = '!(' + Attribute.type_predicates[attrib_var_type].replace(/##argument##/g, '##out##') + ')';
            message = 'Type check failed on return. Expected ' + attrib_var_type;
            break;
         case 'pre':
         case 'post':
            predicate = '!(' + attrib_body + ')';
            message = match[1].toUpperCase() + ' failed. Expected ' + attrib_body;
            break;
         case 'ignore':
            break;
      }

      attribute = new Attribute(match[1], predicate, message);
   }

   lastIndicies[jsdoc] = attrib_regex.lastIndex;

   return attribute;
};



module.exports = Attribute;
