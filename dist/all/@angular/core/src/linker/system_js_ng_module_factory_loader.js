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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../di");
var compiler_1 = require("./compiler");
var _SEPARATOR = '#';
var FACTORY_CLASS_SUFFIX = 'NgFactory';
/**
 * Configuration for SystemJsNgModuleLoader.
 * token.
 *
 * @experimental
 */
var SystemJsNgModuleLoaderConfig = /** @class */ (function () {
    function SystemJsNgModuleLoaderConfig() {
    }
    return SystemJsNgModuleLoaderConfig;
}());
exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
var DEFAULT_CONFIG = {
    factoryPathPrefix: '',
    factoryPathSuffix: '.ngfactory',
};
/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 * @experimental
 */
var SystemJsNgModuleLoader = /** @class */ (function () {
    function SystemJsNgModuleLoader(_compiler, config) {
        this._compiler = _compiler;
        this._config = config || DEFAULT_CONFIG;
    }
    SystemJsNgModuleLoader.prototype.load = function (path) {
        var offlineMode = this._compiler instanceof compiler_1.Compiler;
        return offlineMode ? this.loadFactory(path) : this.loadAndCompile(path);
    };
    SystemJsNgModuleLoader.prototype.loadAndCompile = function (path) {
        var _this = this;
        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
        if (exportName === undefined) {
            exportName = 'default';
        }
        return System.import(module)
            .then(function (module) { return module[exportName]; })
            .then(function (type) { return checkNotEmpty(type, module, exportName); })
            .then(function (type) { return _this._compiler.compileModuleAsync(type); });
    };
    SystemJsNgModuleLoader.prototype.loadFactory = function (path) {
        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
        var factoryClassSuffix = FACTORY_CLASS_SUFFIX;
        if (exportName === undefined) {
            exportName = 'default';
            factoryClassSuffix = '';
        }
        return System.import(this._config.factoryPathPrefix + module + this._config.factoryPathSuffix)
            .then(function (module) { return module[exportName + factoryClassSuffix]; })
            .then(function (factory) { return checkNotEmpty(factory, module, exportName); });
    };
    SystemJsNgModuleLoader = __decorate([
        di_1.Injectable(),
        __param(1, di_1.Optional()),
        __metadata("design:paramtypes", [compiler_1.Compiler, SystemJsNgModuleLoaderConfig])
    ], SystemJsNgModuleLoader);
    return SystemJsNgModuleLoader;
}());
exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
function checkNotEmpty(value, modulePath, exportName) {
    if (!value) {
        throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtX2pzX25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2xpbmtlci9zeXN0ZW1fanNfbmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBR0gsNEJBQTJDO0FBRTNDLHVDQUFvQztBQUlwQyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFFdkIsSUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUM7QUFHekM7Ozs7O0dBS0c7QUFDSDtJQUFBO0lBWUEsQ0FBQztJQUFELG1DQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFacUIsb0VBQTRCO0FBY2xELElBQU0sY0FBYyxHQUFpQztJQUNuRCxpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLGlCQUFpQixFQUFFLFlBQVk7Q0FDaEMsQ0FBQztBQUVGOzs7R0FHRztBQUVIO0lBR0UsZ0NBQW9CLFNBQW1CLEVBQWMsTUFBcUM7UUFBdEUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSSxjQUFjLENBQUM7SUFDMUMsQ0FBQztJQUVELHFDQUFJLEdBQUosVUFBSyxJQUFZO1FBQ2YsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsWUFBWSxtQkFBUSxDQUFDO1FBQ3ZELE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTywrQ0FBYyxHQUF0QixVQUF1QixJQUFZO1FBQW5DLGlCQVVDO1FBVEssSUFBQSwyQkFBNkMsRUFBNUMsY0FBTSxFQUFFLGtCQUFVLENBQTJCO1FBQ2xELElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM1QixVQUFVLEdBQUcsU0FBUyxDQUFDO1NBQ3hCO1FBRUQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUN2QixJQUFJLENBQUMsVUFBQyxNQUFXLElBQUssT0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQWxCLENBQWtCLENBQUM7YUFDekMsSUFBSSxDQUFDLFVBQUMsSUFBUyxJQUFLLE9BQUEsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQXZDLENBQXVDLENBQUM7YUFDNUQsSUFBSSxDQUFDLFVBQUMsSUFBUyxJQUFLLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTyw0Q0FBVyxHQUFuQixVQUFvQixJQUFZO1FBQzFCLElBQUEsMkJBQTZDLEVBQTVDLGNBQU0sRUFBRSxrQkFBVSxDQUEyQjtRQUNsRCxJQUFJLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO1FBQzlDLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM1QixVQUFVLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztTQUN6QjtRQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2FBQ3pGLElBQUksQ0FBQyxVQUFDLE1BQVcsSUFBSyxPQUFBLE1BQU0sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQzthQUM5RCxJQUFJLENBQUMsVUFBQyxPQUFZLElBQUssT0FBQSxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFuQ1Usc0JBQXNCO1FBRGxDLGVBQVUsRUFBRTtRQUkrQixXQUFBLGFBQVEsRUFBRSxDQUFBO3lDQUFyQixtQkFBUSxFQUF1Qiw0QkFBNEI7T0FIL0Usc0JBQXNCLENBb0NsQztJQUFELDZCQUFDO0NBQUEsQUFwQ0QsSUFvQ0M7QUFwQ1ksd0RBQXNCO0FBc0NuQyx1QkFBdUIsS0FBVSxFQUFFLFVBQWtCLEVBQUUsVUFBa0I7SUFDdkUsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWdCLFVBQVUsY0FBUyxVQUFVLE1BQUcsQ0FBQyxDQUFDO0tBQ25FO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIn0=