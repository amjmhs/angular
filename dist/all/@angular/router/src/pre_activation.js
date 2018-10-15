"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var events_1 = require("./events");
var router_state_1 = require("./router_state");
var collection_1 = require("./utils/collection");
var tree_1 = require("./utils/tree");
var CanActivate = /** @class */ (function () {
    function CanActivate(path) {
        this.path = path;
        this.route = this.path[this.path.length - 1];
    }
    return CanActivate;
}());
var CanDeactivate = /** @class */ (function () {
    function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
    }
    return CanDeactivate;
}());
/**
 * This class bundles the actions involved in preactivation of a route.
 */
var PreActivation = /** @class */ (function () {
    function PreActivation(future, curr, moduleInjector, forwardEvent) {
        this.future = future;
        this.curr = curr;
        this.moduleInjector = moduleInjector;
        this.forwardEvent = forwardEvent;
        this.canActivateChecks = [];
        this.canDeactivateChecks = [];
    }
    PreActivation.prototype.initialize = function (parentContexts) {
        var futureRoot = this.future._root;
        var currRoot = this.curr ? this.curr._root : null;
        this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
    };
    PreActivation.prototype.checkGuards = function () {
        var _this = this;
        if (!this.isDeactivating() && !this.isActivating()) {
            return rxjs_1.of(true);
        }
        var canDeactivate$ = this.runCanDeactivateChecks();
        return canDeactivate$.pipe(operators_1.mergeMap(function (canDeactivate) { return canDeactivate ? _this.runCanActivateChecks() : rxjs_1.of(false); }));
    };
    PreActivation.prototype.resolveData = function (paramsInheritanceStrategy) {
        var _this = this;
        if (!this.isActivating())
            return rxjs_1.of(null);
        return rxjs_1.from(this.canActivateChecks)
            .pipe(operators_1.concatMap(function (check) { return _this.runResolve(check.route, paramsInheritanceStrategy); }), operators_1.reduce(function (_, __) { return _; }));
    };
    PreActivation.prototype.isDeactivating = function () { return this.canDeactivateChecks.length !== 0; };
    PreActivation.prototype.isActivating = function () { return this.canActivateChecks.length !== 0; };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    PreActivation.prototype.setupChildRouteGuards = function (futureNode, currNode, contexts, futurePath) {
        var _this = this;
        var prevChildren = tree_1.nodeChildrenAsMap(currNode);
        // Process the children of the future route
        futureNode.children.forEach(function (c) {
            _this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        // Process any children left from the current route (not active for the future route)
        collection_1.forEach(prevChildren, function (v, k) {
            return _this.deactivateRouteAndItsChildren(v, contexts.getContext(k));
        });
    };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    PreActivation.prototype.setupRouteGuards = function (futureNode, currNode, parentContexts, futurePath) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        var context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        // reusing the node
        if (curr && future.routeConfig === curr.routeConfig) {
            var shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, future.routeConfig.runGuardsAndResolvers);
            if (shouldRunGuardsAndResolvers) {
                this.canActivateChecks.push(new CanActivate(futurePath));
            }
            else {
                // we need to set the data
                future.data = curr.data;
                future._resolvedData = curr._resolvedData;
            }
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, currNode, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, currNode, parentContexts, futurePath);
            }
            if (shouldRunGuardsAndResolvers) {
                var outlet = context.outlet;
                this.canDeactivateChecks.push(new CanDeactivate(outlet.component, curr));
            }
        }
        else {
            if (curr) {
                this.deactivateRouteAndItsChildren(currNode, context);
            }
            this.canActivateChecks.push(new CanActivate(futurePath));
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, null, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, null, parentContexts, futurePath);
            }
        }
    };
    PreActivation.prototype.shouldRunGuardsAndResolvers = function (curr, future, mode) {
        switch (mode) {
            case 'always':
                return true;
            case 'paramsOrQueryParamsChange':
                return !router_state_1.equalParamsAndUrlSegments(curr, future) ||
                    !collection_1.shallowEqual(curr.queryParams, future.queryParams);
            case 'paramsChange':
            default:
                return !router_state_1.equalParamsAndUrlSegments(curr, future);
        }
    };
    PreActivation.prototype.deactivateRouteAndItsChildren = function (route, context) {
        var _this = this;
        var children = tree_1.nodeChildrenAsMap(route);
        var r = route.value;
        collection_1.forEach(children, function (node, childName) {
            if (!r.component) {
                _this.deactivateRouteAndItsChildren(node, context);
            }
            else if (context) {
                _this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
            }
            else {
                _this.deactivateRouteAndItsChildren(node, null);
            }
        });
        if (!r.component) {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
        else if (context && context.outlet && context.outlet.isActivated) {
            this.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
        }
        else {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
    };
    PreActivation.prototype.runCanDeactivateChecks = function () {
        var _this = this;
        return rxjs_1.from(this.canDeactivateChecks)
            .pipe(operators_1.mergeMap(function (check) { return _this.runCanDeactivate(check.component, check.route); }), operators_1.every(function (result) { return result === true; }));
    };
    PreActivation.prototype.runCanActivateChecks = function () {
        var _this = this;
        return rxjs_1.from(this.canActivateChecks)
            .pipe(operators_1.concatMap(function (check) { return collection_1.andObservables(rxjs_1.from([
            _this.fireChildActivationStart(check.route.parent),
            _this.fireActivationStart(check.route), _this.runCanActivateChild(check.path),
            _this.runCanActivate(check.route)
        ])); }), operators_1.every(function (result) { return result === true; }));
        // this.fireChildActivationStart(check.path),
    };
    /**
     * This should fire off `ActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     */
    PreActivation.prototype.fireActivationStart = function (snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new events_1.ActivationStart(snapshot));
        }
        return rxjs_1.of(true);
    };
    /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     */
    PreActivation.prototype.fireChildActivationStart = function (snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new events_1.ChildActivationStart(snapshot));
        }
        return rxjs_1.of(true);
    };
    PreActivation.prototype.runCanActivate = function (future) {
        var _this = this;
        var canActivate = future.routeConfig ? future.routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return rxjs_1.of(true);
        var obs = rxjs_1.from(canActivate).pipe(operators_1.map(function (c) {
            var guard = _this.getToken(c, future);
            var observable;
            if (guard.canActivate) {
                observable = collection_1.wrapIntoObservable(guard.canActivate(future, _this.future));
            }
            else {
                observable = collection_1.wrapIntoObservable(guard(future, _this.future));
            }
            return observable.pipe(operators_1.first());
        }));
        return collection_1.andObservables(obs);
    };
    PreActivation.prototype.runCanActivateChild = function (path) {
        var _this = this;
        var future = path[path.length - 1];
        var canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(function (p) { return _this.extractCanActivateChild(p); })
            .filter(function (_) { return _ !== null; });
        return collection_1.andObservables(rxjs_1.from(canActivateChildGuards).pipe(operators_1.map(function (d) {
            var obs = rxjs_1.from(d.guards).pipe(operators_1.map(function (c) {
                var guard = _this.getToken(c, d.node);
                var observable;
                if (guard.canActivateChild) {
                    observable = collection_1.wrapIntoObservable(guard.canActivateChild(future, _this.future));
                }
                else {
                    observable = collection_1.wrapIntoObservable(guard(future, _this.future));
                }
                return observable.pipe(operators_1.first());
            }));
            return collection_1.andObservables(obs);
        })));
    };
    PreActivation.prototype.extractCanActivateChild = function (p) {
        var canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    };
    PreActivation.prototype.runCanDeactivate = function (component, curr) {
        var _this = this;
        var canDeactivate = curr && curr.routeConfig ? curr.routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return rxjs_1.of(true);
        var canDeactivate$ = rxjs_1.from(canDeactivate).pipe(operators_1.mergeMap(function (c) {
            var guard = _this.getToken(c, curr);
            var observable;
            if (guard.canDeactivate) {
                observable =
                    collection_1.wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr, _this.future));
            }
            else {
                observable = collection_1.wrapIntoObservable(guard(component, curr, _this.curr, _this.future));
            }
            return observable.pipe(operators_1.first());
        }));
        return canDeactivate$.pipe(operators_1.every(function (result) { return result === true; }));
    };
    PreActivation.prototype.runResolve = function (future, paramsInheritanceStrategy) {
        var resolve = future._resolve;
        return this.resolveNode(resolve, future).pipe(operators_1.map(function (resolvedData) {
            future._resolvedData = resolvedData;
            future.data = __assign({}, future.data, router_state_1.inheritedParamsDataResolve(future, paramsInheritanceStrategy).resolve);
            return null;
        }));
    };
    PreActivation.prototype.resolveNode = function (resolve, future) {
        var _this = this;
        var keys = Object.keys(resolve);
        if (keys.length === 0) {
            return rxjs_1.of({});
        }
        if (keys.length === 1) {
            var key_1 = keys[0];
            return this.getResolver(resolve[key_1], future).pipe(operators_1.map(function (value) {
                var _a;
                return _a = {}, _a[key_1] = value, _a;
            }));
        }
        var data = {};
        var runningResolvers$ = rxjs_1.from(keys).pipe(operators_1.mergeMap(function (key) {
            return _this.getResolver(resolve[key], future).pipe(operators_1.map(function (value) {
                data[key] = value;
                return value;
            }));
        }));
        return runningResolvers$.pipe(operators_1.last(), operators_1.map(function () { return data; }));
    };
    PreActivation.prototype.getResolver = function (injectionToken, future) {
        var resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? collection_1.wrapIntoObservable(resolver.resolve(future, this.future)) :
            collection_1.wrapIntoObservable(resolver(future, this.future));
    };
    PreActivation.prototype.getToken = function (token, snapshot) {
        var config = closestLoadedConfig(snapshot);
        var injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
    };
    return PreActivation;
}());
exports.PreActivation = PreActivation;
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    for (var s = snapshot.parent; s; s = s.parent) {
        var route = s.routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlX2FjdGl2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3ByZV9hY3RpdmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFHSCw2QkFBMkM7QUFDM0MsNENBQW9GO0FBR3BGLG1DQUFzRTtBQUV0RSwrQ0FBa0k7QUFDbEksaURBQTZGO0FBQzdGLHFDQUF5RDtBQUV6RDtJQUVFLHFCQUFtQixJQUE4QjtRQUE5QixTQUFJLEdBQUosSUFBSSxDQUEwQjtRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFFRDtJQUNFLHVCQUFtQixTQUFzQixFQUFTLEtBQTZCO1FBQTVELGNBQVMsR0FBVCxTQUFTLENBQWE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUF3QjtJQUFHLENBQUM7SUFDckYsb0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVEOztHQUVHO0FBQ0g7SUFJRSx1QkFDWSxNQUEyQixFQUFVLElBQXlCLEVBQzlELGNBQXdCLEVBQVUsWUFBbUM7UUFEckUsV0FBTSxHQUFOLE1BQU0sQ0FBcUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFxQjtRQUM5RCxtQkFBYyxHQUFkLGNBQWMsQ0FBVTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUF1QjtRQUx6RSxzQkFBaUIsR0FBa0IsRUFBRSxDQUFDO1FBQ3RDLHdCQUFtQixHQUFvQixFQUFFLENBQUM7SUFJa0MsQ0FBQztJQUVyRixrQ0FBVSxHQUFWLFVBQVcsY0FBc0M7UUFDL0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBTSxRQUFRLEdB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