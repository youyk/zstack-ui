'use strict';

angular.module('zstackUI.version', [
  'zstackUI.version.interpolate-filter',
  'zstackUI.version.version-directive'
])

.value('version', '0.1');
