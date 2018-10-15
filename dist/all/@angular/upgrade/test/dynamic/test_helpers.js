"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@angular/upgrade/src/common/constants");
__export(require("../common/test_helpers"));
function $apply(adapter, exp) {
    var $rootScope = adapter.ng1Injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$apply(exp);
}
exports.$apply = $apply;
function $digest(adapter) {
    var $rootScope = adapter.ng1Injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$digest();
}
exports.$digest = $digest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L2R5bmFtaWMvdGVzdF9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7O0FBSUgsbUVBQWtFO0FBRWxFLDRDQUF1QztBQUV2QyxnQkFBdUIsT0FBMEIsRUFBRSxHQUEwQjtJQUMzRSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUE4QixDQUFDO0lBQ3JGLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUhELHdCQUdDO0FBRUQsaUJBQXdCLE9BQTBCO0lBQ2hELElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLHVCQUFXLENBQThCLENBQUM7SUFDckYsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFIRCwwQkFHQyJ9