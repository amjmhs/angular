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
var errors_1 = require("@angular/core/src/errors");
var index_1 = require("@angular/core/src/view/index");
var helper_1 = require("./helper");
{
    describe("Query Views", function () {
        var someQueryId = 1;
        var AService = /** @class */ (function () {
            function AService() {
            }
            return AService;
        }());
        var QueryService = /** @class */ (function () {
            function QueryService() {
            }
            return QueryService;
        }());
        function contentQueryProviders(checkIndex) {
            return [
                index_1.directiveDef(checkIndex, 0 /* None */, null, 1, QueryService, []),
                index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ })
            ];
        }
        var cQPLength = contentQueryProviders(0).length;
        // nodes first checkIndex should be 1 (to account for the `queryDef`
        function compViewQueryProviders(checkIndex, extraChildCount, nodes) {
            return [
                index_1.elementDef(checkIndex, 0 /* None */, null, null, 1 + extraChildCount, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                    index_1.queryDef(134217728 /* TypeViewQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ })
                ].concat(nodes)); }),
                index_1.directiveDef(checkIndex + 1, 32768 /* Component */, null, 0, QueryService, [], null, null),
            ];
        }
        var cVQLength = compViewQueryProviders(0, 0, []).length;
        function aServiceProvider(checkIndex) {
            return index_1.directiveDef(checkIndex, 0 /* None */, [[someQueryId, 4 /* Provider */]], 0, AService, []);
        }
        describe('content queries', function () {
            it('should query providers on the same element and child elements', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 5, 'div')
                ].concat(contentQueryProviders(1), [
                    aServiceProvider(1 + cQPLength),
                    index_1.elementDef(2 + cQPLength, 0 /* None */, null, null, 1, 'div'),
                    aServiceProvider(3 + cQPLength),
                ]))).view;
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a).toBeUndefined();
                index_1.Services.checkAndUpdateView(view);
                var as = qs.a.toArray();
                expect(as.length).toBe(2);
                expect(as[0]).toBe(index_1.asProviderData(view, 3).instance);
                expect(as[1]).toBe(index_1.asProviderData(view, 5).instance);
            });
            it('should not query providers on sibling or parent elements', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 6, 'div'),
                    aServiceProvider(1),
                    index_1.elementDef(2, 0 /* None */, null, null, 2, 'div')
                ].concat(contentQueryProviders(3), [
                    index_1.elementDef(3 + cQPLength, 0 /* None */, null, null, 1, 'div'),
                    aServiceProvider(4 + cQPLength),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 3).instance;
                expect(qs.a.length).toBe(0);
            });
        });
        describe('view queries', function () {
            it('should query providers in the view', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef(compViewQueryProviders(0, 0, [
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    aServiceProvider(2),
                ]).slice())).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                var compView = index_1.asElementData(view, 0).componentView;
                expect(comp.a.length).toBe(1);
                expect(comp.a.first).toBe(index_1.asProviderData(compView, 2).instance);
            });
            it('should not query providers on the host element', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef(compViewQueryProviders(0, 1, [index_1.elementDef(1, 0 /* None */, null, null, 0, 'span')]).concat([
                    aServiceProvider(cVQLength),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                expect(comp.a.length).toBe(0);
            });
        });
        describe('embedded views', function () {
            it('should query providers in embedded views', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 5, 'div')
                ].concat(contentQueryProviders(1), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 2, null, helper_1.compViewDefFactory([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(1),
                    ]))
                ], contentQueryProviders(2 + cQPLength)))).view;
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 3), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                // queries on parent elements of anchors
                var qs1 = index_1.asProviderData(view, 1).instance;
                expect(qs1.a.length).toBe(1);
                expect(qs1.a.first instanceof AService).toBe(true);
                // queries on the anchor
                var qs2 = index_1.asProviderData(view, 4).instance;
                expect(qs2.a.length).toBe(1);
                expect(qs2.a.first instanceof AService).toBe(true);
            });
            it('should query providers in embedded views only at the template declaration', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 3, 'div')
                ].concat(contentQueryProviders(1), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(1),
                    ])),
                    index_1.elementDef(2 + cQPLength, 0 /* None */, null, null, 3, 'div')
                ], contentQueryProviders(3 + cQPLength), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0),
                ]))).view;
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                // attach at a different place than the one where the template was defined
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 7), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                // query on the declaration place
                var qs1 = index_1.asProviderData(view, 1).instance;
                expect(qs1.a.length).toBe(1);
                expect(qs1.a.first instanceof AService).toBe(true);
                // query on the attach place
                var qs2 = index_1.asProviderData(view, 5).instance;
                expect(qs2.a.length).toBe(0);
            });
            it('should update content queries if embedded views are added or removed', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 3, 'div')
                ].concat(contentQueryProviders(1), [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(1),
                    ])),
                ]))).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.length).toBe(0);
                var childView = helper_1.createEmbeddedView(view, view.def.nodes[3]);
                index_1.attachEmbeddedView(view, index_1.asElementData(view, 3), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                expect(qs.a.length).toBe(1);
                index_1.detachEmbeddedView(index_1.asElementData(view, 3), 0);
                index_1.Services.checkAndUpdateView(view);
                expect(qs.a.length).toBe(0);
            });
            it('should update view queries if embedded views are added or removed', function () {
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef(compViewQueryProviders(0, 0, [
                    index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, helper_1.compViewDefFactory([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                        aServiceProvider(1),
                    ])),
                ]).slice())).view;
                index_1.Services.checkAndUpdateView(view);
                var comp = index_1.asProviderData(view, 1).instance;
                expect(comp.a.length).toBe(0);
                var compView = index_1.asElementData(view, 0).componentView;
                var childView = helper_1.createEmbeddedView(compView, compView.def.nodes[1]);
                index_1.attachEmbeddedView(view, index_1.asElementData(compView, 1), 0, childView);
                index_1.Services.checkAndUpdateView(view);
                expect(comp.a.length).toBe(1);
                index_1.detachEmbeddedView(index_1.asElementData(compView, 1), 0);
                index_1.Services.checkAndUpdateView(view);
                expect(comp.a.length).toBe(0);
            });
        });
        describe('QueryBindingType', function () {
            it('should query all matches', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 4, 'div'),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ }),
                    aServiceProvider(3),
                    aServiceProvider(4),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a instanceof core_1.QueryList).toBeTruthy();
                expect(qs.a.toArray()).toEqual([
                    index_1.asProviderData(view, 3).instance,
                    index_1.asProviderData(view, 4).instance,
                ]);
            });
            it('should query the first match', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 4, 'div'),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                    aServiceProvider(3),
                    aServiceProvider(4),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a).toBe(index_1.asProviderData(view, 3).instance);
            });
        });
        describe('query builtins', function () {
            it('should query ElementRef', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, [[someQueryId, 0 /* ElementRef */]], null, 2, 'div'),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.nativeElement).toBe(index_1.asElementData(view, 0).renderElement);
            });
            it('should query TemplateRef', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.anchorDef(0 /* None */, [[someQueryId, 2 /* TemplateRef */]], null, 2, null, helper_1.compViewDefFactory([index_1.anchorDef(0 /* None */, null, null, 0)])),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.createEmbeddedView).toBeTruthy();
            });
            it('should query ViewContainerRef', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.anchorDef(16777216 /* EmbeddedViews */, [[someQueryId, 3 /* ViewContainerRef */]], null, 2),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 0 /* First */ }),
                ])).view;
                index_1.Services.checkAndUpdateView(view);
                var qs = index_1.asProviderData(view, 1).instance;
                expect(qs.a.createEmbeddedView).toBeTruthy();
            });
        });
        describe('general binding behavior', function () {
            it('should report debug info on binding errors', function () {
                var QueryService = /** @class */ (function () {
                    function QueryService() {
                    }
                    Object.defineProperty(QueryService.prototype, "a", {
                        set: function (value) { throw new Error('Test'); },
                        enumerable: true,
                        configurable: true
                    });
                    return QueryService;
                }());
                var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 3, 'div'),
                    index_1.directiveDef(1, 0 /* None */, null, 1, QueryService, []),
                    index_1.queryDef(67108864 /* TypeContentQuery */ | 536870912 /* DynamicQuery */, someQueryId, { 'a': 1 /* All */ }),
                    aServiceProvider(3),
                ])).view;
                var err;
                try {
                    index_1.Services.checkAndUpdateView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(2);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3F1ZXJ5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBbUY7QUFDbkYsbURBQXlEO0FBQ3pELHNEQUFrTztBQUVsTyxtQ0FBb0c7QUFFcEc7SUFDRSxRQUFRLENBQUMsYUFBYSxFQUFFO1FBRXRCLElBQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUV0QjtZQUFBO1lBQWdCLENBQUM7WUFBRCxlQUFDO1FBQUQsQ0FBQyxBQUFqQixJQUFpQjtRQUVqQjtZQUFBO1lBR0EsQ0FBQztZQUFELG1CQUFDO1FBQUQsQ0FBQyxBQUhELElBR0M7UUFFRCwrQkFBK0IsVUFBa0I7WUFDL0MsT0FBTztnQkFDTCxvQkFBWSxDQUFDLFVBQVUsZ0JBQWtCLElBQUksRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQztnQkFDbkUsZ0JBQVEsQ0FDSiw4REFBbUQsRUFBRSxXQUFXLEVBQ2hFLEVBQUMsR0FBRyxhQUFzQixFQUFDLENBQUM7YUFDakMsQ0FBQztRQUNKLENBQUM7UUFFRCxJQUFNLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFbEQsb0VBQW9FO1FBQ3BFLGdDQUFnQyxVQUFrQixFQUFFLGVBQXVCLEVBQUUsS0FBZ0I7WUFDM0YsT0FBTztnQkFDTCxrQkFBVSxDQUNOLFVBQVUsZ0JBQWtCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLGVBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ3BGLElBQUksRUFBRSxjQUFNLE9BQUEsb0JBQVc7b0JBQ2YsZ0JBQVEsQ0FDSiw0REFBZ0QsRUFBRSxXQUFXLEVBQzdELEVBQUMsR0FBRyxhQUFzQixFQUFDLENBQUM7eUJBQzdCLEtB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