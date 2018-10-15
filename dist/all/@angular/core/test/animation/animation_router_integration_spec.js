"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var testing_1 = require("@angular/animations/browser/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var animations_2 = require("@angular/platform-browser/animations");
var router_1 = require("@angular/router");
var testing_3 = require("@angular/router/testing");
(function () {
    // these tests are only mean't to be run within the DOM (for now)
    if (isNode)
        return;
    describe('Animation Router Tests', function () {
        function getLog() {
            return testing_1.MockAnimationDriver.log;
        }
        function resetLog() { testing_1.MockAnimationDriver.log = []; }
        beforeEach(function () {
            resetLog();
            testing_2.TestBed.configureTestingModule({
                imports: [testing_3.RouterTestingModule, animations_2.BrowserAnimationsModule],
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }]
            });
        });
        it('should query the old and new routes via :leave and :enter', testing_2.fakeAsync(function () {
            var ContainerCmp = /** @class */ (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                ContainerCmp = __decorate([
                    core_1.Component({
                        animations: [
                            animations_1.trigger('routerAnimations', [
                                animations_1.transition('page1 => page2', [
                                    animations_1.query(':leave', animations_1.animateChild()),
                                    animations_1.query(':enter', animations_1.animateChild()),
                                ]),
                            ]),
                        ],
                        template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                    }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], ContainerCmp);
                return ContainerCmp;
            }());
            var Page1Cmp = /** @class */ (function () {
                function Page1Cmp() {
                    this.doAnimate = true;
                }
                __decorate([
                    core_1.HostBinding('@page1Animation'),
                    __metadata("design:type", Object)
                ], Page1Cmp.prototype, "doAnimate", void 0);
                Page1Cmp = __decorate([
                    core_1.Component({
                        selector: 'page1',
                        template: "page1",
                        animations: [
                            animations_1.trigger('page1Animation', [
                                animations_1.transition(':leave', [
                                    animations_1.style({ width: '200px' }),
                                    animations_1.animate(1000, animations_1.style({ width: '0px' })),
                                ]),
                            ]),
                        ]
                    })
                ], Page1Cmp);
                return Page1Cmp;
            }());
            var Page2Cmp = /** @class */ (function () {
                function Page2Cmp() {
                    this.doAnimate = true;
                }
                __decorate([
                    core_1.HostBinding('@page2Animation'),
                    __metadata("design:type", Object)
                ], Page2Cmp.prototype, "doAnimate", void 0);
                Page2Cmp = __decorate([
                    core_1.Component({
                        selector: 'page2',
                        template: "page2",
                        animations: [
                            animations_1.trigger('page2Animation', [
                                animations_1.transition(':enter', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                ]),
                            ]),
                        ]
                    })
                ], Page2Cmp);
                return Page2Cmp;
            }());
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.duration).toEqual(1000);
            expect(p1.keyframes).toEqual([
                { offset: 0, width: '200px' },
                { offset: 1, width: '0px' },
            ]);
            expect(p2.duration).toEqual(2000);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: .5, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
        }));
        it('should allow inner enter animations to be emulated within a routed item', testing_2.fakeAsync(function () {
            var ContainerCmp = /** @class */ (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                ContainerCmp = __decorate([
                    core_1.Component({
                        animations: [
                            animations_1.trigger('routerAnimations', [
                                animations_1.transition('page1 => page2', [
                                    animations_1.query(':enter', animations_1.animateChild()),
                                ]),
                            ]),
                        ],
                        template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                    }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], ContainerCmp);
                return ContainerCmp;
            }());
            var Page1Cmp = /** @class */ (function () {
                function Page1Cmp() {
                }
                Page1Cmp = __decorate([
                    core_1.Component({ selector: 'page1', template: "page1", animations: [] })
                ], Page1Cmp);
                return Page1Cmp;
            }());
            var Page2Cmp = /** @class */ (function () {
                function Page2Cmp() {
                    this.doAnimate = true;
                    this.exp = true;
                }
                __decorate([
                    core_1.HostBinding('@page2Animation'),
                    __metadata("design:type", Object)
                ], Page2Cmp.prototype, "doAnimate", void 0);
                Page2Cmp = __decorate([
                    core_1.Component({
                        selector: 'page2',
                        template: "\n          <h1>Page 2</h1>\n          <div *ngIf=\"exp\" class=\"if-one\" @ifAnimation></div>\n          <div *ngIf=\"exp\" class=\"if-two\" @ifAnimation></div>\n        ",
                        animations: [
                            animations_1.trigger('page2Animation', [
                                animations_1.transition(':enter', [animations_1.query('.if-one', animations_1.animateChild()), animations_1.query('.if-two', animations_1.animateChild())]),
                            ]),
                            animations_1.trigger('ifAnimation', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])
                        ]
                    })
                ], Page2Cmp);
                return Page2Cmp;
            }());
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: .5, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
        }));
        it('should allow inner leave animations to be emulated within a routed item', testing_2.fakeAsync(function () {
            var ContainerCmp = /** @class */ (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                ContainerCmp = __decorate([
                    core_1.Component({
                        animations: [
                            animations_1.trigger('routerAnimations', [
                                animations_1.transition('page1 => page2', [
                                    animations_1.query(':leave', animations_1.animateChild()),
                                ]),
                            ]),
                        ],
                        template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                    }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], ContainerCmp);
                return ContainerCmp;
            }());
            var Page1Cmp = /** @class */ (function () {
                function Page1Cmp() {
                    this.doAnimate = true;
                    this.exp = true;
                }
                __decorate([
                    core_1.HostBinding('@page1Animation'),
                    __metadata("design:type", Object)
                ], Page1Cmp.prototype, "doAnimate", void 0);
                Page1Cmp = __decorate([
                    core_1.Component({
                        selector: 'page1',
                        template: "\n          <h1>Page 1</h1>\n          <div *ngIf=\"exp\" class=\"if-one\" @ifAnimation></div>\n          <div *ngIf=\"exp\" class=\"if-two\" @ifAnimation></div>\n        ",
                        animations: [
                            animations_1.trigger('page1Animation', [
                                animations_1.transition(':leave', [animations_1.query('.if-one', animations_1.animateChild()), animations_1.query('.if-two', animations_1.animateChild())]),
                            ]),
                            animations_1.trigger('ifAnimation', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])]),
                        ]
                    })
                ], Page1Cmp);
                return Page1Cmp;
            }());
            var Page2Cmp = /** @class */ (function () {
                function Page2Cmp() {
                }
                Page2Cmp = __decorate([
                    core_1.Component({ selector: 'page2', template: "page2", animations: [] })
                ], Page2Cmp);
                return Page2Cmp;
            }());
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.keyframes).toEqual([
                { offset: 0, opacity: '1' },
                { offset: 1, opacity: '0' },
            ]);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '1' },
                { offset: .5, opacity: '1' },
                { offset: 1, opacity: '0' },
            ]);
        }));
        it('should properly collect :enter / :leave router nodes even when another non-router *template component is within the trigger boundaries', testing_2.fakeAsync(function () {
            var ContainerCmp = /** @class */ (function () {
                function ContainerCmp(router) {
                    this.router = router;
                    this.loading = false;
                }
                ContainerCmp.prototype.prepRoute = function (outlet) { return outlet.activatedRouteData['animation']; };
                ContainerCmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        animations: [
                            animations_1.trigger('pageAnimation', [
                                animations_1.transition('page1 => page2', [
                                    animations_1.query('.router-container :leave', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                                    animations_1.query('.router-container :enter', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                                ]),
                            ]),
                        ],
                        template: "\n          <div [@pageAnimation]=\"prepRoute(outlet)\">\n            <header>\n              <div class=\"inner\">\n                <div *ngIf=\"!loading\" class=\"title\">Page Ready</div>\n                <div *ngIf=\"loading\" class=\"loading\">loading...</div>\n              </div>\n            </header>\n            <section class=\"router-container\">\n              <router-outlet #outlet=\"outlet\"></router-outlet>\n            </section>\n          </div>\n        "
                    }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], ContainerCmp);
                return ContainerCmp;
            }());
            var Page1Cmp = /** @class */ (function () {
                function Page1Cmp() {
                }
                Page1Cmp = __decorate([
                    core_1.Component({ selector: 'page1', template: "page1" })
                ], Page1Cmp);
                return Page1Cmp;
            }());
            var Page2Cmp = /** @class */ (function () {
                function Page2Cmp() {
                }
                Page2Cmp = __decorate([
                    core_1.Component({ selector: 'page2', template: "page2" })
                ], Page2Cmp);
                return Page2Cmp;
            }());
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            cmp.loading = true;
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            cmp.loading = false;
            fixture.detectChanges();
            engine.flush();
            var players = engine.players;
            expect(players.length).toEqual(1);
            var p1 = players[0];
            var innerPlayers = p1.getRealPlayer().players;
            expect(innerPlayers.length).toEqual(2);
            var ip1 = innerPlayers[0], ip2 = innerPlayers[1];
            expect(ip1.element.innerText).toEqual('page1');
            expect(ip2.element.innerText).toEqual('page2');
        }));
        it('should allow a recursive set of :leave animations to occur for nested routes', testing_2.fakeAsync(function () {
            var ContainerCmp = /** @class */ (function () {
                function ContainerCmp(_router) {
                    this._router = _router;
                    this.log = [];
                }
                ContainerCmp.prototype.enter = function () { this._router.navigateByUrl('/(recur:recur/nested)'); };
                ContainerCmp.prototype.leave = function () { this._router.navigateByUrl('/'); };
                ContainerCmp = __decorate([
                    core_1.Component({ selector: 'ani-cmp', template: '<router-outlet name="recur"></router-outlet>' }),
                    __metadata("design:paramtypes", [router_1.Router])
                ], ContainerCmp);
                return ContainerCmp;
            }());
            var RecurPageCmp = /** @class */ (function () {
                function RecurPageCmp(container, route) {
                    var _this = this;
                    this.container = container;
                    this.route = route;
                    this.animatePage = true;
                    this.depth = 0;
                    this.route.data.subscribe(function (data) {
                        _this.container.log.push("DEPTH " + data.depth);
                        _this.depth = data.depth;
                    });
                }
                __decorate([
                    core_1.HostBinding('@pageAnimations'),
                    __metadata("design:type", Object)
                ], RecurPageCmp.prototype, "animatePage", void 0);
                __decorate([
                    core_1.HostBinding('attr.data-depth'),
                    __metadata("design:type", Object)
                ], RecurPageCmp.prototype, "depth", void 0);
                RecurPageCmp = __decorate([
                    core_1.Component({
                        selector: 'recur-page',
                        template: 'Depth: {{ depth }} \n <router-outlet></router-outlet>',
                        animations: [
                            animations_1.trigger('pageAnimations', [
                                animations_1.transition(':leave', [animations_1.group([
                                        animations_1.sequence([animations_1.style({ opacity: 1 }), animations_1.animate('1s', animations_1.style({ opacity: 0 }))]),
                                        animations_1.query('@*', animations_1.animateChild(), { optional: true })
                                    ])]),
                            ]),
                        ]
                    }),
                    __metadata("design:paramtypes", [ContainerCmp, router_1.ActivatedRoute])
                ], RecurPageCmp);
                return RecurPageCmp;
            }());
            testing_2.TestBed.configureTestingModule({
                declarations: [ContainerCmp, RecurPageCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([{
                            path: 'recur',
                            component: RecurPageCmp,
                            outlet: 'recur',
                            data: { depth: 0 },
                            children: [{ path: 'nested', component: RecurPageCmp, data: { depth: 1 } }]
                        }])]
            });
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.enter();
            testing_2.tick();
            fixture.detectChanges();
            testing_2.flushMicrotasks();
            expect(cmp.log).toEqual([
                'DEPTH 0',
                'DEPTH 1',
            ]);
            cmp.leave();
            testing_2.tick();
            fixture.detectChanges();
            var players = getLog();
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.element.getAttribute('data-depth')).toEqual('0');
            expect(p2.element.getAttribute('data-depth')).toEqual('1');
        }));
    });
});
function makeAnimationData(value, params) {
    if (params === void 0) { params = {}; }
    return { 'animation': { value: value, params: params } };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3JvdXRlcl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2FuaW1hdGlvbi9hbmltYXRpb25fcm91dGVyX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBNko7QUFDN0osdURBQThFO0FBQzlFLCtEQUE2RjtBQUM3RixzQ0FBcUQ7QUFDckQsaURBQWdGO0FBQ2hGLG1FQUE2RTtBQUM3RSwwQ0FBcUU7QUFDckUsbURBQTREO0FBRTVELENBQUM7SUFDQyxpRUFBaUU7SUFDakUsSUFBSSxNQUFNO1FBQUUsT0FBTztJQUVuQixRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakM7WUFDRSxPQUFPLDZCQUFtQixDQUFDLEdBQTRCLENBQUM7UUFDMUQsQ0FBQztRQUVELHNCQUFzQiw2QkFBbUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyRCxVQUFVLENBQUM7WUFDVCxRQUFRLEVBQUUsQ0FBQztZQUNYLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLDZCQUFtQixFQUFFLG9DQUF1QixDQUFDO2dCQUN2RCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZSxFQUFFLFFBQVEsRUFBRSw2QkFBbUIsRUFBQyxDQUFDO2FBQ3ZFLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLG1CQUFTLENBQUM7WUFvQnJFO2dCQUNFLHNCQUFtQixNQUFjO29CQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7Z0JBQUcsQ0FBQztnQkFFckMsNENBQXFCLEdBQXJCLFVBQXNCLENBQWU7b0JBQ25DLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FB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