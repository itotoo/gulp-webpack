import 'babel-polyfill';
import sqframe from '../../common/sqframe/sqframe.js';
sqframe.sqframe();

const arr = ['red', 'green', 'blue'];

for(let v of arr) {
  // console.log(v) // red green blue
}

const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
  console.log(v) // red green blue
}

console.log(13245) // red green blue
