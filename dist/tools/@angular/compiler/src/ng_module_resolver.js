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
//# sourceMappingURL=ng_module_resolver.js.map