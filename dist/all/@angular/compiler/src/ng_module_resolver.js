"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var directive_resolver_1 = require("./directive_resolver");
var util_1 = require("./util");
/**
 * Resolves types to {@link NgModule}.
 */
var NgModuleResolver = /** @class */ (function () {
    function NgModuleResolver(_reflector) {
        this._reflector = _reflector;
    }
    NgModuleResolver.prototype.isNgModule = function (type) { return this._reflector.annotations(type).some(core_1.createNgModule.isTypeOf); };
    NgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var ngModuleMeta = directive_resolver_1.findLast(this._reflector.annotations(type), core_1.createNgModule.isTypeOf);
        if (ngModuleMeta) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error("No NgModule metadata found for '" + util_1.stringify(type) + "'.");
            }
            return null;
        }
    };
    return NgModuleResolver;
}());
exports.NgModuleResolver = NgModuleResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL25nX21vZHVsZV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUFzRDtBQUN0RCwyREFBOEM7QUFDOUMsK0JBQWlDO0FBR2pDOztHQUVHO0FBQ0g7SUFDRSwwQkFBb0IsVUFBNEI7UUFBNUIsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7SUFBRyxDQUFDO0lBRXBELHFDQUFVLEdBQVYsVUFBVyxJQUFTLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakcsa0NBQU8sR0FBUCxVQUFRLElBQVUsRUFBRSxlQUFzQjtRQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUN4QyxJQUFNLFlBQVksR0FDZCw2QkFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLHFCQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFekUsSUFBSSxZQUFZLEVBQUU7WUFDaEIsT0FBTyxZQUFZLENBQUM7U0FDckI7YUFBTTtZQUNMLElBQUksZUFBZSxFQUFFO2dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFtQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxPQUFJLENBQUMsQ0FBQzthQUN6RTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBbEJZLDRDQUFnQiJ9