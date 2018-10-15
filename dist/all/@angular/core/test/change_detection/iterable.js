"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@angular/core/src/util");
var TestIterable = /** @class */ (function () {
    function TestIterable() {
        this.list = [];
    }
    TestIterable.prototype[util_1.getSymbolIterator()] = function () { return this.list[util_1.getSymbolIterator()](); };
    return TestIterable;
}());
exports.TestIterable = TestIterable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvY2hhbmdlX2RldGVjdGlvbi9pdGVyYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtDQUF5RDtBQUV6RDtJQUVFO1FBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUVqQyx1QkFBQyx3QkFBaUIsRUFBRSxDQUFDLEdBQXJCLGNBQTBCLE9BQVEsSUFBSSxDQUFDLElBQVksQ0FBQyx3QkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsbUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxZLG9DQUFZIn0=