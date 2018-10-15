"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../../src/render3/di");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var query_1 = require("../../src/render3/query");
var common_with_def_1 = require("./common_with_def");
var render_util_1 = require("./render_util");
/**
 * Helper function to check if a given candidate object resembles ElementRef
 * @param candidate
 * @returns true if `ElementRef`.
 */
function isElementRef(candidate) {
    return candidate.nativeElement != null;
}
/**
 * Helper function to check if a given candidate object resembles TemplateRef
 * @param candidate
 * @returns true if `TemplateRef`.
 */
function isTemplateRef(candidate) {
    return candidate.createEmbeddedView != null && candidate.createComponent == null;
}
/**
 * Helper function to check if a given candidate object resembles ViewContainerRef
 * @param candidate
 * @returns true if `ViewContainerRef`.
 */
function isViewContainerRef(candidate) {
    return candidate.createEmbeddedView != null && candidate.createComponent != null;
}
describe('query', function () {
    it('should project query children', function () {
        var Child = render_util_1.createComponent('child', function (rf, ctx) { });
        var child1 = null;
        var child2 = null;
        var Cmp = render_util_1.createComponent('cmp', function (rf, ctx) {
            /**
             * <child>
             *   <child>
             *   </child>
             * </child>
             * class Cmp {
             *   @ViewChildren(Child) query0;
             *   @ViewChildren(Child, {descend: true}) query1;
             * }
             */
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(2, 'child');
                {
                    instructions_1.element(3, 'child');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                child1 = instructions_1.loadDirective(0);
                child2 = instructions_1.loadDirective(1);
            }
        }, [Child], [], function (rf, ctx) {
            if (rf & 1 /* Create */) {
                query_1.query(0, Child, false);
                query_1.query(1, Child, true);
            }
            if (rf & 2 /* Update */) {
                var tmp = void 0;
                query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query0 = tmp);
                query_1.queryRefresh(tmp = instructions_1.load(1)) && (ctx.query1 = tmp);
            }
        });
        var parent = render_util_1.renderComponent(Cmp);
        expect(parent.query0.toArray()).toEqual([child1]);
        expect(parent.query1.toArray()).toEqual([child1, child2]);
    });
    describe('predicate', function () {
        describe('types', function () {
            it('should query using type predicate and read a specified token', function () {
                var Child = render_util_1.createDirective('child');
                var elToQuery;
                /**
                 * <div child></div>
                 * class Cmpt {
                 *  @ViewChildren(Child, {read: ElementRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        elToQuery = instructions_1.elementStart(1, 'div', ['child', '']);
                        instructions_1.elementEnd();
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, Child, false, di_1.QUERY_READ_ELEMENT_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isElementRef(qList.first)).toBeTruthy();
                expect(qList.first.nativeElement).toBe(elToQuery);
            });
            it('should query using type predicate and read another directive type', function () {
                var Child = render_util_1.createDirective('child');
                var OtherChild = render_util_1.createDirective('otherChild');
                var otherChildInstance;
                /**
                 * <div child otherChild></div>
                 * class Cmpt {
                 *  @ViewChildren(Child, {read: OtherChild}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(1, 'div', ['child', '', 'otherChild', '']);
                        {
                            otherChildInstance = instructions_1.loadDirective(1);
                        }
                        instructions_1.elementEnd();
                    }
                }, [Child, OtherChild], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, Child, false, OtherChild);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first).toBe(otherChildInstance);
            });
            it('should not add results to query if a requested token cant be read', function () {
                var Child = render_util_1.createDirective('child');
                var OtherChild = render_util_1.createDirective('otherChild');
                /**
                 * <div child></div>
                 * class Cmpt {
                 *  @ViewChildren(Child, {read: OtherChild}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(1, 'div', ['child', '']);
                        instructions_1.elementEnd();
                    }
                }, [Child, OtherChild], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, Child, false, OtherChild);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(0);
            });
        });
        describe('local names', function () {
            it('should query for a single element and read ElementRef by default', function () {
                var elToQuery;
                /**
                 * <div #foo></div>
                 * <div></div>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        elToQuery = instructions_1.elementStart(1, 'div', null, ['foo', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'div');
                        instructions_1.elementEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement).toEqual(elToQuery);
            });
            it('should query multiple locals on the same element', function () {
                var elToQuery;
                /**
                 * <div #foo #bar></div>
                 * <div></div>
                 * class Cmpt {
                 *  @ViewChildren('foo') fooQuery;
                 *  @ViewChildren('bar') barQuery;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        elToQuery = instructions_1.elementStart(2, 'div', null, ['foo', '', 'bar', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementStart(5, 'div');
                        instructions_1.elementEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_FROM_NODE);
                        query_1.query(1, ['bar'], false, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.fooQuery = tmp);
                        query_1.queryRefresh(tmp = instructions_1.load(1)) &&
                            (ctx.barQuery = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var fooList = cmptInstance.fooQuery;
                expect(fooList.length).toBe(1);
                expect(fooList.first.nativeElement).toEqual(elToQuery);
                var barList = cmptInstance.barQuery;
                expect(barList.length).toBe(1);
                expect(barList.first.nativeElement).toEqual(elToQuery);
            });
            it('should query for multiple elements and read ElementRef by default', function () {
                var el1ToQuery;
                var el2ToQuery;
                /**
                 * <div #foo></div>
                 * <div></div>
                 * <div #bar></div>
                 * class Cmpt {
                 *  @ViewChildren('foo,bar') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        el1ToQuery = instructions_1.elementStart(1, 'div', null, ['foo', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'div');
                        instructions_1.elementEnd();
                        el2ToQuery = instructions_1.elementStart(4, 'div', null, ['bar', '']);
                        instructions_1.elementEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo', 'bar'], undefined, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toEqual(el1ToQuery);
                expect(qList.last.nativeElement).toEqual(el2ToQuery);
            });
            it('should read ElementRef from an element when explicitly asked for', function () {
                var elToQuery;
                /**
                 * <div #foo></div>
                 * <div></div>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: ElementRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        elToQuery = instructions_1.elementStart(1, 'div', null, ['foo', '']);
                        instructions_1.elementEnd();
                        instructions_1.element(3, 'div');
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_ELEMENT_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isElementRef(qList.first)).toBeTruthy();
                expect(qList.first.nativeElement).toEqual(elToQuery);
            });
            it('should read ViewContainerRef from element nodes when explicitly asked for', function () {
                /**
                 * <div #foo></div>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: ViewContainerRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'div', null, ['foo', '']);
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_CONTAINER_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isViewContainerRef(qList.first)).toBeTruthy();
            });
            it('should read ViewContainerRef from container nodes when explicitly asked for', function () {
                /**
                 * <ng-template #foo></ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: ViewContainerRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, undefined, undefined, undefined, ['foo', '']);
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_CONTAINER_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isViewContainerRef(qList.first)).toBeTruthy();
            });
            it('should read ElementRef with a native element pointing to comment DOM node from containers', function () {
                /**
                 * <ng-template #foo></ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: ElementRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, undefined, undefined, undefined, ['foo', '']);
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_ELEMENT_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isElementRef(qList.first)).toBeTruthy();
                expect(qList.first.nativeElement.nodeType).toBe(8); // Node.COMMENT_NODE = 8
            });
            it('should read TemplateRef from container nodes by default', function () {
                // http://plnkr.co/edit/BVpORly8wped9I3xUYsX?p=preview
                /**
                 * <ng-template #foo></ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, undefined, undefined, undefined, ['foo', '']);
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], undefined, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isTemplateRef(qList.first)).toBeTruthy();
            });
            it('should read TemplateRef from container nodes when explicitly asked for', function () {
                /**
                 * <ng-template #foo></ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: TemplateRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, undefined, undefined, undefined, ['foo', '']);
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, di_1.QUERY_READ_TEMPLATE_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(isTemplateRef(qList.first)).toBeTruthy();
            });
            it('should read component instance if element queried for is a component host', function () {
                var Child = render_util_1.createComponent('child', function (rf, ctx) { });
                var childInstance;
                /**
                 * <child #foo></child>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'child', null, ['foo', '']);
                    }
                    if (rf & 2 /* Update */) {
                        childInstance = instructions_1.loadDirective(0);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first).toBe(childInstance);
            });
            it('should read component instance with explicit exportAs', function () {
                var childInstance;
                var Child = /** @class */ (function () {
                    function Child() {
                    }
                    Child.ngComponentDef = index_1.defineComponent({
                        type: Child,
                        selectors: [['child']],
                        factory: function () { return childInstance = new Child(); },
                        template: function (rf, ctx) { },
                        exportAs: 'child'
                    });
                    return Child;
                }());
                /**
                 * <child #foo="child"></child>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'child', null, ['foo', 'child']);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first).toBe(childInstance);
            });
            it('should read directive instance if element queried for has an exported directive with a matching name', function () {
                var Child = render_util_1.createDirective('child', { exportAs: 'child' });
                var childInstance;
                /**
                 * <div #foo="child" child></div>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'div', ['child', ''], ['foo', 'child']);
                    }
                    if (rf & 2 /* Update */) {
                        childInstance = instructions_1.loadDirective(0);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first).toBe(childInstance);
            });
            it('should read all matching directive instances from a given element', function () {
                var Child1 = render_util_1.createDirective('child1', { exportAs: 'child1' });
                var Child2 = render_util_1.createDirective('child2', { exportAs: 'child2' });
                var child1Instance, child2Instance;
                /**
                 * <div #foo="child1" child1 #bar="child2" child2></div>
                 * class Cmpt {
                 *  @ViewChildren('foo, bar') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'div', ['child1', '', 'child2', ''], ['foo', 'child1', 'bar', 'child2']);
                    }
                    if (rf & 2 /* Update */) {
                        child1Instance = instructions_1.loadDirective(0);
                        child2Instance = instructions_1.loadDirective(1);
                    }
                }, [Child1, Child2], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo', 'bar'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(2);
                expect(qList.first).toBe(child1Instance);
                expect(qList.last).toBe(child2Instance);
            });
            it('should read multiple locals exporting the same directive from a given element', function () {
                var Child = render_util_1.createDirective('child', { exportAs: 'child' });
                var childInstance;
                /**
                 * <div child #foo="child" #bar="child"></div>
                 * class Cmpt {
                 *  @ViewChildren('foo') fooQuery;
                 *  @ViewChildren('bar') barQuery;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(2, 'div', ['child', ''], ['foo', 'child', 'bar', 'child']);
                    }
                    if (rf & 2 /* Update */) {
                        childInstance = instructions_1.loadDirective(0);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                        query_1.query(1, ['bar'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.fooQuery = tmp);
                        query_1.queryRefresh(tmp = instructions_1.load(1)) &&
                            (ctx.barQuery = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var fooList = cmptInstance.fooQuery;
                expect(fooList.length).toBe(1);
                expect(fooList.first).toBe(childInstance);
                var barList = cmptInstance.barQuery;
                expect(barList.length).toBe(1);
                expect(barList.first).toBe(childInstance);
            });
            it('should match on exported directive name and read a requested token', function () {
                var Child = render_util_1.createDirective('child', { exportAs: 'child' });
                var div;
                /**
                 * <div #foo="child" child></div>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: ElementRef}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        div = instructions_1.elementStart(1, 'div', ['child', ''], ['foo', 'child']);
                        instructions_1.elementEnd();
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], undefined, di_1.QUERY_READ_ELEMENT_REF);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement).toBe(div);
            });
            it('should support reading a mix of ElementRef and directive instances', function () {
                var Child = render_util_1.createDirective('child', { exportAs: 'child' });
                var childInstance, div;
                /**
                 * <div #foo #bar="child" child></div>
                 * class Cmpt {
                 *  @ViewChildren('foo, bar') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        div = instructions_1.elementStart(1, 'div', ['child', ''], ['foo', '', 'bar', 'child']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        childInstance = instructions_1.loadDirective(0);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo', 'bar'], undefined, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toBe(div);
                expect(qList.last).toBe(childInstance);
            });
            it('should not add results to query if a requested token cant be read', function () {
                var Child = render_util_1.createDirective('child');
                /**
                 * <div #foo></div>
                 * class Cmpt {
                 *  @ViewChildren('foo', {read: Child}) query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(1, 'div', ['foo', '']);
                    }
                }, [Child], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], false, Child);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(0);
            });
        });
    });
    describe('view boundaries', function () {
        describe('ViewContainerRef', function () {
            var directiveInstances = [];
            var ViewContainerManipulatorDirective = /** @class */ (function () {
                function ViewContainerManipulatorDirective(_vcRef) {
                    this._vcRef = _vcRef;
                }
                ViewContainerManipulatorDirective.prototype.insertTpl = function (tpl, ctx, idx) {
                    this._vcRef.createEmbeddedView(tpl, ctx, idx);
                };
                ViewContainerManipulatorDirective.prototype.remove = function (index) { this._vcRef.remove(index); };
                ViewContainerManipulatorDirective.ngDirectiveDef = index_1.defineDirective({
                    type: ViewContainerManipulatorDirective,
                    selectors: [['', 'vc', '']],
                    factory: function () {
                        var directiveInstance = new ViewContainerManipulatorDirective(index_1.injectViewContainerRef());
                        directiveInstances.push(directiveInstance);
                        return directiveInstance;
                    }
                });
                return ViewContainerManipulatorDirective;
            }());
            beforeEach(function () { directiveInstances = []; });
            it('should report results in views inserted / removed by ngIf', function () {
                /**
                 * <ng-template [ngIf]="value">
                 *    <div #foo></div>
                 * </ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, function (rf1, ctx1) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                instructions_1.elementEnd();
                            }
                        }, null, ['ngIf', '']);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(1, 'ngIf', instructions_1.bind(ctx.value));
                    }
                }, [common_with_def_1.NgIf], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var fixture = new render_util_1.ComponentFixture(Cmpt);
                var qList = fixture.component.query;
                expect(qList.length).toBe(0);
                fixture.component.value = true;
                fixture.update();
                expect(qList.length).toBe(1);
                fixture.component.value = false;
                fixture.update();
                expect(qList.length).toBe(0);
            });
            it('should report results in views inserted / removed by ngFor', function () {
                /**
                 * <ng-template ngFor let-item [ngForOf]="value">
                 *    <div #foo [id]="item"></div>
                 * </ng-template>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = /** @class */ (function () {
                    function Cmpt() {
                    }
                    Cmpt.ngComponentDef = index_1.defineComponent({
                        type: Cmpt,
                        factory: function () { return new Cmpt(); },
                        selectors: [['my-app']],
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.container(1, function (rf1, row) {
                                    if (rf1 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                    if (rf1 & 2 /* Update */) {
                                        instructions_1.elementProperty(0, 'id', instructions_1.bind(row.$implicit));
                                    }
                                }, null, ['ngForOf', '']);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(ctx.value));
                            }
                        },
                        viewQuery: function (rf, ctx) {
                            var tmp;
                            if (rf & 1 /* Create */) {
                                query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                            }
                            if (rf & 2 /* Update */) {
                                query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                            }
                        },
                        directives: function () { return [common_with_def_1.NgForOf]; }
                    });
                    return Cmpt;
                }());
                var fixture = new render_util_1.ComponentFixture(Cmpt);
                var qList = fixture.component.query;
                expect(qList.length).toBe(0);
                fixture.component.value = ['a', 'b', 'c'];
                fixture.update();
                expect(qList.length).toBe(3);
                fixture.component.value.splice(1, 1); // remove "b"
                fixture.update();
                expect(qList.length).toBe(2);
                // make sure that a proper element was removed from query results
                expect(qList.first.nativeElement.id).toBe('a');
                expect(qList.last.nativeElement.id).toBe('c');
            });
            // https://stackblitz.com/edit/angular-rrmmuf?file=src/app/app.component.ts
            it('should report results when different instances of TemplateRef are inserted into one ViewContainerRefs', function () {
                var tpl1;
                var tpl2;
                /**
                 * <ng-template #tpl1 let-idx="idx">
                 *   <div #foo [id]="'foo1_'+idx"></div>
                 * </ng-template>
                 *
                 * <div #foo id="middle"></div>
                 *
                 * <ng-template #tpl2 let-idx="idx">
                 *   <div #foo [id]="'foo2_'+idx"></div>
                 * </ng-template>
                 *
                 * <ng-template viewInserter #vi="vi"></ng-template>
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1, function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'id', instructions_1.bind('foo1_' + ctx.idx));
                            }
                        }, null, []);
                        instructions_1.elementStart(2, 'div', ['id', 'middle'], ['foo', '']);
                        instructions_1.elementEnd();
                        instructions_1.container(4, function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'id', instructions_1.bind('foo2_' + ctx.idx));
                            }
                        }, null, []);
                        instructions_1.container(5, undefined, null, [1 /* SelectOnly */, 'vc']);
                    }
                    if (rf & 2 /* Update */) {
                        tpl1 = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(1)));
                        tpl2 = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(4)));
                    }
                }, [ViewContainerManipulatorDirective], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.query = tmp);
                    }
                });
                var fixture = new render_util_1.ComponentFixture(Cmpt);
                var qList = fixture.component.query;
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement.getAttribute('id')).toBe('middle');
                directiveInstances[0].insertTpl(tpl1, { idx: 0 }, 0);
                directiveInstances[0].insertTpl(tpl2, { idx: 1 }, 1);
                fixture.update();
                expect(qList.length).toBe(3);
                var qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo1_0');
                expect(qListArr[1].nativeElement.getAttribute('id')).toBe('middle');
                expect(qListArr[2].nativeElement.getAttribute('id')).toBe('foo2_1');
                directiveInstances[0].insertTpl(tpl1, { idx: 1 }, 1);
                fixture.update();
                expect(qList.length).toBe(4);
                qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo1_0');
                expect(qListArr[1].nativeElement.getAttribute('id')).toBe('foo1_1');
                expect(qListArr[2].nativeElement.getAttribute('id')).toBe('middle');
                expect(qListArr[3].nativeElement.getAttribute('id')).toBe('foo2_1');
                directiveInstances[0].remove(1);
                fixture.update();
                expect(qList.length).toBe(3);
                qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo1_0');
                expect(qListArr[1].nativeElement.getAttribute('id')).toBe('middle');
                expect(qListArr[2].nativeElement.getAttribute('id')).toBe('foo2_1');
                directiveInstances[0].remove(1);
                fixture.update();
                expect(qList.length).toBe(2);
                qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo1_0');
                expect(qListArr[1].nativeElement.getAttribute('id')).toBe('middle');
            });
            // https://stackblitz.com/edit/angular-7vvo9j?file=src%2Fapp%2Fapp.component.ts
            it('should report results when the same TemplateRef is inserted into different ViewContainerRefs', function () {
                var tpl;
                /**
                 * <ng-template #tpl let-idx="idx" let-container_idx="container_idx">
                 *   <div #foo [id]="'foo_'+container_idx+'_'+idx"></div>
                 * </ng-template>
                 *
                 * <ng-template viewInserter #vi1="vi"></ng-template>
                 * <ng-template viewInserter #vi2="vi"></ng-template>
                 */
                var Cmpt = /** @class */ (function () {
                    function Cmpt() {
                    }
                    Cmpt.ngComponentDef = index_1.defineComponent({
                        type: Cmpt,
                        factory: function () { return new Cmpt(); },
                        selectors: [['my-app']],
                        template: function (rf, ctx) {
                            var tmp;
                            if (rf & 1 /* Create */) {
                                instructions_1.container(1, function (rf, ctx) {
                                    if (rf & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                    if (rf & 2 /* Update */) {
                                        instructions_1.elementProperty(0, 'id', instructions_1.bind('foo_' + ctx.container_idx + '_' + ctx.idx));
                                    }
                                }, null, []);
                                instructions_1.container(2, undefined, null, [1 /* SelectOnly */, 'vc']);
                                instructions_1.container(3, undefined, null, [1 /* SelectOnly */, 'vc']);
                            }
                            if (rf & 2 /* Update */) {
                                tpl = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(1)));
                            }
                        },
                        viewQuery: function (rf, cmpt) {
                            var tmp;
                            if (rf & 1 /* Create */) {
                                query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                            }
                            if (rf & 2 /* Update */) {
                                query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                                    (cmpt.query = tmp);
                            }
                        },
                        directives: function () { return [ViewContainerManipulatorDirective]; },
                    });
                    return Cmpt;
                }());
                var fixture = new render_util_1.ComponentFixture(Cmpt);
                var qList = fixture.component.query;
                expect(qList.length).toBe(0);
                directiveInstances[0].insertTpl(tpl, { idx: 0, container_idx: 0 }, 0);
                directiveInstances[1].insertTpl(tpl, { idx: 0, container_idx: 1 }, 0);
                fixture.update();
                expect(qList.length).toBe(2);
                var qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo_1_0');
                expect(qListArr[1].nativeElement.getAttribute('id')).toBe('foo_0_0');
                directiveInstances[0].remove();
                fixture.update();
                expect(qList.length).toBe(1);
                qListArr = qList.toArray();
                expect(qListArr[0].nativeElement.getAttribute('id')).toBe('foo_1_0');
                directiveInstances[1].remove();
                fixture.update();
                expect(qList.length).toBe(0);
            });
            // https://stackblitz.com/edit/angular-wpd6gv?file=src%2Fapp%2Fapp.component.ts
            it('should report results from views inserted in a lifecycle hook', function () {
                var MyApp = /** @class */ (function () {
                    function MyApp() {
                        this.show = false;
                    }
                    MyApp.ngComponentDef = index_1.defineComponent({
                        type: MyApp,
                        factory: function () { return new MyApp(); },
                        selectors: [['my-app']],
                        /**
                         * <ng-template #tpl><span #foo id="from_tpl">from tpl</span></ng-template>
                         * <ng-template [ngTemplateOutlet]="show ? tpl : null"></ng-template>
                         */
                        template: function (rf, myApp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.container(1, function (rf1) {
                                    if (rf1 & 1 /* Create */) {
                                        instructions_1.element(0, 'span', ['id', 'from_tpl'], ['foo', '']);
                                    }
                                }, undefined, undefined, ['tpl', '']);
                                instructions_1.container(3, undefined, null, [1 /* SelectOnly */, 'ngTemplateOutlet']);
                            }
                            if (rf & 2 /* Update */) {
                                var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(1)));
                                instructions_1.elementProperty(3, 'ngTemplateOutlet', instructions_1.bind(myApp.show ? tplRef : null));
                            }
                        },
                        directives: function () { return [common_with_def_1.NgTemplateOutlet]; },
                        viewQuery: function (rf, myApp) {
                            var tmp;
                            if (rf & 1 /* Create */) {
                                query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                            }
                            if (rf & 2 /* Update */) {
                                query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                                    (myApp.query = tmp);
                            }
                        }
                    });
                    return MyApp;
                }());
                var fixture = new render_util_1.ComponentFixture(MyApp);
                var qList = fixture.component.query;
                expect(qList.length).toBe(0);
                fixture.component.show = true;
                fixture.update();
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement.id).toBe('from_tpl');
                fixture.component.show = false;
                fixture.update();
                expect(qList.length).toBe(0);
            });
        });
        describe('JS blocks', function () {
            it('should report results in embedded views', function () {
                var firstEl;
                /**
                 * % if (exp) {
                 *    <div #foo></div>
                 * % }
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(1);
                        {
                            if (ctx.exp) {
                                var rf1 = instructions_1.embeddedViewStart(1);
                                {
                                    if (rf1 & 1 /* Create */) {
                                        firstEl = instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(0);
                cmptInstance.exp = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement).toBe(firstEl);
                cmptInstance.exp = false;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(0);
            });
            it('should add results from embedded views in the correct order - views and elements mix', function () {
                var firstEl, lastEl, viewEl;
                /**
                 * <span #foo></span>
                 * % if (exp) {
                 *    <div #foo></div>
                 * % }
                 * <span #foo></span>
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        firstEl = instructions_1.elementStart(1, 'span', null, ['foo', '']);
                        instructions_1.elementEnd();
                        instructions_1.container(3);
                        lastEl = instructions_1.elementStart(4, 'span', null, ['foo', '']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(3);
                        {
                            if (ctx.exp) {
                                var rf1 = instructions_1.embeddedViewStart(1);
                                {
                                    if (rf1 & 1 /* Create */) {
                                        viewEl = instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                            (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toBe(firstEl);
                expect(qList.last.nativeElement).toBe(lastEl);
                cmptInstance.exp = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(3);
                expect(qList.toArray()[0].nativeElement).toBe(firstEl);
                expect(qList.toArray()[1].nativeElement).toBe(viewEl);
                expect(qList.toArray()[2].nativeElement).toBe(lastEl);
                cmptInstance.exp = false;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toBe(firstEl);
                expect(qList.last.nativeElement).toBe(lastEl);
            });
            it('should add results from embedded views in the correct order - views side by side', function () {
                var firstEl, lastEl;
                /**
                 * % if (exp1) {
                 *    <div #foo></div>
                 * % } if (exp2) {
                 *    <span #foo></span>
                 * % }
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(1);
                        {
                            if (ctx.exp1) {
                                var rf0 = instructions_1.embeddedViewStart(0);
                                {
                                    if (rf0 & 1 /* Create */) {
                                        firstEl = instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                            if (ctx.exp2) {
                                var rf1 = instructions_1.embeddedViewStart(1);
                                {
                                    if (rf1 & 1 /* Create */) {
                                        lastEl = instructions_1.elementStart(0, 'span', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(0);
                cmptInstance.exp2 = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(1);
                expect(qList.last.nativeElement).toBe(lastEl);
                cmptInstance.exp1 = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toBe(firstEl);
                expect(qList.last.nativeElement).toBe(lastEl);
            });
            it('should add results from embedded views in the correct order - nested views', function () {
                var firstEl, lastEl;
                /**
                 * % if (exp1) {
                 *    <div #foo></div>
                 *    % if (exp2) {
                 *      <span #foo></span>
                 *    }
                 * % }
                 * class Cmpt {
                 *  @ViewChildren('foo') query;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(1);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(1);
                        {
                            if (ctx.exp1) {
                                var rf0 = instructions_1.embeddedViewStart(0);
                                {
                                    if (rf0 & 1 /* Create */) {
                                        firstEl = instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                        instructions_1.container(2);
                                    }
                                    if (rf0 & 2 /* Update */) {
                                        instructions_1.containerRefreshStart(2);
                                        {
                                            if (ctx.exp2) {
                                                var rf2 = instructions_1.embeddedViewStart(0);
                                                {
                                                    if (rf2) {
                                                        lastEl = instructions_1.elementStart(0, 'span', null, ['foo', '']);
                                                        instructions_1.elementEnd();
                                                    }
                                                }
                                                instructions_1.embeddedViewEnd();
                                            }
                                        }
                                        instructions_1.containerRefreshEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.query = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var qList = cmptInstance.query;
                expect(qList.length).toBe(0);
                cmptInstance.exp1 = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(1);
                expect(qList.first.nativeElement).toBe(firstEl);
                cmptInstance.exp2 = true;
                index_1.detectChanges(cmptInstance);
                expect(qList.length).toBe(2);
                expect(qList.first.nativeElement).toBe(firstEl);
                expect(qList.last.nativeElement).toBe(lastEl);
            });
            /**
             * What is tested here can't be achieved in the Renderer2 as all view queries are deep by
             * default and can't be marked as shallow by a user.
             */
            it('should support combination of deep and shallow queries', function () {
                /**
                 * % if (exp) { ">
                 *    <div #foo></div>
                 * % }
                 * <span #foo></span>
                 * class Cmpt {
                 *  @ViewChildren('foo') deep;
                 *  @ViewChildren('foo') shallow;
                 * }
                 */
                var Cmpt = render_util_1.createComponent('cmpt', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(2);
                        instructions_1.elementStart(3, 'span', null, ['foo', '']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(2);
                        {
                            if (ctx.exp) {
                                var rf0 = instructions_1.embeddedViewStart(0);
                                {
                                    if (rf0 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'div', null, ['foo', '']);
                                        instructions_1.elementEnd();
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }, [], [], function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        query_1.query(0, ['foo'], true, di_1.QUERY_READ_FROM_NODE);
                        query_1.query(1, ['foo'], false, di_1.QUERY_READ_FROM_NODE);
                    }
                    if (rf & 2 /* Update */) {
                        var tmp = void 0;
                        query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.deep = tmp);
                        query_1.queryRefresh(tmp = instructions_1.load(1)) &&
                            (ctx.shallow = tmp);
                    }
                });
                var cmptInstance = render_util_1.renderComponent(Cmpt);
                var deep = cmptInstance.deep;
                var shallow = cmptInstance.shallow;
                expect(deep.length).toBe(1);
                expect(shallow.length).toBe(1);
                cmptInstance.exp = true;
                index_1.detectChanges(cmptInstance);
                expect(deep.length).toBe(2);
                expect(shallow.length).toBe(1);
                cmptInstance.exp = false;
                index_1.detectChanges(cmptInstance);
                expect(deep.length).toBe(1);
                expect(shallow.length).toBe(1);
            });
        });
    });
    describe('observable interface', function () {
        it('should allow observing changes to query list', function () {
            var queryList = new index_1.QueryList();
            var changes = 0;
            queryList.changes.subscribe({
                next: function (arg) {
                    changes += 1;
                    expect(arg).toBe(queryList);
                }
            });
            // initial refresh, the query should be dirty
            query_1.queryRefresh(queryList);
            expect(changes).toBe(1);
            // refresh without setting dirty - no emit
            query_1.queryRefresh(queryList);
            expect(changes).toBe(1);
            // refresh with setting dirty - emit
            queryList.setDirty();
            query_1.queryRefresh(queryList);
            expect(changes).toBe(2);
        });
    });
    describe('queryList', function () {
        it('should be destroyed when the containing view is destroyed', function () {
            var queryInstance;
            var SimpleComponentWithQuery = render_util_1.createComponent('some-component-with-query', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(1, 'div', null, ['foo', '']);
                    instructions_1.elementEnd();
                }
            }, [], [], function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    query_1.query(0, ['foo'], false, di_1.QUERY_READ_FROM_NODE);
                }
                if (rf & 2 /* Update */) {
                    var tmp = void 0;
                    query_1.queryRefresh(tmp = instructions_1.load(0)) &&
                        (ctx.query = queryInstance = tmp);
                }
            });
            function createTemplate() { instructions_1.container(0); }
            function updateTemplate() {
                instructions_1.containerRefreshStart(0);
                {
                    if (condition) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'some-component-with-query');
                                instructions_1.elementEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
            /**
             * % if (condition) {
             *   <some-component-with-query></some-component-with-query>
             * %}
             */
            var condition = true;
            var t = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [SimpleComponentWithQuery]);
            expect(t.html).toEqual('<some-component-with-query><div></div></some-component-with-query>');
            expect(queryInstance.changes.closed).toBeFalsy();
            condition = false;
            t.update();
            expect(t.html).toEqual('');
            expect(queryInstance.changes.closed).toBeTruthy();
        });
    });
    describe('content', function () {
        it('should support content queries for directives', function () {
            var withContentInstance;
            var WithContentDirective = /** @class */ (function () {
                function WithContentDirective() {
                }
                WithContentDirective.ngComponentDef = index_1.defineDirective({
                    type: WithContentDirective,
                    selectors: [['', 'with-content', '']],
                    factory: function () { return new WithContentDirective(); },
                    contentQueries: function () { instructions_1.registerContentQuery(query_1.query(null, ['foo'], true, di_1.QUERY_READ_FROM_NODE)); },
                    contentQueriesRefresh: function (dirIndex, queryStartIdx) {
                        var tmp;
                        withContentInstance = instructions_1.loadDirective(dirIndex);
                        query_1.queryRefresh(tmp = instructions_1.loadQueryList(queryStartIdx)) &&
                            (withContentInstance.foos = tmp);
                    }
                });
                return WithContentDirective;
            }());
            /**
             * <div with-content>
             *   <span #foo></span>
             * </div>
             * class Cmpt {
             * }
             */
            var AppComponent = render_util_1.createComponent('app-component', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', [1 /* SelectOnly */, 'with-content']);
                    {
                        instructions_1.element(1, 'span', null, ['foo', '']);
                    }
                    instructions_1.elementEnd();
                }
            }, [WithContentDirective]);
            var fixture = new render_util_1.ComponentFixture(AppComponent);
            expect(withContentInstance.foos.length).toBe(1);
        });
        // https://stackblitz.com/edit/angular-wlenwd?file=src%2Fapp%2Fapp.component.ts
        it('should support view and content queries matching the same element', function () {
            var withContentComponentInstance;
            var WithContentComponent = /** @class */ (function () {
                function WithContentComponent() {
                }
                WithContentComponent.ngComponentDef = index_1.defineComponent({
                    type: WithContentComponent,
                    selectors: [['with-content']],
                    factory: function () { return new WithContentComponent(); },
                    contentQueries: function () { instructions_1.registerContentQuery(query_1.query(null, ['foo'], true, di_1.QUERY_READ_FROM_NODE)); },
                    template: function (rf, ctx) {
                        // intentionally left empty, don't need anything for this test
                    },
                    contentQueriesRefresh: function (dirIndex, queryStartIdx) {
                        var tmp;
                        withContentComponentInstance = instructions_1.loadDirective(dirIndex);
                        query_1.queryRefresh(tmp = instructions_1.loadQueryList(queryStartIdx)) &&
                            (withContentComponentInstance.foos = tmp);
                    },
                });
                return WithContentComponent;
            }());
            /**
             * <with-content>
             *   <div #foo></div>
             * </with-content>
             * <div id="after" #bar></div>
             * class Cmpt {
             *  @ViewChildren('foo, bar') foos;
             * }
             */
            var AppComponent = render_util_1.createComponent('app-component', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(1, 'with-content');
                    {
                        instructions_1.element(2, 'div', null, ['foo', '']);
                    }
                    instructions_1.elementEnd();
                    instructions_1.element(4, 'div', ['id', 'after'], ['bar', '']);
                }
            }, [WithContentComponent], [], function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    query_1.query(0, ['foo', 'bar'], true, di_1.QUERY_READ_FROM_NODE);
                }
                if (rf & 2 /* Update */) {
                    var tmp = void 0;
                    query_1.queryRefresh(tmp = instructions_1.load(0)) && (ctx.foos = tmp);
                }
            });
            var fixture = new render_util_1.ComponentFixture(AppComponent);
            var viewQList = fixture.component.foos;
            expect(viewQList.length).toBe(2);
            expect(withContentComponentInstance.foos.length).toBe(1);
            expect(viewQList.first.nativeElement)
                .toBe(withContentComponentInstance.foos.first.nativeElement);
            expect(viewQList.last.nativeElement.id).toBe('after');
        });
        it('should report results to appropriate queries where content queries are nested', function () {
            var QueryDirective = /** @class */ (function () {
                function QueryDirective() {
                }
                QueryDirective.ngDirectiveDef = index_1.defineDirective({
                    type: QueryDirective,
                    selectors: [['', 'query', '']],
                    exportAs: 'query',
                    factory: function () { return new QueryDirective(); },
                    contentQueries: function () {
                        // @ContentChildren('foo, bar, baz', {descendants: true}) fooBars:
                        // QueryList<ElementRef>;
                        instructions_1.registerContentQuery(query_1.query(null, ['foo', 'bar', 'baz'], true, di_1.QUERY_READ_FROM_NODE));
                    },
                    contentQueriesRefresh: function (dirIndex, queryStartIdx) {
                        var tmp;
                        var instance = instructions_1.loadDirective(dirIndex);
                        query_1.queryRefresh(tmp = instructions_1.loadQueryList(queryStartIdx)) &&
                            (instance.fooBars = tmp);
                    },
                });
                return QueryDirective;
            }());
            var outInstance;
            var inInstance;
            var AppComponent = render_util_1.createComponent('app-component', 
            /**
             * <div query #out="query">
             *   <span #foo></span>
             *   <div query #in="query">
             *     <span #bar></span>
             *   </div>
             *   <span #baz></span>
             * </div>
             */
            function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', [1 /* SelectOnly */, 'query'], ['out', 'query']);
                    {
                        instructions_1.element(2, 'span', ['id', 'foo'], ['foo', '']);
                        instructions_1.elementStart(4, 'div', [1 /* SelectOnly */, 'query'], ['in', 'query']);
                        {
                            instructions_1.element(6, 'span', ['id', 'bar'], ['bar', '']);
                        }
                        instructions_1.elementEnd();
                        instructions_1.element(8, 'span', ['id', 'baz'], ['baz', '']);
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    outInstance = instructions_1.load(1);
                    inInstance = instructions_1.load(5);
                }
            }, [QueryDirective]);
            var fixture = new render_util_1.ComponentFixture(AppComponent);
            expect(outInstance.fooBars.length).toBe(3);
            expect(inInstance.fooBars.length).toBe(1);
        });
        it('should respect shallow flag on content queries when mixing deep and shallow queries', function () {
            var ShallowQueryDirective = /** @class */ (function () {
                function ShallowQueryDirective() {
                }
                ShallowQueryDirective.ngDirectiveDef = index_1.defineDirective({
                    type: ShallowQueryDirective,
                    selectors: [['', 'shallow-query', '']],
                    exportAs: 'shallow-query',
                    factory: function () { return new ShallowQueryDirective(); },
                    contentQueries: function () {
                        // @ContentChildren('foo', {descendants: false}) foos: QueryList<ElementRef>;
                        instructions_1.registerContentQuery(query_1.query(null, ['foo'], false, di_1.QUERY_READ_FROM_NODE));
                    },
                    contentQueriesRefresh: function (dirIndex, queryStartIdx) {
                        var tmp;
                        var instance = instructions_1.loadDirective(dirIndex);
                        query_1.queryRefresh(tmp = instructions_1.loadQueryList(queryStartIdx)) &&
                            (instance.foos = tmp);
                    },
                });
                return ShallowQueryDirective;
            }());
            var DeepQueryDirective = /** @class */ (function () {
                function DeepQueryDirective() {
                }
                DeepQueryDirective.ngDirectiveDef = index_1.defineDirective({
                    type: DeepQueryDirective,
                    selectors: [['', 'deep-query', '']],
                    exportAs: 'deep-query',
                    factory: function () { return new DeepQueryDirective(); },
                    contentQueries: function () {
                        // @ContentChildren('foo', {descendants: false}) foos: QueryList<ElementRef>;
                        instructions_1.registerContentQuery(query_1.query(null, ['foo'], true, di_1.QUERY_READ_FROM_NODE));
                    },
                    contentQueriesRefresh: function (dirIndex, queryStartIdx) {
                        var tmp;
                        var instance = instructions_1.loadDirective(dirIndex);
                        query_1.queryRefresh(tmp = instructions_1.loadQueryList(queryStartIdx)) &&
                            (instance.foos = tmp);
                    },
                });
                return DeepQueryDirective;
            }());
            var shallowInstance;
            var deepInstance;
            var AppComponent = render_util_1.createComponent('app-component', 
            /**
             * <div shallow-query #shallow="shallow-query" deep-query #deep="deep-query">
              *   <span #foo></span>
             * </div>
             */
            function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', [1 /* SelectOnly */, 'shallow-query', 'deep-query'], ['shallow', 'shallow-query', 'deep', 'deep-query']);
                    {
                        instructions_1.element(3, 'span', ['id', 'foo'], ['foo', '']);
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    shallowInstance = instructions_1.load(1);
                    deepInstance = instructions_1.load(2);
                }
            }, [ShallowQueryDirective, DeepQueryDirective]);
            var fixture = new render_util_1.ComponentFixture(AppComponent);
            expect(shallowInstance.foos.length).toBe(1);
            expect(deepInstance.foos.length).toBe(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL3F1ZXJ5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFNSCwyQ0FBNkw7QUFDN0wsaURBQTRJO0FBQzVJLCtEQUE2UDtBQUU3UCxpREFBNEQ7QUFFNUQscURBQWtFO0FBQ2xFLDZDQUFtSDtBQUluSDs7OztHQUlHO0FBQ0gsc0JBQXNCLFNBQWM7SUFDbEMsT0FBTyxTQUFTLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztBQUN6QyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILHVCQUF1QixTQUFjO0lBQ25DLE9BQU8sU0FBUyxDQUFDLGtCQUFrQixJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztBQUNuRixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILDRCQUE0QixTQUFjO0lBQ3hDLE9BQU8sU0FBUyxDQUFDLGtCQUFrQixJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztBQUNuRixDQUFDO0FBRUQsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixFQUFFLENBQUMsK0JBQStCLEVBQUU7UUFDbEMsSUFBTSxLQUFLLEdBQUcsNkJBQWUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxFQUFlLEVBQUUsR0FBUSxJQUFHLENBQUMsQ0FBQyxDQUFDO1FBRS9FLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxHQUFHLEdBQUcsNkJBQWUsQ0FDdkIsS0FBSyxFQUNMLFVBQVMsRUFBZSxFQUFFLEdBQVE7WUFDaEM7Ozs7Ozs7OztlQVNHO1lBQ0gsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQiwyQkFBWSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FB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