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
var platform_state_1 = require("./platform_state");
exports.PlatformState = platform_state_1.PlatformState;
var server_1 = require("./server");
exports.ServerModule = server_1.ServerModule;
exports.platformDynamicServer = server_1.platformDynamicServer;
exports.platformServer = server_1.platformServer;
var tokens_1 = require("./tokens");
exports.BEFORE_APP_SERIALIZED = tokens_1.BEFORE_APP_SERIALIZED;
exports.INITIAL_CONFIG = tokens_1.INITIAL_CONFIG;
var transfer_state_1 = require("./transfer_state");
exports.ServerTransferStateModule = transfer_state_1.ServerTransferStateModule;
var utils_1 = require("./utils");
exports.renderModule = utils_1.renderModule;
exports.renderModuleFactory = utils_1.renderModuleFactory;
__export(require("./private_export"));
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tc2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy9wbGF0Zm9ybS1zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCxtREFBK0M7QUFBdkMseUNBQUEsYUFBYSxDQUFBO0FBQ3JCLG1DQUE2RTtBQUFyRSxnQ0FBQSxZQUFZLENBQUE7QUFBRSx5Q0FBQSxxQkFBcUIsQ0FBQTtBQUFFLGtDQUFBLGNBQWMsQ0FBQTtBQUMzRCxtQ0FBK0U7QUFBdkUseUNBQUEscUJBQXFCLENBQUE7QUFBRSxrQ0FBQSxjQUFjLENBQUE7QUFDN0MsbURBQTJEO0FBQW5ELHFEQUFBLHlCQUF5QixDQUFBO0FBQ2pDLGlDQUEwRDtBQUFsRCwrQkFBQSxZQUFZLENBQUE7QUFBRSxzQ0FBQSxtQkFBbUIsQ0FBQTtBQUV6QyxzQ0FBaUM7QUFDakMscUNBQWtDO0FBQTFCLDRCQUFBLE9BQU8sQ0FBQSJ9