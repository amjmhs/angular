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
// TODO(i): switch to fromPromise once it's expored in rxjs
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var config_1 = require("./config");
var collection_1 = require("./utils/collection");
/**
 * @docsNotRequired
 * @experimental
 */
exports.ROUTES = new core_1.InjectionToken('ROUTES');
var RouterConfigLoader = /** @class */ (function () {
    function RouterConfigLoader(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    RouterConfigLoader.prototype.load = function (parentInjector, route) {
        var _this = this;
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        var moduleFactory$ = this.loadModuleFactory(route.loadChildren);
        return moduleFactory$.pipe(operators_1.map(function (factory) {
            if (_this.onLoadEndListener) {
                _this.onLoadEndListener(route);
            }
            var module = factory.create(parentInjector);
            return new config_1.LoadedRouterConfig(collection_1.flatten(module.injector.get(exports.ROUTES)).map(config_1.standardizeConfig), module);
        }));
    };
    RouterConfigLoader.prototype.loadModuleFactory = function (loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
            return rxjs_1.from(this.loader.load(loadChildren));
        }
        else {
            return collection_1.wrapIntoObservable(loadChildren()).pipe(operators_1.mergeMap(function (t) {
                if (t instanceof core_1.NgModuleFactory) {
                    return rxjs_1.of(t);
                }
                else {
                    return rxjs_1.from(_this.compiler.compileModuleAsync(t));
                }
            }));
        }
    };
    return RouterConfigLoader;
}());
exports.RouterConfigLoader = RouterConfigLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2NvbmZpZ19sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlcl9jb25maWdfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXlHO0FBQ3pHLDJEQUEyRDtBQUMzRCw2QkFBMkM7QUFDM0MsNENBQTZDO0FBQzdDLG1DQUFvRjtBQUNwRixpREFBK0Q7QUFFL0Q7OztHQUdHO0FBQ1UsUUFBQSxNQUFNLEdBQUcsSUFBSSxxQkFBYyxDQUFZLFFBQVEsQ0FBQyxDQUFDO0FBRTlEO0lBQ0UsNEJBQ1ksTUFBNkIsRUFBVSxRQUFrQixFQUN6RCxtQkFBd0MsRUFDeEMsaUJBQXNDO1FBRnRDLFdBQU0sR0FBTixNQUFNLENBQXVCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN6RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7SUFBRyxDQUFDO0lBRXRELGlDQUFJLEdBQUosVUFBSyxjQUF3QixFQUFFLEtBQVk7UUFBM0MsaUJBaUJDO1FBaEJDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsWUFBYyxDQUFDLENBQUM7UUFFcEUsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQUcsQ0FBQyxVQUFDLE9BQTZCO1lBQzNELElBQUksS0FBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMxQixLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFFRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sSUFBSSwyQkFBa0IsQ0FDekIsb0JBQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQywwQkFBaUIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRU8sOENBQWlCLEdBQXpCLFVBQTBCLFlBQTBCO1FBQXBELGlCQVlDO1FBWEMsSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7WUFDcEMsT0FBTyxXQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUM3QzthQUFNO1lBQ0wsT0FBTywrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBUSxDQUFDLFVBQUMsQ0FBTTtnQkFDN0QsSUFBSSxDQUFDLFlBQVksc0JBQWUsRUFBRTtvQkFDaEMsT0FBTyxTQUFFLENBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2Y7cUJBQU07b0JBQ0wsT0FBTyxXQUFJLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDtZQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDTDtJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0M7QUF0Q1ksZ0RBQWtCIn0=