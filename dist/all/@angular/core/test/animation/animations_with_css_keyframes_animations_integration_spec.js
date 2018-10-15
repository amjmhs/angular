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
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var testing_1 = require("../../testing");
(function () {
    // these tests are only mean't to be run within the DOM (for now)
    // Buggy in Chromium 39, see https://github.com/angular/angular/issues/15793
    if (isNode)
        return;
    describe('animation integration tests using css keyframe animations', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵCssKeyframesDriver }],
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
                                animations_1.state('void', animations_1.style({ height: '0px' })),
                                animations_1.state('*', animations_1.style({ height: '*' })),
                                animations_1.transition('* => *', animations_1.animate(1000)),
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
            var player = getPlayer(engine);
            expect(player.keyframes).toEqual([{ height: '0px', offset: 0 }, { height: '100px', offset: 1 }]);
            player.finish();
            if (browser_util_1.browserDetection.isOldChrome)
                return;
            cmp.exp = false;
            fixture.detectChanges();
            player = getPlayer(engine);
            expect(player.keyframes).toEqual([{ height: '100px', offset: 0 }, { height: '0px', offset: 1 }]);
        });
        it('should cleanup all existing @keyframe <style> objects after the animation has finished', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.myAnimationExp = '';
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"myAnimationExp\">\n            <div>1</div>\n            <div>2</div>\n            <div>3</div>\n            <div>4</div>\n            <div>5</div>\n          </div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query('div', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 0 })),
                                    ]),
                                ]),
                            ])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.myAnimationExp = 'go';
            fixture.detectChanges();
            var webPlayer = getPlayer(engine);
            var players = webPlayer.players;
            expect(players.length).toEqual(5);
            var head = document.querySelector('head');
            var sheets = [];
            for (var i = 0; i < 5; i++) {
                var sheet = findStyleObjectWithKeyframes(i);
                expect(head.contains(sheet)).toBeTruthy();
                sheets.push(sheet);
            }
            cmp.myAnimationExp = 'go-back';
            fixture.detectChanges();
            for (var i = 0; i < 5; i++) {
                expect(head.contains(sheets[i])).toBeFalsy();
            }
        });
        it('should properly handle easing values that are apart of the sequence', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.myAnimationExp = '';
                }
                __decorate([
                    core_1.ViewChild('elm'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "element", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div #elm [@myAnimation]=\"myAnimationExp\"></div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => goSteps', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate('1s ease-out', animations_1.style({ opacity: 1 })),
                                ]),
                                animations_1.transition('* => goKeyframes', [
                                    animations_1.animate('1s cubic-bezier(0.5, 1, 0.5, 1)', animations_1.keyframes([
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.style({ opacity: 0.5 }),
                                        animations_1.style({ opacity: 1 }),
                                    ])),
                                ]),
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
            cmp.myAnimationExp = 'goSteps';
            fixture.detectChanges();
            var kfElm = findStyleObjectWithKeyframes();
            var _a = kfElm.sheet.cssRules[0].cssRules, r1 = _a[0], r2 = _a[1];
            assertEasing(r1, 'ease-out');
            assertEasing(r2, '');
            var element = cmp.element.nativeElement;
            var webPlayer = getPlayer(engine);
            cmp.myAnimationExp = 'goKeyframes';
            fixture.detectChanges();
            assertEasing(element, 'cubic-bezier(0.5,1,0.5,1)');
        });
        it('should restore existing style values once the animation completes', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.myAnimationExp = '';
                }
                __decorate([
                    core_1.ViewChild('elm'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "element", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div #elm [@myAnimation]=\"myAnimationExp\"></div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.state('go', animations_1.style({ width: '200px' })),
                                animations_1.transition('* => go', [
                                    animations_1.style({ height: '100px', width: '100px' }), animations_1.group([
                                        animations_1.animate('1s', animations_1.style({ height: '200px' })),
                                        animations_1.animate('1s', animations_1.style({ width: '200px' }))
                                    ])
                                ]),
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
            fixture.detectChanges();
            var element = cmp.element.nativeElement;
            element.style['width'] = '50px';
            element.style['height'] = '50px';
            assertStyle(element, 'width', '50px');
            assertStyle(element, 'height', '50px');
            cmp.myAnimationExp = 'go';
            fixture.detectChanges();
            var player = getPlayer(engine);
            assertStyle(element, 'width', '100px');
            assertStyle(element, 'height', '100px');
            player.finish();
            assertStyle(element, 'width', '200px');
            assertStyle(element, 'height', '50px');
        });
        it('should clean up 0 second animation styles (queried styles) that contain camel casing when complete', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.myAnimationExp = '';
                }
                __decorate([
                    core_1.ViewChild('elm'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "element", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div #elm [@myAnimation]=\"myAnimationExp\">\n            <div class=\"foo\"></div>\n            <div class=\"bar\"></div>\n          </div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.state('go', animations_1.style({ width: '200px' })),
                                animations_1.transition('* => go', [
                                    animations_1.query('.foo', [animations_1.style({ maxHeight: '0px' })]),
                                    animations_1.query('.bar', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate('1s', animations_1.style({ width: '100px' })),
                                    ]),
                                ]),
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
            var elm = cmp.element.nativeElement;
            var foo = elm.querySelector('.foo');
            cmp.myAnimationExp = 'go';
            fixture.detectChanges();
            expect(foo.style.getPropertyValue('max-height')).toEqual('0px');
            var player = engine.players.pop();
            player.finish();
            expect(foo.style.getPropertyValue('max-height')).toBeFalsy();
        });
    });
})();
function approximate(value, target) {
    return Math.abs(target - value) / value;
}
function getPlayer(engine, index) {
    if (index === void 0) { index = 0; }
    return engine.players[index].getRealPlayer();
}
function findStyleObjectWithKeyframes(index) {
    var sheetWithKeyframes = document.styleSheets[document.styleSheets.length - (index || 1)];
    var styleElms = Array.from(document.querySelectorAll('head style'));
    return styleElms.find(function (elm) { return elm.sheet == sheetWithKeyframes; }) || null;
}
function assertEasing(node, easing) {
    expect((node.style.animationTimingFunction || '').replace(/\s+/g, '')).toEqual(easing);
}
function assertStyle(node, prop, value) {
    expect(node.style[prop] || '').toEqual(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uc193aXRoX2Nzc19rZXlmcmFtZXNfYW5pbWF0aW9uc19pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2FuaW1hdGlvbi9hbmltYXRpb25zX3dpdGhfY3NzX2tleWZyYW1lc19hbmltYXRpb25zX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBd0c7QUFDeEcsdURBQXVMO0FBRXZMLHNDQUFtRDtBQUNuRCxtRUFBNkU7QUFDN0UsbUZBQW9GO0FBRXBGLHlDQUFzQztBQUV0QyxDQUFDO0lBQ0MsaUVBQWlFO0lBQ2pFLDRFQUE0RTtJQUM1RSxJQUFJLE1BQU07UUFBRSxPQUFPO0lBRW5CLFFBQVEsQ0FBQywyREFBMkQsRUFBRTtRQUVwRSxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZSxFQUFFLFFBQVEsRUFBRSw2QkFBa0IsRUFBQyxDQUFDO2dCQUNyRSxPQUFPLEVBQUUsQ0FBQyxvQ0FBdUIsQ0FBQzthQUNuQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQW9COUU7Z0JBbkJBO29CQW9CUyxRQUFHLEdBQVksS0FBSyxDQUFDO2dCQUM5QixDQUFDO2dCQUZLLEdBQUc7b0JBbkJSLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFNBQVM7d0JBQ25CLFFBQVEsRUFBRSxpVkFRVDt3QkFDRCxVQUFVLEVBQUUsQ0FBQyxvQkFBTyxDQUNoQixNQUFNLEVBQ047Z0NBQ0Usa0JBQUssQ0FBQyxNQUFNLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dDQUNy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