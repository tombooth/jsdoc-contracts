
Simple design by contracts system expressed using jsdoc.

Usage
--------------

In your code:

```javascript
/**
 * Decrement a number by a given amount which defaults to 1
 * @param {Number} i   Number to be decremented
 * @param {Number} [n] How much to take away from i, defaults to 1
 * @returns {Number}
 */
function dec(i, n) {
   n = n || 1;
   return i - n;
}
```

Would generate:

```javascript
function dec(i, n) {
   if (typeof i !== 'number') throw new Error(...);
   else if (n && typeof n !== 'number') throw new Error(...);
   else {
      n = n || 1;
      var ___return = i - n;
      if (typeof ___return !== 'number') throw new Error(...);
      else {
         return ___return;
      }
   }
}
```

To do the transformation execute the following after npm install jsdoc-contracts:

```
$ contracts <file>
$ contracts <file> > out.js
```
