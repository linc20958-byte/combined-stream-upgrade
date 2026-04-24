'use strict';

var path = require('path');
var fs = require('fs');
var root = path.join(__dirname, '..');

var common = module.exports;

common.dir = {
  fixture: path.join(root, 'test', 'fixture'),
  tmp: path.join(root, 'test', 'tmp'),
};

try {
  fs.statSync(common.dir.tmp);
} catch (e) {
  fs.mkdirSync(common.dir.tmp, { recursive: true });
}

common.CombinedStream = require(path.join(root, 'lib', 'combined_stream.js'));
common.assert = require('assert');
