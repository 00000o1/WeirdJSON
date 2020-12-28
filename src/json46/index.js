//import JSON36 from 'json36';
//import {encode as encode36,decode as decode36} from 'json36';
import JSON36 from '../json36/index.js';
import {encode as encode36,decode as decode36} from '../json36/index.js';


// for Date
class WrapDate {
  constructor(dateObj) {
    if ( !(dateObj instanceof Date) ) {
      throw new Error(`Date only!`);
    }
    this.$ = dateObj;
  }
}

// alphabet: 0-9a-z":,[]{}-+.
const JSON46 = {
  parse,
  stringify,
  clone
};

const TypedArray = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array)).constructor;

const isTypedArray = val => {
  try {
    return Object.getPrototypeOf(Object.getPrototypeOf(val)).constructor == TypedArray;
  } catch(e) {
    return false;
  }
};

const TA = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
];

const whatTACode = new Map(TA.map((con, i) => [con, i]));
const whatTA = new Map(TA.map((con, i) => [i, con]));

// currently we are not using fixed width fields for typed arrays
const width36TA = {
  "Int8Array":            3,
  "Uint8Array":           2,
  "Uint8ClampedArray":    2,
  "Int16Array":           Math.ceil(Math.log(2**16)/Math.log(36)) + 1,
  "Uint16Array":          Math.ceil(Math.log(2**16)/Math.log(36)),
  "Int32Array":           Math.ceil(Math.log(2**32)/Math.log(36)) + 1,
  "Uint32Array":          Math.ceil(Math.log(2**32)/Math.log(36)),
                          // we don't convert floats to base 36
  "Float32Array":         11,   
  "Float64Array":         21, 
  "BigInt64Array":        Math.ceil(Math.log(2**64)/Math.log(36)) + 1,  
  "BigUint64Array":       Math.ceil(Math.log(2**64)/Math.log(36)),    
}

// clever trick to get undefined to work
const WillBecomeUndefined = Symbol('[[WillBecomeUndefined]]');

export default JSON46;

export function clone(thing) {
  return parse(stringify(thing));
}

export function parse(text, reviver = a => a, asciiOnly = true) {
  if ( asciiOnly ) {
    // base 36/46 we don't care about caps! OO RAH
    text = text.toLocaleLowerCase();
  }
  const result = JSON.parse(text, weirdReviver(reviver, asciiOnly));
  return result;
}

export function stringify(value, replacer = b => b, space = 0, asciiOnly = true) {
  const result = JSON.stringify(value, weirdReplacer(replacer, asciiOnly), space);
  return result;
}

function weirdReplacer(replacer, asciiOnly = true) {
  return function (key, value) {
    if ( isObject(value) ) {
      value = encodeKeys(value, asciiOnly);
    } else if ( ! Array.isArray(value) ) {
      value = encode(value, asciiOnly);
    }
    return value;
  };
}

function weirdReviver(reviver, asciiOnly = true) {
  return function (key, value) {
    const that = this;
    if ( isObject(value) ) {
      value = decodeKeys(value, asciiOnly);
    } else if ( Array.isArray(value) ) {
      value.forEach((v,i) => {
        if ( v === WillBecomeUndefined ) {
          value[i] = undefined;
        }
      });
    } else if ( typeof value == "string" ) {
      value = decode(value, that, key, asciiOnly);
    }
    return value;
  };
}

function encodeKeys(obj, asciiOnly = true) {
  const newObj = {};
  for( const key of Object.keys(obj) ) {
    let setKey = key;
    if ( asciiOnly ) {
      const encodedKey = encode(key);
      newObj[encodedKey] = obj[key];
      setKey = encodedKey;
    } else {
      newObj[key] = obj[key];
    }
    if ( newObj[setKey] instanceof Date ) {
      // this is necessary because Date is processed specially
      // presumable because it has a toJSON method
      newObj[setKey] = new WrapDate(obj[key]);
    }
  }
  return newObj;
}

function decodeKeys(obj, asciiOnly = true) {
  const oldObj = {};
  for( const encodedKey of Object.keys(obj) ) {
    let setKey = encodedKey;
    if ( asciiOnly ) {
      const decodedKey = decode(encodedKey);
      oldObj[decodedKey] = obj[encodedKey];
      setKey = decodedKey;
    } else {
      oldObj[encodedKey] = obj[encodedKey];
    }
    if ( obj[encodedKey] === WillBecomeUndefined ) {
      oldObj[setKey] = undefined;
    }
  }
  return oldObj;
}

