import {sayHello} from './utils.js';
import _ from "https://esm.sh/lodash@4.17.21";


const result = _.flattenDeep([1,2,[3,[4]]]);

console.log(result);



sayHello('world');