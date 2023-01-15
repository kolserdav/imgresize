/******************************************************************************************
 * Repository: https://github.com/kolserdav/imgresize.git
 * File name: index.d.ts
 * Author: Sergey Kolmiller
 * Email: <serega12101983@gmail.com>
 * License: MIT
 * License text: The code is distributed as is. There are no guarantees regarding the functionality of the code or parts of it.
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Sun Jan 15 2023 11:34:35 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
/**
 * Image resize config interface
 */
export type ImageResize = Record<string, number>;
/**
 * Create preview
 * @param { { path: string; width: number; dest: string }} param1
 * @returns {Promise<1 | 0>}
 */
export function createImagePreview({ path, width, dest }: {
    path: string;
    width: number;
    dest: string;
}): Promise<1 | 0>;
import path = require("path");
