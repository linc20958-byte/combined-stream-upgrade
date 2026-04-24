'use strict';

var test = require('node:test');
var common = require('../common');
var CombinedStream = common.CombinedStream;

test('many callback appends do not overflow the stack', function () {
  var s = CombinedStream.create();

  for (var i = 0; i < 1e4; i++) {
    s.append(function (next) {
      next('test');
    });
  }

  s.resume();
});
