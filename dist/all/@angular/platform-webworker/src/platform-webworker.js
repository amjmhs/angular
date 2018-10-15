"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var worker_render_1 = require("./worker_render");
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
var client_message_broker_1 = require("./web_workers/shared/client_message_broker");
exports.ClientMessageBroker = client_message_broker_1.ClientMessageBroker;
exports.ClientMessageBrokerFactory = client_message_broker_1.ClientMessageBrokerFactory;
exports.FnArg = client_message_broker_1.FnArg;
exports.UiArguments = client_message_broker_1.UiArguments;
var message_bus_1 = require("./web_workers/shared/message_bus");
exports.MessageBus = message_bus_1.MessageBus;
var service_message_broker_1 = require("./web_workers/shared/service_message_broker");
exports.ServiceMessageBroker = service_message_broker_1.ServiceMessageBroker;
exports.ServiceMessageBrokerFactory = service_message_broker_1.ServiceMessageBrokerFactory;
var location_providers_1 = require("./web_workers/ui/location_providers");
exports.WORKER_UI_LOCATION_PROVIDERS = location_providers_1.WORKER_UI_LOCATION_PROVIDERS;
var location_providers_2 = require("./web_workers/worker/location_providers");
exports.WORKER_APP_LOCATION_PROVIDERS = location_providers_2.WORKER_APP_LOCATION_PROVIDERS;
var worker_app_1 = require("./worker_app");
exports.WorkerAppModule = worker_app_1.WorkerAppModule;
exports.platformWorkerApp = worker_app_1.platformWorkerApp;
var worker_render_2 = require("./worker_render");
exports.platformWorkerUi = worker_render_2.platformWorkerUi;
/**
 * Bootstraps the worker ui.
 *
 * @experimental
 */
function bootstrapWorkerUi(workerScriptUri, customProviders) {
    if (customProviders === void 0) { customProviders = []; }
    // For now, just creates the worker ui platform...
    var platform = worker_render_1.platformWorkerUi([
        { provide: worker_render_1.WORKER_SCRIPT, useValue: workerScriptUri }
    ].concat(customProviders));
    return Promise.resolve(platform);
}
exports.bootstrapWorkerUi = bootstrapWorkerUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0td2Vid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3NyYy9wbGF0Zm9ybS13ZWJ3b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxpREFBZ0U7QUFFaEUscUNBQWtDO0FBQTFCLDRCQUFBLE9BQU8sQ0FBQTtBQUNmLG9GQUErSDtBQUF2SCxzREFBQSxtQkFBbUIsQ0FBQTtBQUFFLDZEQUFBLDBCQUEwQixDQUFBO0FBQUUsd0NBQUEsS0FBSyxDQUFBO0FBQUUsOENBQUEsV0FBVyxDQUFBO0FBQzNFLGdFQUE4RjtBQUF0RixtQ0FBQSxVQUFVLENBQUE7QUFFbEIsc0ZBQStIO0FBQXRHLHdEQUFBLG9CQUFvQixDQUFBO0FBQUUsK0RBQUEsMkJBQTJCLENBQUE7QUFDMUUsMEVBQWlGO0FBQXpFLDREQUFBLDRCQUE0QixDQUFBO0FBQ3BDLDhFQUFzRjtBQUE5RSw2REFBQSw2QkFBNkIsQ0FBQTtBQUNyQywyQ0FBZ0U7QUFBeEQsdUNBQUEsZUFBZSxDQUFBO0FBQUUseUNBQUEsaUJBQWlCLENBQUE7QUFDMUMsaURBQWlEO0FBQXpDLDJDQUFBLGdCQUFnQixDQUFBO0FBRXhCOzs7O0dBSUc7QUFDSCwyQkFDSSxlQUF1QixFQUFFLGVBQXNDO0lBQXRDLGdDQUFBLEVBQUEsb0JBQXNDO0lBQ2pFLGtEQUFrRDtJQUNsRCxJQUFNLFFBQVEsR0FBRyxnQ0FBZ0I7UUFDL0IsRUFBQyxPQUFPLEVBQUUsNkJBQWEsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFDO2FBQ2hELGVBQWUsRUFDbEIsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBVEQsOENBU0MifQ==