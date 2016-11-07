'use strict';

describe('Cats E2E Tests:', function () {
  describe('Test cats page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cats');
      expect(element.all(by.repeater('cat in cats')).count()).toEqual(0);
    });
  });
});
