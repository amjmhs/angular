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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var collection_1 = require("../src/utils/collection");
var testing_2 = require("../testing");
describe('Integration', function () {
    var noopConsole = { log: function () { }, warn: function () { } };
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'simple', component: SimpleCmp }]), TestModule],
            providers: [{ provide: core_1.ɵConsole, useValue: noopConsole }]
        });
    });
    it('should navigate with a provided config', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/simple');
    })));
    it('should navigate from ngOnInit hook', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        router.resetConfig([
            { path: '', component: SimpleCmp },
            { path: 'one', component: RouteCmp },
        ]);
        var fixture = createRoot(router, RootCmpWithOnInit);
        matchers_1.expect(location.path()).toEqual('/one');
        matchers_1.expect(fixture.nativeElement).toHaveText('route');
    })));
    describe('navigation', function () {
        it('should navigate to the current URL', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            router.onSameUrlNavigation = 'reload';
            router.resetConfig([
                { path: '', component: SimpleCmp },
                { path: 'simple', component: SimpleCmp },
            ]);
            var fixture = createRoot(router, RootCmp);
            var events = [];
            router.events.subscribe(function (e) { return onlyNavigationStartAndEnd(e) && events.push(e); });
            router.navigateByUrl('/simple');
            testing_1.tick();
            router.navigateByUrl('/simple');
            testing_1.tick();
            expectEvents(events, [
                [router_1.NavigationStart, '/simple'], [router_1.NavigationEnd, '/simple'], [router_1.NavigationStart, '/simple'],
                [router_1.NavigationEnd, '/simple']
            ]);
        })));
        it('should set the restoredState to null when executing imperative navigations', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            router.resetConfig([
                { path: '', component: SimpleCmp },
                { path: 'simple', component: SimpleCmp },
            ]);
            var fixture = createRoot(router, RootCmp);
            var event;
            router.events.subscribe(function (e) {
                if (e instanceof router_1.NavigationStart) {
                    event = e;
                }
            });
            router.navigateByUrl('/simple');
            testing_1.tick();
            matchers_1.expect(event.navigationTrigger).toEqual('imperative');
            matchers_1.expect(event.restoredState).toEqual(null);
        })));
        it('should not pollute browser history when replaceUrl is set to true', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            router.resetConfig([
                { path: '', component: SimpleCmp }, { path: 'a', component: SimpleCmp },
                { path: 'b', component: SimpleCmp }
            ]);
            var fixture = createRoot(router, RootCmp);
            router.navigateByUrl('/a', { replaceUrl: true });
            router.navigateByUrl('/b', { replaceUrl: true });
            testing_1.tick();
            matchers_1.expect(location.urlChanges).toEqual(['replace: /', 'replace: /b']);
        })));
        it('should skip navigation if another navigation is already scheduled', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            router.resetConfig([
                { path: '', component: SimpleCmp }, { path: 'a', component: SimpleCmp },
                { path: 'b', component: SimpleCmp }
            ]);
            var fixture = createRoot(router, RootCmp);
            router.navigate(['/a'], { queryParams: { a: true }, queryParamsHandling: 'merge', replaceUrl: true });
            router.navigate(['/b'], { queryParams: { b: true }, queryParamsHandling: 'merge', replaceUrl: true });
            testing_1.tick();
            /**
             * Why do we have '/b?b=true' and not '/b?a=true&b=true'?
             *
             * This is because the router has the right to stop a navigation mid-flight if another
             * navigation has been already scheduled. This is why we can use a top-level guard
             * to perform redirects. Calling `navigate` in such a guard will stop the navigation, and
             * the components won't be instantiated.
             *
             * This is a fundamental property of the router: it only cares about its latest state.
             *
             * This means that components should only map params to something else, not reduce them.
             * In other words, the following component is asking for trouble:
             *
             * ```
             * class MyComponent {
             *  constructor(a: ActivatedRoute) {
             *    a.params.scan(...)
             *  }
             * }
             * ```
             *
             * This also means "queryParamsHandling: 'merge'" should only be used to merge with
             * long-living query parameters (e.g., debug).
             */
            matchers_1.expect(router.url).toEqual('/b?b=true');
        })));
    });
    describe('navigation warning', function () {
        var warnings = [];
        var MockConsole = /** @class */ (function () {
            function MockConsole() {
            }
            MockConsole.prototype.warn = function (message) { warnings.push(message); };
            return MockConsole;
        }());
        beforeEach(function () {
            warnings = [];
            testing_1.TestBed.overrideProvider(core_1.ɵConsole, { useValue: new MockConsole() });
        });
        describe('with NgZone enabled', function () {
            it('should warn when triggered outside Angular zone', testing_1.fakeAsync(testing_1.inject([router_1.Router, core_1.NgZone], function (router, ngZone) {
                ngZone.runOutsideAngular(function () { router.navigateByUrl('/simple'); });
                matchers_1.expect(warnings.length).toBe(1);
                matchers_1.expect(warnings[0])
                    .toBe("Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?");
            })));
            it('should not warn when triggered inside Angular zone', testing_1.fakeAsync(testing_1.inject([router_1.Router, core_1.NgZone], function (router, ngZone) {
                ngZone.run(function () { router.navigateByUrl('/simple'); });
                matchers_1.expect(warnings.length).toBe(0);
            })));
        });
        describe('with NgZone disabled', function () {
            beforeEach(function () { testing_1.TestBed.overrideProvider(core_1.NgZone, { useValue: new core_1.ɵNoopNgZone() }); });
            it('should not warn when triggered outside Angular zone', testing_1.fakeAsync(testing_1.inject([router_1.Router, core_1.NgZone], function (router, ngZone) {
                ngZone.runOutsideAngular(function () { router.navigateByUrl('/simple'); });
                matchers_1.expect(warnings.length).toBe(0);
            })));
        });
    });
    describe('should execute navigations serially', function () {
        var log = [];
        beforeEach(function () {
            log = [];
            testing_1.TestBed.configureTestingModule({
                providers: [
                    {
                        provide: 'trueRightAway',
                        useValue: function () {
                            log.push('trueRightAway');
                            return true;
                        }
                    },
                    {
                        provide: 'trueIn2Seconds',
                        useValue: function () {
                            log.push('trueIn2Seconds-start');
                            var res = null;
                            var p = new Promise(function (r) { return res = r; });
                            setTimeout(function () {
                                log.push('trueIn2Seconds-end');
                                res(true);
                            }, 2000);
                            return p;
                        }
                    }
                ]
            });
        });
        describe('should advance the parent route after deactivating its children', function () {
            var Parent = /** @class */ (function () {
                function Parent(route) {
                    route.params.subscribe(function (s) { log.push(s); });
                }
                Parent = __decorate([
                    core_1.Component({ template: '<router-outlet></router-outlet>' }),
                    __metadata("design:paramtypes", [router_1.ActivatedRoute])
                ], Parent);
                return Parent;
            }());
            var Child1 = /** @class */ (function () {
                function Child1() {
                }
                Child1.prototype.ngOnDestroy = function () { log.push('child1 destroy'); };
                Child1 = __decorate([
                    core_1.Component({ template: 'child1' })
                ], Child1);
                return Child1;
            }());
            var Child2 = /** @class */ (function () {
                function Child2() {
                    log.push('child2 constructor');
                }
                Child2 = __decorate([
                    core_1.Component({ template: 'child2' }),
                    __metadata("design:paramtypes", [])
                ], Child2);
                return Child2;
            }());
            var TestModule = /** @class */ (function () {
                function TestModule() {
                }
                TestModule = __decorate([
                    core_1.NgModule({
                        declarations: [Parent, Child1, Child2],
                        entryComponents: [Parent, Child1, Child2],
                        imports: [router_1.RouterModule]
                    })
                ], TestModule);
                return TestModule;
            }());
            beforeEach(function () { return testing_1.TestBed.configureTestingModule({ imports: [TestModule] }); });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'parent/:id',
                        component: Parent,
                        children: [
                            { path: 'child1', component: Child1 },
                            { path: 'child2', component: Child2 },
                        ]
                    }]);
                router.navigateByUrl('/parent/1/child1');
                advance(fixture);
                router.navigateByUrl('/parent/2/child2');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/parent/2/child2');
                matchers_1.expect(log).toEqual([
                    { id: '1' },
                    'child1 destroy',
                    { id: '2' },
                    'child2 constructor',
                ]);
            })));
        });
        it('should execute navigations serialy', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'a', component: SimpleCmp, canActivate: ['trueRightAway', 'trueIn2Seconds'] },
                { path: 'b', component: SimpleCmp, canActivate: ['trueRightAway', 'trueIn2Seconds'] }
            ]);
            router.navigateByUrl('/a');
            testing_1.tick(100);
            fixture.detectChanges();
            router.navigateByUrl('/b');
            testing_1.tick(100); // 200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual(['trueRightAway', 'trueIn2Seconds-start']);
            testing_1.tick(2000); // 2200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual([
                'trueRightAway', 'trueIn2Seconds-start', 'trueIn2Seconds-end', 'trueRightAway',
                'trueIn2Seconds-start'
            ]);
            testing_1.tick(2000); // 4200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual([
                'trueRightAway', 'trueIn2Seconds-start', 'trueIn2Seconds-end', 'trueRightAway',
                'trueIn2Seconds-start', 'trueIn2Seconds-end'
            ]);
        })));
    });
    it('Should work inside ChangeDetectionStrategy.OnPush components', testing_1.fakeAsync(function () {
        var OnPushOutlet = /** @class */ (function () {
            function OnPushOutlet() {
            }
            OnPushOutlet = __decorate([
                core_1.Component({
                    selector: 'root-cmp',
                    template: "<router-outlet></router-outlet>",
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                })
            ], OnPushOutlet);
            return OnPushOutlet;
        }());
        var NeedCdCmp = /** @class */ (function () {
            function NeedCdCmp() {
            }
            NeedCdCmp = __decorate([
                core_1.Component({ selector: 'need-cd', template: "{{'it works!'}}" })
            ], NeedCdCmp);
            return NeedCdCmp;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule() {
            }
            TestModule = __decorate([
                core_1.NgModule({
                    declarations: [OnPushOutlet, NeedCdCmp],
                    entryComponents: [OnPushOutlet, NeedCdCmp],
                    imports: [router_1.RouterModule],
                })
            ], TestModule);
            return TestModule;
        }());
        testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'on',
                component: OnPushOutlet,
                children: [{
                        path: 'push',
                        component: NeedCdCmp,
                    }],
            }]);
        advance(fixture);
        router.navigateByUrl('on');
        advance(fixture);
        router.navigateByUrl('on/push');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('it works!');
    }));
    it('should not error when no url left and no children are matching', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }]
            }]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        router.navigateByUrl('/team/33');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should work when an outlet is in an ngIf', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'child',
                component: OutletInNgIf,
                children: [{ path: 'simple', component: SimpleCmp }]
            }]);
        router.navigateByUrl('/child/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/child/simple');
    })));
    it('should work when an outlet is added/removed', testing_1.fakeAsync(function () {
        var RootCmpWithLink = /** @class */ (function () {
            function RootCmpWithLink() {
                this.cond = true;
            }
            RootCmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someRoot',
                    template: "[<div *ngIf=\"cond\"><router-outlet></router-outlet></div>]"
                })
            ], RootCmpWithLink);
            return RootCmpWithLink;
        }());
        testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, RootCmpWithLink);
        router.resetConfig([
            { path: 'simple', component: SimpleCmp },
            { path: 'blank', component: BlankCmp },
        ]);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[simple]');
        fixture.componentInstance.cond = false;
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[]');
        fixture.componentInstance.cond = true;
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[simple]');
    }));
    it('should update location when navigating', testing_1.fakeAsync(function () {
        var RecordLocationCmp = /** @class */ (function () {
            function RecordLocationCmp(loc) {
                this.storedPath = loc.path();
            }
            RecordLocationCmp = __decorate([
                core_1.Component({ template: "record" }),
                __metadata("design:paramtypes", [common_1.Location])
            ], RecordLocationCmp);
            return RecordLocationCmp;
        }());
        var TestModule = /** @class */ (function () {
            function TestModule() {
            }
            TestModule = __decorate([
                core_1.NgModule({ declarations: [RecordLocationCmp], entryComponents: [RecordLocationCmp] })
            ], TestModule);
            return TestModule;
        }());
        testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
        var router = testing_1.TestBed.get(router_1.Router);
        var location = testing_1.TestBed.get(common_1.Location);
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'record/:id', component: RecordLocationCmp }]);
        router.navigateByUrl('/record/22');
        advance(fixture);
        var c = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(location.path()).toEqual('/record/22');
        matchers_1.expect(c.storedPath).toEqual('/record/22');
        router.navigateByUrl('/record/33');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/record/33');
    }));
    it('should skip location update when using NavigationExtras.skipLocationChange with navigateByUrl', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = testing_1.TestBed.createComponent(RootCmp);
        advance(fixture);
        router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
        router.navigateByUrl('/team/22');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
        router.navigateByUrl('/team/33', { skipLocationChange: true });
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should skip location update when using NavigationExtras.skipLocationChange with navigate', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = testing_1.TestBed.createComponent(RootCmp);
        advance(fixture);
        router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
        router.navigate(['/team/22']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
        router.navigate(['/team/33'], { skipLocationChange: true });
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should eagerly update the URL with urlUpdateStrategy="eagar"', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = testing_1.TestBed.createComponent(RootCmp);
        advance(fixture);
        router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
        router.navigateByUrl('/team/22');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
        router.urlUpdateStrategy = 'eager';
        router.hooks.beforePreactivation = function () {
            matchers_1.expect(location.path()).toEqual('/team/33');
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
            return rxjs_1.of(null);
        };
        router.navigateByUrl('/team/33');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should navigate back and forward', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }, { path: 'user/:name', component: UserCmp }]
            }]);
        var event;
        router.events.subscribe(function (e) {
            if (e instanceof router_1.NavigationStart) {
                event = e;
            }
        });
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        var simpleNavStart = event;
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        var userVictorNavStart = event;
        location.back();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        matchers_1.expect(event.navigationTrigger).toEqual('hashchange');
        matchers_1.expect(event.restoredState.navigationId).toEqual(simpleNavStart.id);
        location.forward();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22/user/victor');
        matchers_1.expect(event.navigationTrigger).toEqual('hashchange');
        matchers_1.expect(event.restoredState.navigationId).toEqual(userVictorNavStart.id);
    })));
    it('should navigate to the same url when config changes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'a', component: SimpleCmp }]);
        router.navigate(['/a']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/a');
        matchers_1.expect(fixture.nativeElement).toHaveText('simple');
        router.resetConfig([{ path: 'a', component: RouteCmp }]);
        router.navigate(['/a']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/a');
        matchers_1.expect(fixture.nativeElement).toHaveText('route');
    })));
    it('should navigate when locations changes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'user/:name', component: UserCmp }]
            }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return onlyNavigationStartAndEnd(e) && recordedEvents.push(e); });
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.simulateHashChange('/team/22/user/fedor');
        advance(fixture);
        location.simulateUrlPop('/team/22/user/fedor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user fedor, right:  ]');
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/team/22/user/victor'], [router_1.NavigationEnd, '/team/22/user/victor'],
            [router_1.NavigationStart, '/team/22/user/fedor'], [router_1.NavigationEnd, '/team/22/user/fedor']
        ]);
    })));
    it('should update the location when the matched route does not change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: '**', component: CollectParamsCmp }]);
        router.navigateByUrl('/one/two');
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(location.path()).toEqual('/one/two');
        matchers_1.expect(fixture.nativeElement).toHaveText('collect-params');
        matchers_1.expect(cmp.recordedUrls()).toEqual(['one/two']);
        router.navigateByUrl('/three/four');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/three/four');
        matchers_1.expect(fixture.nativeElement).toHaveText('collect-params');
        matchers_1.expect(cmp.recordedUrls()).toEqual(['one/two', 'three/four']);
    })));
    describe('should reset location if a navigation by location is successful', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{
                        provide: 'in1Second',
                        useValue: function (c, a, b) {
                            var res = null;
                            var p = new Promise(function (_) { return res = _; });
                            setTimeout(function () { return res(true); }, 1000);
                            return p;
                        }
                    }]
            });
        });
        it('work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp, canActivate: ['in1Second'] }]);
            // Trigger two location changes to the same URL.
            // Because of the guard the order will look as follows:
            // - location change 'simple'
            // - start processing the change, start a guard
            // - location change 'simple'
            // - the first location change gets canceled, the URL gets reset to '/'
            // - the second location change gets finished, the URL should be reset to '/simple'
            location.simulateUrlPop('/simple');
            location.simulateUrlPop('/simple');
            testing_1.tick(2000);
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/simple');
        })));
    });
    it('should support secondary routes', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right: simple ]');
    })));
    it('should support secondary routes in separate commands', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        router.navigate(['team/22', { outlets: { right: 'simple' } }]);
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right: simple ]');
    })));
    it('should deactivate outlets', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right:  ]');
    })));
    it('should deactivate nested outlets', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([
            {
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            },
            { path: '', component: BlankCmp }
        ]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('');
    })));
    it('should set query params and fragment', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: QueryParamsAndFragmentCmp }]);
        router.navigateByUrl('/query?name=1#fragment1');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('query: 1 fragment: fragment1');
        router.navigateByUrl('/query?name=2#fragment2');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('query: 2 fragment: fragment2');
    })));
    it('should ignore null and undefined query params', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: EmptyQueryParamsCmp }]);
        router.navigate(['query'], { queryParams: { name: 1, age: null, page: undefined } });
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(cmp.recordedParams).toEqual([{ name: '1' }]);
    })));
    it('should throw an error when one of the commands is null/undefined', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: EmptyQueryParamsCmp }]);
        matchers_1.expect(function () { return router.navigate([
            undefined, 'query'
        ]); }).toThrowError("The requested path contains undefined segment at index 0");
    })));
    it('should push params only when they change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'user/:name', component: UserCmp }]
            }]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        var team = fixture.debugElement.children[1].componentInstance;
        var user = fixture.debugElement.children[1].children[1].componentInstance;
        matchers_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        matchers_1.expect(team.snapshotParams).toEqual([{ id: '22' }]);
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'victor' }]);
        matchers_1.expect(user.snapshotParams).toEqual([{ name: 'victor' }]);
        router.navigateByUrl('/team/22/user/fedor');
        advance(fixture);
        matchers_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        matchers_1.expect(team.snapshotParams).toEqual([{ id: '22' }]);
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'victor' }, { name: 'fedor' }]);
        matchers_1.expect(user.snapshotParams).toEqual([{ name: 'victor' }, { name: 'fedor' }]);
    })));
    it('should work when navigating to /', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([
            { path: '', pathMatch: 'full', component: SimpleCmp },
            { path: 'user/:name', component: UserCmp }
        ]);
        router.navigateByUrl('/user/victor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('user victor');
        router.navigateByUrl('/');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('simple');
    })));
    it('should cancel in-flight navigations', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        router.navigateByUrl('/user/init');
        advance(fixture);
        var user = fixture.debugElement.children[1].componentInstance;
        var r1, r2;
        router.navigateByUrl('/user/victor').then(function (_) { return r1 = _; });
        router.navigateByUrl('/user/fedor').then(function (_) { return r2 = _; });
        advance(fixture);
        matchers_1.expect(r1).toEqual(false); // returns false because it was canceled
        matchers_1.expect(r2).toEqual(true); // returns true because it was successful
        matchers_1.expect(fixture.nativeElement).toHaveText('user fedor');
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'init' }, { name: 'fedor' }]);
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/user/init'],
            [router_1.RoutesRecognized, '/user/init'],
            [router_1.GuardsCheckStart, '/user/init'],
            [router_1.ChildActivationStart],
            [router_1.ActivationStart],
            [router_1.GuardsCheckEnd, '/user/init'],
            [router_1.ResolveStart, '/user/init'],
            [router_1.ResolveEnd, '/user/init'],
            [router_1.ActivationEnd],
            [router_1.ChildActivationEnd],
            [router_1.NavigationEnd, '/user/init'],
            [router_1.NavigationStart, '/user/victor'],
            [router_1.NavigationCancel, '/user/victor'],
            [router_1.NavigationStart, '/user/fedor'],
            [router_1.RoutesRecognized, '/user/fedor'],
            [router_1.GuardsCheckStart, '/user/fedor'],
            [router_1.ChildActivationStart],
            [router_1.ActivationStart],
            [router_1.GuardsCheckEnd, '/user/fedor'],
            [router_1.ResolveStart, '/user/fedor'],
            [router_1.ResolveEnd, '/user/fedor'],
            [router_1.ActivationEnd],
            [router_1.ChildActivationEnd],
            [router_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    it('should handle failed navigations gracefully', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        var e;
        router.navigateByUrl('/invalid').catch(function (_) { return e = _; });
        advance(fixture);
        matchers_1.expect(e.message).toContain('Cannot match any routes');
        router.navigateByUrl('/user/fedor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('user fedor');
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/invalid'], [router_1.NavigationError, '/invalid'],
            [router_1.NavigationStart, '/user/fedor'], [router_1.RoutesRecognized, '/user/fedor'],
            [router_1.GuardsCheckStart, '/user/fedor'], [router_1.ChildActivationStart], [router_1.ActivationStart],
            [router_1.GuardsCheckEnd, '/user/fedor'], [router_1.ResolveStart, '/user/fedor'],
            [router_1.ResolveEnd, '/user/fedor'], [router_1.ActivationEnd], [router_1.ChildActivationEnd],
            [router_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    // Errors should behave the same for both deferred and eager URL update strategies
    ['deferred', 'eager'].forEach(function (strat) {
        it('should dispatch NavigationError after the url has been reset back', testing_1.fakeAsync(function () {
            var router = testing_1.TestBed.get(router_1.Router);
            var location = testing_1.TestBed.get(common_1.Location);
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }, { path: 'throwing', component: ThrowingCmp }]);
            router.urlUpdateStrategy = strat;
            router.navigateByUrl('/simple');
            advance(fixture);
            var routerUrlBeforeEmittingError = '';
            var locationUrlBeforeEmittingError = '';
            router.events.forEach(function (e) {
                if (e instanceof router_1.NavigationError) {
                    routerUrlBeforeEmittingError = router.url;
                    locationUrlBeforeEmittingError = location.path();
                }
            });
            router.navigateByUrl('/throwing').catch(function () { return null; });
            advance(fixture);
            matchers_1.expect(routerUrlBeforeEmittingError).toEqual('/simple');
            matchers_1.expect(locationUrlBeforeEmittingError).toEqual('/simple');
        }));
        it('should reset the url with the right state when navigation errors', testing_1.fakeAsync(function () {
            var router = testing_1.TestBed.get(router_1.Router);
            var location = testing_1.TestBed.get(common_1.Location);
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'simple1', component: SimpleCmp }, { path: 'simple2', component: SimpleCmp },
                { path: 'throwing', component: ThrowingCmp }
            ]);
            router.urlUpdateStrategy = strat;
            var event;
            router.events.subscribe(function (e) {
                if (e instanceof router_1.NavigationStart) {
                    event = e;
                }
            });
            router.navigateByUrl('/simple1');
            advance(fixture);
            var simple1NavStart = event;
            router.navigateByUrl('/throwing').catch(function () { return null; });
            advance(fixture);
            router.navigateByUrl('/simple2');
            advance(fixture);
            location.back();
            testing_1.tick();
            matchers_1.expect(event.restoredState.navigationId).toEqual(simple1NavStart.id);
        }));
        it('should not trigger another navigation when resetting the url back due to a NavigationError', testing_1.fakeAsync(function () {
            var router = testing_1.TestBed.get(router_1.Router);
            router.onSameUrlNavigation = 'reload';
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }, { path: 'throwing', component: ThrowingCmp }]);
            router.urlUpdateStrategy = strat;
            var events = [];
            router.events.forEach(function (e) {
                if (e instanceof router_1.NavigationStart) {
                    events.push(e.url);
                }
            });
            router.navigateByUrl('/simple');
            advance(fixture);
            router.navigateByUrl('/throwing').catch(function () { return null; });
            advance(fixture);
            // we do not trigger another navigation to /simple
            matchers_1.expect(events).toEqual(['/simple', '/throwing']);
        }));
    });
    it('should dispatch NavigationCancel after the url has been reset back', testing_1.fakeAsync(function () {
        testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'returnsFalse', useValue: function () { return false; } }] });
        var router = testing_1.TestBed.get(router_1.Router);
        var location = testing_1.TestBed.get(common_1.Location);
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([
            { path: 'simple', component: SimpleCmp },
            { path: 'throwing', loadChildren: 'doesnotmatter', canLoad: ['returnsFalse'] }
        ]);
        router.navigateByUrl('/simple');
        advance(fixture);
        var routerUrlBeforeEmittingError = '';
        var locationUrlBeforeEmittingError = '';
        router.events.forEach(function (e) {
            if (e instanceof router_1.NavigationCancel) {
                routerUrlBeforeEmittingError = router.url;
                locationUrlBeforeEmittingError = location.path();
            }
        });
        location.simulateHashChange('/throwing');
        advance(fixture);
        matchers_1.expect(routerUrlBeforeEmittingError).toEqual('/simple');
        matchers_1.expect(locationUrlBeforeEmittingError).toEqual('/simple');
    }));
    it('should support custom error handlers', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        router.errorHandler = function (error) { return 'resolvedValue'; };
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        var e;
        router.navigateByUrl('/invalid').then(function (_) { return e = _; });
        advance(fixture);
        matchers_1.expect(e).toEqual('resolvedValue');
        expectEvents(recordedEvents, [[router_1.NavigationStart, '/invalid'], [router_1.NavigationError, '/invalid']]);
    })));
    it('should recover from malformed uri errors', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
        var fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/invalid/url%with%percent');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/');
    })));
    it('should support custom malformed uri error handler', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var customMalformedUriErrorHandler = function (e, urlSerializer, url) { return urlSerializer.parse('/?error=The-URL-you-went-to-is-invalid'); };
        router.malformedUriErrorHandler = customMalformedUriErrorHandler;
        router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
        var fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/invalid/url%with%percent');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/?error=The-URL-you-went-to-is-invalid');
    })));
    it('should not swallow errors', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
        router.navigateByUrl('/invalid');
        matchers_1.expect(function () { return advance(fixture); }).toThrow();
        router.navigateByUrl('/invalid2');
        matchers_1.expect(function () { return advance(fixture); }).toThrow();
    })));
    it('should replace state when path is equal to current path', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }, { path: 'user/:name', component: UserCmp }]
            }]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.back();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
    })));
    it('should handle componentless paths', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmpWithTwoOutlets);
        router.resetConfig([
            {
                path: 'parent/:id',
                children: [
                    { path: 'simple', component: SimpleCmp },
                    { path: 'user/:name', component: UserCmp, outlet: 'right' }
                ]
            },
            { path: 'user/:name', component: UserCmp }
        ]);
        // navigate to a componentless route
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user victor]');
        // navigate to the same route with different params (reuse)
        router.navigateByUrl('/parent/22/(simple//right:user/fedor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/22/(simple//right:user/fedor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user fedor]');
        // navigate to a normal route (check deactivation)
        router.navigateByUrl('/user/victor');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/user/victor');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [user victor] right []');
        // navigate back to a componentless route
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user victor]');
    })));
    it('should not deactivate aux routes when navigating from a componentless routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, TwoOutletsCmp);
        router.resetConfig([
            { path: 'simple', component: SimpleCmp },
            { path: 'componentless', children: [{ path: 'simple', component: SimpleCmp }] },
            { path: 'user/:name', outlet: 'aux', component: UserCmp }
        ]);
        router.navigateByUrl('/componentless/simple(aux:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/componentless/simple(aux:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('[ simple, aux: user victor ]');
        router.navigateByUrl('/simple(aux:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/simple(aux:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('[ simple, aux: user victor ]');
    })));
    it('should emit an event when an outlet gets activated', testing_1.fakeAsync(function () {
        var Container = /** @class */ (function () {
            function Container() {
                this.activations = [];
                this.deactivations = [];
            }
            Container.prototype.recordActivate = function (component) { this.activations.push(component); };
            Container.prototype.recordDeactivate = function (component) { this.deactivations.push(component); };
            Container = __decorate([
                core_1.Component({
                    selector: 'container',
                    template: "<router-outlet (activate)=\"recordActivate($event)\" (deactivate)=\"recordDeactivate($event)\"></router-outlet>"
                })
            ], Container);
            return Container;
        }());
        testing_1.TestBed.configureTestingModule({ declarations: [Container] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, Container);
        var cmp = fixture.componentInstance;
        router.resetConfig([{ path: 'blank', component: BlankCmp }, { path: 'simple', component: SimpleCmp }]);
        cmp.activations = [];
        cmp.deactivations = [];
        router.navigateByUrl('/blank');
        advance(fixture);
        matchers_1.expect(cmp.activations.length).toEqual(1);
        matchers_1.expect(cmp.activations[0] instanceof BlankCmp).toBe(true);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(cmp.activations.length).toEqual(2);
        matchers_1.expect(cmp.activations[1] instanceof SimpleCmp).toBe(true);
        matchers_1.expect(cmp.deactivations.length).toEqual(1);
        matchers_1.expect(cmp.deactivations[0] instanceof BlankCmp).toBe(true);
    }));
    it('should update url and router state before activating components', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'cmp', component: ComponentRecordingRoutePathAndUrl }]);
        router.navigateByUrl('/cmp');
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(cmp.url).toBe('/cmp');
        matchers_1.expect(cmp.path.length).toEqual(2);
    })));
    describe('data', function () {
        var ResolveSix = /** @class */ (function () {
            function ResolveSix() {
            }
            ResolveSix.prototype.resolve = function (route, state) { return 6; };
            return ResolveSix;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [
                    { provide: 'resolveTwo', useValue: function (a, b) { return 2; } },
                    { provide: 'resolveFour', useValue: function (a, b) { return 4; } },
                    { provide: 'resolveSix', useClass: ResolveSix },
                    { provide: 'resolveError', useValue: function (a, b) { return Promise.reject('error'); } },
                    { provide: 'resolveNullError', useValue: function (a, b) { return Promise.reject(null); } },
                    { provide: 'numberOfUrlSegments', useValue: function (a, b) { return a.url.length; } },
                ]
            });
        });
        it('should provide resolved data', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmpWithTwoOutlets);
            router.resetConfig([{
                    path: 'parent/:id',
                    data: { one: 1 },
                    resolve: { two: 'resolveTwo' },
                    children: [
                        { path: '', data: { three: 3 }, resolve: { four: 'resolveFour' }, component: RouteCmp }, {
                            path: '',
                            data: { five: 5 },
                            resolve: { six: 'resolveSix' },
                            component: RouteCmp,
                            outlet: 'right'
                        }
                    ]
                }]);
            router.navigateByUrl('/parent/1');
            advance(fixture);
            var primaryCmp = fixture.debugElement.children[1].componentInstance;
            var rightCmp = fixture.debugElement.children[3].componentInstance;
            matchers_1.expect(primaryCmp.route.snapshot.data).toEqual({ one: 1, two: 2, three: 3, four: 4 });
            matchers_1.expect(rightCmp.route.snapshot.data).toEqual({ one: 1, two: 2, five: 5, six: 6 });
            var primaryRecorded = [];
            primaryCmp.route.data.forEach(function (rec) { return primaryRecorded.push(rec); });
            var rightRecorded = [];
            rightCmp.route.data.forEach(function (rec) { return rightRecorded.push(rec); });
            router.navigateByUrl('/parent/2');
            advance(fixture);
            matchers_1.expect(primaryRecorded).toEqual([{ one: 1, three: 3, two: 2, four: 4 }]);
            matchers_1.expect(rightRecorded).toEqual([{ one: 1, five: 5, two: 2, six: 6 }]);
        })));
        it('should handle errors', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp, resolve: { error: 'resolveError' } }]);
            var recordedEvents = [];
            router.events.subscribe(function (e) { return e instanceof router_1.RouterEvent && recordedEvents.push(e); });
            var e = null;
            router.navigateByUrl('/simple').catch(function (error) { return e = error; });
            advance(fixture);
            expectEvents(recordedEvents, [
                [router_1.NavigationStart, '/simple'], [router_1.RoutesRecognized, '/simple'],
                [router_1.GuardsCheckStart, '/simple'], [router_1.GuardsCheckEnd, '/simple'], [router_1.ResolveStart, '/simple'],
                [router_1.NavigationError, '/simple']
            ]);
            matchers_1.expect(e).toEqual('error');
        })));
        it('should handle empty errors', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp, resolve: { error: 'resolveNullError' } }]);
            var recordedEvents = [];
            router.events.subscribe(function (e) { return e instanceof router_1.RouterEvent && recordedEvents.push(e); });
            var e = 'some value';
            router.navigateByUrl('/simple').catch(function (error) { return e = error; });
            advance(fixture);
            matchers_1.expect(e).toEqual(null);
        })));
        it('should preserve resolved data', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'parent',
                    resolve: { two: 'resolveTwo' },
                    children: [
                        { path: 'child1', component: CollectParamsCmp },
                        { path: 'child2', component: CollectParamsCmp }
                    ]
                }]);
            var e = null;
            router.navigateByUrl('/parent/child1');
            advance(fixture);
            router.navigateByUrl('/parent/child2');
            advance(fixture);
            var cmp = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ two: 2 });
        })));
        it('should rerun resolvers when the urls segments of a wildcard route change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: '**',
                    component: CollectParamsCmp,
                    resolve: { numberOfUrlSegments: 'numberOfUrlSegments' }
                }]);
            router.navigateByUrl('/one/two');
            advance(fixture);
            var cmp = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ numberOfUrlSegments: 2 });
            router.navigateByUrl('/one/two/three');
            advance(fixture);
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ numberOfUrlSegments: 3 });
        })));
        describe('should run resolvers for the same route concurrently', function () {
            var log;
            var observer;
            beforeEach(function () {
                log = [];
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: 'resolver1',
                            useValue: function () {
                                var obs$ = new rxjs_1.Observable(function (obs) {
                                    observer = obs;
                                    return function () { };
                                });
                                return obs$.pipe(operators_1.map(function () { return log.push('resolver1'); }));
                            }
                        },
                        {
                            provide: 'resolver2',
                            useValue: function () {
                                return rxjs_1.of(null).pipe(operators_1.map(function () {
                                    log.push('resolver2');
                                    observer.next(null);
                                    observer.complete();
                                }));
                            }
                        },
                    ]
                });
            });
            it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'a',
                        resolve: {
                            one: 'resolver1',
                            two: 'resolver2',
                        },
                        component: SimpleCmp
                    }]);
                router.navigateByUrl('/a');
                advance(fixture);
                matchers_1.expect(log).toEqual(['resolver2', 'resolver1']);
            })));
        });
    });
    describe('router links', function () {
        it('should support skipping location update for anchor router links', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = testing_1.TestBed.createComponent(RootCmp);
            advance(fixture);
            router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
            router.navigateByUrl('/team/22');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
            var teamCmp = fixture.debugElement.childNodes[1].componentInstance;
            teamCmp.routerLink = ['/team/0'];
            advance(fixture);
            var anchor = fixture.debugElement.query(by_1.By.css('a')).nativeElement;
            anchor.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 0 [ , right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22');
            teamCmp.routerLink = ['/team/1'];
            advance(fixture);
            var button = fixture.debugElement.query(by_1.By.css('button')).nativeElement;
            button.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 1 [ , right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22');
        })));
        it('should support string router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: StringLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/33/simple');
            matchers_1.expect(native.getAttribute('target')).toEqual('_self');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should not preserve query params and fragment by default', testing_1.fakeAsync(function () {
            var RootCmpWithLink = /** @class */ (function () {
                function RootCmpWithLink() {
                }
                RootCmpWithLink = __decorate([
                    core_1.Component({
                        selector: 'someRoot',
                        template: "<router-outlet></router-outlet><a routerLink=\"/home\">Link</a>"
                    })
                ], RootCmpWithLink);
                return RootCmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?q=123#fragment');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home');
        }));
        it('should not throw when commands is null', testing_1.fakeAsync(function () {
            var CmpWithLink = /** @class */ (function () {
                function CmpWithLink() {
                }
                CmpWithLink = __decorate([
                    core_1.Component({
                        selector: 'someCmp',
                        template: "<router-outlet></router-outlet><a [routerLink]=\"null\">Link</a><button [routerLink]=\"null\">Button</button>"
                    })
                ], CmpWithLink);
                return CmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [CmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, CmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var anchor = fixture.nativeElement.querySelector('a');
            var button = fixture.nativeElement.querySelector('button');
            matchers_1.expect(function () { return anchor.click(); }).not.toThrow();
            matchers_1.expect(function () { return button.click(); }).not.toThrow();
        }));
        it('should update hrefs when query params or fragment change', testing_1.fakeAsync(function () {
            var RootCmpWithLink = /** @class */ (function () {
                function RootCmpWithLink() {
                }
                RootCmpWithLink = __decorate([
                    core_1.Component({
                        selector: 'someRoot',
                        template: "<router-outlet></router-outlet><a routerLink=\"/home\" preserveQueryParams preserveFragment>Link</a>"
                    })
                ], RootCmpWithLink);
                return RootCmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?q=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=123');
            router.navigateByUrl('/home?q=456');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=456');
            router.navigateByUrl('/home?q=456#1');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=456#1');
        }));
        it('should correctly use the preserve strategy', testing_1.fakeAsync(function () {
            var RootCmpWithLink = /** @class */ (function () {
                function RootCmpWithLink() {
                }
                RootCmpWithLink = __decorate([
                    core_1.Component({
                        selector: 'someRoot',
                        template: "<router-outlet></router-outlet><a routerLink=\"/home\" [queryParams]=\"{q: 456}\" queryParamsHandling=\"preserve\">Link</a>"
                    })
                ], RootCmpWithLink);
                return RootCmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?a=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?a=123');
        }));
        it('should correctly use the merge strategy', testing_1.fakeAsync(function () {
            var RootCmpWithLink = /** @class */ (function () {
                function RootCmpWithLink() {
                }
                RootCmpWithLink = __decorate([
                    core_1.Component({
                        selector: 'someRoot',
                        template: "<router-outlet></router-outlet><a routerLink=\"/home\" [queryParams]=\"{removeMe: null, q: 456}\" queryParamsHandling=\"merge\">Link</a>"
                    })
                ], RootCmpWithLink);
                return RootCmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?a=123&removeMe=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?a=123&q=456');
        }));
        it('should support using links on non-a tags', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: StringLinkButtonCmp },
                        { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var button = fixture.nativeElement.querySelector('button');
            matchers_1.expect(button.getAttribute('tabindex')).toEqual('0');
            button.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should support absolute router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: AbsoluteLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/33/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should support relative router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: RelativeLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/22/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ simple, right:  ]');
        })));
        it('should support top-level link', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RelativeLinkInIfCmp);
            advance(fixture);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]);
            router.navigateByUrl('/');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            var cmp = fixture.componentInstance;
            cmp.show = true;
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('link');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('linksimple');
        })));
        it('should support query params and fragments', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: LinkWithQueryParamsAndFragment },
                        { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/22/simple?q=1#f');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ simple, right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22/simple?q=1#f');
        })));
    });
    describe('redirects', function () {
        it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'old/team/:id', redirectTo: 'team/:id' }, { path: 'team/:id', component: TeamCmp }
            ]);
            router.navigateByUrl('old/team/22');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
        })));
        it('should not break the back button when trigger by location change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = testing_1.TestBed.createComponent(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'initial', component: BlankCmp }, { path: 'old/team/:id', redirectTo: 'team/:id' },
                { path: 'team/:id', component: TeamCmp }
            ]);
            location.go('initial');
            location.go('old/team/22');
            // initial navigation
            router.initialNavigation();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
            location.back();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/initial');
            // location change
            location.go('/old/team/33');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/33');
            location.back();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/initial');
        })));
    });
    describe('guards', function () {
        describe('CanActivate', function () {
            describe('should not activate a route when CanActivate returns false', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'alwaysFalse', useValue: function (a, b) { return false; } }] });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    var recordedEvents = [];
                    router.events.forEach(function (e) { return recordedEvents.push(e); });
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['alwaysFalse'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                    expectEvents(recordedEvents, [
                        [router_1.NavigationStart, '/team/22'],
                        [router_1.RoutesRecognized, '/team/22'],
                        [router_1.GuardsCheckStart, '/team/22'],
                        [router_1.ChildActivationStart],
                        [router_1.ActivationStart],
                        [router_1.GuardsCheckEnd, '/team/22'],
                        [router_1.NavigationCancel, '/team/22'],
                    ]);
                    matchers_1.expect(recordedEvents[5].shouldActivate).toBe(false);
                })));
            });
            describe('should not activate a route when CanActivate returns false (componentless route)', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'alwaysFalse', useValue: function (a, b) { return false; } }] });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'parent',
                            canActivate: ['alwaysFalse'],
                            children: [{ path: 'team/:id', component: TeamCmp }]
                        }]);
                    router.navigateByUrl('parent/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                })));
            });
            describe('should activate a route when CanActivate returns true', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysTrue',
                                useValue: function (a, s) { return true; }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['alwaysTrue'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should work when given a class', function () {
                var AlwaysTrue = /** @class */ (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canActivate = function (route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                }());
                beforeEach(function () { testing_1.TestBed.configureTestingModule({ providers: [AlwaysTrue] }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: [AlwaysTrue] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should work when returns an observable', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanActivate',
                                useValue: function (a, b) {
                                    return rxjs_1.Observable.create(function (observer) { observer.next(false); });
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['CanActivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                })));
            });
            describe('should work when returns a promise', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanActivate',
                                useValue: function (a, b) {
                                    if (a.params['id'] === '22') {
                                        return Promise.resolve(true);
                                    }
                                    else {
                                        return Promise.resolve(false);
                                    }
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['CanActivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should reset the location when cancleling a navigation', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysFalse',
                                useValue: function (a, b) { return false; }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        { path: 'one', component: SimpleCmp },
                        { path: 'two', component: SimpleCmp, canActivate: ['alwaysFalse'] }
                    ]);
                    router.navigateByUrl('/one');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/one');
                    location.go('/two');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/one');
                })));
            });
            describe('should redirect to / when guard returns false', function () {
                beforeEach(function () { return testing_1.TestBed.configureTestingModule({
                    providers: [{
                            provide: 'returnFalseAndNavigate',
                            useFactory: function (router) { return function () {
                                router.navigate(['/']);
                                return false;
                            }; },
                            deps: [router_1.Router]
                        }]
                }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    router.resetConfig([
                        {
                            path: '',
                            component: SimpleCmp,
                        },
                        { path: 'one', component: RouteCmp, canActivate: ['returnFalseAndNavigate'] }
                    ]);
                    var fixture = testing_1.TestBed.createComponent(RootCmp);
                    router.navigateByUrl('/one');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                    matchers_1.expect(fixture.nativeElement).toHaveText('simple');
                })));
            });
            describe('runGuardsAndResolvers', function () {
                var guardRunCount = 0;
                var resolverRunCount = 0;
                beforeEach(function () {
                    guardRunCount = 0;
                    resolverRunCount = 0;
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            {
                                provide: 'guard',
                                useValue: function () {
                                    guardRunCount++;
                                    return true;
                                }
                            },
                            { provide: 'resolver', useValue: function () { return resolverRunCount++; } }
                        ]
                    });
                });
                function configureRouter(router, runGuardsAndResolvers) {
                    var fixture = createRoot(router, RootCmpWithTwoOutlets);
                    router.resetConfig([
                        {
                            path: 'a',
                            runGuardsAndResolvers: runGuardsAndResolvers,
                            component: RouteCmp,
                            canActivate: ['guard'],
                            resolve: { data: 'resolver' }
                        },
                        { path: 'b', component: SimpleCmp, outlet: 'right' }
                    ]);
                    router.navigateByUrl('/a');
                    advance(fixture);
                    return fixture;
                }
                it('should rerun guards and resolvers when params change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'paramsChange');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                })));
                it('should rerun guards and resolvers when query params change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'paramsOrQueryParamsChange');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                    router.navigateByUrl('/a;p=2(right:b)?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                })));
                it('should always rerun guards and resolvers', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'always');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                    router.navigateByUrl('/a;p=2(right:b)?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(5);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }]);
                })));
            });
            describe('should wait for parent to complete', function () {
                var log;
                beforeEach(function () {
                    log = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            {
                                provide: 'parentGuard',
                                useValue: function () {
                                    return delayPromise(10).then(function () {
                                        log.push('parent');
                                        return true;
                                    });
                                }
                            },
                            {
                                provide: 'childGuard',
                                useValue: function () {
                                    return delayPromise(5).then(function () {
                                        log.push('child');
                                        return true;
                                    });
                                }
                            }
                        ]
                    });
                });
                function delayPromise(delay) {
                    var resolve;
                    var promise = new Promise(function (res) { return resolve = res; });
                    setTimeout(function () { return resolve(true); }, delay);
                    return promise;
                }
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'parent',
                            canActivate: ['parentGuard'],
                            children: [
                                { path: 'child', component: SimpleCmp, canActivate: ['childGuard'] },
                            ]
                        }]);
                    router.navigateByUrl('/parent/child');
                    advance(fixture);
                    testing_1.tick(15);
                    matchers_1.expect(log).toEqual(['parent', 'child']);
                })));
            });
        });
        describe('CanDeactivate', function () {
            var log;
            beforeEach(function () {
                log = [];
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: 'CanDeactivateParent',
                            useValue: function (c, a, b) {
                                return a.params['id'] === '22';
                            }
                        },
                        {
                            provide: 'CanDeactivateTeam',
                            useValue: function (c, a, b) {
                                return c.route.snapshot.params['id'] === '22';
                            }
                        },
                        {
                            provide: 'CanDeactivateUser',
                            useValue: function (c, a, b) {
                                return a.params['name'] === 'victor';
                            }
                        },
                        {
                            provide: 'RecordingDeactivate',
                            useValue: function (c, a, b) {
                                log.push({ path: a.routeConfig.path, component: c });
                                return true;
                            }
                        },
                        {
                            provide: 'alwaysFalse',
                            useValue: function (c, a, b) { return false; }
                        },
                        {
                            provide: 'alwaysFalseAndLogging',
                            useValue: function (c, a, b) {
                                log.push('called');
                                return false;
                            }
                        },
                        {
                            provide: 'alwaysFalseWithDelayAndLogging',
                            useValue: function () {
                                log.push('called');
                                var resolve;
                                var promise = new Promise(function (res) { return resolve = res; });
                                setTimeout(function () { return resolve(false); }, 0);
                                return promise;
                            }
                        },
                        {
                            provide: 'canActivate_alwaysTrueAndLogging',
                            useValue: function () {
                                log.push('canActivate called');
                                return true;
                            }
                        },
                    ]
                });
            });
            describe('should not deactivate a route when CanDeactivate returns false', function () {
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: ['CanDeactivateTeam'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    var successStatus = false;
                    router.navigateByUrl('/team/33').then(function (res) { return successStatus = res; });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(successStatus).toEqual(true);
                    var canceledStatus = false;
                    router.navigateByUrl('/team/44').then(function (res) { return canceledStatus = res; });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(canceledStatus).toEqual(false);
                })));
                it('works with componentless routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        {
                            path: 'grandparent',
                            canDeactivate: ['RecordingDeactivate'],
                            children: [{
                                    path: 'parent',
                                    canDeactivate: ['RecordingDeactivate'],
                                    children: [{
                                            path: 'child',
                                            canDeactivate: ['RecordingDeactivate'],
                                            children: [{
                                                    path: 'simple',
                                                    component: SimpleCmp,
                                                    canDeactivate: ['RecordingDeactivate']
                                                }]
                                        }]
                                }]
                        },
                        { path: 'simple', component: SimpleCmp }
                    ]);
                    router.navigateByUrl('/grandparent/parent/child/simple');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/grandparent/parent/child/simple');
                    router.navigateByUrl('/simple');
                    advance(fixture);
                    var child = fixture.debugElement.children[1].componentInstance;
                    matchers_1.expect(log.map(function (a) { return a.path; })).toEqual([
                        'simple', 'child', 'parent', 'grandparent'
                    ]);
                    matchers_1.expect(log.map(function (a) { return a.component; })).toEqual([child, null, null, null]);
                })));
                it('works with aux routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'two-outlets',
                            component: TwoOutletsCmp,
                            children: [
                                { path: 'a', component: BlankCmp }, {
                                    path: 'b',
                                    canDeactivate: ['RecordingDeactivate'],
                                    component: SimpleCmp,
                                    outlet: 'aux'
                                }
                            ]
                        }]);
                    router.navigateByUrl('/two-outlets/(a//aux:b)');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/two-outlets/(a//aux:b)');
                    router.navigate(['two-outlets', { outlets: { aux: null } }]);
                    advance(fixture);
                    matchers_1.expect(log.map(function (a) { return a.path; })).toEqual(['b']);
                    matchers_1.expect(location.path()).toEqual('/two-outlets/(a)');
                })));
                it('works with a nested route', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'team/:id',
                            component: TeamCmp,
                            children: [
                                { path: '', pathMatch: 'full', component: SimpleCmp },
                                { path: 'user/:name', component: UserCmp, canDeactivate: ['CanDeactivateUser'] }
                            ]
                        }]);
                    router.navigateByUrl('/team/22/user/victor');
                    advance(fixture);
                    // this works because we can deactivate victor
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    router.navigateByUrl('/team/33/user/fedor');
                    advance(fixture);
                    // this doesn't work cause we cannot deactivate fedor
                    router.navigateByUrl('/team/44');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33/user/fedor');
                })));
            });
            it('should not create a route state if navigation is canceled', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'main',
                        component: TeamCmp,
                        children: [
                            { path: 'component1', component: SimpleCmp, canDeactivate: ['alwaysFalse'] },
                            { path: 'component2', component: SimpleCmp }
                        ]
                    }]);
                router.navigateByUrl('/main/component1');
                advance(fixture);
                router.navigateByUrl('/main/component2');
                advance(fixture);
                var teamCmp = fixture.debugElement.children[1].componentInstance;
                matchers_1.expect(teamCmp.route.firstChild.url.value[0].path).toEqual('component1');
                matchers_1.expect(location.path()).toEqual('/main/component1');
            })));
            it('should not run CanActivate when CanDeactivate returns false', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'main',
                        component: TeamCmp,
                        children: [
                            {
                                path: 'component1',
                                component: SimpleCmp,
                                canDeactivate: ['alwaysFalseWithDelayAndLogging']
                            },
                            {
                                path: 'component2',
                                component: SimpleCmp,
                                canActivate: ['canActivate_alwaysTrueAndLogging']
                            },
                        ]
                    }]);
                router.navigateByUrl('/main/component1');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/main/component1');
                router.navigateByUrl('/main/component2');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/main/component1');
                matchers_1.expect(log).toEqual(['called']);
            })));
            it('should call guards every time when navigating to the same url over and over again', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'simple', component: SimpleCmp, canDeactivate: ['alwaysFalseAndLogging'] },
                    { path: 'blank', component: BlankCmp }
                ]);
                router.navigateByUrl('/simple');
                advance(fixture);
                router.navigateByUrl('/blank');
                advance(fixture);
                matchers_1.expect(log).toEqual(['called']);
                matchers_1.expect(location.path()).toEqual('/simple');
                router.navigateByUrl('/blank');
                advance(fixture);
                matchers_1.expect(log).toEqual(['called', 'called']);
                matchers_1.expect(location.path()).toEqual('/simple');
            })));
            describe('next state', function () {
                var log;
                var ClassWithNextState = /** @class */ (function () {
                    function ClassWithNextState() {
                    }
                    ClassWithNextState.prototype.canDeactivate = function (component, currentRoute, currentState, nextState) {
                        log.push(currentState.url, nextState.url);
                        return true;
                    };
                    return ClassWithNextState;
                }());
                beforeEach(function () {
                    log = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            ClassWithNextState, {
                                provide: 'FunctionWithNextState',
                                useValue: function (cmp, currentRoute, currentState, nextState) {
                                    log.push(currentState.url, nextState.url);
                                    return true;
                                }
                            }
                        ]
                    });
                });
                it('should pass next state as the 4 argument when guard is a class', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: [ClassWithNextState] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(log).toEqual(['/team/22', '/team/33']);
                })));
                it('should pass next state as the 4 argument when guard is a function', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canDeactivate: ['FunctionWithNextState'] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(log).toEqual(['/team/22', '/team/33']);
                })));
            });
            describe('should work when given a class', function () {
                var AlwaysTrue = /** @class */ (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canDeactivate = function (component, route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                }());
                beforeEach(function () { testing_1.TestBed.configureTestingModule({ providers: [AlwaysTrue] }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: [AlwaysTrue] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                })));
            });
            describe('should work when returns an observable', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanDeactivate',
                                useValue: function (c, a, b) {
                                    return rxjs_1.Observable.create(function (observer) { observer.next(false); });
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: ['CanDeactivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
        });
        describe('CanActivateChild', function () {
            describe('should be invoked when activating a child', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysFalse',
                                useValue: function (a, b) { return a.paramMap.get('id') === '22'; },
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: '',
                            canActivateChild: ['alwaysFalse'],
                            children: [{ path: 'team/:id', component: TeamCmp }]
                        }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33').catch(function () { });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            it('should find the guard provided in lazy loaded module', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var AdminComponent = /** @class */ (function () {
                    function AdminComponent() {
                    }
                    AdminComponent = __decorate([
                        core_1.Component({ selector: 'admin', template: '<router-outlet></router-outlet>' })
                    ], AdminComponent);
                    return AdminComponent;
                }());
                var LazyLoadedComponent = /** @class */ (function () {
                    function LazyLoadedComponent() {
                    }
                    LazyLoadedComponent = __decorate([
                        core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                    ], LazyLoadedComponent);
                    return LazyLoadedComponent;
                }());
                var LazyLoadedModule = /** @class */ (function () {
                    function LazyLoadedModule() {
                    }
                    LazyLoadedModule = __decorate([
                        core_1.NgModule({
                            declarations: [AdminComponent, LazyLoadedComponent],
                            imports: [router_1.RouterModule.forChild([{
                                        path: '',
                                        component: AdminComponent,
                                        children: [{
                                                path: '',
                                                canActivateChild: ['alwaysTrue'],
                                                children: [{ path: '', component: LazyLoadedComponent }]
                                            }]
                                    }])],
                            providers: [{ provide: 'alwaysTrue', useValue: function () { return true; } }],
                        })
                    ], LazyLoadedModule);
                    return LazyLoadedModule;
                }());
                loader.stubbedModules = { lazy: LazyLoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{ path: 'admin', loadChildren: 'lazy' }]);
                router.navigateByUrl('/admin');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/admin');
                matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded');
            })));
        });
        describe('CanLoad', function () {
            var canLoadRunCount = 0;
            beforeEach(function () {
                canLoadRunCount = 0;
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: 'alwaysFalse', useValue: function (a) { return false; } },
                        {
                            provide: 'returnFalseAndNavigate',
                            useFactory: function (router) { return function (a) {
                                router.navigate(['blank']);
                                return false;
                            }; },
                            deps: [router_1.Router],
                        },
                        {
                            provide: 'alwaysTrue',
                            useValue: function () {
                                canLoadRunCount++;
                                return true;
                            }
                        },
                    ]
                });
            });
            it('should not load children when CanLoad returns false', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = /** @class */ (function () {
                    function LazyLoadedComponent() {
                    }
                    LazyLoadedComponent = __decorate([
                        core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                    ], LazyLoadedComponent);
                    return LazyLoadedComponent;
                }());
                var LoadedModule = /** @class */ (function () {
                    function LoadedModule() {
                    }
                    LoadedModule = __decorate([
                        core_1.NgModule({
                            declarations: [LazyLoadedComponent],
                            imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])]
                        })
                    ], LoadedModule);
                    return LoadedModule;
                }());
                loader.stubbedModules = { lazyFalse: LoadedModule, lazyTrue: LoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'lazyFalse', canLoad: ['alwaysFalse'], loadChildren: 'lazyFalse' },
                    { path: 'lazyTrue', canLoad: ['alwaysTrue'], loadChildren: 'lazyTrue' }
                ]);
                var recordedEvents = [];
                router.events.forEach(function (e) { return recordedEvents.push(e); });
                // failed navigation
                router.navigateByUrl('/lazyFalse/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyFalse/loaded'],
                    //  [GuardsCheckStart, '/lazyFalse/loaded'],
                    [router_1.NavigationCancel, '/lazyFalse/loaded'],
                ]);
                recordedEvents.splice(0);
                // successful navigation
                router.navigateByUrl('/lazyTrue/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazyTrue/loaded');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyTrue/loaded'],
                    [router_1.RouteConfigLoadStart],
                    [router_1.RouteConfigLoadEnd],
                    [router_1.RoutesRecognized, '/lazyTrue/loaded'],
                    [router_1.GuardsCheckStart, '/lazyTrue/loaded'],
                    [router_1.ChildActivationStart],
                    [router_1.ActivationStart],
                    [router_1.ChildActivationStart],
                    [router_1.ActivationStart],
                    [router_1.GuardsCheckEnd, '/lazyTrue/loaded'],
                    [router_1.ResolveStart, '/lazyTrue/loaded'],
                    [router_1.ResolveEnd, '/lazyTrue/loaded'],
                    [router_1.ActivationEnd],
                    [router_1.ChildActivationEnd],
                    [router_1.ActivationEnd],
                    [router_1.ChildActivationEnd],
                    [router_1.NavigationEnd, '/lazyTrue/loaded'],
                ]);
            })));
            it('should support navigating from within the guard', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'lazyFalse', canLoad: ['returnFalseAndNavigate'], loadChildren: 'lazyFalse' },
                    { path: 'blank', component: BlankCmp }
                ]);
                var recordedEvents = [];
                router.events.forEach(function (e) { return recordedEvents.push(e); });
                router.navigateByUrl('/lazyFalse/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/blank');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyFalse/loaded'],
                    // No GuardCheck events as `canLoad` is a special guard that's not actually part of the
                    // guard lifecycle.
                    [router_1.NavigationCancel, '/lazyFalse/loaded'],
                    [router_1.NavigationStart, '/blank'], [router_1.RoutesRecognized, '/blank'],
                    [router_1.GuardsCheckStart, '/blank'], [router_1.ChildActivationStart], [router_1.ActivationStart],
                    [router_1.GuardsCheckEnd, '/blank'], [router_1.ResolveStart, '/blank'], [router_1.ResolveEnd, '/blank'],
                    [router_1.ActivationEnd], [router_1.ChildActivationEnd], [router_1.NavigationEnd, '/blank']
                ]);
            })));
            it('should execute CanLoad only once', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = /** @class */ (function () {
                    function LazyLoadedComponent() {
                    }
                    LazyLoadedComponent = __decorate([
                        core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                    ], LazyLoadedComponent);
                    return LazyLoadedComponent;
                }());
                var LazyLoadedModule = /** @class */ (function () {
                    function LazyLoadedModule() {
                    }
                    LazyLoadedModule = __decorate([
                        core_1.NgModule({
                            declarations: [LazyLoadedComponent],
                            imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])]
                        })
                    ], LazyLoadedModule);
                    return LazyLoadedModule;
                }());
                loader.stubbedModules = { lazy: LazyLoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{ path: 'lazy', canLoad: ['alwaysTrue'], loadChildren: 'lazy' }]);
                router.navigateByUrl('/lazy/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazy/loaded');
                matchers_1.expect(canLoadRunCount).toEqual(1);
                router.navigateByUrl('/');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/');
                router.navigateByUrl('/lazy/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazy/loaded');
                matchers_1.expect(canLoadRunCount).toEqual(1);
            })));
        });
        describe('order', function () {
            var Logger = /** @class */ (function () {
                function Logger() {
                    this.logs = [];
                }
                Logger.prototype.add = function (thing) { this.logs.push(thing); };
                return Logger;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        Logger, {
                            provide: 'canActivateChild_parent',
                            useFactory: function (logger) { return function () { return (logger.add('canActivateChild_parent'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canActivate_team',
                            useFactory: function (logger) { return function () { return (logger.add('canActivate_team'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canDeactivate_team',
                            useFactory: function (logger) { return function () { return (logger.add('canDeactivate_team'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canDeactivate_simple',
                            useFactory: function (logger) { return function () { return (logger.add('canDeactivate_simple'), true); }; },
                            deps: [Logger]
                        }
                    ]
                });
            });
            it('should call guards in the right order', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, Logger], function (router, location, logger) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: '',
                        canActivateChild: ['canActivateChild_parent'],
                        children: [{
                                path: 'team/:id',
                                canActivate: ['canActivate_team'],
                                canDeactivate: ['canDeactivate_team'],
                                component: TeamCmp
                            }]
                    }]);
                router.navigateByUrl('/team/22');
                advance(fixture);
                router.navigateByUrl('/team/33');
                advance(fixture);
                matchers_1.expect(logger.logs).toEqual([
                    'canActivateChild_parent', 'canActivate_team',
                    'canDeactivate_team', 'canActivateChild_parent', 'canActivate_team'
                ]);
            })));
            it('should call deactivate guards from bottom to top', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, Logger], function (router, location, logger) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: '',
                        children: [{
                                path: 'team/:id',
                                canDeactivate: ['canDeactivate_team'],
                                children: [{ path: '', component: SimpleCmp, canDeactivate: ['canDeactivate_simple'] }],
                                component: TeamCmp
                            }]
                    }]);
                router.navigateByUrl('/team/22');
                advance(fixture);
                router.navigateByUrl('/team/33');
                advance(fixture);
                matchers_1.expect(logger.logs).toEqual(['canDeactivate_simple', 'canDeactivate_team']);
            })));
        });
    });
    describe('route events', function () {
        it('should fire matching (Child)ActivationStart/End events', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
            var recordedEvents = [];
            router.events.forEach(function (e) { return recordedEvents.push(e); });
            router.navigateByUrl('/user/fedor');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('user fedor');
            matchers_1.expect(recordedEvents[3] instanceof router_1.ChildActivationStart).toBe(true);
            matchers_1.expect(recordedEvents[3].snapshot).toBe(recordedEvents[9].snapshot.root);
            matchers_1.expect(recordedEvents[9] instanceof router_1.ChildActivationEnd).toBe(true);
            matchers_1.expect(recordedEvents[9].snapshot).toBe(recordedEvents[9].snapshot.root);
            matchers_1.expect(recordedEvents[4] instanceof router_1.ActivationStart).toBe(true);
            matchers_1.expect(recordedEvents[4].snapshot.routeConfig.path).toBe('user/:name');
            matchers_1.expect(recordedEvents[8] instanceof router_1.ActivationEnd).toBe(true);
            matchers_1.expect(recordedEvents[8].snapshot.routeConfig.path).toBe('user/:name');
            expectEvents(recordedEvents, [
                [router_1.NavigationStart, '/user/fedor'], [router_1.RoutesRecognized, '/user/fedor'],
                [router_1.GuardsCheckStart, '/user/fedor'], [router_1.ChildActivationStart], [router_1.ActivationStart],
                [router_1.GuardsCheckEnd, '/user/fedor'], [router_1.ResolveStart, '/user/fedor'],
                [router_1.ResolveEnd, '/user/fedor'], [router_1.ActivationEnd], [router_1.ChildActivationEnd],
                [router_1.NavigationEnd, '/user/fedor']
            ]);
        })));
    });
    describe('routerActiveLink', function () {
        it('should set the class when the link is active (a tag)', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link;exact=true');
            advance(fixture);
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link;exact=true');
            var nativeLink = fixture.nativeElement.querySelector('a');
            var nativeButton = fixture.nativeElement.querySelector('button');
            matchers_1.expect(nativeLink.className).toEqual('active');
            matchers_1.expect(nativeButton.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(nativeLink.className).toEqual('');
            matchers_1.expect(nativeButton.className).toEqual('');
        })));
        it('should not set the class until the first navigation succeeds', testing_1.fakeAsync(function () {
            var RootCmpWithLink = /** @class */ (function () {
                function RootCmpWithLink() {
                }
                RootCmpWithLink = __decorate([
                    core_1.Component({
                        template: '<router-outlet></router-outlet><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" ></a>'
                    })
                ], RootCmpWithLink);
                return RootCmpWithLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var loc = testing_1.TestBed.get(common_1.Location);
            var f = testing_1.TestBed.createComponent(RootCmpWithLink);
            advance(f);
            var link = f.nativeElement.querySelector('a');
            matchers_1.expect(link.className).toEqual('');
            router.initialNavigation();
            advance(f);
            matchers_1.expect(link.className).toEqual('active');
        }));
        it('should set the class on a parent element when the link is active', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkWithParentCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link;exact=true');
            advance(fixture);
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link;exact=true');
            var native = fixture.nativeElement.querySelector('#link-parent');
            matchers_1.expect(native.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(native.className).toEqual('');
        })));
        it('should set the class when the link is active', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(native.className).toEqual('active');
        })));
        it('should expose an isActive property', testing_1.fakeAsync(function () {
            var ComponentWithRouterLink = /** @class */ (function () {
                function ComponentWithRouterLink() {
                }
                ComponentWithRouterLink = __decorate([
                    core_1.Component({
                        template: "<a routerLink=\"/team\" routerLinkActive #rla=\"routerLinkActive\"></a>\n              <p>{{rla.isActive}}</p>\n              <span *ngIf=\"rla.isActive\"></span>\n              <span [ngClass]=\"{'highlight': rla.isActive}\"></span>\n              <router-outlet></router-outlet>"
                    })
                ], ComponentWithRouterLink);
                return ComponentWithRouterLink;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [ComponentWithRouterLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            router.resetConfig([
                {
                    path: 'team',
                    component: TeamCmp,
                },
                {
                    path: 'otherteam',
                    component: TeamCmp,
                }
            ]);
            var fixture = testing_1.TestBed.createComponent(ComponentWithRouterLink);
            router.navigateByUrl('/team');
            matchers_1.expect(function () { return advance(fixture); }).not.toThrow();
            advance(fixture);
            var paragraph = fixture.nativeElement.querySelector('p');
            matchers_1.expect(paragraph.textContent).toEqual('true');
            router.navigateByUrl('/otherteam');
            advance(fixture);
            advance(fixture);
            matchers_1.expect(paragraph.textContent).toEqual('false');
        }));
    });
    describe('lazy loading', function () {
        it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = /** @class */ (function () {
                function ParentLazyLoadedComponent() {
                }
                ParentLazyLoadedComponent = __decorate([
                    core_1.Component({
                        selector: 'lazy',
                        template: 'lazy-loaded-parent [<router-outlet></router-outlet>]'
                    })
                ], ParentLazyLoadedComponent);
                return ParentLazyLoadedComponent;
            }());
            var ChildLazyLoadedComponent = /** @class */ (function () {
                function ChildLazyLoadedComponent() {
                }
                ChildLazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
                ], ChildLazyLoadedComponent);
                return ChildLazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: 'loaded',
                                    component: ParentLazyLoadedComponent,
                                    children: [{ path: 'child', component: ChildLazyLoadedComponent }]
                                }])]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded/child');
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded-parent [lazy-loaded-child]');
        })));
        it('should have 2 injector trees: module and element', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var Parent = /** @class */ (function () {
                function Parent() {
                }
                Parent = __decorate([
                    core_1.Component({
                        selector: 'lazy',
                        template: 'parent[<router-outlet></router-outlet>]',
                        viewProviders: [
                            { provide: 'shadow', useValue: 'from parent component' },
                        ],
                    })
                ], Parent);
                return Parent;
            }());
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'child' })
                ], Child);
                return Child;
            }());
            var ParentModule = /** @class */ (function () {
                function ParentModule() {
                }
                ParentModule = __decorate([
                    core_1.NgModule({
                        declarations: [Parent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: 'parent',
                                    component: Parent,
                                    children: [
                                        { path: 'child', loadChildren: 'child' },
                                    ]
                                }])],
                        providers: [
                            { provide: 'moduleName', useValue: 'parent' },
                            { provide: 'fromParent', useValue: 'from parent' },
                        ],
                    })
                ], ParentModule);
                return ParentModule;
            }());
            var ChildModule = /** @class */ (function () {
                function ChildModule() {
                }
                ChildModule = __decorate([
                    core_1.NgModule({
                        declarations: [Child],
                        imports: [router_1.RouterModule.forChild([{ path: '', component: Child }])],
                        providers: [
                            { provide: 'moduleName', useValue: 'child' },
                            { provide: 'fromChild', useValue: 'from child' },
                            { provide: 'shadow', useValue: 'from child module' },
                        ],
                    })
                ], ChildModule);
                return ChildModule;
            }());
            loader.stubbedModules = {
                parent: ParentModule,
                child: ChildModule,
            };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'parent' }]);
            router.navigateByUrl('/lazy/parent/child');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/parent/child');
            matchers_1.expect(fixture.nativeElement).toHaveText('parent[child]');
            var pInj = fixture.debugElement.query(by_1.By.directive(Parent)).injector;
            var cInj = fixture.debugElement.query(by_1.By.directive(Child)).injector;
            matchers_1.expect(pInj.get('moduleName')).toEqual('parent');
            matchers_1.expect(pInj.get('fromParent')).toEqual('from parent');
            matchers_1.expect(pInj.get(Parent)).toBeAnInstanceOf(Parent);
            matchers_1.expect(pInj.get('fromChild', null)).toEqual(null);
            matchers_1.expect(pInj.get(Child, null)).toEqual(null);
            matchers_1.expect(cInj.get('moduleName')).toEqual('child');
            matchers_1.expect(cInj.get('fromParent')).toEqual('from parent');
            matchers_1.expect(cInj.get('fromChild')).toEqual('from child');
            matchers_1.expect(cInj.get(Parent)).toBeAnInstanceOf(Parent);
            matchers_1.expect(cInj.get(Child)).toBeAnInstanceOf(Child);
            // The child module can not shadow the parent component
            matchers_1.expect(cInj.get('shadow')).toEqual('from parent component');
            var pmInj = pInj.get(core_1.NgModuleRef).injector;
            var cmInj = cInj.get(core_1.NgModuleRef).injector;
            matchers_1.expect(pmInj.get('moduleName')).toEqual('parent');
            matchers_1.expect(cmInj.get('moduleName')).toEqual('child');
            matchers_1.expect(pmInj.get(Parent, '-')).toEqual('-');
            matchers_1.expect(cmInj.get(Parent, '-')).toEqual('-');
            matchers_1.expect(pmInj.get(Child, '-')).toEqual('-');
            matchers_1.expect(cmInj.get(Child, '-')).toEqual('-');
        })));
        // https://github.com/angular/angular/issues/12889
        it('should create a single instance of lazy-loaded modules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = /** @class */ (function () {
                function ParentLazyLoadedComponent() {
                }
                ParentLazyLoadedComponent = __decorate([
                    core_1.Component({
                        selector: 'lazy',
                        template: 'lazy-loaded-parent [<router-outlet></router-outlet>]'
                    })
                ], ParentLazyLoadedComponent);
                return ParentLazyLoadedComponent;
            }());
            var ChildLazyLoadedComponent = /** @class */ (function () {
                function ChildLazyLoadedComponent() {
                }
                ChildLazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
                ], ChildLazyLoadedComponent);
                return ChildLazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                    LoadedModule_1.instances++;
                }
                LoadedModule_1 = LoadedModule;
                var LoadedModule_1;
                LoadedModule.instances = 0;
                LoadedModule = LoadedModule_1 = __decorate([
                    core_1.NgModule({
                        declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: 'loaded',
                                    component: ParentLazyLoadedComponent,
                                    children: [{ path: 'child', component: ChildLazyLoadedComponent }]
                                }])]
                    }),
                    __metadata("design:paramtypes", [])
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded-parent [lazy-loaded-child]');
            matchers_1.expect(LoadedModule.instances).toEqual(1);
        })));
        // https://github.com/angular/angular/issues/13870
        it('should create a single instance of guards for lazy-loaded modules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var Service = /** @class */ (function () {
                function Service() {
                }
                Service = __decorate([
                    core_1.Injectable()
                ], Service);
                return Service;
            }());
            var Resolver = /** @class */ (function () {
                function Resolver(service) {
                    this.service = service;
                }
                Resolver.prototype.resolve = function (route, state) {
                    return this.service;
                };
                Resolver = __decorate([
                    core_1.Injectable(),
                    __metadata("design:paramtypes", [Service])
                ], Resolver);
                return Resolver;
            }());
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent(injectedService, route) {
                    this.injectedService = injectedService;
                    this.resolvedService = route.snapshot.data['service'];
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy' }),
                    __metadata("design:paramtypes", [Service, router_1.ActivatedRoute])
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        providers: [Service, Resolver],
                        imports: [
                            router_1.RouterModule.forChild([{
                                    path: 'loaded',
                                    component: LazyLoadedComponent,
                                    resolve: { 'service': Resolver },
                                }]),
                        ]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy');
            var lzc = fixture.debugElement.query(by_1.By.directive(LazyLoadedComponent)).componentInstance;
            matchers_1.expect(lzc.injectedService).toBe(lzc.resolvedService);
        })));
        it('should emit RouteConfigLoadStart and RouteConfigLoadEnd event when route is lazy loaded', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = /** @class */ (function () {
                function ParentLazyLoadedComponent() {
                }
                ParentLazyLoadedComponent = __decorate([
                    core_1.Component({
                        selector: 'lazy',
                        template: 'lazy-loaded-parent [<router-outlet></router-outlet>]',
                    })
                ], ParentLazyLoadedComponent);
                return ParentLazyLoadedComponent;
            }());
            var ChildLazyLoadedComponent = /** @class */ (function () {
                function ChildLazyLoadedComponent() {
                }
                ChildLazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
                ], ChildLazyLoadedComponent);
                return ChildLazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: 'loaded',
                                    component: ParentLazyLoadedComponent,
                                    children: [{ path: 'child', component: ChildLazyLoadedComponent }],
                                }])]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            var events = [];
            router.events.subscribe(function (e) {
                if (e instanceof router_1.RouteConfigLoadStart || e instanceof router_1.RouteConfigLoadEnd) {
                    events.push(e);
                }
            });
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(events.length).toEqual(2);
            matchers_1.expect(events[0].toString()).toEqual('RouteConfigLoadStart(path: lazy)');
            matchers_1.expect(events[1].toString()).toEqual('RouteConfigLoadEnd(path: lazy)');
        })));
        it('throws an error when forRoot() is used in a lazy context', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent() {
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'should not show' })
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forRoot([{ path: 'loaded', component: LazyLoadedComponent }])]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            var recordedError = null;
            router.navigateByUrl('/lazy/loaded').catch(function (err) { return recordedError = err; });
            advance(fixture);
            matchers_1.expect(recordedError.message)
                .toEqual("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
        })));
        it('should combine routes from multiple modules into a single configuration', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyComponent2 = /** @class */ (function () {
                function LazyComponent2() {
                }
                LazyComponent2 = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded-2' })
                ], LazyComponent2);
                return LazyComponent2;
            }());
            var SiblingOfLoadedModule = /** @class */ (function () {
                function SiblingOfLoadedModule() {
                }
                SiblingOfLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyComponent2],
                        imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyComponent2 }])]
                    })
                ], SiblingOfLoadedModule);
                return SiblingOfLoadedModule;
            }());
            var LazyComponent1 = /** @class */ (function () {
                function LazyComponent1() {
                }
                LazyComponent1 = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded-1' })
                ], LazyComponent1);
                return LazyComponent1;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyComponent1],
                        imports: [
                            router_1.RouterModule.forChild([{ path: 'loaded', component: LazyComponent1 }]),
                            SiblingOfLoadedModule
                        ]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { expected1: LoadedModule, expected2: SiblingOfLoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'lazy1', loadChildren: 'expected1' },
                { path: 'lazy2', loadChildren: 'expected2' }
            ]);
            router.navigateByUrl('/lazy1/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy1/loaded');
            router.navigateByUrl('/lazy2/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy2/loaded');
        })));
        it('should allow lazy loaded module in named outlet', testing_1.fakeAsync(testing_1.inject([router_1.Router, core_1.NgModuleFactoryLoader], function (router, loader) {
            var LazyComponent = /** @class */ (function () {
                function LazyComponent() {
                }
                LazyComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyComponent);
                return LazyComponent;
            }());
            var LazyLoadedModule = /** @class */ (function () {
                function LazyLoadedModule() {
                }
                LazyLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyComponent],
                        imports: [router_1.RouterModule.forChild([{ path: '', component: LazyComponent }])]
                    })
                ], LazyLoadedModule);
                return LazyLoadedModule;
            }());
            loader.stubbedModules = { lazyModule: LazyLoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'user/:name', component: UserCmp },
                        { path: 'lazy', loadChildren: 'lazyModule', outlet: 'right' },
                    ]
                }]);
            router.navigateByUrl('/team/22/user/john');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user john, right:  ]');
            router.navigateByUrl('/team/22/(user/john//right:lazy)');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user john, right: lazy-loaded ]');
        })));
        it('should allow componentless named outlet to render children', testing_1.fakeAsync(testing_1.inject([router_1.Router, core_1.NgModuleFactoryLoader], function (router, loader) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'user/:name', component: UserCmp },
                        { path: 'simple', outlet: 'right', children: [{ path: '', component: SimpleCmp }] },
                    ]
                }]);
            router.navigateByUrl('/team/22/user/john');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user john, right:  ]');
            router.navigateByUrl('/team/22/(user/john//right:simple)');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user john, right: simple ]');
        })));
        describe('should use the injector of the lazily-loaded configuration', function () {
            var LazyLoadedServiceDefinedInModule = /** @class */ (function () {
                function LazyLoadedServiceDefinedInModule() {
                }
                return LazyLoadedServiceDefinedInModule;
            }());
            var EagerParentComponent = /** @class */ (function () {
                function EagerParentComponent() {
                }
                EagerParentComponent = __decorate([
                    core_1.Component({
                        selector: 'eager-parent',
                        template: 'eager-parent <router-outlet></router-outlet>',
                    })
                ], EagerParentComponent);
                return EagerParentComponent;
            }());
            var LazyParentComponent = /** @class */ (function () {
                function LazyParentComponent() {
                }
                LazyParentComponent = __decorate([
                    core_1.Component({
                        selector: 'lazy-parent',
                        template: 'lazy-parent <router-outlet></router-outlet>',
                    })
                ], LazyParentComponent);
                return LazyParentComponent;
            }());
            var LazyChildComponent = /** @class */ (function () {
                function LazyChildComponent(lazy, // should be able to inject lazy/direct parent
                lazyService, // should be able to inject lazy service
                eager // should use the injector of the location to create a parent
                ) {
                }
                LazyChildComponent = __decorate([
                    core_1.Component({
                        selector: 'lazy-child',
                        template: 'lazy-child',
                    }),
                    __metadata("design:paramtypes", [LazyParentComponent,
                        LazyLoadedServiceDefinedInModule,
                        EagerParentComponent // should use the injector of the location to create a parent
                    ])
                ], LazyChildComponent);
                return LazyChildComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyParentComponent, LazyChildComponent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: '',
                                    children: [{
                                            path: 'lazy-parent',
                                            component: LazyParentComponent,
                                            children: [{ path: 'lazy-child', component: LazyChildComponent }]
                                        }]
                                }])],
                        providers: [LazyLoadedServiceDefinedInModule]
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            var TestModule = /** @class */ (function () {
                function TestModule() {
                }
                TestModule = __decorate([
                    core_1.NgModule({
                        declarations: [EagerParentComponent],
                        entryComponents: [EagerParentComponent],
                        imports: [router_1.RouterModule]
                    })
                ], TestModule);
                return TestModule;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    imports: [TestModule],
                });
            });
            it('should use the injector of the lazily-loaded configuration', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                loader.stubbedModules = { expected: LoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'eager-parent',
                        component: EagerParentComponent,
                        children: [{ path: 'lazy', loadChildren: 'expected' }]
                    }]);
                router.navigateByUrl('/eager-parent/lazy/lazy-parent/lazy-child');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/eager-parent/lazy/lazy-parent/lazy-child');
                matchers_1.expect(fixture.nativeElement).toHaveText('eager-parent lazy-parent lazy-child');
            })));
        });
        it('works when given a callback', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location) {
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent() {
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])],
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: function () { return LoadedModule; } }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded');
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded');
        })));
        it('error emit an error when cannot load a config', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            loader.stubbedModules = {};
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'invalid' }]);
            var recordedEvents = [];
            router.events.forEach(function (e) { return recordedEvents.push(e); });
            router.navigateByUrl('/lazy/loaded').catch(function (s) { });
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/');
            expectEvents(recordedEvents, [
                [router_1.NavigationStart, '/lazy/loaded'],
                [router_1.RouteConfigLoadStart],
                [router_1.NavigationError, '/lazy/loaded'],
            ]);
        })));
        it('should work with complex redirect rules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent() {
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LoadedModule = /** @class */ (function () {
                function LoadedModule() {
                }
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])],
                    })
                ], LoadedModule);
                return LoadedModule;
            }());
            loader.stubbedModules = { lazy: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'lazy' }, { path: '**', redirectTo: 'lazy' }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded');
        })));
        it('should work with wildcard route', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = /** @class */ (function () {
                function LazyLoadedComponent() {
                }
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                return LazyLoadedComponent;
            }());
            var LazyLoadedModule = /** @class */ (function () {
                function LazyLoadedModule() {
                }
                LazyLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: '', component: LazyLoadedComponent }])],
                    })
                ], LazyLoadedModule);
                return LazyLoadedModule;
            }());
            loader.stubbedModules = { lazy: LazyLoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: '**', loadChildren: 'lazy' }]);
            router.navigateByUrl('/lazy');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy');
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded');
        })));
        describe('preloading', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ providers: [{ provide: router_1.PreloadingStrategy, useExisting: router_1.PreloadAllModules }] });
                var preloader = testing_1.TestBed.get(router_1.RouterPreloader);
                preloader.setUpPreloading();
            });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = /** @class */ (function () {
                    function LazyLoadedComponent() {
                    }
                    LazyLoadedComponent = __decorate([
                        core_1.Component({ selector: 'lazy', template: 'should not show' })
                    ], LazyLoadedComponent);
                    return LazyLoadedComponent;
                }());
                var LoadedModule2 = /** @class */ (function () {
                    function LoadedModule2() {
                    }
                    LoadedModule2 = __decorate([
                        core_1.NgModule({
                            declarations: [LazyLoadedComponent],
                            imports: [router_1.RouterModule.forChild([{ path: 'LoadedModule2', component: LazyLoadedComponent }])]
                        })
                    ], LoadedModule2);
                    return LoadedModule2;
                }());
                var LoadedModule1 = /** @class */ (function () {
                    function LoadedModule1() {
                    }
                    LoadedModule1 = __decorate([
                        core_1.NgModule({
                            imports: [router_1.RouterModule.forChild([{ path: 'LoadedModule1', loadChildren: 'expected2' }])]
                        })
                    ], LoadedModule1);
                    return LoadedModule1;
                }());
                loader.stubbedModules = { expected: LoadedModule1, expected2: LoadedModule2 };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'blank', component: BlankCmp }, { path: 'lazy', loadChildren: 'expected' }
                ]);
                router.navigateByUrl('/blank');
                advance(fixture);
                var config = router.config;
                var firstConfig = config[1]._loadedConfig;
                matchers_1.expect(firstConfig).toBeDefined();
                matchers_1.expect(firstConfig.routes[0].path).toEqual('LoadedModule1');
                var secondConfig = firstConfig.routes[0]._loadedConfig;
                matchers_1.expect(secondConfig).toBeDefined();
                matchers_1.expect(secondConfig.routes[0].path).toEqual('LoadedModule2');
            })));
        });
        describe('custom url handling strategies', function () {
            var CustomUrlHandlingStrategy = /** @class */ (function () {
                function CustomUrlHandlingStrategy() {
                }
                CustomUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) {
                    return url.toString().startsWith('/include') || url.toString() === '/';
                };
                CustomUrlHandlingStrategy.prototype.extract = function (url) {
                    var oldRoot = url.root;
                    var children = {};
                    if (oldRoot.children[router_1.PRIMARY_OUTLET]) {
                        children[router_1.PRIMARY_OUTLET] = oldRoot.children[router_1.PRIMARY_OUTLET];
                    }
                    var root = new router_1.UrlSegmentGroup(oldRoot.segments, children);
                    return new router_1.UrlTree(root, url.queryParams, url.fragment);
                };
                CustomUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) {
                    var _this = this;
                    var oldRoot = newUrlPart.root;
                    var children = {};
                    if (oldRoot.children[router_1.PRIMARY_OUTLET]) {
                        children[router_1.PRIMARY_OUTLET] = oldRoot.children[router_1.PRIMARY_OUTLET];
                    }
                    collection_1.forEach(wholeUrl.root.children, function (v, k) {
                        if (k !== router_1.PRIMARY_OUTLET) {
                            children[k] = v;
                        }
                        v.parent = _this;
                    });
                    var root = new router_1.UrlSegmentGroup(oldRoot.segments, children);
                    return new router_1.UrlTree(root, newUrlPart.queryParams, newUrlPart.fragment);
                };
                return CustomUrlHandlingStrategy;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ providers: [{ provide: router_1.UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }] });
            });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'include',
                        component: TeamCmp,
                        children: [
                            { path: 'user/:name', component: UserCmp }, { path: 'simple', component: SimpleCmp }
                        ]
                    }]);
                var events = [];
                router.events.subscribe(function (e) { return e instanceof router_1.RouterEvent && events.push(e); });
                // supported URL
                router.navigateByUrl('/include/user/kate');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/user/kate');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/user/kate'], [router_1.RoutesRecognized, '/include/user/kate'],
                    [router_1.GuardsCheckStart, '/include/user/kate'], [router_1.GuardsCheckEnd, '/include/user/kate'],
                    [router_1.ResolveStart, '/include/user/kate'], [router_1.ResolveEnd, '/include/user/kate'],
                    [router_1.NavigationEnd, '/include/user/kate']
                ]);
                matchers_1.expect(fixture.nativeElement).toHaveText('team  [ user kate, right:  ]');
                events.splice(0);
                // unsupported URL
                router.navigateByUrl('/exclude/one');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/exclude/one');
                matchers_1.expect(Object.keys(router.routerState.root.children).length).toEqual(0);
                matchers_1.expect(fixture.nativeElement).toHaveText('');
                expectEvents(events, [
                    [router_1.NavigationStart, '/exclude/one'], [router_1.GuardsCheckStart, '/exclude/one'],
                    [router_1.GuardsCheckEnd, '/exclude/one'], [router_1.NavigationEnd, '/exclude/one']
                ]);
                events.splice(0);
                // another unsupported URL
                location.go('/exclude/two');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/exclude/two');
                expectEvents(events, []);
                // back to a supported URL
                location.go('/include/simple');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/simple');
                matchers_1.expect(fixture.nativeElement).toHaveText('team  [ simple, right:  ]');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/simple'], [router_1.RoutesRecognized, '/include/simple'],
                    [router_1.GuardsCheckStart, '/include/simple'], [router_1.GuardsCheckEnd, '/include/simple'],
                    [router_1.ResolveStart, '/include/simple'], [router_1.ResolveEnd, '/include/simple'],
                    [router_1.NavigationEnd, '/include/simple']
                ]);
            })));
            it('should handle the case when the router takes only the primary url', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'include',
                        component: TeamCmp,
                        children: [
                            { path: 'user/:name', component: UserCmp }, { path: 'simple', component: SimpleCmp }
                        ]
                    }]);
                var events = [];
                router.events.subscribe(function (e) { return e instanceof router_1.RouterEvent && events.push(e); });
                location.go('/include/user/kate(aux:excluded)');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/user/kate(aux:excluded)');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/user/kate'], [router_1.RoutesRecognized, '/include/user/kate'],
                    [router_1.GuardsCheckStart, '/include/user/kate'], [router_1.GuardsCheckEnd, '/include/user/kate'],
                    [router_1.ResolveStart, '/include/user/kate'], [router_1.ResolveEnd, '/include/user/kate'],
                    [router_1.NavigationEnd, '/include/user/kate']
                ]);
                events.splice(0);
                location.go('/include/user/kate(aux:excluded2)');
                advance(fixture);
                expectEvents(events, []);
                router.navigateByUrl('/include/simple');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/simple(aux:excluded2)');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/simple'], [router_1.RoutesRecognized, '/include/simple'],
                    [router_1.GuardsCheckStart, '/include/simple'], [router_1.GuardsCheckEnd, '/include/simple'],
                    [router_1.ResolveStart, '/include/simple'], [router_1.ResolveEnd, '/include/simple'],
                    [router_1.NavigationEnd, '/include/simple']
                ]);
            })));
        });
    });
    describe('Custom Route Reuse Strategy', function () {
        var AttachDetachReuseStrategy = /** @class */ (function () {
            function AttachDetachReuseStrategy() {
                this.stored = {};
            }
            AttachDetachReuseStrategy.prototype.shouldDetach = function (route) {
                return route.routeConfig.path === 'a';
            };
            AttachDetachReuseStrategy.prototype.store = function (route, detachedTree) {
                this.stored[route.routeConfig.path] = detachedTree;
            };
            AttachDetachReuseStrategy.prototype.shouldAttach = function (route) {
                return !!this.stored[route.routeConfig.path];
            };
            AttachDetachReuseStrategy.prototype.retrieve = function (route) {
                return this.stored[route.routeConfig.path];
            };
            AttachDetachReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
                return future.routeConfig === curr.routeConfig;
            };
            return AttachDetachReuseStrategy;
        }());
        var ShortLifecycle = /** @class */ (function () {
            function ShortLifecycle() {
            }
            ShortLifecycle.prototype.shouldDetach = function (route) { return false; };
            ShortLifecycle.prototype.store = function (route, detachedTree) { };
            ShortLifecycle.prototype.shouldAttach = function (route) { return false; };
            ShortLifecycle.prototype.retrieve = function (route) { return null; };
            ShortLifecycle.prototype.shouldReuseRoute = function (future, curr) {
                if (future.routeConfig !== curr.routeConfig) {
                    return false;
                }
                if (Object.keys(future.params).length !== Object.keys(curr.params).length) {
                    return false;
                }
                return Object.keys(future.params).every(function (k) { return future.params[k] === curr.params[k]; });
            };
            return ShortLifecycle;
        }());
        it('should support attaching & detaching fragments', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.routeReuseStrategy = new AttachDetachReuseStrategy();
            router.resetConfig([
                {
                    path: 'a',
                    component: TeamCmp,
                    children: [{ path: 'b', component: SimpleCmp }],
                },
                { path: 'c', component: UserCmp },
            ]);
            router.navigateByUrl('/a/b');
            advance(fixture);
            var teamCmp = fixture.debugElement.children[1].componentInstance;
            var simpleCmp = fixture.debugElement.children[1].children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a/b');
            matchers_1.expect(teamCmp).toBeDefined();
            matchers_1.expect(simpleCmp).toBeDefined();
            router.navigateByUrl('/c');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/c');
            matchers_1.expect(fixture.debugElement.children[1].componentInstance).toBeAnInstanceOf(UserCmp);
            router.navigateByUrl('/a;p=1/b;p=2');
            advance(fixture);
            var teamCmp2 = fixture.debugElement.children[1].componentInstance;
            var simpleCmp2 = fixture.debugElement.children[1].children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a;p=1/b;p=2');
            matchers_1.expect(teamCmp2).toBe(teamCmp);
            matchers_1.expect(simpleCmp2).toBe(simpleCmp);
            matchers_1.expect(teamCmp.route).toBe(router.routerState.root.firstChild);
            matchers_1.expect(teamCmp.route.snapshot).toBe(router.routerState.snapshot.root.firstChild);
            matchers_1.expect(teamCmp.route.snapshot.params).toEqual({ p: '1' });
            matchers_1.expect(teamCmp.route.firstChild.snapshot.params).toEqual({ p: '2' });
        })));
        it('should support shorter lifecycles', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.routeReuseStrategy = new ShortLifecycle();
            router.resetConfig([{ path: 'a', component: SimpleCmp }]);
            router.navigateByUrl('/a');
            advance(fixture);
            var simpleCmp1 = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a');
            router.navigateByUrl('/a;p=1');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/a;p=1');
            var simpleCmp2 = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(simpleCmp1).not.toBe(simpleCmp2);
        })));
        it('should not mount the component of the previously reused route when the outlet was not instantiated at the time of route activation', testing_1.fakeAsync(function () {
            var RootCmpWithCondOutlet = /** @class */ (function () {
                function RootCmpWithCondOutlet(router) {
                    var _this = this;
                    this.isToolpanelShowing = false;
                    this.subscription =
                        router.events.pipe(operators_1.filter(function (event) { return event instanceof router_1.NavigationEnd; }))
                            .subscribe(function () { return _this.isToolpanelShowing =
                            !!router.parseUrl(router.url).root.children['toolpanel']; });
                }
                RootCmpWithCondOutlet.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
                RootCmpWithCondOutlet = __decorate([
                    core_1.Component({
                        selector: 'root-cmp',
                        template: '<div *ngIf="isToolpanelShowing"><router-outlet name="toolpanel"></router-outlet></div>'
                    }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], RootCmpWithCondOutlet);
                return RootCmpWithCondOutlet;
            }());
            var Tool1Component = /** @class */ (function () {
                function Tool1Component() {
                }
                Tool1Component = __decorate([
                    core_1.Component({ selector: 'tool-1-cmp', template: 'Tool 1 showing' })
                ], Tool1Component);
                return Tool1Component;
            }());
            var Tool2Component = /** @class */ (function () {
                function Tool2Component() {
                }
                Tool2Component = __decorate([
                    core_1.Component({ selector: 'tool-2-cmp', template: 'Tool 2 showing' })
                ], Tool2Component);
                return Tool2Component;
            }());
            var TestModule = /** @class */ (function () {
                function TestModule() {
                }
                TestModule = __decorate([
                    core_1.NgModule({
                        declarations: [RootCmpWithCondOutlet, Tool1Component, Tool2Component],
                        imports: [
                            common_1.CommonModule,
                            testing_2.RouterTestingModule.withRoutes([
                                { path: 'a', outlet: 'toolpanel', component: Tool1Component },
                                { path: 'b', outlet: 'toolpanel', component: Tool2Component },
                            ]),
                        ],
                    })
                ], TestModule);
                return TestModule;
            }());
            testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
            var router = testing_1.TestBed.get(router_1.Router);
            router.routeReuseStrategy = new AttachDetachReuseStrategy();
            var fixture = createRoot(router, RootCmpWithCondOutlet);
            // Activate 'tool-1'
            router.navigate([{ outlets: { toolpanel: 'a' } }]);
            advance(fixture);
            matchers_1.expect(fixture).toContainComponent(Tool1Component, '(a)');
            // Deactivate 'tool-1'
            router.navigate([{ outlets: { toolpanel: null } }]);
            advance(fixture);
            matchers_1.expect(fixture).not.toContainComponent(Tool1Component, '(b)');
            // Activate 'tool-1'
            router.navigate([{ outlets: { toolpanel: 'a' } }]);
            advance(fixture);
            matchers_1.expect(fixture).toContainComponent(Tool1Component, '(c)');
            // Deactivate 'tool-1'
            router.navigate([{ outlets: { toolpanel: null } }]);
            advance(fixture);
            matchers_1.expect(fixture).not.toContainComponent(Tool1Component, '(d)');
            // Activate 'tool-2'
            router.navigate([{ outlets: { toolpanel: 'b' } }]);
            advance(fixture);
            matchers_1.expect(fixture).toContainComponent(Tool2Component, '(e)');
        }));
    });
});
describe('Testing router options', function () {
    describe('paramsInheritanceStrategy', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ imports: [testing_2.RouterTestingModule.withRoutes([], { paramsInheritanceStrategy: 'always' })] });
        });
        it('should configure the router', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            matchers_1.expect(router.paramsInheritanceStrategy).toEqual('always');
        })));
    });
    describe('malformedUriErrorHandler', function () {
        function malformedUriErrorHandler(e, urlSerializer, url) {
            return urlSerializer.parse('/error');
        }
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ imports: [testing_2.RouterTestingModule.withRoutes([], { malformedUriErrorHandler: malformedUriErrorHandler })] });
        });
        it('should configure the router', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            matchers_1.expect(router.malformedUriErrorHandler).toBe(malformedUriErrorHandler);
        })));
    });
});
function expectEvents(events, pairs) {
    matchers_1.expect(events.length).toEqual(pairs.length);
    for (var i = 0; i < events.length; ++i) {
        matchers_1.expect(events[i].constructor.name).toBe(pairs[i][0].name);
        matchers_1.expect(events[i].url).toBe(pairs[i][1]);
    }
}
function onlyNavigationStartAndEnd(e) {
    return e instanceof router_1.NavigationStart || e instanceof router_1.NavigationEnd;
}
var StringLinkCmp = /** @class */ (function () {
    function StringLinkCmp() {
    }
    StringLinkCmp = __decorate([
        core_1.Component({ selector: 'link-cmp', template: "<a routerLink=\"/team/33/simple\" [target]=\"'_self'\">link</a>" })
    ], StringLinkCmp);
    return StringLinkCmp;
}());
var StringLinkButtonCmp = /** @class */ (function () {
    function StringLinkButtonCmp() {
    }
    StringLinkButtonCmp = __decorate([
        core_1.Component({ selector: 'link-cmp', template: "<button routerLink=\"/team/33/simple\">link</button>" })
    ], StringLinkButtonCmp);
    return StringLinkButtonCmp;
}());
var AbsoluteLinkCmp = /** @class */ (function () {
    function AbsoluteLinkCmp() {
    }
    AbsoluteLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet><a [routerLink]=\"['/team/33/simple']\">link</a>"
        })
    ], AbsoluteLinkCmp);
    return AbsoluteLinkCmp;
}());
var DummyLinkCmp = /** @class */ (function () {
    function DummyLinkCmp(route) {
        this.exact = route.snapshot.paramMap.get('exact') === 'true';
    }
    DummyLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet><a routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\" [routerLink]=\"['./']\">link</a>\n<button routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\" [routerLink]=\"['./']\">button</button>\n"
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], DummyLinkCmp);
    return DummyLinkCmp;
}());
var RelativeLinkCmp = /** @class */ (function () {
    function RelativeLinkCmp() {
    }
    RelativeLinkCmp = __decorate([
        core_1.Component({ selector: 'link-cmp', template: "<a [routerLink]=\"['../simple']\">link</a>" })
    ], RelativeLinkCmp);
    return RelativeLinkCmp;
}());
var LinkWithQueryParamsAndFragment = /** @class */ (function () {
    function LinkWithQueryParamsAndFragment() {
    }
    LinkWithQueryParamsAndFragment = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<a [routerLink]=\"['../simple']\" [queryParams]=\"{q: '1'}\" fragment=\"f\">link</a>"
        })
    ], LinkWithQueryParamsAndFragment);
    return LinkWithQueryParamsAndFragment;
}());
var SimpleCmp = /** @class */ (function () {
    function SimpleCmp() {
    }
    SimpleCmp = __decorate([
        core_1.Component({ selector: 'simple-cmp', template: "simple" })
    ], SimpleCmp);
    return SimpleCmp;
}());
var CollectParamsCmp = /** @class */ (function () {
    function CollectParamsCmp(route) {
        var _this = this;
        this.route = route;
        this.params = [];
        this.urls = [];
        route.params.forEach(function (p) { return _this.params.push(p); });
        route.url.forEach(function (u) { return _this.urls.push(u); });
    }
    CollectParamsCmp.prototype.recordedUrls = function () {
        return this.urls.map(function (a) { return a.map(function (p) { return p.path; }).join('/'); });
    };
    CollectParamsCmp = __decorate([
        core_1.Component({ selector: 'collect-params-cmp', template: "collect-params" }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], CollectParamsCmp);
    return CollectParamsCmp;
}());
var BlankCmp = /** @class */ (function () {
    function BlankCmp() {
    }
    BlankCmp = __decorate([
        core_1.Component({ selector: 'blank-cmp', template: "" })
    ], BlankCmp);
    return BlankCmp;
}());
var TeamCmp = /** @class */ (function () {
    function TeamCmp(route) {
        var _this = this;
        this.route = route;
        this.recordedParams = [];
        this.snapshotParams = [];
        this.routerLink = ['.'];
        this.id = route.params.pipe(operators_1.map(function (p) { return p['id']; }));
        route.params.forEach(function (p) {
            _this.recordedParams.push(p);
            _this.snapshotParams.push(route.snapshot.params);
        });
    }
    TeamCmp = __decorate([
        core_1.Component({
            selector: 'team-cmp',
            template: "team {{id | async}} " +
                "[ <router-outlet></router-outlet>, right: <router-outlet name=\"right\"></router-outlet> ]" +
                "<a [routerLink]=\"routerLink\" skipLocationChange></a>" +
                "<button [routerLink]=\"routerLink\" skipLocationChange></button>"
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], TeamCmp);
    return TeamCmp;
}());
var TwoOutletsCmp = /** @class */ (function () {
    function TwoOutletsCmp() {
    }
    TwoOutletsCmp = __decorate([
        core_1.Component({
            selector: 'two-outlets-cmp',
            template: "[ <router-outlet></router-outlet>, aux: <router-outlet name=\"aux\"></router-outlet> ]"
        })
    ], TwoOutletsCmp);
    return TwoOutletsCmp;
}());
var UserCmp = /** @class */ (function () {
    function UserCmp(route) {
        var _this = this;
        this.recordedParams = [];
        this.snapshotParams = [];
        this.name = route.params.pipe(operators_1.map(function (p) { return p['name']; }));
        route.params.forEach(function (p) {
            _this.recordedParams.push(p);
            _this.snapshotParams.push(route.snapshot.params);
        });
    }
    UserCmp = __decorate([
        core_1.Component({ selector: 'user-cmp', template: "user {{name | async}}" }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], UserCmp);
    return UserCmp;
}());
var WrapperCmp = /** @class */ (function () {
    function WrapperCmp() {
    }
    WrapperCmp = __decorate([
        core_1.Component({ selector: 'wrapper', template: "<router-outlet></router-outlet>" })
    ], WrapperCmp);
    return WrapperCmp;
}());
var QueryParamsAndFragmentCmp = /** @class */ (function () {
    function QueryParamsAndFragmentCmp(route) {
        this.name = route.queryParamMap.pipe(operators_1.map(function (p) { return p.get('name'); }));
        this.fragment = route.fragment;
    }
    QueryParamsAndFragmentCmp = __decorate([
        core_1.Component({ selector: 'query-cmp', template: "query: {{name | async}} fragment: {{fragment | async}}" }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], QueryParamsAndFragmentCmp);
    return QueryParamsAndFragmentCmp;
}());
var EmptyQueryParamsCmp = /** @class */ (function () {
    function EmptyQueryParamsCmp(route) {
        var _this = this;
        this.recordedParams = [];
        route.queryParams.forEach(function (_) { return _this.recordedParams.push(_); });
    }
    EmptyQueryParamsCmp = __decorate([
        core_1.Component({ selector: 'empty-query-cmp', template: "" }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], EmptyQueryParamsCmp);
    return EmptyQueryParamsCmp;
}());
var RouteCmp = /** @class */ (function () {
    function RouteCmp(route) {
        this.route = route;
    }
    RouteCmp = __decorate([
        core_1.Component({ selector: 'route-cmp', template: "route" }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], RouteCmp);
    return RouteCmp;
}());
var RelativeLinkInIfCmp = /** @class */ (function () {
    function RelativeLinkInIfCmp() {
        this.show = false;
    }
    RelativeLinkInIfCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<div *ngIf=\"show\"><a [routerLink]=\"['./simple']\">link</a></div> <router-outlet></router-outlet>"
        })
    ], RelativeLinkInIfCmp);
    return RelativeLinkInIfCmp;
}());
var OutletInNgIf = /** @class */ (function () {
    function OutletInNgIf() {
        this.alwaysTrue = true;
    }
    OutletInNgIf = __decorate([
        core_1.Component({ selector: 'child', template: '<div *ngIf="alwaysTrue"><router-outlet></router-outlet></div>' })
    ], OutletInNgIf);
    return OutletInNgIf;
}());
var DummyLinkWithParentCmp = /** @class */ (function () {
    function DummyLinkWithParentCmp(route) {
        this.exact = route.snapshot.params.exact === 'true';
    }
    DummyLinkWithParentCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet>\n             <div id=\"link-parent\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\">\n               <div ngClass=\"{one: 'true'}\"><a [routerLink]=\"['./']\">link</a></div>\n             </div>"
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], DummyLinkWithParentCmp);
    return DummyLinkWithParentCmp;
}());
var ComponentRecordingRoutePathAndUrl = /** @class */ (function () {
    function ComponentRecordingRoutePathAndUrl(router, route) {
        this.path = router.routerState.pathFromRoot(route);
        this.url = router.url.toString();
    }
    ComponentRecordingRoutePathAndUrl = __decorate([
        core_1.Component({ selector: 'cmp', template: '' }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
    ], ComponentRecordingRoutePathAndUrl);
    return ComponentRecordingRoutePathAndUrl;
}());
var RootCmp = /** @class */ (function () {
    function RootCmp() {
    }
    RootCmp = __decorate([
        core_1.Component({ selector: 'root-cmp', template: "<router-outlet></router-outlet>" })
    ], RootCmp);
    return RootCmp;
}());
var RootCmpWithOnInit = /** @class */ (function () {
    function RootCmpWithOnInit(router) {
        this.router = router;
    }
    RootCmpWithOnInit.prototype.ngOnInit = function () { this.router.navigate(['one']); };
    RootCmpWithOnInit = __decorate([
        core_1.Component({ selector: 'root-cmp-on-init', template: "<router-outlet></router-outlet>" }),
        __metadata("design:paramtypes", [router_1.Router])
    ], RootCmpWithOnInit);
    return RootCmpWithOnInit;
}());
var RootCmpWithTwoOutlets = /** @class */ (function () {
    function RootCmpWithTwoOutlets() {
    }
    RootCmpWithTwoOutlets = __decorate([
        core_1.Component({
            selector: 'root-cmp',
            template: "primary [<router-outlet></router-outlet>] right [<router-outlet name=\"right\"></router-outlet>]"
        })
    ], RootCmpWithTwoOutlets);
    return RootCmpWithTwoOutlets;
}());
var ThrowingCmp = /** @class */ (function () {
    function ThrowingCmp() {
        throw new Error('Throwing Cmp');
    }
    ThrowingCmp = __decorate([
        core_1.Component({ selector: 'throwing-cmp', template: '' }),
        __metadata("design:paramtypes", [])
    ], ThrowingCmp);
    return ThrowingCmp;
}());
function advance(fixture) {
    testing_1.tick();
    fixture.detectChanges();
}
function createRoot(router, type) {
    var f = testing_1.TestBed.createComponent(type);
    advance(f);
    router.initialNavigation();
    advance(f);
    return f;
}
var LazyComponent = /** @class */ (function () {
    function LazyComponent() {
    }
    LazyComponent = __decorate([
        core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
    ], LazyComponent);
    return LazyComponent;
}());
var TestModule = /** @class */ (function () {
    function TestModule() {
    }
    TestModule = __decorate([
        core_1.NgModule({
            imports: [testing_2.RouterTestingModule, common_1.CommonModule],
            entryComponents: [
                BlankCmp,
                SimpleCmp,
                TwoOutletsCmp,
                TeamCmp,
                UserCmp,
                StringLinkCmp,
                DummyLinkCmp,
                AbsoluteLinkCmp,
                RelativeLinkCmp,
                DummyLinkWithParentCmp,
                LinkWithQueryParamsAndFragment,
                CollectParamsCmp,
                QueryParamsAndFragmentCmp,
                StringLinkButtonCmp,
                WrapperCmp,
                OutletInNgIf,
                ComponentRecordingRoutePathAndUrl,
                RouteCmp,
                RootCmp,
                RelativeLinkInIfCmp,
                RootCmpWithTwoOutlets,
                EmptyQueryParamsCmp,
                ThrowingCmp
            ],
            exports: [
                BlankCmp,
                SimpleCmp,
                TwoOutletsCmp,
                TeamCmp,
                UserCmp,
                StringLinkCmp,
                DummyLinkCmp,
                AbsoluteLinkCmp,
                RelativeLinkCmp,
                DummyLinkWithParentCmp,
                LinkWithQueryParamsAndFragment,
                CollectParamsCmp,
                QueryParamsAndFragmentCmp,
                StringLinkButtonCmp,
                WrapperCmp,
                OutletInNgIf,
                ComponentRecordingRoutePathAndUrl,
                RouteCmp,
                RootCmp,
                RootCmpWithOnInit,
                RelativeLinkInIfCmp,
                RootCmpWithTwoOutlets,
                EmptyQueryParamsCmp,
                ThrowingCmp
            ],
            declarations: [
                BlankCmp,
                SimpleCmp,
                TeamCmp,
                TwoOutletsCmp,
                UserCmp,
                StringLinkCmp,
                DummyLinkCmp,
                AbsoluteLinkCmp,
                RelativeLinkCmp,
                DummyLinkWithParentCmp,
                LinkWithQueryParamsAndFragment,
                CollectParamsCmp,
                QueryParamsAndFragmentCmp,
                StringLinkButtonCmp,
                WrapperCmp,
                OutletInNgIf,
                ComponentRecordingRoutePathAndUrl,
                RouteCmp,
                RootCmp,
                RootCmpWithOnInit,
                RelativeLinkInIfCmp,
                RootCmpWithTwoOutlets,
                EmptyQueryParamsCmp,
                ThrowingCmp
            ]
        })
    ], TestModule);
    return TestModule;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L2ludGVncmF0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBdUQ7QUFFdkQsc0NBQThMO0FBQzlMLGlEQUF5RjtBQUN6RixpRUFBOEQ7QUFDOUQsMkVBQXNFO0FBQ3RFLDBDQUF3b0I7QUFDeG9CLDZCQUE2RDtBQUM3RCw0Q0FBMkM7QUFFM0Msc0RBQWdEO0FBQ2hELHNDQUF5RTtBQUV6RSxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLElBQU0sV0FBVyxHQUFZLEVBQUMsR0FBRyxnQkFBSSxDQUFDLEVBQUUsSUFBSSxnQkFBSSxDQUFDLEVBQUMsQ0FBQztJQUVuRCxVQUFVLENBQUM7UUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzdCLE9BQU8sRUFDSCxDQUFDLDZCQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztZQUMxRixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxlQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUN4QyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxlQUFNLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYyxFQUFFLFFBQWtCO1FBQ3RFLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsT0FBTyxDQUFD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