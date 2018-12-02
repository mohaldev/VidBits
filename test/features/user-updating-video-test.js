const {assert} = require('chai');
const {buildVideoObject, generateRandomUrl} = require('../test-helpers');

function fillFormAndSubmit(newVideo) {
  browser.setValue('#video-title', newVideo.title);
  browser.setValue('#video-description', newVideo.description);
  browser.setValue('#video-url', newVideo.videoUrl);
  browser.click('#submit-video');
}

describe('User visits the update page', () => {
  describe('updating the video details', () => {
    it('changes the values', async () => {
      const newTitle = 'original title';
      const updatedTitle = 'updated title';
      const newVideo = buildVideoObject({'title': newTitle, 'videoUrl': generateRandomUrl('youtube.com')});
      const updatedVideo = buildVideoObject({'title': updatedTitle, 'videoUrl': generateRandomUrl('youtube.com')});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.click('#edit');
      fillFormAndSubmit(updatedVideo);

      assert.include(browser.getText('body'), updatedVideo.title);
      assert.include(browser.getText('body'), updatedVideo.description);
      assert.equal(browser.getAttribute('iframe', 'src'), updatedVideo.videoUrl);
    });

    it('does not create a new video', async () => {
      const newTitle = 'original title';
      const updatedTitle = 'updated title';
      const newVideo = buildVideoObject({'title': newTitle, 'videoUrl': generateRandomUrl('youtube.com')});
      const updatedVideo = buildVideoObject({'title': updatedTitle, 'description': 'newdesc', 'videoUrl': generateRandomUrl('youtube.com')});

      browser.url('/videos/create');
      fillFormAndSubmit(newVideo);
      browser.click('#edit');
      fillFormAndSubmit(updatedVideo);

      assert.notInclude(browser.getText('body'), newVideo.title);
      assert.notInclude(browser.getText('body'), newVideo.description);
      assert.notEqual(browser.getAttribute('iframe', 'src'), newVideo.videoUrl);
    });
  });
});
