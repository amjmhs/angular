"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const mod = require("./module");
if (mod.AppModule) {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(mod.AppModule);
}
//# sourceMappingURL=main-dynamic.js.map