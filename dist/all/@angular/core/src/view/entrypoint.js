"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = require("../di/injector");
var ng_module_factory_1 = require("../linker/ng_module_factory");
var services_1 = require("./services");
var types_1 = require("./types");
var util_1 = require("./util");
function overrideProvider(override) {
    services_1.initServicesIfNeeded();
    return types_1.Services.overrideProvider(override);
}
exports.overrideProvider = overrideProvider;
function overrideComponentView(comp, componentFactory) {
    services_1.initServicesIfNeeded();
    return types_1.Services.overrideComponentView(comp, componentFactory);
}
exports.overrideComponentView = overrideComponentView;
function clearOverrides() {
    services_1.initServicesIfNeeded();
    return types_1.Services.clearOverrides();
}
exports.clearOverrides = clearOverrides;
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
    return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
}
exports.createNgModuleFactory = createNgModuleFactory;
function cloneNgModuleDefinition(def) {
    var providers = Array.from(def.providers);
    var modules = Array.from(def.modules);
    var providersByKey = {};
    for (var key in def.providersByKey) {
        providersByKey[key] = def.providersByKey[key];
    }
    return {
        factory: def.factory,
        isRoot: def.isRoot, providers: providers, modules: modules, providersByKey: providersByKey,
    };
}
var NgModuleFactory_ = /** @class */ (function (_super) {
    __extends(NgModuleFactory_, _super);
    function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
        var _this = 
        // Attention: this ctor is called as top level function.
        // Putting any logic in here will destroy closure tree shaking!
        _super.call(this) || this;
        _this.moduleType = moduleType;
        _this._bootstrapComponents = _bootstrapComponents;
        _this._ngModuleDefFactory = _ngModuleDefFactory;
        return _this;
    }
    NgModuleFactory_.prototype.create = function (parentInjector) {
        services_1.initServicesIfNeeded();
        // Clone the NgModuleDefinition so that any tree shakeable provider definition
        // added to this instance of the NgModuleRef doesn't affect the cached copy.
        // See https://github.com/angular/angular/issues/25018.
        var def = cloneNgModuleDefinition(util_1.resolveDefinition(this._ngModuleDefFactory));
        return types_1.Services.createNgModuleRef(this.moduleType, parentInjector || injector_1.Injector.NULL, this._bootstrapComponents, def);
    };
    return NgModuleFactory_;
}(ng_module_factory_1.NgModuleFactory));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwyQ0FBd0M7QUFFeEMsaUVBQXlFO0FBR3pFLHVDQUFnRDtBQUNoRCxpQ0FBdUk7QUFDdkksK0JBQXlDO0FBRXpDLDBCQUFpQyxRQUEwQjtJQUN6RCwrQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBSEQsNENBR0M7QUFFRCwrQkFBc0MsSUFBZSxFQUFFLGdCQUF1QztJQUM1RiwrQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sZ0JBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBSEQsc0RBR0M7QUFFRDtJQUNFLCtCQUFvQixFQUFFLENBQUM7SUFDdkIsT0FBTyxnQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFIRCx3Q0FHQztBQUVELDREQUE0RDtBQUM1RCwrREFBK0Q7QUFDL0QsK0JBQ0ksWUFBdUIsRUFBRSxtQkFBZ0MsRUFDekQsVUFBcUM7SUFDdkMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBSkQsc0RBSUM7QUFFRCxpQ0FBaUMsR0FBdUI7SUFDdEQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBTSxjQUFjLEdBQThDLEVBQUUsQ0FBQztJQUNyRSxLQUFLLElBQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUU7UUFDcEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0M7SUFFRCxPQUFPO1FBQ0wsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1FBQ3BCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLGNBQWMsZ0JBQUE7S0FDdkQsQ0FBQztBQUNKLENBQUM7QUFFRDtJQUErQixvQ0FBb0I7SUFDakQsMEJBQ29CLFVBQXFCLEVBQVUsb0JBQWlDLEVBQ3hFLG1CQUE4QztRQUYxRDtRQUdFLHdEQUF3RDtRQUN4RCwrREFBK0Q7UUFDL0QsaUJBQU8sU0FDUjtRQUxtQixnQkFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLDBCQUFvQixHQUFwQixvQkFBb0IsQ0FBYTtRQUN4RSx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQTJCOztJQUkxRCxDQUFDO0lBRUQsaUNBQU0sR0FBTixVQUFPLGNBQTZCO1FBQ2xDLCtCQUFvQixFQUFFLENBQUM7UUFDdkIsOEVBQThFO1FBQzlFLDRFQUE0RTtRQUM1RSx1REFBdUQ7UUFDdkQsSUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUMsd0JBQWlCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNqRixPQUFPLGdCQUFRLENBQUMsaUJBQWlCLENBQzdCLElBQUksQ0FBQyxVQUFVLEVBQUUsY0FBYyxJQUFJLG1CQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBbEJELENBQStCLG1DQUFlLEdBa0I3QyJ9