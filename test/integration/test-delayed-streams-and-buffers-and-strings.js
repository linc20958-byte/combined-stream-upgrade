'use strict';

var test = require('node:test');
var fs = require('node:fs');
var { once } = require('node:events');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';
var BUFFER = Buffer.from('Bacon is delicious');
var FILE2 = common.dir.fixture + '/file2.txt';
var STRING = "The € kicks the $'s ass!";

test('mixed append: file, buffer, file, callback string', async function () {
  var EXPECTED =
    fs.readFileSync(FILE1) +
    BUFFER +
    fs.readFileSync(FILE2) +
    STRING;

  var combinedStream = CombinedStream.create();
  combinedStream.append(fs.createReadStream(FILE1));
  combinedStream.append(BUFFER);
  combinedStream.append(fs.createReadStream(FILE2));
  combinedStream.append(function (next) {
    next(STRING);
  });

  var tmpFile = common.dir.tmp + '/combined-file1-buffer-file2-string.txt';
  var dest = fs.createWriteStream(tmpFile);
  combinedStream.pipe(dest);

  await once(dest, 'close');
  var GOT = fs.readFileSync(tmpFile, 'utf8');
  assert.strictEqual(GOT, EXPECTED);
});
