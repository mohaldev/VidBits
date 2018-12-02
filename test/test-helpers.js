const {jsdom} = require('jsdom');

function buildVideoObject(options = {}) {
  const title = options.title || 'My favorite item';
  const videoUrl = options.videoUrl || generateRandomUrl('youtube.com');
  const description = options.description || 'Just the best item';
  return {title, videoUrl, description};
}

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const findElementBySelector = (htmlAsString, selector) => {
  const elementInHTML = jsdom(htmlAsString).querySelector(selector);
  if (elementInHTML !== null) {
    return elementInHTML;
  } else {
    throw new Error(`Element not found in HTML`);
  }
};

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

module.exports = {
  buildVideoObject,
  parseTextFromHTML,
  generateRandomUrl,
  findElementBySelector
};
