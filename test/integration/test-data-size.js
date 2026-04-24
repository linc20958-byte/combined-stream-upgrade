'use strict';

var test = require('node:test');
var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

test('_updateDataSize aggregates queued and current streams', function () {
  var combinedStream = CombinedStream.create();

  assert.strictEqual(combinedStream.dataSize, 0);

  combinedStream._streams.push({ dataSize: 10 });
  combinedStream._updateDataSize();
  assert.strictEqual(combinedStream.dataSize, 10);

  combinedStream._streams.push({ dataSize: 23 });
  combinedStream._updateDataSize();
  assert.strictEqual(combinedStream.dataSize, 33);

  combinedStream._currentStream = { dataSize: 20 };
  combinedStream._updateDataSize();
  assert.strictEqual(combinedStream.dataSize, 53);

  combinedStream._currentStream = {};
  combinedStream._updateDataSize();
  assert.strictEqual(combinedStream.dataSize, 33);

  combinedStream._streams.push(function () {});
  combinedStream._updateDataSize();
  assert.strictEqual(combinedStream.dataSize, 33);
});
