// @ts-check

const path = require('path');
const { createImagePreview } = require('../index');

createImagePreview({
  path: path.resolve(__dirname, '../resources/test.png'),
  dest: path.resolve(__dirname, '../tmp/test-preview.png'),
  width: 100,
});
