
(function() {

   /* a comment*/
   function inc(i) {
      /* comment */
      return i+1;
   }
   /* blah */

   /**
    * @type {Number}
    */
   inc.prototype.foo = 0;

   /**
    * JSDoc comment
    * @param {Number} i number to decrement
    * @param {Number} [n] number to decriment by, defauls to 1
    * @returns {Number} decrimented number
    */
   inc.prototype.dec = function dec(i, n) {
      n = n || 1;
      return i-n;
   }

   /* blah blah*/
   console.log(inc(2));
   console.log(inc.prototype.dec('asdf'));

})();


