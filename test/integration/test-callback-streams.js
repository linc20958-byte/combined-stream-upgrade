'use strict';

var test = require('node:test');
var fs = require('node:fs');
var { once } = require('node:events');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';
var FILE2 = common.dir.fixture + '/file2.txt';

test('callback append supplies streams lazily', async function () {
  var EXPECTED = fs.readFileSync(FILE1) + fs.readFileSync(FILE2);

  var combinedStream = CombinedStream.create();
  combinedStream.append(function (next) {
    next(fs.createReadStream(FILE1));
  });
  combinedStream.append(function (next) {
    next(fs.createReadStream(FILE2));
  });

  var tmpFile = common.dir.tmp + '/combined-callback.txt';
  var dest = fs.createWriteStream(tmpFile);
  combinedStream.pipe(dest);

  await once(dest, 'close');
  var written = fs.readFileSync(tmpFile, 'utf8');
  assert.strictEqual(written, EXPECTED);
});
