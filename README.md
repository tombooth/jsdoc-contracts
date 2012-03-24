
Simple design by contracts system expressed using jsdoc.

Installation
--------------

```
$ npm install -g jsdoc-contracts
```


Usage
--------------

In your code:

```javascript
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
```

Would generate:

```javascript
function dec(i, n) {
    if (!(typeof i === "number")) {
        throw new Error(...);
    } else if (n !== undefined && !(typeof n === "number")) {
        throw new Error(...);
    } else if (!(i > 0)) {
        throw new Error(...);
    } else {
        n = n || 1;
        {
            var ___return = i - n;
            if (!(typeof ___return === "number")) {
                throw new Error(...);
            } else if (!(___return > 0)) {
                throw new Error(...);
            } else {
                return ___return;
            }
        }
    }
}

```

To do the transformation execute the following after installing

```
$ contracts <file>
$ contracts <file> > out.js
```
