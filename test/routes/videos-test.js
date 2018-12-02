const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {buildVideoObject, findElementBySelector, generateRandomUrl} = require('../test-helpers');
const Video = require('../../models/video');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utilities');

describe('GET /videos', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('returns the videos in the database', async () => {
    const videoToCreate = buildVideoObject();

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const responseGet = await request(app)
      .get('/videos');

    assert.include(responseGet.text, videoToCreate.title);
  });
});

describe('GET /videos/:id/edit', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('renders the edit form with the video values populated', async () => {
    let videoToCreate = buildVideoObject();

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .get(`/videos/${createdVideo._id}/edit`);

    assert.equal(findElementBySelector(response.text, '#video-title').value, videoToCreate.title);
    assert.equal(findElementBySelector(response.text, '#video-description').value, videoToCreate.description);
    assert.equal(findElementBySelector(response.text, '#video-url').value, videoToCreate.videoUrl);
  });
});

describe('POST /videos/:id/updates', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('updates the video', async () => {
    let videoToCreate = buildVideoObject();
    let updatedVideo = buildVideoObject({
      'title': 'newtitle',
      'description': 'new desc',
      'videoUrl': generateRandomUrl('youtube.com')
    });

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/updates`)
      .type('form')
      .send(updatedVideo)
      .redirects(1);

    assert.include(response.text, updatedVideo.title);
    assert.include(response.text, updatedVideo.description);
    assert.include(response.text, updatedVideo.videoUrl);
  });

  it('does NOT updates the video when the record is invalid', async () => {
    let videoToCreate = buildVideoObject();
    let updatedVideo = buildVideoObject({
      'description': 'new desc',
      'videoUrl': generateRandomUrl('youtube.com')
    });
    updatedVideo.title = undefined;

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/updates`)
      .type('form')
      .send(updatedVideo)
      .redirects(1);

    assert.equal(findElementBySelector(response.text, '#video-title').value, videoToCreate.title);
    assert.equal(findElementBySelector(response.text, '#video-description').value, videoToCreate.description);
    assert.equal(findElementBySelector(response.text, '#video-url').value, videoToCreate.videoUrl);
  });

  it('responds with a 400 status when the record is invalid', async () => {
    let videoToCreate = buildVideoObject();
    let updatedVideo = buildVideoObject({
      'description': 'new desc',
      'videoUrl': generateRandomUrl('youtube.com')
    });
    updatedVideo.title = undefined;

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/updates`)
      .type('form')
      .send(updatedVideo)
      .redirects(1);

    assert.equal(response.status, 400);
  });

  it('renders the edit form when the record is invalid', async () => {
    let videoToCreate = buildVideoObject();
    let updatedVideo = buildVideoObject({
      'description': 'new desc',
      'videoUrl': generateRandomUrl('youtube.com')
    });
    updatedVideo.title = undefined;

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/updates`)
      .type('form')
      .send(updatedVideo)
      .redirects(1);

    assert.notEqual(findElementBySelector(response.text, '#video-title'), null);
    assert.notEqual(findElementBySelector(response.text, '#video-description'), null);
    assert.notEqual(findElementBySelector(response.text, '#video-url'), null);
  });

  it('redirects to the show page upon updating', async () => {
    let videoToCreate = buildVideoObject();
    let updatedVideo = buildVideoObject({
      'title': 'newtitle',
      'description': 'new desc',
      'videoUrl': generateRandomUrl('youtube.com')
    });

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/updates`)
      .type('form')
      .send(updatedVideo);

    assert.equal(response.status, 302);
    assert.equal(response.header.location, `/videos/${createdVideo._id}`);
  });
});

describe('GET /videos/:id', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('renders the video in the database', async () => {
    let videoToCreate = buildVideoObject();

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .get(`/videos/${createdVideo._id}`);

    assert.include(response.text, videoToCreate.title);
    assert.include(response.text, videoToCreate.description);
    assert.equal(findElementBySelector(response.text, 'iframe').src, videoToCreate.videoUrl);
  });
});


describe('POST /videos/:id/deletions', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('deletes the video', async () => {
    let videoToCreate = buildVideoObject();

    const responsePost = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate);

    const createdVideo = await Video.findOne(videoToCreate);

    const response = await request(app)
      .post(`/videos/${createdVideo._id}/deletions`)
      .type('form')
      .send({})
      .redirects(1);

    const queryDeletedVideo = await Video.findOne(videoToCreate);

    assert.equal(queryDeletedVideo, null);
  });
});
