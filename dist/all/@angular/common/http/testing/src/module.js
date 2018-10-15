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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var api_1 = require("./api");
var backend_1 = require("./backend");
/**
 * Configures `HttpClientTestingBackend` as the `HttpBackend` used by `HttpClient`.
 *
 * Inject `HttpTestingController` to expect and flush requests in your tests.
 *
 *
 */
var HttpClientTestingModule = /** @class */ (function () {
    function HttpClientTestingModule() {
    }
    HttpClientTestingModule = __decorate([
        core_1.NgModule({
            imports: [
                http_1.HttpClientModule,
            ],
            providers: [
                backend_1.HttpClientTestingBackend,
                { provide: http_1.HttpBackend, useExisting: backend_1.HttpClientTestingBackend },
                { provide: api_1.HttpTestingController, useExisting: backend_1.HttpClientTestingBackend },
            ],
        })
    ], HttpClientTestingModule);
    return HttpClientTestingModule;
}());
exports.HttpClientTestingModule = HttpClientTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdGluZy9zcmMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsNkNBQW1FO0FBQ25FLHNDQUF1QztBQUV2Qyw2QkFBNEM7QUFDNUMscUNBQW1EO0FBR25EOzs7Ozs7R0FNRztBQVdIO0lBQUE7SUFDQSxDQUFDO0lBRFksdUJBQXVCO1FBVm5DLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCx1QkFBZ0I7YUFDakI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Qsa0NBQXdCO2dCQUN4QixFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFdBQVcsRUFBRSxrQ0FBd0IsRUFBQztnQkFDN0QsRUFBQyxPQUFPLEVBQUUsMkJBQXFCLEVBQUUsV0FBVyxFQUFFLGtDQUF3QixFQUFDO2FBQ3hFO1NBQ0YsQ0FBQztPQUNXLHVCQUF1QixDQUNuQztJQUFELDhCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksMERBQXVCIn0=