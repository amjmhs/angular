"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/animations/browser/testing");
var core_1 = require("../../src/core");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var index_2 = require("../../src/view/index");
var imported_renderer2_1 = require("./imported_renderer2");
var render_util_1 = require("./render_util");
describe('renderer factory lifecycle', function () {
    var logs = [];
    var rendererFactory = imported_renderer2_1.getRendererFactory2(render_util_1.document);
    var createRender = rendererFactory.createRenderer;
    rendererFactory.createRenderer = function (hostElement, type) {
        logs.push('create');
        return createRender.apply(rendererFactory, [hostElement, type]);
    };
    rendererFactory.begin = function () { return logs.push('begin'); };
    rendererFactory.end = function () { return logs.push('end'); };
    var SomeComponent = /** @class */ (function () {
        function SomeComponent() {
        }
        SomeComponent.ngComponentDef = index_1.defineComponent({
            type: SomeComponent,
            selectors: [['some-component']],
            template: function (rf, ctx) {
                logs.push('component');
                if (rf & 1 /* Create */) {
                    instructions_1.text(0, 'foo');
                }
            },
            factory: function () { return new SomeComponent; }
        });
        return SomeComponent;
    }());
    var SomeComponentWhichThrows = /** @class */ (function () {
        function SomeComponentWhichThrows() {
        }
        SomeComponentWhichThrows.ngComponentDef = index_1.defineComponent({
            type: SomeComponentWhichThrows,
            selectors: [['some-component-with-Error']],
            template: function (rf, ctx) {
                throw (new Error('SomeComponentWhichThrows threw'));
            },
            factory: function () { return new SomeComponentWhichThrows; }
        });
        return SomeComponentWhichThrows;
    }());
    function Template(rf, ctx) {
        logs.push('function');
        if (rf & 1 /* Create */) {
            instructions_1.text(0, 'bar');
        }
    }
    var directives = [SomeComponent, SomeComponentWhichThrows];
    function TemplateWithComponent(rf, ctx) {
        logs.push('function_with_component');
        if (rf & 1 /* Create */) {
            instructions_1.text(0, 'bar');
            instructions_1.elementStart(1, 'some-component');
            instructions_1.elementEnd();
        }
    }
    beforeEach(function () { logs = []; });
    it('should work with a component', function () {
        var component = render_util_1.renderComponent(SomeComponent, { rendererFactory: rendererFactory });
        expect(logs).toEqual(['create', 'create', 'begin', 'component', 'end']);
        logs = [];
        instructions_1.tick(component);
        expect(logs).toEqual(['begin', 'component', 'end']);
    });
    it('should work with a component which throws', function () {
        expect(function () { return render_util_1.renderComponent(SomeComponentWhichThrows, { rendererFactory: rendererFactory }); }).toThrow();
        expect(logs).toEqual(['create', 'create', 'begin', 'end']);
    });
    it('should work with a template', function () {
        render_util_1.renderToHtml(Template, {}, null, null, rendererFactory);
        expect(logs).toEqual(['create', 'begin', 'function', 'end']);
        logs = [];
        render_util_1.renderToHtml(Template, {});
        expect(logs).toEqual(['begin', 'function', 'end']);
    });
    it('should work with a template which contains a component', function () {
        render_util_1.renderToHtml(TemplateWithComponent, {}, directives, null, rendererFactory);
        expect(logs).toEqual(['create', 'begin', 'function_with_component', 'create', 'component', 'end']);
        logs = [];
        render_util_1.renderToHtml(TemplateWithComponent, {}, directives);
        expect(logs).toEqual(['begin', 'function_with_component', 'component', 'end']);
    });
});
describe('animation renderer factory', function () {
    var eventLogs = [];
    function getLog() {
        return testing_1.MockAnimationDriver.log;
    }
    function resetLog() { testing_1.MockAnimationDriver.log = []; }
    beforeEach(function () {
        eventLogs = [];
        resetLog();
    });
    var SomeComponent = /** @class */ (function () {
        function SomeComponent() {
        }
        SomeComponent.ngComponentDef = index_1.defineComponent({
            type: SomeComponent,
            selectors: [['some-component']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0, 'foo');
                }
            },
            factory: function () { return new SomeComponent; }
        });
        return SomeComponent;
    }());
    var SomeComponentWithAnimation = /** @class */ (function () {
        function SomeComponentWithAnimation() {
        }
        SomeComponentWithAnimation.prototype.callback = function (event) {
            eventLogs.push((event.fromState ? event.fromState : event.toState) + " - " + event.phaseName);
        };
        SomeComponentWithAnimation.ngComponentDef = index_1.defineComponent({
            type: SomeComponentWithAnimation,
            selectors: [['some-component']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div');
                    {
                        instructions_1.listener('@myAnimation.start', ctx.callback.bind(ctx));
                        instructions_1.listener('@myAnimation.done', ctx.callback.bind(ctx));
                        instructions_1.text(1, 'foo');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, '@myAnimation', instructions_1.bind(ctx.exp));
                }
            },
            factory: function () { return new SomeComponentWithAnimation; },
            rendererType: index_2.createRendererType2({
                encapsulation: core_1.ViewEncapsulation.None,
                styles: [],
                data: {
                    animation: [{
                            type: 7,
                            name: 'myAnimation',
                            definitions: [{
                                    type: 1,
                                    expr: '* => on',
                                    animation: [{ type: 4, styles: { type: 6, styles: { opacity: 1 }, offset: null }, timings: 10 }],
                                    options: null
                                }],
                            options: {}
                        }]
                }
            }),
        });
        return SomeComponentWithAnimation;
    }());
    it('should work with components without animations', function () {
        render_util_1.renderComponent(SomeComponent, { rendererFactory: imported_renderer2_1.getAnimationRendererFactory2(render_util_1.document) });
        expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('foo');
    });
    isBrowser && it('should work with animated components', function (done) {
        var rendererFactory = imported_renderer2_1.getAnimationRendererFactory2(render_util_1.document);
        var component = render_util_1.renderComponent(SomeComponentWithAnimation, { rendererFactory: rendererFactory });
        expect(render_util_1.toHtml(render_util_1.containerEl))
            .toMatch(/<div class="ng-tns-c\d+-0 ng-trigger ng-trigger-myAnimation">foo<\/div>/);
        component.exp = 'on';
        instructions_1.tick(component);
        var player = getLog()[0];
        expect(player.keyframes).toEqual([
            { opacity: '*', offset: 0 },
            { opacity: 1, offset: 1 },
        ]);
        player.finish();
        rendererFactory.whenRenderingDone().then(function () {
            expect(eventLogs).toEqual(['void - start', 'void - done', 'on - start', 'on - done']);
            done();
        });
    });
});
describe('Renderer2 destruction hooks', function () {
    var rendererFactory = imported_renderer2_1.getRendererFactory2(render_util_1.document);
    it('should call renderer.destroyNode for each node destroyed', function () {
        var condition = true;
        function createTemplate() {
            instructions_1.elementStart(0, 'div');
            {
                instructions_1.container(1);
            }
            instructions_1.elementEnd();
        }
        function updateTemplate() {
            instructions_1.containerRefreshStart(1);
            {
                if (condition) {
                    var rf1 = instructions_1.embeddedViewStart(1);
                    {
                        if (rf1 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'span');
                            instructions_1.elementEnd();
                            instructions_1.elementStart(1, 'span');
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'span');
                            instructions_1.elementEnd();
                        }
                    }
                    instructions_1.embeddedViewEnd();
                }
            }
            instructions_1.containerRefreshEnd();
        }
        var t = new render_util_1.TemplateFixture(createTemplate, updateTemplate, null, null, null, rendererFactory);
        expect(t.html).toEqual('<div><span></span><span></span><span></span></div>');
        condition = false;
        t.update();
        expect(t.html).toEqual('<div></div>');
        expect(ngDevMode).toHaveProperties({ rendererDestroy: 0, rendererDestroyNode: 3 });
    });
    it('should call renderer.destroy for each component destroyed', function () {
        var SimpleComponent = /** @class */ (function () {
            function SimpleComponent() {
            }
            SimpleComponent.ngComponentDef = index_1.defineComponent({
                type: SimpleComponent,
                selectors: [['simple']],
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementEnd();
                    }
                },
                factory: function () { return new SimpleComponent; },
            });
            return SimpleComponent;
        }());
        var condition = true;
        function createTemplate() {
            instructions_1.elementStart(0, 'div');
            {
                instructions_1.container(1);
            }
            instructions_1.elementEnd();
        }
        function updateTemplate() {
            instructions_1.containerRefreshStart(1);
            {
                if (condition) {
                    var rf1 = instructions_1.embeddedViewStart(1);
                    {
                        if (rf1 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'simple');
                            instructions_1.elementEnd();
                            instructions_1.elementStart(1, 'span');
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'simple');
                            instructions_1.elementEnd();
                        }
                    }
                    instructions_1.embeddedViewEnd();
                }
            }
            instructions_1.containerRefreshEnd();
        }
        var t = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [SimpleComponent], null, null, rendererFactory);
        expect(t.html).toEqual('<div><simple><span></span></simple><span></span><simple><span></span></simple></div>');
        condition = false;
        t.update();
        expect(t.html).toEqual('<div></div>');
        expect(ngDevMode).toHaveProperties({ rendererDestroy: 2, rendererDestroyNode: 3 });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXJfZmFjdG9yeV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvcmVuZGVyZXJfZmFjdG9yeV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsK0RBQTZGO0FBRTdGLHVDQUFnRTtBQUNoRSxpREFBdUU7QUFDdkUsK0RBQWdOO0FBRWhOLDhDQUF5RDtBQUV6RCwyREFBdUY7QUFDdkYsNkNBQTRHO0FBRTVHLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtJQUNyQyxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7SUFDeEIsSUFBSSxlQUFlLEdBQUcsd0NBQW1CLENBQUMsc0JBQVEsQ0FBQyxDQUFDO0lBQ3BELElBQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUM7SUFDcEQsZUFBZSxDQUFDLGNBQWMsR0FBRyxVQUFDLFdBQWdCLEVBQUUsSUFBMEI7UUFDNUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixPQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDO0lBQ0YsZUFBZSxDQUFDLEtBQUssR0FBRyxjQUFNLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQztJQUNqRCxlQUFlLENBQUMsR0FBRyxHQUFHLGNBQU0sT0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFoQixDQUFnQixDQUFDO0lBRTdDO1FBQUE7UUFZQSxDQUFDO1FBWFEsNEJBQWMsR0FBRyx1QkFBZSxDQUFDO1lBQ3RDLElBQUksRUFBRSxhQUFhO1lBQ25CLFNBQVMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUMvQixRQUFRLEVBQUUs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