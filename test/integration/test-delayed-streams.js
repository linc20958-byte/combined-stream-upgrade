'use strict';

var test = require('node:test');
var fs = require('node:fs');
var { once } = require('node:events');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';
var FILE2 = common.dir.fixture + '/file2.txt';

test('delayed streams: ordering and buffering', async function () {
  var EXPECTED = fs.readFileSync(FILE1) + fs.readFileSync(FILE2);

  var combinedStream = CombinedStream.create();
  combinedStream.append(fs.createReadStream(FILE1));
  combinedStream.append(fs.createReadStream(FILE2));

  var stream1 = combinedStream._streams[0];
  var stream2 = combinedStream._streams[1];

  stream1.on('end', function () {
    assert.strictEqual(stream2.dataSize, 0);
  });

  var tmpFile = common.dir.tmp + '/combined.txt';
  var dest = fs.createWriteStream(tmpFile);
  combinedStream.pipe(dest);

  await once(dest, 'close');
  var GOT = fs.readFileSync(tmpFile, 'utf8');
  assert.strictEqual(GOT, EXPECTED);
});
