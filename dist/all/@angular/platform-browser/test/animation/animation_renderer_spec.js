"use strict";
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
var testing_1 = require("@angular/core/testing");
var animations_2 = require("@angular/platform-browser/animations");
var dom_renderer_1 = require("@angular/platform-browser/src/dom/dom_renderer");
var providers_1 = require("../../animations/src/providers");
var browser_util_1 = require("../../testing/src/browser_util");
(function () {
    if (isNode)
        return;
    describe('AnimationRenderer', function () {
        var element;
        beforeEach(function () {
            element = browser_util_1.el('<div></div>');
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.ɵAnimationEngine, useClass: MockAnimationEngine }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        function makeRenderer(animationTriggers) {
            if (animationTriggers === void 0) { animationTriggers = []; }
            var type = {
                id: 'id',
                encapsulation: null,
                styles: [],
                data: { 'animation': animationTriggers }
            };
            return testing_1.TestBed.get(core_1.RendererFactory2)
                .createRenderer(element, type);
        }
        it('should hook into the engine\'s insert operations when appending children', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            renderer.appendChild(container, element);
            expect(engine.captures['onInsert'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s insert operations when inserting a child before another', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            var element2 = browser_util_1.el('<div></div>');
            container.appendChild(element2);
            renderer.insertBefore(container, element, element2);
            expect(engine.captures['onInsert'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s insert operations when removing children', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            renderer.removeChild(container, element);
            expect(engine.captures['onRemove'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s setProperty call if the property begins with `@`', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            renderer.setProperty(element, 'prop', 'value');
            expect(engine.captures['setProperty']).toBeFalsy();
            renderer.setProperty(element, '@prop', 'value');
            expect(engine.captures['setProperty'].pop()).toEqual([element, 'prop', 'value']);
        });
        describe('listen', function () {
            it('should hook into the engine\'s listen call if the property begins with `@`', function () {
                var renderer = makeRenderer();
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var cb = function (event) { return true; };
                renderer.listen(element, 'event', cb);
                expect(engine.captures['listen']).toBeFalsy();
                renderer.listen(element, '@event.phase', cb);
                expect(engine.captures['listen'].pop()).toEqual([element, 'event', 'phase']);
            });
            it('should resolve the body|document|window nodes given their values as strings as input', function () {
                var renderer = makeRenderer();
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var cb = function (event) { return true; };
                renderer.listen('body', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(document.body);
                renderer.listen('document', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(document);
                renderer.listen('window', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(window);
            });
        });
        describe('registering animations', function () {
            it('should only create a trigger definition once even if the registered multiple times');
        });
        describe('flushing animations', function () {
            // these tests are only mean't to be run within the DOM
            if (isNode)
                return;
            it('should flush and fire callbacks when the zone becomes stable', function (async) {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp.prototype.onStart = function (event) { this.event = event; };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: '<div [@myAnimation]="exp" (@myAnimation.start)="onStart($event)"></div>',
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => state', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'state';
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    expect(cmp.event.triggerName).toEqual('myAnimation');
                    expect(cmp.event.phaseName).toEqual('start');
                    cmp.event = null;
                    engine.flush();
                    expect(cmp.event).toBeFalsy();
                    async();
                });
            });
            it('should properly insert/remove nodes through the animation renderer that do not contain animations', function (async) {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('elm'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "element", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: '<div #elm *ngIf="exp"></div>',
                            animations: [animations_1.trigger('someAnimation', [animations_1.transition('* => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    cmp.exp = false;
                    var element = cmp.element;
                    expect(element.nativeElement.parentNode).toBeTruthy();
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        expect(element.nativeElement.parentNode).toBeFalsy();
                        async();
                    });
                });
            });
            it('should only queue up dom removals if the element itself contains a valid leave animation', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp1 = true;
                        this.exp2 = true;
                        this.exp3 = true;
                    }
                    __decorate([
                        core_1.ViewChild('elm1'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm1", void 0);
                    __decorate([
                        core_1.ViewChild('elm2'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm2", void 0);
                    __decorate([
                        core_1.ViewChild('elm3'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm3", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "\n               <div #elm1 *ngIf=\"exp1\"></div>\n               <div #elm2 @animation1 *ngIf=\"exp2\"></div>\n               <div #elm3 @animation2 *ngIf=\"exp3\"></div>\n            ",
                            animations: [
                                animations_1.trigger('animation1', [animations_1.transition('a => b', [])]),
                                animations_1.trigger('animation2', [animations_1.transition(':leave', [])]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                var elm1 = cmp.elm1;
                var elm2 = cmp.elm2;
                var elm3 = cmp.elm3;
                assertHasParent(elm1);
                assertHasParent(elm2);
                assertHasParent(elm3);
                engine.flush();
                finishPlayers(engine.players);
                cmp.exp1 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                cmp.exp2 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2, false);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                cmp.exp3 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2, false);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(1);
            });
        });
    });
    describe('AnimationRendererFactory', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{
                        provide: core_1.RendererFactory2,
                        useClass: ExtendedAnimationRendererFactory,
                        deps: [dom_renderer_1.DomRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
                    }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        it('should provide hooks at the start and end of change detection', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div> \n        ",
                        animations: [animations_1.trigger('myAnimation', [])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                declarations: [Cmp]
            });
            var renderer = testing_1.TestBed.get(core_1.RendererFactory2);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            renderer.log = [];
            fixture.detectChanges();
            expect(renderer.log).toEqual(['begin', 'end']);
            renderer.log = [];
            fixture.detectChanges();
            expect(renderer.log).toEqual(['begin', 'end']);
        });
    });
})();
var MockAnimationEngine = /** @class */ (function (_super) {
    __extends(MockAnimationEngine, _super);
    function MockAnimationEngine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.captures = {};
        _this.triggers = [];
        return _this;
    }
    MockAnimationEngine.prototype._capture = function (name, args) {
        var data = this.captures[name] = this.captures[name] || [];
        data.push(args);
    };
    MockAnimationEngine.prototype.registerTrigger = function (componentId, namespaceId, trigger) {
        this.triggers.push(trigger);
    };
    MockAnimationEngine.prototype.onInsert = function (namespaceId, element) { this._capture('onInsert', [element]); };
    MockAnimationEngine.prototype.onRemove = function (namespaceId, element, domFn) {
        this._capture('onRemove', [element]);
    };
    MockAnimationEngine.prototype.process = function (namespaceId, element, property, value) {
        this._capture('setProperty', [element, property, value]);
        return true;
    };
    MockAnimationEngine.prototype.listen = function (namespaceId, element, eventName, eventPhase, callback) {
        // we don't capture the callback here since the renderer wraps it in a zone
        this._capture('listen', [element, eventName, eventPhase]);
        return function () { };
    };
    MockAnimationEngine.prototype.flush = function () { };
    MockAnimationEngine.prototype.destroy = function (namespaceId) { };
    MockAnimationEngine = __decorate([
        core_1.Injectable()
    ], MockAnimationEngine);
    return MockAnimationEngine;
}(providers_1.InjectableAnimationEngine));
var ExtendedAnimationRendererFactory = /** @class */ (function (_super) {
    __extends(ExtendedAnimationRendererFactory, _super);
    function ExtendedAnimationRendererFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.log = [];
        return _this;
    }
    ExtendedAnimationRendererFactory.prototype.begin = function () {
        _super.prototype.begin.call(this);
        this.log.push('begin');
    };
    ExtendedAnimationRendererFactory.prototype.end = function () {
        _super.prototype.end.call(this);
        this.log.push('end');
    };
    ExtendedAnimationRendererFactory = __decorate([
        core_1.Injectable()
    ], ExtendedAnimationRendererFactory);
    return ExtendedAnimationRendererFactory;
}(animations_2.ɵAnimationRendererFactory));
function assertHasParent(element, yes) {
    if (yes === void 0) { yes = true; }
    var parent = element.nativeElement.parentNode;
    if (yes) {
        expect(parent).toBeTruthy();
    }
    else {
        expect(parent).toBeFalsy();
    }
}
function finishPlayers(players) {
    players.forEach(function (player) { return player.finish(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3JlbmRlcmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9yZW5kZXJlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILGtEQUEwSDtBQUMxSCx1REFBZ0Y7QUFDaEYsc0NBQXdHO0FBQ3hHLGlEQUE4QztBQUM5QyxtRUFBb0k7QUFDcEksK0VBQW1GO0FBQ25GLDREQUF5RTtBQUN6RSwrREFBa0Q7QUFFbEQsQ0FBQztJQUNDLElBQUksTUFBTTtRQUFFLE9BQU87SUFDbkIsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLElBQUksT0FBWSxDQUFDO1FBQ2pCLFVBQVUsQ0FBQztZQUNULE9BQU8sR0FBRyxpQkFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVCLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLDBCQUFlLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7Z0JBQ3RFLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsc0JBQXNCLGlCQUE2QjtZQUE3QixrQ0FBQSxFQUFBLHNCQUE2QjtZQUNqRCxJQUFNLElBQUksR0FBa0I7Z0JBQzFCLEVBQUUsRUFBRSxJQUFJO2dCQUNSLGFBQWEsRUFBRSxJQUFNO2dCQUNyQixNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUM7YUFDdkMsQ0FBQztZQUNGLE9BQVEsaUJBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQWdCLENBQThCO2lCQUM3RCxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxRQUFRLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDaEMsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQWUsQ0FBd0IsQ0FBQztZQUNuRSxJQUFNLFNBQVMsR0FBRyxpQkFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXBDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3RkFBd0YsRUFDeEY7WUFDRSxJQUFNLFFBQVEsR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUNoQyxJQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBZSxDQUF3QixDQUFDO1lBQ25FLElBQU0sU0FBUyxHQUFHLGlCQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDcEMsSUFBTSxRQUFRLEdBQUcsaUJBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFTixFQUFFLENBQUMseUVBQXlFLEVBQUU7WUFDNUUsSUFBTSxRQUFRLEdBQUcsWUFBWSxFQUFFLENBQUM7WUFDaEMsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQWUsQ0FBd0IsQ0FBQztZQUNuRSxJQUFNLFNBQVMsR0FBRyxpQkFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXBDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpRkFBaUYsRUFBRTtZQUNwRixJQUFNLFFBQVEsR0FBRyxZQUFZLEVBQUUsQ0FBQztZQUNoQyxJQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBZSxDQUF3QixDQUFDO1lBRW5FLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRW5ELFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDakIsRUFBRSxDQUFDLDRFQUE0RSxFQUFFO2dCQUMvRSxJQUFNLFFBQVEsR0FBRyxZQUFZLEVBQUUsQ0FBQztnQkFDaEMsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQWUsQ0FBd0IsQ0FBQztnQkFFbkUsSUFBTSxFQUFFLEdBQUcsVUFBQyxLQUFVLElBQWdCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyRCxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBRTlDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsc0ZBQXNGLEVBQ3RGO2dCQUNFLElBQU0sUUFBUSxHQUFHLFlBQVksRUFBRSxDQUFDO2dCQUNoQyxJQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBZSxDQUF3QixDQUFDO2dCQUVuRSxJQUFNLEVBQUUsR0FBRyxVQUFDLEtBQVUsSUFBZ0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXJELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUvRCxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUxRCxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7WUFDakMsRUFBRSxDQUFDLG9GQUFvRixDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsdURBQXVEO1lBQ3ZELElBQUksTUFBTTtnQkFBRSxPQUFPO1lBRW5CLEVBQUUsQ0FBQyw4REFBOEQsRUFBRSxVQUFDLEtBQUs7Z0JBVXZFO29CQUFBO29CQUlBLENBQUM7b0JBREMscUJBQU8sR0FBUCxVQUFRLEtBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBSHZDLEdBQUc7d0JBVFIsZ0JBQVMsQ0FBQzs0QkFDVCxRQUFRLEVBQUUsUUFBUTs0QkFDbEIsUUFBUSxFQUFFLHlFQUF5RTs0QkFDbkYsVUFBVSxFQUFFLENBQUMsb0JBQU8sQ0FDaEIsYUFBYSxFQUNiLENBQUMsdUJBQVUsQ0FDUCxZQUFZLEVBQ1osQ0FBQyxrQkFBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDN0UsQ0FBQzt1QkFDSSxHQUFHLENBSVI7b0JBQUQsVUFBQztpQkFBQSxBQUpELElBSUM7Z0JBRUQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsMEJBQWUsRUFBRSxRQUFRLEVBQUUscUNBQXlCLEVBQUMsQ0FBQztvQkFDNUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNwQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQWUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0MsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUN0QyxHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztnQkFDbEIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0MsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBRWpCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDZixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUM5QixLQUFLLEVBQUUsQ0FBQztnQkFDVixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1HQUFtRyxFQUNuRyxVQUFDLEtBQUs7Z0JBU0o7b0JBQUE7b0JBR0EsQ0FBQztvQkFEbUI7d0JBQWpCLGdCQUFTLENBQUMsS0FBSyxDQUFDOzt3REFBcUI7b0JBRmxDLEdBQUc7d0JBUlIsZ0JBQVMsQ0FBQzs0QkFDVCxRQUFRLEVBQUUsUUFBUTs0QkFDbEIsUUFBUSxFQUFFLDhCQUE4Qjs0QkFDeEMsVUFBVSxFQUFFLENBQUMsb0JBQU8sQ0FDaEIsZUFBZSxFQUNmLENBQUMsdUJBQVUsQ0FDUCxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDdkYsQ0FBQzt1QkFDSSxHQUFHLENBR1I7b0JBQUQsVUFBQztpQkFBQSxBQUhELElBR0M7Z0JBRUQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsMEJBQWUsRUFBRSxRQUFRLEVBQUUscUNBQXlCLEVBQUMsQ0FBQztvQkFDNUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNwQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUV4QixPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUN4QixHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztvQkFDaEIsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztvQkFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBRXRELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQzt3QkFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ3JELEtBQUssRUFBRSxDQUFDO29CQUNWLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMsMEZBQTBGLEVBQzFGO2dCQWFFO29CQVpBO3dCQWFFLFNBQUksR0FBUSxJQUFJLENBQUM7d0JBQ2pCLFNBQUksR0FBUSxJQUFJLENBQUM7d0JBQ2pCLFNBQUksR0FBUSxJQUFJLENBQUM7b0JBT25CLENBQUM7b0JBTG9CO3dCQUFsQixnQkFBUyxDQUFDLE1BQU0sQ0FBQzs7cURBQWtCO29CQUVqQjt3QkFBbEIsZ0JBQVMsQ0FBQyxNQUFNLENBQUM7O3FEQUFrQjtvQkFFakI7d0JBQWxCLGdCQUFTLENBQUMsTUFBTSxDQUFDOztxREFBa0I7b0JBVGhDLEdBQUc7d0JBWlIsZ0JBQVMsQ0FBQzs0QkFDVCxRQUFRLEVBQUUsUUFBUTs0QkFDbEIsUUFBUSxFQUFFLDJMQUlWOzRCQUNBLFVBQVUsRUFBRTtnQ0FDVixvQkFBTyxDQUFDLFlBQVksRUFBRSxDQUFDLHVCQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ2pELG9CQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs2QkFDbEQ7eUJBQ0YsQ0FBQzt1QkFDSSxHQUFHLENBVVI7b0JBQUQsVUFBQztpQkFBQSxBQVZELElBVUM7Z0JBRUQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsMEJBQWUsRUFBRSxRQUFRLEVBQUUscUNBQXlCLEVBQUMsQ0FBQztvQkFDNUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNwQixDQUFDLENBQUM7Z0JBRUgsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQWUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0MsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUV0QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUU5QixHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDakIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM3QixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RCLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFekMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0IsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0IsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDakIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM3QixlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM3QixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDUixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDO3dCQUNWLE9BQU8sRUFBRSx1QkFBZ0I7d0JBQ3pCLFFBQVEsRUFBRSxnQ0FBZ0M7d0JBQzFDLElBQUksRUFBRSxDQUFDLGtDQUFtQixFQUFFLDBCQUFlLEVBQUUsYUFBTSxDQUFDO3FCQUNyRCxDQUFDO2dCQUNGLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBUWxFO2dCQUFBO2dCQUVBLENBQUM7Z0JBRkssR0FBRztvQkFQUixnQkFBUyxDQUFDO3dCQUNULFFBQVEsRUFBRSxRQUFRO3dCQUNsQixRQUFRLEVBQUUsMkRBRVQ7d0JBQ0QsVUFBVSxFQUFFLENBQUMsb0JBQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ3pDLENBQUM7bUJBQ0ksR0FBRyxDQUVSO2dCQUFELFVBQUM7YUFBQSxBQUZELElBRUM7WUFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSwwQkFBZSxFQUFFLFFBQVEsRUFBRSxxQ0FBeUIsRUFBQyxDQUFDO2dCQUM1RSxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDcEIsQ0FBQyxDQUFDO1lBRUgsSUFBTSxRQUFRLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQWdCLENBQXFDLENBQUM7WUFDbkYsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0MsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1lBRXRDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRS9DLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBR0w7SUFBa0MsdUNBQXlCO0lBRDNEO1FBQUEscUVBb0NDO1FBbENDLGNBQVEsR0FBOEIsRUFBRSxDQUFDO1FBQ3pDLGNBQVEsR0FBK0IsRUFBRSxDQUFDOztJQWlDNUMsQ0FBQztJQS9CUyxzQ0FBUSxHQUFoQixVQUFpQixJQUFZLEVBQUUsSUFBVztRQUN4QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELDZDQUFlLEdBQWYsVUFBZ0IsV0FBbUIsRUFBRSxXQUFtQixFQUFFLE9BQWlDO1FBQ3pGLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxzQ0FBUSxHQUFSLFVBQVMsV0FBbUIsRUFBRSxPQUFZLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRixzQ0FBUSxHQUFSLFVBQVMsV0FBbUIsRUFBRSxPQUFZLEVBQUUsS0FBZ0I7UUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxxQ0FBTyxHQUFQLFVBQVEsV0FBbUIsRUFBRSxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFVO1FBQ3JFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELG9DQUFNLEdBQU4sVUFDSSxXQUFtQixFQUFFLE9BQVksRUFBRSxTQUFpQixFQUFFLFVBQWtCLEVBQ3hFLFFBQTZCO1FBQy9CLDJFQUEyRTtRQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRCxPQUFPLGNBQU8sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxtQ0FBSyxHQUFMLGNBQVMsQ0FBQztJQUVWLHFDQUFPLEdBQVAsVUFBUSxXQUFtQixJQUFHLENBQUM7SUFsQzNCLG1CQUFtQjtRQUR4QixpQkFBVSxFQUFFO09BQ1AsbUJBQW1CLENBbUN4QjtJQUFELDBCQUFDO0NBQUEsQUFuQ0QsQ0FBa0MscUNBQXlCLEdBbUMxRDtBQUdEO0lBQStDLG9EQUF3QjtJQUR2RTtRQUFBLHFFQWFDO1FBWFEsU0FBRyxHQUFhLEVBQUUsQ0FBQzs7SUFXNUIsQ0FBQztJQVRDLGdEQUFLLEdBQUw7UUFDRSxpQkFBTSxLQUFLLFdBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCw4Q0FBRyxHQUFIO1FBQ0UsaUJBQU0sR0FBRyxXQUFFLENBQUM7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBWEcsZ0NBQWdDO1FBRHJDLGlCQUFVLEVBQUU7T0FDUCxnQ0FBZ0MsQ0FZckM7SUFBRCx1Q0FBQztDQUFBLEFBWkQsQ0FBK0Msc0NBQXdCLEdBWXRFO0FBR0QseUJBQXlCLE9BQVksRUFBRSxHQUFtQjtJQUFuQixvQkFBQSxFQUFBLFVBQW1CO0lBQ3hELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hELElBQUksR0FBRyxFQUFFO1FBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQzdCO1NBQU07UUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDNUI7QUFDSCxDQUFDO0FBRUQsdUJBQXVCLE9BQTBCO0lBQy9DLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUM7QUFDN0MsQ0FBQyJ9