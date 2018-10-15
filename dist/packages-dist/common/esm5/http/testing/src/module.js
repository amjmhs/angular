/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpTestingController } from './api';
import { HttpClientTestingBackend } from './backend';
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
    HttpClientTestingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpClientModule,
                    ],
                    providers: [
                        HttpClientTestingBackend,
                        { provide: HttpBackend, useExisting: HttpClientTestingBackend },
                        { provide: HttpTestingController, useExisting: HttpClientTestingBackend },
                    ],
                },] },
    ];
    return HttpClientTestingModule;
}());
export { HttpClientTestingModule };
//# sourceMappingURL=module.js.map