"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var property_1 = require("../../util/property");
var environment_1 = require("./environment");
var fields_1 = require("./fields");
var util_1 = require("./util");
/**
 * Compile an Angular injectable according to its `Injectable` metadata, and patch the resulting
 * `ngInjectableDef` onto the injectable type.
 */
function compileInjectable(type, meta) {
    // TODO(alxhub): handle JIT of bare @Injectable().
    if (!meta) {
        return;
    }
    var def = null;
    Object.defineProperty(type, fields_1.NG_INJECTABLE_DEF, {
        get: function () {
            if (def === null) {
                // Check whether the injectable metadata includes a provider specification.
                var hasAProvider = isUseClassProvider(meta) || isUseFactoryProvider(meta) ||
                    isUseValueProvider(meta) || isUseExistingProvider(meta);
                var deps = undefined;
                if (!hasAProvider || (isUseClassProvider(meta) && type === meta.useClass)) {
                    deps = util_1.reflectDependencies(type);
                }
                else if (isUseClassProvider(meta)) {
                    deps = meta.deps && util_1.convertDependencies(meta.deps);
                }
                else if (isUseFactoryProvider(meta)) {
                    deps = meta.deps && util_1.convertDependencies(meta.deps) || [];
                }
                // Decide which flavor of factory to generate, based on the provider specified.
                // Only one of the use* fields should be set.
                var useClass = undefined;
                var useFactory = undefined;
                var useValue = undefined;
                var useExisting = undefined;
                if (!hasAProvider) {
                    // In the case the user specifies a type provider, treat it as {provide: X, useClass: X}.
                    // The deps will have been reflected above, causing the factory to create the class by
                    // calling
                    // its constructor with injected deps.
                    useClass = new compiler_1.WrappedNodeExpr(type);
                }
                else if (isUseClassProvider(meta)) {
                    // The user explicitly specified useClass, and may or may not have provided deps.
                    useClass = new compiler_1.WrappedNodeExpr(meta.useClass);
                }
                else if (isUseValueProvider(meta)) {
                    // The user explicitly specified useValue.
                    useValue = new compiler_1.WrappedNodeExpr(meta.useValue);
                }
                else if (isUseFactoryProvider(meta)) {
                    // The user explicitly specified useFactory.
                    useFactory = new compiler_1.WrappedNodeExpr(meta.useFactory);
                }
                else if (isUseExistingProvider(meta)) {
                    // The user explicitly specified useExisting.
                    useExisting = new compiler_1.WrappedNodeExpr(meta.useExisting);
                }
                else {
                    // Can't happen - either hasAProvider will be false, or one of the providers will be set.
                    throw new Error("Unreachable state.");
                }
                var expression = compiler_1.compileInjectable({
                    name: type.name,
                    type: new compiler_1.WrappedNodeExpr(type),
                    providedIn: computeProvidedIn(meta.providedIn),
                    useClass: useClass,
                    useFactory: useFactory,
                    useValue: useValue,
                    useExisting: useExisting,
                    deps: deps,
                }).expression;
                def = compiler_1.jitExpression(expression, environment_1.angularCoreEnv, "ng://" + type.name + "/ngInjectableDef.js");
            }
            return def;
        },
    });
}
exports.compileInjectable = compileInjectable;
function computeProvidedIn(providedIn) {
    if (providedIn == null || typeof providedIn === 'string') {
        return new compiler_1.LiteralExpr(providedIn);
    }
    else {
        return new compiler_1.WrappedNodeExpr(providedIn);
    }
}
function isUseClassProvider(meta) {
    return meta.useClass !== undefined;
}
var GET_PROPERTY_NAME = {};
var USE_VALUE = property_1.getClosureSafeProperty({ provide: String, useValue: GET_PROPERTY_NAME }, GET_PROPERTY_NAME);
function isUseValueProvider(meta) {
    return USE_VALUE in meta;
}
function isUseFactoryProvider(meta) {
    return meta.useFactory !== undefined;
}
function isUseExistingProvider(meta) {
    return meta.useExisting !== undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaml0L2luamVjdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMEo7QUFLMUosZ0RBQTJEO0FBRTNELDZDQUE2QztBQUM3QyxtQ0FBMkM7QUFDM0MsK0JBQWdFO0FBR2hFOzs7R0FHRztBQUNILDJCQUFrQyxJQUFlLEVBQUUsSUFBaUI7SUFDbEUsa0RBQWtEO0lBQ2xELElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxPQUFPO0tBQ1I7SUFFRCxJQUFJLEdBQUcsR0FBUSxJQUFJLENBQUM7SUFDcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsMEJBQWlCLEVBQUU7UUFDN0MsR0FBRyxFQUFFO1lBQ0gsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUNoQiwyRUFBMkU7Z0JBQzNFLElBQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQztvQkFDdkUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTVELElBQUksSUFBSSxHQUFxQyxTQUFTLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN6RSxJQUFJLEdBQUcsMEJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2xDO3FCQUFNLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ25DLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLDBCQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEQ7cUJB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