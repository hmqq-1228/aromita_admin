'use strict'
// module.exports = {
//   NODE_ENV: '"production"',
//   API_ROOT: '"https://admin.aromitajewelry.com"'
// }

const target = process.env.npm_lifecycle_event;
let obj;

if (target == 'test') {
  //测试服
  obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://aradmin.panduo.com.cn"'
  }
} else {
  //正式服
  obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://admin.aromitajewelry.com"'
  }
}

module.exports = obj;