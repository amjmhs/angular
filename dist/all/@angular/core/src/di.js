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
/**
 * @module
 * @description
 * The `di` module provides dependency injection container services.
 */
__export(require("./di/metadata"));
var defs_1 = require("./di/defs");
exports.defineInjectable = defs_1.defineInjectable;
exports.defineInjector = defs_1.defineInjector;
var forward_ref_1 = require("./di/forward_ref");
exports.forwardRef = forward_ref_1.forwardRef;
exports.resolveForwardRef = forward_ref_1.resolveForwardRef;
var injectable_1 = require("./di/injectable");
exports.Injectable = injectable_1.Injectable;
var injector_1 = require("./di/injector");
exports.inject = injector_1.inject;
exports.INJECTOR = injector_1.INJECTOR;
exports.Injector = injector_1.Injector;
var reflective_injector_1 = require("./di/reflective_injector");
exports.ReflectiveInjector = reflective_injector_1.ReflectiveInjector;
var r3_injector_1 = require("./di/r3_injector");
exports.createInjector = r3_injector_1.createInjector;
var reflective_provider_1 = require("./di/reflective_provider");
exports.ResolvedReflectiveFactory = reflective_provider_1.ResolvedReflectiveFactory;
var reflective_key_1 = require("./di/reflective_key");
exports.ReflectiveKey = reflective_key_1.ReflectiveKey;
var injection_token_1 = require("./di/injection_token");
exports.InjectionToken = injection_token_1.InjectionToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7OztBQUVIOzs7O0dBSUc7QUFFSCxtQ0FBOEI7QUFDOUIsa0NBQXlGO0FBQW5ELGtDQUFBLGdCQUFnQixDQUFBO0FBQUUsZ0NBQUEsY0FBYyxDQUFBO0FBQ3RFLGdEQUE2RTtBQUFyRSxtQ0FBQSxVQUFVLENBQUE7QUFBRSwwQ0FBQSxpQkFBaUIsQ0FBQTtBQUNyQyw4Q0FBb0Y7QUFBNUUsa0NBQUEsVUFBVSxDQUFBO0FBQ2xCLDBDQUFzRTtBQUE5RCw0QkFBQSxNQUFNLENBQUE7QUFBZSw4QkFBQSxRQUFRLENBQUE7QUFBRSw4QkFBQSxRQUFRLENBQUE7QUFDL0MsZ0VBQTREO0FBQXBELG1EQUFBLGtCQUFrQixDQUFBO0FBRTFCLGdEQUFnRDtBQUF4Qyx1Q0FBQSxjQUFjLENBQUE7QUFDdEIsZ0VBQStGO0FBQXZGLDBEQUFBLHlCQUF5QixDQUFBO0FBQ2pDLHNEQUFrRDtBQUExQyx5Q0FBQSxhQUFhLENBQUE7QUFDckIsd0RBQW9EO0FBQTVDLDJDQUFBLGNBQWMsQ0FBQSJ9