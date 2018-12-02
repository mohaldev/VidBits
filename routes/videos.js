const router = require('express').Router();
const Video = require('../models/video');

router.post('/videos', async (req, res, next) => {
  const itemToInsert = new Video(req.body);
  itemToInsert.validateSync();

  if (itemToInsert.errors && itemToInsert.errors.title) {
    return res.status(400).render('create', {'error': itemToInsert.errors.title.message, 'video': req.body});
  }
  if (itemToInsert.errors && itemToInsert.errors.videoUrl) {
    return res.status(400).render('create', {'error': itemToInsert.errors.videoUrl.message, 'video': req.body});
  }
  const insertedItem = await Video.create(req.body);
  const video = await Video.findOne(insertedItem);
  res.status(201).render('videos/show', { 'video': video });
});

router.post('/videos/:id/updates', async (req, res, next) => {
  const itemToInsert = new Video(req.body);
  itemToInsert.validateSync();

  if (itemToInsert.errors && itemToInsert.errors.title) {
    const video = await Video.findOne({'_id': req.params.id});
    return res.status(400).render('edit', {'error': itemToInsert.errors.title.message, 'video': video});
  }
  if (itemToInsert.errors && itemToInsert.errors.videoUrl) {
    const video = await Video.findOne({'_id': req.params.id});
    return res.status(400).render('edit', {'error': itemToInsert.errors.videoUrl.message, 'video': video});
  }
  const videoUpdated = await Video.findOneAndUpdate({'_id': req.params.id}, req.body);
  res.redirect(`/videos/${req.params.id}`);
});

router.post('/videos/:id/deletions', async (req, res, next) => {
  const videoDelete = await Video.findOneAndRemove({'_id': req.params.id});
  res.redirect(`/videos`);
});

router.get('/videos/create', async (req, res, next) => {
  res.render('create');
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const video = await Video.findOne({'_id': req.params.id});
  res.render('edit', { 'video': video });
});

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findOne({'_id': req.params.id});
  res.render('videos/show', { 'video': video });
});

router.get('/videos', async (req, res, next) => {
  const videoList = await Video.find({});
  res.render('videos/index', { 'videos': videoList });
});

router.get('/', (req, res, next) => {
  res.redirect('/videos');
});

module.exports = router;
