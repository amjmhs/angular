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
var r3_injector_1 = require("../di/r3_injector");
var component_factory_resolver_1 = require("../linker/component_factory_resolver");
var ng_module_factory_1 = require("../linker/ng_module_factory");
var util_1 = require("../util");
var assert_1 = require("./assert");
var component_ref_1 = require("./component_ref");
exports.COMPONENT_FACTORY_RESOLVER = {
    provide: component_factory_resolver_1.ComponentFactoryResolver,
    useFactory: function () { return new component_ref_1.ComponentFactoryResolver(); },
    deps: [],
};
var NgModuleRef = /** @class */ (function (_super) {
    __extends(NgModuleRef, _super);
    function NgModuleRef(ngModuleType, parentInjector) {
        var _this = _super.call(this) || this;
        // tslint:disable-next-line:require-internal-with-underscore
        _this._bootstrapComponents = [];
        _this.destroyCbs = [];
        var ngModuleDef = ngModuleType.ngModuleDef;
        ngDevMode && assert_1.assertDefined(ngModuleDef, "NgModule '" + util_1.stringify(ngModuleType) + "' is not a subtype of 'NgModuleType'.");
        _this._bootstrapComponents = ngModuleDef.bootstrap;
        var additionalProviders = [
            exports.COMPONENT_FACTORY_RESOLVER, {
                provide: ng_module_factory_1.NgModuleRef,
                useValue: _this,
            }
        ];
        _this.injector = r3_injector_1.createInjector(ngModuleType, parentInjector, additionalProviders);
        _this.instance = _this.injector.get(ngModuleType);
        _this.componentFactoryResolver = new component_ref_1.ComponentFactoryResolver();
        return _this;
    }
    NgModuleRef.prototype.destroy = function () {
        ngDevMode && assert_1.assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.forEach(function (fn) { return fn(); });
        this.destroyCbs = null;
    };
    NgModuleRef.prototype.onDestroy = function (callback) {
        ngDevMode && assert_1.assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.push(callback);
    };
    return NgModuleRef;
}(ng_module_factory_1.NgModuleRef));
exports.NgModuleRef = NgModuleRef;
var NgModuleFactory = /** @class */ (function (_super) {
    __extends(NgModuleFactory, _super);
    function NgModuleFactory(moduleType) {
        var _this = _super.call(this) || this;
        _this.moduleType = moduleType;
        return _this;
    }
    NgModuleFactory.prototype.create = function (parentInjector) {
        return new NgModuleRef(this.moduleType, parentInjector);
    };
    return NgModuleFactory;
}(ng_module_factory_1.NgModuleFactory));
exports.NgModuleFactory = NgModuleFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3JlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvbmdfbW9kdWxlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFJSCxpREFBaUQ7QUFDakQsbUZBQXFIO0FBQ3JILGlFQUFzSjtBQUd0SixnQ0FBa0M7QUFDbEMsbUNBQXVDO0FBQ3ZDLGlEQUF5RDtBQUk1QyxRQUFBLDBCQUEwQixHQUFtQjtJQUN4RCxPQUFPLEVBQUUscURBQW1DO0lBQzVDLFVBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSx3Q0FBd0IsRUFBRSxFQUE5QixDQUE4QjtJQUNoRCxJQUFJLEVBQUUsRUFBRTtDQUNULENBQUM7QUFFRjtJQUFvQywrQkFBeUI7SUFRM0QscUJBQVksWUFBcUIsRUFBRSxjQUE2QjtRQUFoRSxZQUNFLGlCQUFPLFNBZ0JSO1FBeEJELDREQUE0RDtRQUM1RCwwQkFBb0IsR0FBZ0IsRUFBRSxDQUFDO1FBSXZDLGdCQUFVLEdBQXdCLEVBQUUsQ0FBQztRQUluQyxJQUFNLFdBQVcsR0FBSSxZQUFvQyxDQUFDLFdBQVcsQ0FBQztRQUN0RSxTQUFTLElBQUksc0JBQWEsQ0FDVCxXQUFXLEVBQ1gsZUFBYSxnQkFBUyxDQUFDLFlBQVksQ0FBQywwQ0FBdUMsQ0FBQyxDQUFDO1FBRTlGLEtBQUksQ0FBQyxvQkFBb0IsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO1FBQ2xELElBQU0sbUJBQW1CLEdBQXFCO1lBQzVDLGtDQUEwQixFQUFFO2dCQUMxQixPQUFPLEVBQUUsK0JBQXNCO2dCQUMvQixRQUFRLEVBQUUsS0FBSTthQUNmO1NBQ0YsQ0FBQztRQUNGLEtBQUksQ0FBQyxRQUFRLEdBQUcsNEJBQWMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDbEYsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRCxLQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSx3Q0FBd0IsRUFBRSxDQUFDOztJQUNqRSxDQUFDO0lBRUQsNkJBQU8sR0FBUDtRQUNFLFNBQVMsSUFBSSxzQkFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsVUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFDRCwrQkFBUyxHQUFULFVBQVUsUUFBb0I7UUFDNUIsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxVQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFwQ0QsQ0FBb0MsK0JBQXNCLEdBb0N6RDtBQXBDWSxrQ0FBVztBQXNDeEI7SUFBd0MsbUNBQTZCO0lBQ25FLHlCQUFtQixVQUFtQjtRQUF0QyxZQUEwQyxpQkFBTyxTQUFHO1FBQWpDLGdCQUFVLEdBQVYsVUFBVSxDQUFTOztJQUFhLENBQUM7SUFFcEQsZ0NBQU0sR0FBTixVQUFPLGNBQTZCO1FBQ2xDLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBd0MsbUNBQTBCLEdBTWpFO0FBTlksMENBQWUifQ==