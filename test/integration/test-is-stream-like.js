'use strict';

var test = require('node:test');
var fs = require('node:fs');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';

test('isStreamLike', function () {
  var fileStream = fs.createReadStream(FILE1);
  var foo = function () {};

  assert.ok(!CombinedStream.isStreamLike(true));
  assert.ok(!CombinedStream.isStreamLike('I am a string'));
  assert.ok(!CombinedStream.isStreamLike(7));
  assert.ok(!CombinedStream.isStreamLike(foo));

  assert.ok(CombinedStream.isStreamLike(fileStream));
  fileStream.destroy();
});
