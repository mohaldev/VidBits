const {assert} = require('chai');
const {buildVideoObject} = require('../test-helpers');

function fillFormAndSubmit(newVideo) {
  browser.setValue('#video-title', newVideo.title);
  browser.setValue('#video-description', newVideo.description);
  browser.setValue('#video-url', newVideo.videoUrl);
  browser.click('#submit-video');
}

describe('User visits the video creation page', () => {
  describe('posting a new video', () => {
    it('has an empty form initially', () => {
      browser.url('/videos/create');

      assert.equal(browser.getText('#video-title'), '');
      assert.equal(browser.getText('#video-description'), '');
      assert.equal(browser.getText('#video-url'), '');
    });

    it('redirects to the landing page with the newly posted video', () => {
      const newVideo = buildVideoObject();

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);

      // console.log(browser.getSource());
      assert.include(browser.getText('.contents-container'), newVideo.title);
    });
  });

  describe('has access to creation page', () => {
    it('has a link to /videos/create', () => {
      browser.url('/');

      browser.click('a[href="/videos/create"]');

      assert.include(browser.getText('body'), 'Save a video');
    });
  });
});
