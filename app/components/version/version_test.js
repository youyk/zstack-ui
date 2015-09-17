'use strict';

describe('zstackUI.version module', function() {
  beforeEach(module('zstackUI.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
