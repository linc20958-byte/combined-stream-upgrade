'use strict';

var test = require('node:test');
var fs = require('node:fs');
var { Writable } = require('node:stream');
var { once } = require('node:events');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var FILE1 = common.dir.fixture + '/file1.txt';
var FILE2 = common.dir.fixture + '/file2.txt';

test('maxDataSize exceeded emits error', async function () {
  var combinedStream = CombinedStream.create({
    pauseStreams: false,
    maxDataSize: 20736,
  });
  combinedStream.append(fs.createReadStream(FILE1));
  combinedStream.append(fs.createReadStream(FILE2));

  var drain = new Writable({
    write: function (_chunk, _enc, cb) {
      cb();
    },
  });

  combinedStream.pipe(drain);

  var err = await once(combinedStream, 'error').then(function (args) {
    return args[0];
  });

  assert.ok(err);
  assert.ok(/bytes/.test(err.message));
});
