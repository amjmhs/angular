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
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var constants_1 = require("@angular/upgrade/static/src/common/constants");
var test_helpers_1 = require("../common/test_helpers");
__export(require("../common/test_helpers"));
function bootstrap(platform, Ng2Module, element, ng1Module) {
    // We bootstrap the Angular module first; then when it is ready (async) we bootstrap the AngularJS
    // module on the bootstrap element (also ensuring that AngularJS errors will fail the test).
    return platform.bootstrapModule(Ng2Module).then(function (ref) {
        var ngZone = ref.injector.get(core_1.NgZone);
        var upgrade = ref.injector.get(static_1.UpgradeModule);
        var failHardModule = function ($provide) {
            $provide.value('$exceptionHandler', function (err) { throw err; });
        };
        // The `bootstrap()` helper is used for convenience in tests, so that we don't have to inject
        // and call `upgrade.bootstrap()` on every Angular module.
        // In order to closer emulate what happens in real application, ensure AngularJS is bootstrapped
        // inside the Angular zone.
        //
        ngZone.run(function () { return upgrade.bootstrap(element, [failHardModule, ng1Module.name]); });
        return upgrade;
    });
}
exports.bootstrap = bootstrap;
exports.withEachNg1Version = test_helpers_1.createWithEachNg1VersionFn(angular.setAngularJSGlobal);
function $apply(adapter, exp) {
    var $rootScope = adapter.$injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$apply(exp);
}
exports.$apply = $apply;
function $digest(adapter) {
    var $rootScope = adapter.$injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$digest();
}
exports.$digest = $digest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy90ZXN0X2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCxzQ0FBd0Q7QUFDeEQsa0RBQXNEO0FBQ3RELHFFQUF1RTtBQUN2RSwwRUFBeUU7QUFFekUsdURBQWtFO0FBQ2xFLDRDQUF1QztBQUV2QyxtQkFDSSxRQUFxQixFQUFFLFNBQW1CLEVBQUUsT0FBZ0IsRUFBRSxTQUEwQjtJQUMxRixrR0FBa0c7SUFDbEcsNEZBQTRGO0lBQzVGLE9BQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO1FBQ2pELElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFTLGFBQU0sQ0FBQyxDQUFDO1FBQ2hELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHNCQUFhLENBQUMsQ0FBQztRQUNoRCxJQUFNLGNBQWMsR0FBUSxVQUFDLFFBQWlDO1lBQzVELFFBQVEsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxHQUFRLElBQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUM7UUFFRiw2RkFBNkY7UUFDN0YsMERBQTBEO1FBQzFELGdHQUFnRztRQUNoRywyQkFBMkI7UUFDM0IsRUFBRTtRQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUE1RCxDQUE0RCxDQUFDLENBQUM7UUFFL0UsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBcEJELDhCQW9CQztBQUVZLFFBQUEsa0JBQWtCLEdBQUcseUNBQTBCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFekYsZ0JBQXVCLE9BQXNCLEVBQUUsR0FBMEI7SUFDdkUsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVcsQ0FBOEIsQ0FBQztJQUNuRixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFIRCx3QkFHQztBQUVELGlCQUF3QixPQUFzQjtJQUM1QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUE4QixDQUFDO0lBQ25GLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBSEQsMEJBR0MifQ==