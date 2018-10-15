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
var util_1 = require("../util");
var component_factory_1 = require("./component_factory");
function noComponentFactoryError(component) {
    var error = Error("No component factory found for " + util_1.stringify(component) + ". Did you add it to @NgModule.entryComponents?");
    error[ERROR_COMPONENT] = component;
    return error;
}
exports.noComponentFactoryError = noComponentFactoryError;
var ERROR_COMPONENT = 'ngComponent';
function getComponent(error) {
    return error[ERROR_COMPONENT];
}
exports.getComponent = getComponent;
var _NullComponentFactoryResolver = /** @class */ (function () {
    function _NullComponentFactoryResolver() {
    }
    _NullComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        throw noComponentFactoryError(component);
    };
    return _NullComponentFactoryResolver;
}());
var ComponentFactoryResolver = /** @class */ (function () {
    function ComponentFactoryResolver() {
    }
    ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
    return ComponentFactoryResolver;
}());
exports.ComponentFactoryResolver = ComponentFactoryResolver;
var CodegenComponentFactoryResolver = /** @class */ (function () {
    function CodegenComponentFactoryResolver(factories, _parent, _ngModule) {
        this._parent = _parent;
        this._ngModule = _ngModule;
        this._factories = new Map();
        for (var i = 0; i < factories.length; i++) {
            var factory = factories[i];
            this._factories.set(factory.componentType, factory);
        }
    }
    CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        var factory = this._factories.get(component);
        if (!factory && this._parent) {
            factory = this._parent.resolveComponentFactory(component);
        }
        if (!factory) {
            throw noComponentFactoryError(component);
        }
        return new ComponentFactoryBoundToModule(factory, this._ngModule);
    };
    return CodegenComponentFactoryResolver;
}());
exports.CodegenComponentFactoryResolver = CodegenComponentFactoryResolver;
var ComponentFactoryBoundToModule = /** @class */ (function (_super) {
    __extends(ComponentFactoryBoundToModule, _super);
    function ComponentFactoryBoundToModule(factory, ngModule) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.ngModule = ngModule;
        _this.selector = factory.selector;
        _this.componentType = factory.componentType;
        _this.ngContentSelectors = factory.ngContentSelectors;
        _this.inputs = factory.inputs;
        _this.outputs = factory.outputs;
        return _this;
    }
    ComponentFactoryBoundToModule.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
        return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
    };
    return ComponentFactoryBoundToModule;
}(component_factory_1.ComponentFactory));
exports.ComponentFactoryBoundToModule = ComponentFactoryBoundToModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgsZ0NBQWtDO0FBRWxDLHlEQUFtRTtBQUduRSxpQ0FBd0MsU0FBbUI7SUFDekQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUNmLG9DQUFrQyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxtREFBZ0QsQ0FBQyxDQUFDO0lBQzNHLEtBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDNUMsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBTEQsMERBS0M7QUFFRCxJQUFNLGVBQWUsR0FBRyxhQUFhLENBQUM7QUFFdEMsc0JBQTZCLEtBQVk7SUFDdkMsT0FBUSxLQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELG9DQUVDO0FBR0Q7SUFBQTtJQUlBLENBQUM7SUFIQywrREFBdUIsR0FBdkIsVUFBMkIsU0FBb0M7UUFDN0QsTUFBTSx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0gsb0NBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEO0lBQUE7SUFHQSxDQUFDO0lBRlEsNkJBQUksR0FBNkIsSUFBSSw2QkFBNkIsRUFBRSxDQUFDO0lBRTlFLCtCQUFDO0NBQUEsQUFIRCxJQUdDO0FBSHFCLDREQUF3QjtBQUs5QztJQUdFLHlDQUNJLFNBQWtDLEVBQVUsT0FBaUMsRUFDckUsU0FBMkI7UUFEUyxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUNyRSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUovQixlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFLekQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckQ7SUFDSCxDQUFDO0lBRUQsaUVBQXVCLEdBQXZCLFVBQTJCLFNBQW9DO1FBQzdELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzRDtRQUNELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNILHNDQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSwwRUFBK0I7QUF3QjVDO0lBQXNELGlEQUFtQjtJQU92RSx1Q0FBb0IsT0FBNEIsRUFBVSxRQUEwQjtRQUFwRixZQUNFLGlCQUFPLFNBTVI7UUFQbUIsYUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFBVSxjQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUVsRixLQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsS0FBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzNDLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7UUFDckQsS0FBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzs7SUFDakMsQ0FBQztJQUVELDhDQUFNLEdBQU4sVUFDSSxRQUFrQixFQUFFLGdCQUEwQixFQUFFLGtCQUErQixFQUMvRSxRQUEyQjtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUN0QixRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBQ0gsb0NBQUM7QUFBRCxDQUFDLEFBdEJELENBQXNELG9DQUFnQixHQXNCckU7QUF0Qlksc0VBQTZCIn0=