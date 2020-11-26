# weird-json

A menagerie of strange, encoded JSONs, for connoisseurs.

# what?

JSON superset, supporting BigInts, TypedArrays, null, undefined and Symbol.

Supports the full 17-plane Unicode 13, and codes it down to ASCII without Base64. HUZZAH!

## testimonials

----------

> Go where no Unicode JSON has gone before. Go where only ASCII can!
>
> &mdash; J. (Son) F. Kennedy

----------

> You stole our goddamn alphabet!
>
> &mdash; NATO

----------

> What's the point of this? I mean it's clearly a joke, but... Why? Oh yeah, let's invent a new incompatible standard. Great idea. Just a reminder to everyone, don't use this in production! 
>
> &mdash; Top comment on HN :pout:

----------

> This sucks. Real JSON is waay better than OP. Or at least use Protobuf, it's popular and created by Google, or bson. Don't use this, it's clearly a security nightmare.
>
> &mdash; Second Top comment on HN :vomiting_face:	

----------

> Hmm, interesting idea. Have you ever heard of Base64? Just curious why you chose to name it 46? And why JSON? There's specific definitions of 46, and JSON, and they don't say anything about this. Did I miss something in the JSON spec?
> 
> &mdash; Third top comment on HN :japanese_goblin:

----------

## get to know the current JSONs-in-residence

The merry little band of tricksters: *JSON46*, *JSON36*, *JSON37* and ever-affable *JSON38*

### JSON46

Forged in the fires of Mordor, the hand-polished 46 runic sigils of our exclusive 46 line cover all your possible use cases. You can make a Chinese JSON, an emoji JSON, and then safely protect it and in the darkness bind it so only 36 alphanumerics plus 7 unique JSON structural symbols, plus 3 highly-coveted numeric specifiers (`e`, `+` and `-`) are present.  

Features:

- alphabet: a-z, 0-9, `:,"[]{}.+-`
- JSON superset, supports BigInt, TypedArrays, null, undefined and Symbol

Complete ASCII. Complete URL safe. But not safe enough? Try *JSON36*. :tada:

### JSON36

