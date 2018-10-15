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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9waXBlX3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsK0JBQThDO0FBQzlDLDJEQUE4QztBQUM5QywrQkFBb0Q7QUFFcEQ7Ozs7OztHQU1HO0FBQ0g7SUFDRSxzQkFBb0IsVUFBNEI7UUFBNUIsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7SUFBRyxDQUFDO0lBRXBELDZCQUFNLEdBQU4sVUFBTyxJQUFVO1FBQ2YsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsd0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRSxPQUFPLFlBQVksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOEJBQU8sR0FBUCxVQUFRLElBQVUsRUFBRSxlQUFzQjtRQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUN4QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBTSxVQUFVLEdBQUcsNkJBQVEsQ0FBQyxLQUFLLEVBQUUsaUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4RCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxPQUFPLFVBQVUsQ0FBQzthQUNuQjtTQUNGO1FBQ0QsSUFBSSxlQUFlLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsZ0JBQVMsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLG9DQUFZIn0=