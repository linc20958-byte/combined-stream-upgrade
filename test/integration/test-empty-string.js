'use strict';

var test = require('node:test');
var util = require('node:util');
var Stream = require('node:stream').Stream;
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

function StringStream() {
  this.writable = true;
  this.str = '';
}
util.inherits(StringStream, Stream);

StringStream.prototype.write = function (chunk, encoding) {
  this.str += chunk.toString();
  this.emit('data', chunk);
};

StringStream.prototype.end = function (chunk, encoding) {
  this.emit('end');
};

StringStream.prototype.toString = function () {
  return this.str;
};

test('empty string between chunks', function () {
  var s = CombinedStream.create();

  s.append('foo.');
  s.append('');
  s.append('bar');

  var ss = new StringStream();

  s.pipe(ss);
  s.resume();

  assert.strictEqual(ss.toString(), 'foo.bar');
});
