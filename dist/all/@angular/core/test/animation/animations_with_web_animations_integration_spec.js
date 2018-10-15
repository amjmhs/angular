"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var testing_1 = require("../../testing");
(function () {
    // these tests are only mean't to be run within the DOM (for now)
    // Buggy in Chromium 39, see https://github.com/angular/angular/issues/15793
    if (isNode || !browser_1.ɵsupportsWebAnimations())
        return;
    describe('animation integration tests using web animations', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵWebAnimationsDriver }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        it('should compute (*) animation styles for a container that is being removed', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div @auto *ngIf=\"exp\">\n            <div style=\"line-height:20px;\">1</div>\n            <div style=\"line-height:20px;\">2</div>\n            <div style=\"line-height:20px;\">3</div>\n            <div style=\"line-height:20px;\">4</div>\n            <div style=\"line-height:20px;\">5</div>\n          </div>\n        ",
                        animations: [animations_1.trigger('auto', [
                                animations_1.state('void', animations_1.style({ height: '0px' })), animations_1.state('*', animations_1.style({ height: '*' })),
                                animations_1.transition('* => *', animations_1.animate(1000))
                            ])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            expect(engine.players.length).toEqual(1);
            var webPlayer = engine.players[0].getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
            ]);
            webPlayer.finish();
            if (!browser_util_1.browserDetection.isOldChrome) {
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(1);
                webPlayer = engine.players[0].getRealPlayer();
                expect(webPlayer.keyframes).toEqual([
                    { height: '100px', offset: 0 }, { height: '0px', offset: 1 }
                ]);
            }
        });
        it('should compute (!) animation styles for a container that is being inserted', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div @auto *ngIf=\"exp\">\n            <div style=\"line-height:20px;\">1</div>\n            <div style=\"line-height:20px;\">2</div>\n            <div style=\"line-height:20px;\">3</div>\n            <div style=\"line-height:20px;\">4</div>\n            <div style=\"line-height:20px;\">5</div>\n          </div>\n        ",
                        animations: [animations_1.trigger('auto', [animations_1.transition(':enter', [animations_1.style({ height: '!' }), animations_1.animate(1000, animations_1.style({ height: '120px' }))])])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            var webPlayer = engine.players[0].getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '100px', offset: 0 }, { height: '120px', offset: 1 }
            ]);
        });
        it('should compute pre (!) and post (*) animation styles with different dom states', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.items = [0, 1, 2, 3, 4];
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" #parent>\n              <div *ngFor=\"let item of items\" class=\"child\" style=\"line-height:20px\">\n                - {{ item }}\n              </div>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => *', [animations_1.style({ height: '!' }), animations_1.animate(1000, animations_1.style({ height: '*' }))])])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 1;
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            var player = engine.players[0];
            var webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
            ]);
            // we destroy the player because since it has started and is
            // at 0ms duration a height value of `0px` will be extracted
            // from the element and passed into the follow-up animation.
            player.destroy();
            cmp.exp = 2;
            cmp.items = [0, 1, 2, 6];
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            player = engine.players[0];
            webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '100px', offset: 0 }, { height: '80px', offset: 1 }
            ]);
        });
        it('should treat * styles as ! when a removal animation is being rendered', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                Cmp.prototype.toggle = function () { this.exp = !this.exp; };
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        styles: ["\n            .box {\n              width: 500px;\n              overflow:hidden;\n              background:orange;\n              line-height:300px;\n              font-size:100px;\n              text-align:center;\n            }\n          "],
                        template: "\n            <button (click)=\"toggle()\">Open / Close</button>\n            <hr />\n            <div *ngIf=\"exp\" @slide class=\"box\">\n            ...\n            </div>\n          ",
                        animations: [animations_1.trigger('slide', [
                                animations_1.state('void', animations_1.style({ height: '0px' })),
                                animations_1.state('*', animations_1.style({ height: '*' })),
                                animations_1.transition('* => *', animations_1.animate('500ms')),
                            ])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            var player = engine.players[0];
            var webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '0px', offset: 0 },
                { height: '300px', offset: 1 },
            ]);
            player.finish();
            cmp.exp = false;
            fixture.detectChanges();
            player = engine.players[0];
            webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '300px', offset: 0 },
                { height: '0px', offset: 1 },
            ]);
        });
        it('should treat * styles as ! for queried items that are collected in a container that is being removed', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.items = [];
                }
                Object.defineProperty(Cmp.prototype, "exp", {
                    get: function () { return this.items.length ? 'full' : 'empty'; },
                    enumerable: true,
                    configurable: true
                });
                Cmp.prototype.empty = function () { this.items = []; };
                Cmp.prototype.full = function () { this.items = [0, 1, 2, 3, 4]; };
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        styles: ["\n              .list .outer {\n                overflow:hidden;\n              }\n              .list .inner {\n                line-height:50px;\n              }\n            "],
                        template: "\n              <button (click)=\"empty()\">Empty</button>\n              <button (click)=\"middle()\">Middle</button>\n              <button (click)=\"full()\">Full</button>\n              <hr />\n              <div [@list]=\"exp\" class=\"list\">\n                <div *ngFor=\"let item of items\" class=\"outer\">\n                  <div class=\"inner\">\n                    {{ item }}\n                  </div>\n                </div>\n              </div>\n            ",
                        animations: [
                            animations_1.trigger('list', [
                                animations_1.transition(':enter', []),
                                animations_1.transition('* => empty', [
                                    animations_1.query(':leave', [
                                        animations_1.animate(500, animations_1.style({ height: '0px' }))
                                    ])
                                ]),
                                animations_1.transition('* => full', [
                                    animations_1.query(':enter', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(500, animations_1.style({ height: '*' }))
                                    ])
                                ]),
                            ])
                        ]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.empty();
            fixture.detectChanges();
            var player = engine.players[0];
            player.finish();
            cmp.full();
            fixture.detectChanges();
            player = engine.players[0];
            var queriedPlayers = player.getRealPlayer().players;
            expect(queriedPlayers.length).toEqual(5);
            var i = 0;
            for (i = 0; i < queriedPlayers.length; i++) {
                var player_1 = queriedPlayers[i];
                expect(player_1.keyframes).toEqual([
                    { height: '0px', offset: 0 },
                    { height: '50px', offset: 1 },
                ]);
                player_1.finish();
            }
            cmp.empty();
            fixture.detectChanges();
            player = engine.players[0];
            queriedPlayers = player.getRealPlayer().players;
            expect(queriedPlayers.length).toEqual(5);
            for (i = 0; i < queriedPlayers.length; i++) {
                var player_2 = queriedPlayers[i];
                expect(player_2.keyframes).toEqual([
                    { height: '50px', offset: 0 },
                    { height: '0px', offset: 1 },
                ]);
            }
        });
        it('should compute intermediate styles properly when an animation is cancelled', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\">...</div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => a', [
                                    animations_1.style({ width: 0, height: 0 }),
                                    animations_1.animate('1s', animations_1.style({ width: '300px', height: '600px' })),
                                ]),
                                animations_1.transition('* => b', [animations_1.animate('1s', animations_1.style({ opacity: 0 }))]),
                            ]),
                        ]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'a';
            fixture.detectChanges();
            var player = engine.players[0];
            var webPlayer = player.getRealPlayer();
            webPlayer.setPosition(0.5);
            cmp.exp = 'b';
            fixture.detectChanges();
            player = engine.players[0];
            webPlayer = player.getRealPlayer();
            expect(approximate(parseFloat(webPlayer.keyframes[0]['width']), 150))
                .toBeLessThan(0.05);
            expect(approximate(parseFloat(webPlayer.keyframes[0]['height']), 300))
                .toBeLessThan(0.05);
        });
        it('should compute intermediate styles properly for multiple queried elements when an animation is cancelled', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.items = [];
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"target\"></div>\n          </div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => full', [animations_1.query('.target', [
                                        animations_1.style({ width: 0, height: 0 }),
                                        animations_1.animate('1s', animations_1.style({ width: '500px', height: '1000px' })),
                                    ])]),
                                animations_1.transition('* => empty', [animations_1.query('.target', [animations_1.animate('1s', animations_1.style({ opacity: 0 }))])]),
                            ]),
                        ]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'full';
            cmp.items = [0, 1, 2, 3, 4];
            fixture.detectChanges();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(5);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                p.setPosition(0.5);
            }
            cmp.exp = 'empty';
            cmp.items = [];
            fixture.detectChanges();
            player = engine.players[0];
            groupPlayer = player.getRealPlayer();
            players = groupPlayer.players;
            expect(players.length).toEqual(5);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                expect(approximate(parseFloat(p.keyframes[0]['width']), 250))
                    .toBeLessThan(0.05);
                expect(approximate(parseFloat(p.keyframes[0]['height']), 500))
                    .toBeLessThan(0.05);
            }
        });
    });
})();
function approximate(value, target) {
    return Math.abs(target - value) / value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uc193aXRoX3dlYl9hbmltYXRpb25zX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbnNfd2l0aF93ZWJfYW5pbWF0aW9uc19pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQTZGO0FBQzdGLHVEQUFrSjtBQUdsSixzQ0FBd0M7QUFDeEMsbUVBQTZFO0FBQzdFLG1GQUFvRjtBQUVwRix5Q0FBc0M7QUFFdEMsQ0FBQztJQUNDLGlFQUFpRTtJQUNqRSw0RUFBNEU7SUFDNUUsSUFBSSxNQUFNLElBQUksQ0FBQyxnQ0FBc0IsRUFBRTtRQUFFLE9BQU87SUFFaEQsUUFBUSxDQUFDLGtEQUFrRCxFQUFFO1FBRTNELFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDhCQUFvQixFQUFDLENBQUM7Z0JBQ3ZFLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBbUI5RTtnQkFsQkE7b0JBbUJTLFFBQUcsR0FBWSxLQUFLLENBQUM7Z0JBQzlCLENBQUM7Z0JBRkssR0FBRztvQkFsQlIsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsU0FBUzt3QkFDbkIsUUFBUSxFQUFFLGlWQVFUO3dCQUNELFVBQVUsRUFBRSxDQUFDLG9CQUFPLENBQ2hCLE1BQU0sRUFDTjtnQ0FDRSxrQkFBSyxDQUFDLE1BQU0sRUFBRSxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBRSxr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