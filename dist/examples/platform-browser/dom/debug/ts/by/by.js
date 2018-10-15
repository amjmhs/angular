"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
let debugElement = undefined;
class MyDirective {
}
// #docregion by_all
debugElement.query(platform_browser_1.By.all());
// #enddocregion
// #docregion by_css
debugElement.query(platform_browser_1.By.css('[attribute]'));
// #enddocregion
// #docregion by_directive
debugElement.query(platform_browser_1.By.directive(MyDirective));
// #enddocregion
//# sourceMappingURL=by.js.map