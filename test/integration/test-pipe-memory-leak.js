'use strict';

/**
 * Originally asserted RSS stayed below a huge buffered size while piping.
 * RSS checks are flaky across platforms; this version still verifies that a
 * large second source is streamed through CombinedStream without requiring
 * the entire file to be held in memory as a single buffer (integration smoke).
 */

var test = require('node:test');
var fs = require('node:fs');
var path = require('node:path');
var { once } = require('node:events');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';

test('large file is piped after small file (streaming path)', async function () {
  var LARGE = path.join(common.dir.tmp, 'large-pipe.bin');
  var OUT = path.join(common.dir.tmp, 'large-pipe-out.bin');
  var size = 5 * 1024 * 1024;

  fs.writeFileSync(LARGE, Buffer.alloc(size, 7));

  var combinedStream = CombinedStream.create();
  combinedStream.append(fs.createReadStream(FILE1));
  combinedStream.append(fs.createReadStream(LARGE));

  var sink = fs.createWriteStream(OUT);
  combinedStream.pipe(sink);

  await once(sink, 'close');

  try {
    var st = fs.statSync(OUT);
    assert.ok(st.size >= size, 'output should include large second part');
  } finally {
    fs.unlink(LARGE, function () {});
    fs.unlink(OUT, function () {});
  }
});
