const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: [true, 'a title is required']
    },
    description: {
      type: String,
      required: [true, 'a description is required']
    },
    videoUrl: {
      type: String,
      required: [true, 'a URL is required']
    }
  })
);

module.exports = Video;
