"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var tokens_1 = require("./tokens");
function serializeTransferStateFactory(doc, appId, transferStore) {
    return function () {
        var script = doc.createElement('script');
        script.id = appId + '-state';
        script.setAttribute('type', 'application/json');
        script.textContent = platform_browser_1.ɵescapeHtml(transferStore.toJson());
        doc.body.appendChild(script);
    };
}
exports.serializeTransferStateFactory = serializeTransferStateFactory;
/**
 * NgModule to install on the server side while using the `TransferState` to transfer state from
 * server to client.
 *
 * @experimental
 */
var ServerTransferStateModule = /** @class */ (function () {
    function ServerTransferStateModule() {
    }
    ServerTransferStateModule = __decorate([
        core_1.NgModule({
            providers: [
                platform_browser_1.TransferState, {
                    provide: tokens_1.BEFORE_APP_SERIALIZED,
                    useFactory: serializeTransferStateFactory,
                    deps: [platform_browser_1.DOCUMENT, core_1.APP_ID, platform_browser_1.TransferState],
                    multi: true,
                }
            ]
        })
    ], ServerTransferStateModule);
    return ServerTransferStateModule;
}());
exports.ServerTransferStateModule = ServerTransferStateModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJfc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3RyYW5zZmVyX3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQStDO0FBQy9DLDhEQUE2RjtBQUU3RixtQ0FBK0M7QUFFL0MsdUNBQ0ksR0FBYSxFQUFFLEtBQWEsRUFBRSxhQUE0QjtJQUM1RCxPQUFPO1FBQ0wsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7UUFDN0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsV0FBVyxHQUFHLDhCQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVRELHNFQVNDO0FBRUQ7Ozs7O0dBS0c7QUFXSDtJQUFBO0lBQ0EsQ0FBQztJQURZLHlCQUF5QjtRQVZyQyxlQUFRLENBQUM7WUFDUixTQUFTLEVBQUU7Z0JBQ1QsZ0NBQWEsRUFBRTtvQkFDYixPQUFPLEVBQUUsOEJBQXFCO29CQUM5QixVQUFVLEVBQUUsNkJBQTZCO29CQUN6QyxJQUFJLEVBQUUsQ0FBQywyQkFBUSxFQUFFLGFBQU0sRUFBRSxnQ0FBYSxDQUFDO29CQUN2QyxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztPQUNXLHlCQUF5QixDQUNyQztJQUFELGdDQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksOERBQXlCIn0=