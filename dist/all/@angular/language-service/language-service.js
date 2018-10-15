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
/// <reference types="node" />
/**
 * @module
 * @description
 * Entry point for all public APIs of the language service package.
 */
var language_service_1 = require("./src/language_service");
exports.createLanguageService = language_service_1.createLanguageService;
__export(require("./src/ts_plugin"));
var typescript_host_1 = require("./src/typescript_host");
exports.TypeScriptServiceHost = typescript_host_1.TypeScriptServiceHost;
exports.createLanguageServiceFromTypescript = typescript_host_1.createLanguageServiceFromTypescript;
var version_1 = require("./src/version");
exports.VERSION = version_1.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Utc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvbGFuZ3VhZ2Utc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7OztBQUVILDhCQUE4QjtBQUU5Qjs7OztHQUlHO0FBQ0gsMkRBQTZEO0FBQXJELG1EQUFBLHFCQUFxQixDQUFBO0FBQzdCLHFDQUFnQztBQUVoQyx5REFBaUc7QUFBekYsa0RBQUEscUJBQXFCLENBQUE7QUFBRSxnRUFBQSxtQ0FBbUMsQ0FBQTtBQUNsRSx5Q0FBc0M7QUFBOUIsNEJBQUEsT0FBTyxDQUFBIn0=