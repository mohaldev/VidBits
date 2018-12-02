const chai = require('chai');
chai.use(require('chai-string'));
const {assert} = chai;
const {buildVideoObject, generateRandomUrl} = require('../test-helpers');

function fillFormAndSubmit(newVideo) {
  browser.setValue('#video-title', newVideo.title);
  browser.setValue('#video-description', newVideo.description);
  browser.setValue('#video-url', newVideo.videoUrl);
  browser.click('#submit-video');
}

describe('User deleting video', () => {
  describe('after deletion', () => {
    it('should remove the video from the list', async () => {
      const newTitle = 'the new title';
      const newVideo = buildVideoObject({'title': newTitle, 'videoUrl': generateRandomUrl()});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.click('#delete');

      assert.notInclude(browser.getText('body'), newVideo.title);
      assert.endsWith(browser.getUrl(), '/videos');
    });
  });
});
