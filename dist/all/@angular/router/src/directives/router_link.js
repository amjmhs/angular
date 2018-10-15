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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var events_1 = require("../events");
var router_1 = require("../router");
var router_state_1 = require("../router_state");
/**
 * @description
 *
 * Lets you link to specific routes in your app.
 *
 * Consider the following route configuration:
 * `[{ path: 'user/:name', component: UserCmp }]`.
 * When linking to this `user/:name` route, you use the `RouterLink` directive.
 *
 * If the link is static, you can use the directive as follows:
 * `<a routerLink="/user/bob">link to user component</a>`
 *
 * If you use dynamic values to generate the link, you can pass an array of path
 * segments, followed by the params for each segment.
 *
 * For instance `['/team', teamId, 'user', userName, {details: true}]`
 * means that we want to generate a link to `/team/11/user/bob;details=true`.
 *
 * Multiple static segments can be merged into one
 * (e.g., `['/team/11/user', userName, {details: true}]`).
 *
 * The first segment name can be prepended with `/`, `./`, or `../`:
 * * If the first segment begins with `/`, the router will look up the route from the root of the
 *   app.
 * * If the first segment begins with `./`, or doesn't begin with a slash, the router will
 *   instead look in the children of the current activated route.
 * * And if the first segment begins with `../`, the router will go up one level.
 *
 * You can set query params and fragment as follows:
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *   link to user component
 * </a>
 * ```
 * RouterLink will use these to generate this link: `/user/bob#education?debug=true`.
 *
 * (Deprecated in v4.0.0 use `queryParamsHandling` instead) You can also tell the
 * directive to preserve the current query params and fragment:
 *
 * ```
 * <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
 *   link to user component
 * </a>
 * ```
 *
 * You can tell the directive to how to handle queryParams, available options are:
 *  - `'merge'`: merge the queryParams into the current queryParams
 *  - `'preserve'`: preserve the current queryParams
 *  - default/`''`: use the queryParams only
 *
 * Same options for {@link NavigationExtras#queryParamsHandling
 * NavigationExtras#queryParamsHandling}.
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *   link to user component
 * </a>
 * ```
 *
 * The router link directive always treats the provided input as a delta to the current url.
 *
 * For instance, if the current url is `/user/(box//aux:team)`.
 *
 * Then the following link `<a [routerLink]="['/user/jim']">Jim</a>` will generate the link
 * `/user/(jim//aux:team)`.
 *
 * See {@link Router#createUrlTree createUrlTree} for more information.
 *
 * @ngModule RouterModule
 *
 *
 */
var RouterLink = /** @class */ (function () {
    function RouterLink(router, route, tabIndex, renderer, el) {
        this.router = router;
        this.route = route;
        this.commands = [];
        if (tabIndex == null) {
            renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
    }
    Object.defineProperty(RouterLink.prototype, "routerLink", {
        set: function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLink.prototype, "preserveQueryParams", {
        /**
         * @deprecated 4.0.0 use `queryParamsHandling` instead.
         */
        set: function (value) {
            if (core_1.isDevMode() && console && console.warn) {
                console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    RouterLink.prototype.onClick = function () {
        var extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return true;
    };
    Object.defineProperty(RouterLink.prototype, "urlTree", {
        get: function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], RouterLink.prototype, "queryParams", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], RouterLink.prototype, "fragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], RouterLink.prototype, "queryParamsHandling", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLink.prototype, "preserveFragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLink.prototype, "skipLocationChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLink.prototype, "replaceUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RouterLink.prototype, "routerLink", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RouterLink.prototype, "preserveQueryParams", null);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Boolean)
    ], RouterLink.prototype, "onClick", null);
    RouterLink = __decorate([
        core_1.Directive({ selector: ':not(a)[routerLink]' }),
        __param(2, core_1.Attribute('tabindex')),
        __metadata("design:paramtypes", [router_1.Router, router_state_1.ActivatedRoute, String, core_1.Renderer2, core_1.ElementRef])
    ], RouterLink);
    return RouterLink;
}());
exports.RouterLink = RouterLink;
/**
 * @description
 *
 * Lets you link to specific routes in your app.
 *
 * See `RouterLink` for more information.
 *
 * @ngModule RouterModule
 *
 *
 */
var RouterLinkWithHref = /** @class */ (function () {
    function RouterLinkWithHref(router, route, locationStrategy) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof events_1.NavigationEnd) {
                _this.updateTargetUrlAndHref();
            }
        });
    }
    Object.defineProperty(RouterLinkWithHref.prototype, "routerLink", {
        set: function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLinkWithHref.prototype, "preserveQueryParams", {
        set: function (value) {
            if (core_1.isDevMode() && console && console.warn) {
                console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    RouterLinkWithHref.prototype.ngOnChanges = function (changes) { this.updateTargetUrlAndHref(); };
    RouterLinkWithHref.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterLinkWithHref.prototype.onClick = function (button, ctrlKey, metaKey, shiftKey) {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        var extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return false;
    };
    RouterLinkWithHref.prototype.updateTargetUrlAndHref = function () {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
    };
    Object.defineProperty(RouterLinkWithHref.prototype, "urlTree", {
        get: function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.HostBinding('attr.target'), core_1.Input(),
        __metadata("design:type", String)
    ], RouterLinkWithHref.prototype, "target", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], RouterLinkWithHref.prototype, "queryParams", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], RouterLinkWithHref.prototype, "fragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], RouterLinkWithHref.prototype, "queryParamsHandling", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLinkWithHref.prototype, "preserveFragment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLinkWithHref.prototype, "skipLocationChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], RouterLinkWithHref.prototype, "replaceUrl", void 0);
    __decorate([
        core_1.HostBinding(),
        __metadata("design:type", String)
    ], RouterLinkWithHref.prototype, "href", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RouterLinkWithHref.prototype, "routerLink", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RouterLinkWithHref.prototype, "preserveQueryParams", null);
    __decorate([
        core_1.HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Boolean, Boolean, Boolean]),
        __metadata("design:returntype", Boolean)
    ], RouterLinkWithHref.prototype, "onClick", null);
    RouterLinkWithHref = __decorate([
        core_1.Directive({ selector: 'a[routerLink]' }),
        __metadata("design:paramtypes", [router_1.Router, router_state_1.ActivatedRoute,
            common_1.LocationStrategy])
    ], RouterLinkWithHref);
    return RouterLinkWithHref;
}());
exports.RouterLinkWithHref = RouterLinkWithHref;
function attrBoolValue(s) {
    return s === '' || !!s;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL2RpcmVjdGl2ZXMvcm91dGVyX2xpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBaUQ7QUFDakQsc0NBQTZJO0FBSTdJLG9DQUFxRDtBQUNyRCxvQ0FBaUM7QUFDakMsZ0RBQStDO0FBSS9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3RUc7QUFFSDtJQWlCRSxvQkFDWSxNQUFjLEVBQVUsS0FBcUIsRUFDOUIsUUFBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQWM7UUFEcEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBTGpELGFBQVEsR0FBVSxFQUFFLENBQUM7UUFPM0IsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBR0Qsc0JBQUksa0NBQVU7YUFBZCxVQUFlLFFBQXNCO1lBQ25DLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDakU7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDcEI7UUFDSCxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLDJDQUFtQjtRQUp2Qjs7V0FFRzthQUVILFVBQXdCLEtBQWM7WUFDcEMsSUFBSSxnQkFB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