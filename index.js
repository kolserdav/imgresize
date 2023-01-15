/******************************************************************************************
 * Repository: https://github.com/kolserdav/imgresize.git
 * File name: index.js
 * Author: Sergey Kolmiller
 * Email: <serega12101983@gmail.com>
 * License: MIT
 * License text: The code is distributed as is. There are no guarantees regarding the functionality of the code or parts of it.
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Sun Jan 15 2023 11:34:35 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
// @ts-check
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_PATH = process.cwd();
const { argv } = process;

/**
 * Image resize config interface
 * @typedef {Record<string, number>} ImageResize
 */

/**
 * Constants of preview sizes
 * @type {ImageResize}
 */
const IMAGE_PREVIEW = {
  full: 0,
  fourK: 3840,
  desktop: 1920,
  tablet: 1024,
  mobile: 760,
  small: 320,
};

/**
 * Get user params
 * @returns {Promise<{
 *  sourcePath: string;
 *  destination: string;
 *  imgresize: ImageResize;
 *  width: number;
 * }>}
 */
const getOptions = async () => {
  let sourcePath = '';
  let destination = '';
  let width = 0;
  for (let i = 2; argv[i]; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--help':
        console.info(`
[INFO]
Image resize client
Example:
  imgresize [option] value 
Options:
      --path - source image path 
      --out - destination path [./imgresize] 
        `);
        process.exit(0);
        break;
      case '--path':
        if (!argv[i + 1]) {
          console.error(`[ERROR] Source path must be specified. Received ${argv[i + 1]}`);
          process.exit(1);
        }
        sourcePath = argv[i + 1];
        break;
      case '--out':
        if (!argv[i + 1]) {
          console.error(`[ERROR] Source path must be specified. Received ${argv[i + 1]}`);
          process.exit(1);
        }
        destination = argv[i + 1];
        break;
      default:
        if (argv[i - 1] !== '--path' && argv[i - 1] !== '--out') {
          console.error(`[ERROR] Command ${argv[i]}, is missing. Try run "imageresize --help".`);
          process.exit(1);
        }
        break;
    }
  }
  // Read package.json config
  /**
   * @type {ImageResize}
   */
  let imgresize = IMAGE_PREVIEW;
  try {
    const data = fs.readFileSync(path.resolve(ROOT_PATH, 'package.json')).toString();
    /**
     * @type {any}
     */
    const _packageJson = JSON.parse(data);
    if (!_packageJson.imgresize) {
      console.warn('[WARNING] Property "imgresize" is missing on package.json. Used default sizes');
    } else {
      imgresize = _packageJson.imgresize;
    }
  } catch (err) {
    console.warn('[WARNING] Package json file is missing. Used default sizes');
  }
  if (!sourcePath) {
    console.error('[ERROR] Source image path not set');
    process.exit(1);
  }
  const _sourcePath = /:/.test(sourcePath) ? sourcePath : path.resolve(ROOT_PATH, sourcePath);
  try {
    const data = fs.readFileSync(_sourcePath);
    const image = sharp(data);
    const metadata = await image.metadata();
    if (metadata.width) {
      width = metadata.width;
    } else {
      console.warn('[WARN] Metadata width is undefined', { metadata });
    }
  } catch (err) {
    console.error('[ERROR] Source file', _sourcePath, 'is missing', err);
    process.exit(1);
  }
  destination = destination || './imgresize';
  const _destination = /:/.test(destination) ? destination : path.resolve(ROOT_PATH, destination);
  try {
    fs.statSync(_destination);
  } catch (err) {
    try {
      fs.mkdirSync(_destination);
    } catch (err) {
      console.error('[ERROR] Can not create directory or directory is missing', _destination);
      process.exit(1);
    }
  }
  return {
    sourcePath: path.normalize(_sourcePath),
    destination: path.normalize(_destination),
    imgresize,
    width,
  };
};

/**
 *  Created previews when loaded image
 *  @returns {Promise<1 | 0>}
 */
const createImagePreviews = async () => {
  const options = await getOptions();
  console.info('[INFO]', options);
  const { sourcePath, destination, imgresize, width } = options;
  const type = sourcePath.match(/\.[a-zA-Z]{3,4}$/);
  const fileType = type ? type[0] : '';
  /**
   * @type {any[]}
   */
  const keys = Object.keys(imgresize);
  let i = 0;
  let errors = 0;
  while (i < keys.length) {
    i++;
    /**
     * @type {keyof ImageResize}
     */
    const key = keys[i];
    const imagePreview = getImagePreview(width, imgresize);
    if (key && key !== 'full') {
      if (
        await createImagePreview({
          width: imagePreview[key],
          path: sourcePath,
          dest: path.normalize(path.resolve(destination, `${key}${fileType}`)),
        })
      ) {
        errors++;
      }
    }
    if (key === 'full' || key === undefined) {
      try {
        fs.cpSync(sourcePath, path.normalize(path.resolve(destination, `full${fileType}`)));
      } catch (err) {
        console.error('[ERROR] Can not copy source to full destination');
        return 1;
      }
    }
  }
  if (errors) {
    console.error('[ERROR] Can not create image preview. Errors:', errors);
    return 1;
  }
  return 0;
};

/**
 * Get previews size
 * @param {number} width
 * @param {ImageResize} imgresize
 * @returns {ImageResize}
 */
const getImagePreview = (width, imgresize) => {
  /**
   * @type {any[]}
   */
  const keys = Object.keys(imgresize);
  /**
   * @type {Array<keyof ImageResize>}
   */
  const _keys = keys;
  const imagePreview = { ...imgresize };
  _keys.map((item) => {
    if (item && item !== 'full') {
      if (IMAGE_PREVIEW[item] >= width) {
        imagePreview[item] = width;
      }
    }
  });
  return imagePreview;
};

/**
 * Create preview
 * @param { { path: string; width: number; dest: string }} param1
 * @returns {Promise<1 | 0>}
 */
const createImagePreview = async ({ path, width, dest }) => {
  return new Promise((resolve) => {
    sharp(path)
      .resize(width)
      .toFile(dest)
      .then(() => {
        resolve(0);
      })
      .catch((e) => {
        console.error('[ERROR]', 'Error resize image', { path }, e);
        resolve(1);
      });
  });
};

if (require.main === module) {
  (async () => {
    console.info('[INFO] Starting image resize script...');
    const code = await createImagePreviews();
    console.info('[INFO] Image resize script end with code:', code);
  })();
} else {
  module.exports = { createImagePreview };
}
