
(function() {

   /**
    * JSDoc comment
    * @pre i > 0
    * @post ##out## > 0
    * @param {Number} i number to decrement
    * @param {Number} [n] number to decriment by, defauls to 1
    * @returns {Number} decrimented number
    */
   function inc(i, n) {
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
    * @pre i > 0
    * @post ##out## > 0
    * @param {Number} i number to decrement
    * @param {Number} [n] number to decriment by, defauls to 1
    * @returns {Number} decrimented number
    * @ignore
    */
   inc.prototype.dec = function dec(i, n) {
      n = n || 1;
      if (n < 0) return i+n;
      else return i-n;
   }
   
   /**
    * Decrement a number by a given amount which defaults to 1
    * 
    * @param {Number} i   Number to be decremented
    * @param {Number} [n] How much to take away from i, defaults to 1
    * @pre i > 0
    * 
    * @returns {Number}
    * @post ##out## > 0
    */
   function dec(i, n) {
      n = n || 1;
      return i - n;
   }


   /* blah blah*/
   console.log(inc(2));
   console.log(inc.prototype.dec('asdf'));

})();