function encode(val, asciiOnly = true) {
  const to = typeof val;

  if ( val === null ) {
    return `v`;
  } else if ( val === undefined ) {
    return `u`;
  } else if ( Number.isNaN(val) ) {
    return `w`;
  } else if ( val === Infinity || val === -Infinity ) {
    return `z${Math.sign(val) == 1 ? '+' : '-' }`;
  } else if ( to === "symbol" ) {
    const key = Symbol.keyFor(val);
    //console.log({key});
    if ( key ) {
      return `y${bin2hex(key)}`;
    } else {
      console.warn("Error on value of type Symbol", val, val.toString());
      throw new TypeError(`Sorry, the only thing we don't support is Symbols that do not have keys in the global symbol registry (i.e., Symbols not created using Symbol.for are unsupported, because there is no way to recreate them)`);
    }
  } else if ( val instanceof Function ) {
    /**
      if ( val[Symbol.for('[[referentially-transparent]]')] ) {
        return `t${bin2hex(val.toString())}`; 
      } else {
    **/
      console.warn("Error on value of type function", val, val.toString());
      //throw new TypeError(`Sorry, we do not support functions because even tho they can be converted to string values and serialized, a function has a scope, and this scope cannot currently be serialized. If you want to serialize functions, please indicate they are referentially transparent by using the global symbol with key "[[referentially-transparent]]" to set a property on the function to true`);
      throw new TypeError(`Sorry, we do not support functions because even tho they can be converted to string values and serialized, a function has a scope, and this scope cannot currently be serialized.`);
    /**}**/
  } else if ( to === "bigint" ) {
    return `o${val.toString(36)}`;
  } else if ( val === true ) {
    return 'a';
  } else if ( val === false ) {
    return 'b';
  } else if ( to === "number" ) {
    const strVal = val.toString();
    if ( strVal.includes('e') ) {
      return `s${strVal}`;
    }
    return `r${val.toString(36)}`;
  } else if ( isTypedArray(val) ) {
    return `x${specifyTypedArray(val)}${serializeTypedArray(val)}`; 
  } else if ( val instanceof Map ) {
    return `p${serializeMapOrSet(val)}`;
  } else if ( val instanceof Set ) {
    return `q${serializeMapOrSet(val)}`;
  } else if ( val instanceof WeakMap || val instanceof WeakSet ) {
    throw new TypeError(`Sorry we do not support WeakMap or WeakSet. The reason is that even tho the values can be serialized, it does not make sense to re-instantiate them because values in such collections only exist in those collections as long as they have references elsewhere in your program. When reinstantiating values from a WeakMap or WeakSet, these values will not have any other references in your code, so it does not make sense for them to be collected in a WeakSet or WeakMap. When our reinstantiation code exits, the values will not longer be guaranteed to exist in the WeakSet or WeakMap. Explore if you can use a Set or Map instead.`);
  } else if ( val instanceof WrapDate ) {
    return `t${serializeDate(val.$)}`; 
  }
  if ( asciiOnly ) {
    return bin2hex(val);
  } else {
    return val;
  }
}

function decode(val, that, key, asciiOnly = true) {
  if ( val === 'u' ) {
    return WillBecomeUndefined;
  } else if ( val === 'v' ) {
    return null;
  } else if ( val === 'w' ) {
    return NaN;
  } else if ( val[0] === 'z' ) {
    return val[1] === '+' ? Infinity : -Infinity;
  } else if ( val === 'a' ) {
    return true;
  } else if ( val === 'b' ) {
    return false;
  /*
  } else if ( val[0] === 't' ) { 
    console.warn("Error on value of intended type function", val);
    throw new TypeError(`Sorry we do not support functions`);
    //return eval(hex2bin(val.slice(1)));
  */
  } else if ( val[0] === 'y' ) {
    const key = hex2bin(val.slice(1));
    const symbol = Symbol.for(key);
    return symbol;
  } else if ( val[0] === 'r' ) {
    if ( val.includes(".") ) {
      // there is no "parseFloat(str, radix)", so...
      return parseFloatFrom36(val);
    } else {
      return parseInt(val.slice(1), 36);
    }
  } else if ( val[0] === 's' ) {
    return parseFloat(val.slice(1));
  } else if ( val[0] === 'o' ) {
    // unfortunately there is no parseBigInt function
    const units = val.slice(1); 
    return parseBigIntFrom36(units);
  } else if ( val[0] === 'x' ) {
    const taCode = val[1];
    const taConstructor = getTypedArrayConstructor(taCode);
    let values;
    if ( taConstructor.name.includes('Float') ) {
      const codedValues = val.slice(2).split('f').filter(l => l.length);
      values = codedValues.map(cv => parseFloat(cv));
    } else if ( taConstructor.name.includes('Big') ) {
      const codedValues = val.slice(2).split('.').filter(l => l.length);
      values = codedValues.map(cv => parseBigIntFrom36(cv));
    } else {
      const codedValues = val.slice(2).split('.').filter(l => l.length);
      values = codedValues.map(cv => parseInt(cv, 36));
    }

    //console.log({val,values});

    const newTa = new taConstructor(values);
    return newTa;
  } else if ( val[0] === 'p' ) {
    val = val.slice(1);
    const map = new Map(JSON36.parse(val));
    return map;
  } else if ( val[0] === 'q' ) {
    val = val.slice(1);
    const set = new Set(JSON36.parse(val));
    return set;
  } else if ( val[0] === 't' ) {
    val = val.slice(1);
    const isoString = decode36(val);
    const date = new Date(isoString);
    return date;
  }
  if ( asciiOnly ) {
    return hex2bin(val);
  } else {
    return val;
  }
}

