"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NgAdapterInjector = /** @class */ (function () {
    function NgAdapterInjector(modInjector) {
        this.modInjector = modInjector;
    }
    // When Angular locate a service in the component injector tree, the not found value is set to
    // `NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR`. In such a case we should not walk up to the module
    // injector.
    // AngularJS only supports a single tree and should always check the module injector.
    NgAdapterInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === core_1.ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
            return notFoundValue;
        }
        return this.modInjector.get(token, notFoundValue);
    };
    return NgAdapterInjector;
}());
exports.NgAdapterInjector = NgAdapterInjector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL3N0YXRpYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXdIO0FBR3hIO0lBQ0UsMkJBQW9CLFdBQXFCO1FBQXJCLGdCQUFXLEdBQVgsV0FBVyxDQUFVO0lBQUcsQ0FBQztJQUU3Qyw4RkFBOEY7SUFDOUYsOEZBQThGO0lBQzlGLFlBQVk7SUFDWixxRkFBcUY7SUFDckYsK0JBQUcsR0FBSCxVQUFJLEtBQVUsRUFBRSxhQUFtQjtRQUNqQyxJQUFJLGFBQWEsS0FBSyw2Q0FBcUMsRUFBRTtZQUMzRCxPQUFPLGFBQWEsQ0FBQztTQUN0QjtRQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksOENBQWlCIn0=