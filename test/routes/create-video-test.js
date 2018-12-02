const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {buildVideoObject, parseTextFromHTML, findElementBySelector} = require('../test-helpers');
const Video = require('../../models/video');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utilities');
const {jsdom} = require('jsdom');

describe('/videos', () => {
  describe('POST', () => {
    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    it('returns a 201 status on video creation', async () => {
      const videoToCreate = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      assert.equal(response.status, 201);
    });

    it('saves video in database after submission', async () => {
      const videoToCreate = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      const foundVideo = await Video.findOne(videoToCreate);
      assert.notEqual(foundVideo, null);
      assert.equal(foundVideo.videoUrl, videoToCreate.videoUrl);
    });

    describe('when the video lacks a title', () => {
      it('does not save video in database if submitting a video that lacks a title', async () => {
        let videoToCreate = buildVideoObject();
        videoToCreate.title = undefined;

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);

        const foundVideo = await Video.findOne(videoToCreate);
        assert.equal(foundVideo, null);
      });

      it('responds with a 400 status code if submitting a video that lacks a title', async () => {
        let videoToCreate = buildVideoObject();
        videoToCreate.title = undefined;

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);

        assert.equal(response.status, 400);
      });

      it('renders the video form if submitting a video that lacks a title', async () => {
        let videoToCreate = buildVideoObject();
        videoToCreate.title = undefined;

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);

        const videoInput = findElementBySelector(response.text, '#video-title');
        const descriptionInput = findElementBySelector(response.text, '#video-description');
        const videoUrlInput = findElementBySelector(response.text, '#video-url');
        assert.notEqual(videoInput, null);
        assert.notEqual(descriptionInput, null);
        assert.notEqual(videoUrlInput, null);
      });

      it('displays an error if submitting a video that lacks a title', async () => {
        let videoToCreate = buildVideoObject();
        videoToCreate.title = undefined;

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);

        const errorElement = findElementBySelector(response.text, '.error-message');
        assert.include(errorElement.innerHTML, `a title is required`);
      });

      it('renders the video form with the rest of the fields pre-filled if submitting a video that lacks a title', async () => {
        let videoToCreate = buildVideoObject();
        videoToCreate.title = undefined;

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoToCreate);

        assert.equal(findElementBySelector(response.text, '#video-description').value, videoToCreate.description);
        assert.equal(findElementBySelector(response.text, '#video-url').value, videoToCreate.videoUrl);
      });
    });

    it('displays an error if submitting a video that lacks a url', async () => {
      let videoToCreate = buildVideoObject();
      videoToCreate.videoUrl = undefined;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      const errorElement = findElementBySelector(response.text, '.error-message');
      assert.include(errorElement.innerHTML, `a URL is required`);
    });

    it('shows the video detail after submission', async () => {
      let videoToCreate = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      assert.include(parseTextFromHTML(response.text, '#video-description'), videoToCreate.description);
      assert.include(parseTextFromHTML(response.text, '#video-title'), videoToCreate.title);
    });
  });
});
