'use strict';

var fs = require('node:fs');
var path = require('node:path');
var { spawnSync } = require('node:child_process');

var dir = path.join(__dirname, 'integration');
var files = fs
  .readdirSync(dir)
  .filter(function (f) {
    return f.endsWith('.js');
  })
  .map(function (f) {
    return path.join(dir, f);
  });

var result = spawnSync(process.execPath, ['--test'].concat(files), {
  stdio: 'inherit',
});

process.exit(result.status === null ? 1 : result.status);
