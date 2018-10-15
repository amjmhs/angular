"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RootService = /** @class */ (function () {
    function RootService() {
    }
    RootService.ngInjectableDef = core_1.defineInjectable({
        providedIn: 'root',
        factory: function () { return new RootService(); },
    });
    return RootService;
}());
exports.RootService = RootService;
var ScopedService = /** @class */ (function () {
    function ScopedService() {
    }
    ScopedService.prototype.doSomething = function () {
        // tslint:disable-next-line:no-console
        console.log('Ensure this isn\'t tree-shaken.');
    };
    ScopedService.ngInjectableDef = core_1.defineInjectable({
        providedIn: null,
        factory: function () { return new ScopedService(); },
    });
    return ScopedService;
}());
exports.ScopedService = ScopedService;
var DefinedInjector = /** @class */ (function () {
    function DefinedInjector() {
    }
    DefinedInjector.ngInjectorDef = core_1.defineInjector({
        factory: function () { return new DefinedInjector(); },
        providers: [ScopedService],
    });
    return DefinedInjector;
}());
exports.DefinedInjector = DefinedInjector;
exports.INJECTOR = core_1.createInjector(DefinedInjector);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYnVuZGxpbmcvaW5qZWN0aW9uL3VzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXlGO0FBRXpGO0lBQUE7SUFLQSxDQUFDO0lBSlEsMkJBQWUsR0FBRyx1QkFBZ0IsQ0FBQztRQUN4QyxVQUFVLEVBQUUsTUFBTTtRQUNsQixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksV0FBVyxFQUFFLEVBQWpCLENBQWlCO0tBQ2pDLENBQUMsQ0FBQztJQUNMLGtCQUFDO0NBQUEsQUFMRCxJQUtDO0FBTFksa0NBQVc7QUFPeEI7SUFBQTtJQVVBLENBQUM7SUFKQyxtQ0FBVyxHQUFYO1FBQ0Usc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBUk0sNkJBQWUsR0FBRyx1QkFBZ0IsQ0FBQztRQUN4QyxVQUFVLEVBQUUsSUFBSTtRQUNoQixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksYUFBYSxFQUFFLEVBQW5CLENBQW1CO0tBQ25DLENBQUMsQ0FBQztJQU1MLG9CQUFDO0NBQUEsQUFWRCxJQVVDO0FBVlksc0NBQWE7QUFZMUI7SUFBQTtJQUtBLENBQUM7SUFKUSw2QkFBYSxHQUFHLHFCQUFjLENBQUM7UUFDcEMsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLGVBQWUsRUFBRSxFQUFyQixDQUFxQjtRQUNwQyxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7S0FDM0IsQ0FBQyxDQUFDO0lBQ0wsc0JBQUM7Q0FBQSxBQUxELElBS0M7QUFMWSwwQ0FBZTtBQU9mLFFBQUEsUUFBUSxHQUFHLHFCQUFjLENBQUMsZUFBZSxDQUFDLENBQUMifQ==