"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// #docregion longform
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h1>Hello World!</h1>\n    <span class=\"red\">Shadow DOM Rocks!</span>\n  ",
            styles: ["\n    :host {\n      display: block;\n      border: 1px solid black;\n    }\n    h1 {\n      color: blue;\n    }\n    .red {\n      background-color: red;\n    }\n\n  "],
            encapsulation: core_1.ViewEncapsulation.ShadowDom
        })
    ], MyApp);
    return MyApp;
}());
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jYXBzdWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvdHMvbWV0YWRhdGEvZW5jYXBzdWxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUEyRDtBQUUzRCxzQkFBc0I7QUFzQnRCO0lBQUE7SUFDQSxDQUFDO0lBREssS0FBSztRQXJCVixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLG1GQUdUO1lBQ0QsTUFBTSxFQUFFLENBQUMseUtBWVIsQ0FBQztZQUNGLGFBQWEsRUFBRSx3QkFBaUIsQ0FBQyxTQUFTO1NBQzNDLENBQUM7T0FDSSxLQUFLLENBQ1Y7SUFBRCxZQUFDO0NBQUEsQUFERCxJQUNDO0FBQ0QsZ0JBQWdCIn0=