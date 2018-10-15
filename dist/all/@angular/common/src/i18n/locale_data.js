"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @experimental i18n support is experimental.
 */
exports.LOCALE_DATA = {};
/**
 * Register global data to be used internally by Angular. See the
 * ["I18n guide"](guide/i18n#i18n-pipes) to know how to import additional locale data.
 *
 * @experimental i18n support is experimental.
 */
// The signature registerLocaleData(data: any, extraData?: any) is deprecated since v5.1
function registerLocaleData(data, localeId, extraData) {
    if (typeof localeId !== 'string') {
        extraData = localeId;
        localeId = data[0 /* LocaleId */];
    }
    localeId = localeId.toLowerCase().replace(/_/g, '-');
    exports.LOCALE_DATA[localeId] = data;
    if (extraData) {
        exports.LOCALE_DATA[localeId][19 /* ExtraData */] = extraData;
    }
}
exports.registerLocaleData = registerLocaleData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2kxOG4vbG9jYWxlX2RhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUE4QixFQUFFLENBQUM7QUFFekQ7Ozs7O0dBS0c7QUFDSCx3RkFBd0Y7QUFDeEYsNEJBQW1DLElBQVMsRUFBRSxRQUF1QixFQUFFLFNBQWU7SUFDcEYsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDaEMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUNyQixRQUFRLEdBQUcsSUFBSSxrQkFBMEIsQ0FBQztLQUMzQztJQUVELFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVyRCxtQkFBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUU3QixJQUFJLFNBQVMsRUFBRTtRQUNiLG1CQUFXLENBQUMsUUFBUSxDQUFDLG9CQUEyQixHQUFHLFNBQVMsQ0FBQztLQUM5RDtBQUNILENBQUM7QUFiRCxnREFhQyJ9