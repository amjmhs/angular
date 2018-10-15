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
 * Resolve a `Type` for {@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
var PipeResolver = /** @class */ (function () {
    function PipeResolver(_reflector) {
        this._reflector = _reflector;
    }
    PipeResolver.prototype.isPipe = function (type) {
        var typeMetadata = this._reflector.annotations(util_1.resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(core_1.createPipe.isTypeOf);
    };
    /**
     * Return {@link Pipe} for a given `Type`.
     */
    PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metas = this._reflector.annotations(util_1.resolveForwardRef(type));
        if (metas) {
            var annotation = directive_resolver_1.findLast(metas, core_1.createPipe.isTypeOf);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Pipe decorator found on " + util_1.stringify(type));
        }
        return null;
    };
    return PipeResolver;
}());
exports.PipeResolver = PipeResolver;
//# sourceMappingURL=pipe_resolver.js.map