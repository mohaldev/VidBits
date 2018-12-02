const {assert} = require('chai');
const {buildVideoObject, generateRandomUrl} = require('../test-helpers');

function fillFormAndSubmit(newVideo) {
  browser.setValue('#video-title', newVideo.title);
  browser.setValue('#video-description', newVideo.description);
  browser.setValue('#video-url', newVideo.videoUrl);
  browser.click('#submit-video');
}

describe('User visits the landing page', () => {
  describe('empty on the initial visit', () => {
    it('should contain no videos', async () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('with existing videos', () => {
    it('should display them', async () => {
      const newTitle = 'the new title';
      const newVideo = buildVideoObject({'title': newTitle});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.url('/');

      assert.include(browser.getText('#videos-container'), newTitle);
    });

    it('should display the video', () => {
      const newTitle = 'the new title';
      const newVideo = buildVideoObject({'title': newTitle, 'videoUrl': generateRandomUrl()});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.url('/');

      const iframeElement = browser.element('iframe');

      assert.notInclude(iframeElement, {'state': 'failure'}, 'iframe not found');
      assert.equal(browser.getAttribute('iframe', 'src'), newVideo.videoUrl);
    });

    it('can navigate to a video', () => {
      const newTitle = 'the new title 2';
      const newVideo = buildVideoObject({'title': newTitle, 'videoUrl': generateRandomUrl('youtube.com')});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.url('/');

      browser.click('.video-title a');

      assert.include(browser.getText('body'), newVideo.title);
      assert.include(browser.getText('body'), newVideo.description);
      assert.equal(browser.getAttribute('iframe', 'src'), newVideo.videoUrl);
    });
  });

  describe('has access to creation page', () => {
    it('has a link to /videos/create', async () => {
      browser.url('/');

      browser.click('a[href="/videos/create"]');

      assert.include(browser.getText('body'), 'Save a video');
    });
  });
});