// type help
  function isObject(thing) {
    if ( Array.isArray(thing) || isTypedArray(thing) ) {
      return false;
    } else if ( thing instanceof Map || thing instanceof Set || thing instanceof WeakMap || thing instanceof WeakSet ) {
      return false;
    } else if ( thing === null ) {
      return false;
    } else if ( thing instanceof Function ) {
      return false;
    } else if ( thing instanceof WrapDate ) {
      return false;
    } else {
      return typeof thing === "object";
    }
  }

// parsing big ints from base 36 help
  function parseBigIntFrom36(units) {
    let n = 0n, sign = 1n;
    if ( units[0] == '-' ) {
      sign = -1n;
    }
    units.split('').forEach(u => n = (n * 36n) + BigInt(parseInt(u,36)));
    return n*sign;
  }

// parsing floats from base 36 help
  function parseFloatFrom36(val) {
    // this code came from checking and mentally reversing 
    // the toString(radix) code for float numbers in v8
    // here: https://github.com/v8/v8/blob/4b9b23521e6fd42373ebbcb20ebe03bf445494f9/src/conversions.cc#L1227
    val = val.slice(1);
    let [whole, part] = val.split('.');
    let number = parseInt(whole, 36);
    let fraction = 0;
    let divisor = 36;
    for( const unit of part ) {
      const part = parseInt(unit, 36);
      fraction += part/divisor;
      divisor *= 36;
      // DEBUG
      //console.log({fraction, whole, part, unit});
    }
    const result = number + fraction;
    // DEBUG
    //console.log({floatRevive:{result}});
    return result;
  }

// TypedArray help
  function getTypedArrayConstructor(code) {
    return whatTA.get(parseInt(code, 36));
  }

  function specifyTypedArray(ta) {
    //console.log(whatTACode, ta);
    return whatTACode.get(ta.constructor).toString(36); 
  }

  function serializeTypedArray(ta) {
    // instead of using fixed width fields
    let res;
    if ( ta.constructor.name.includes('Float') ) {
      res = ta.map(v => v.toString()).join('f');
    } else {
      res = Array.from(ta).map(v => v.toString(36)).join('.');
    }
    //console.log({res});
    return res;
  }

  function serializeDate(d) {
    return encode36(d.toISOString());
  }

  function serializeMapOrSet(h) {
    const entries = h instanceof Map ? [...h.entries()] : [...h.keys()];
    const serialized = JSON36.stringify(entries);
    return serialized;
  }

// unicode coding help (from dosybytes.js) 
  // https://github.com/dosyago/xen/blob/403a8860929450b35b425a5b3cf231ac119b0298/dosybytes.js

  function bin2hex( binstr ) {
    return toHex( fromBinary( binstr ) );
  }

  function hex2bin( hexstr ) {
    return toBinary( fromHex( hexstr ) );
  }

  function toHex( bytes ) {
    return Array.from( bytes ).reduce( (hs,bv) => hs + pad( bv.toString(36), 4, '0', true ), "" );
  }
  function fromHex( hexstr ) {
    return new Uint32Array( Array.from( hexstr ).reduce( 
      (pa,c,i) => i % 4 ? (pa[pa.length-1]+=c, pa) : (pa.push(c), pa) ,
      []
    ).reduce( 
      (ba,hn) => (ba.push( parseInt(hn, 36)), ba),
      []
    ) );
  }

  function pad( str, width, char, left, right ) {
    if( left ) {
      str = str.padStart(width, char);
    }
    if ( right ) {
      str = str.padEnd(width, char);
    }
    return str;
  }
  
  function toBinary(bytes) {
    const bs = [];
    for( const byte of bytes ) {
      bs.push(String.fromCodePoint(byte));
    }
    return bs.join('');
  }

  function fromBinary(str) {
    const b = [];
    for( const char of str ) {
      b.push(char.codePointAt(0));
    }
    return new Uint32Array(b);
  }