Like JSON46, but encoded again into the 36ers: a-z, 0-9. Fully [NATO](https://www.nato.int/cps/fr/natohq/declassified_136216.htm) [compliant](https://archives.nato.int/phonetic-alphabet;isad).

### JSON37

Like JSON46, but compressed with LZW, then encoded into the 36ers: a-z, 0-9 plus `.` Also, NATO phonetic alphabet compliant.

### JSON38

Like JSON37, but separated into stanzas separted by `-` dash. Also, NATO phonetic alphabet OK.

## example

From the tests:
```js
  const a = {
    name: 'Cris',
    age: 36,
    mmm: undefined,
    code: 3948573458972n,
    hello: true,
    great: null,
    hi: NaN,
    xchakka: -Infinity,
    bigExp: 2.95e77,
    smallExp: 1.93e-81,
    azza: new Uint8Array([9,10,11]),
    happiness: [
      { object: 999999n, z: NaN, p: Symbol.for("hello-kitty") },
      null,
      "CRIS",
      238947,
      undefined,
      NaN,
      2234.1231,
      34589358794234233498752345789345n,
      { great: [true, false] },
      [ "ok", Infinity ],
      new Float64Array([1.123e+123, 9.06233419e-94])
    ]
  };
  
  const aStr = JSON46.stringify(a);
  
  /***
  
  '{"0032002p0031002t":"001v0036002x0037","002p002v002t":"r10","003100310031":"u","002r0033002s002t":"o1edy6os2k","002w002t003000300033":"a","002v0036002t002p0038":"v","002w002x":"w","003c002r002w002p002z002z002p":"z-","002q002x002v001x003c0034":"s2.95e+77","00370031002p00300030001x003c0034":"s1.93e-81","002p003e003e002p":"x19.a.b","002w002p00340034002x0032002t00370037":[{"0033002q002y002t002r0038":"olflr","003e":"w","0034":"y002w002t0030003000330019002z002x00380038003d"},"v","001v002a0021002b","r54df","u","w","r1q2.4fjcq9k7","o2l5hrv15xy2864k787t7l",{"002v0036002t002p0038":["a","b"]},["0033002z","z+"],"x81.123e+123f9.06233419e-94"]}'
  
  ***/
  
  const aStr2 = JSON36.stringify(a);
  
  /***
  
  'dga0032002p0031002taba001v0036002x0037aca002p002v002tabar10aca003100310031abauaca002r0033002s002tabao1eddy6os2kaca002w002t003000300033abadaaca002v0036002t002p0038abavaca002w002xabawaca003dc002r002w002p002z002z002pabazdiaca002q002x002v001x003dc0034abas2dk95edj77aca00370031002p00300030001x003dc0034abas1dk93edi81aca002p003e003e002pabax19dkdadkdbaca002w002p00340034002x0032002t00370037abdedga0033002q002y002t002r0038abaolflraca003eabawaca0034abay002w002t0030003000330019002z002x00380038003ddadhcavaca001v002da0021002dbacar54ddfacauacawacar1q2dk4fjdcq9k7acao2l5hrv15xy2864k787t7lacdga002v0036002t002p0038abdeadaacadbadfdhcdea0033002zacazdjadfcax81dk123edj123f9dk06233419edi94adfdh'
  
  ***/
  
  const revivedA = JSON36.parse(aStr2);
  
  /***
  
  a = {
    name: 'Cris',
    age: 36,
    mmm: undefined,
    code: 3948573458972n,
    hello: true,
    great: null,
    hi: NaN,
    xchakka: -Infinity,
    bigExp: 2.95e77,
    smallExp: 1.93e-81,
    azza: new Uint8Array([9,10,11]),
    happiness: [
      { object: 999999n, z: NaN, p: Symbol.for("hello-kitty") },
      null,
      "CRIS",
      238947,
      undefined,
      NaN,
      2234.1231,
      34589358794234233498752345789345n,
      { great: [true, false] },
      [ "ok", Infinity ],
      new Float64Array([1.123e+123, 9.06233419e-94])
    ]
  };
  
  ***/
  

```

## design

- can I have a Jason format that effortlessly supports Unicode everywhere without any problems?
- can I have a text and coding format to make everything ASCII for transport that isn't affected by different apis for base64 and no JS and the browser?
- can I have a Jason that supports Biggins and typed arrays as well as null undefined and symbols?
- is there a encoding to ASCII text that I can easily access in JavaScript in the browser and in node without writing it myself nor importing a dependency?
- what if I want to say JSON over the telephone or radio?

All these encoding designs are inspired by the availability of base 36 in Node and Browser, and also in people's brains.

## get 

Them all:

```console
$ npm i --save weird-json
```

Or just one:

```console
$ npm i --save json36
```

## use

```js
import {JSON36} from 'weird-json';
import JSON46 from 'json46';
import json37 from 'json37';
```

## Technical Details

We aim for equality based on [assert.deepStrictEqual](https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message), which has the following specifications:

- Primitive values are compared using the SameValue Comparison, used by Object.is().
- Type tags of objects should be the same.
- [[Prototype]] of objects are compared using the Strict Equality Comparison.
- Only enumerable "own" properties are considered.
- Error names and messages are always compared, even if these are not enumerable properties.
- Enumerable own Symbol properties are compared as well.
- Object wrappers are compared both as objects and unwrapped values.
- Object properties are compared unordered.
- Map keys and Set items are compared unordered.
- Recursion stops when both sides differ or both sides encounter a circular reference.
- WeakMap and WeakSet comparison does not rely on their values. See below for further details.

## Roadmap

- [x] add support for BigInt
- [x] add support for NaN, Infinity, null and undefined
- [x] add typedarray support
- [x] support floating point exponent notification
- [x] add symbol support
- [ ] implement json37, and json38
- [ ] Add support for Map, Set
- [ ] Add support for WeakMap, WeakSet
- [ ] Add support for Date
