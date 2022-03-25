// @ts-check
const fs = require('fs');
const sharp = require('sharp');

const ROOT_PATH = process.cwd();

/**
 * Image sizes interface
 * @typedef {{
 * full: number | undefined;
 * fourK: number;
 * desktop: number;
 * tablet: number;
 * mobile: number;
 * small: number;
 * }} ImagePreview
 */

/**
 * Image interface
 * @typedef {{
 *  id: number
 *  fieldname: string
 *  originalname: string
 *  encoding: string
 *  mimetype: string
 *  destination: string
 *  origin: string
 *  filename: string
 *  path: string
 *  size: number
 *  width: number
 *  height: number
 *  updated_at: Date
 *  created_at: Date
 *  parentId: number | null
 * }} Image
 */

/**
 * Constants of preview sizes
 * @type {ImagePreview}
 */
const IMAGE_PREVIEW = {
  full: undefined,
  fourK: 3840,
  desktop: 1920,
  tablet: 1024,
  mobile: 760,
  small: 320,
};

/**
 *  Created previews when loaded image
 *  @param {Image} image
 *  @returns {Promise<1 | 0>}
 */
export const createImagePreviews = async (image) => {
  const { width, path, destination, filename } = image;
  const type = filename.match(/\.[a-zA-Z]{3,4}$/);
  const fileType = type ? type[0] : '';
  /**
   * @type {any[]}
   */
  const keys = Object.keys(IMAGE_PREVIEW);
  let i = 0;
  let errors = 0;
  while (i < keys.length) {
    i++;
    /**
     * @type {keyof ImagePreview}
     */
    const key = keys[i];
    const imagePreview = getImagePreview(width);
    if (key && key !== 'full') {
      if (
        await createImagePreview({
          width: imagePreview[key],
          path: `${ROOT_PATH}/${path}`,
          dest: `${ROOT_PATH}/${destination}/${key}${fileType}`,
        })
      ) {
        errors++;
      }
    }
  }
  if (errors) {
    console.error('Error create image preview. Errors:', errors);
    return 1;
  }
  return 0;
};

/**
 * Get previews size
 * @param {number} width
 * @returns {ImagePreview}
 */
const getImagePreview = (width) => {
  /**
   * @type {any[]}
   */
  const keys = Object.keys(IMAGE_PREVIEW);
  /**
   * @type {Array<keyof ImagePreview>}
   */
  const _keys = keys;
  const imagePreview = { ...IMAGE_PREVIEW };
  _keys.map((item) => {
    if (item && item !== 'full') {
      if (IMAGE_PREVIEW[item] < width) {
        imagePreview[item] = imagePreview[item];
      } else {
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
        console.error(e, 'Error resize image', path);
        resolve(1);
      });
  });
};
