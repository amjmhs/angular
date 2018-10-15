"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@angular/core/src/view/index");
var util_1 = require("@angular/core/src/view/util");
{
    describe('viewDef', function () {
        describe('parent', function () {
            function parents(viewDef) {
                return viewDef.nodes.map(function (node) { return node.parent ? node.parent.nodeIndex : null; });
            }
            it('should calculate parents for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.textDef(1, null, ['a']),
                    index_1.textDef(2, null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, 0]);
            });
            it('should calculate parents for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(1, null, ['a']),
                    index_1.elementDef(2, 0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(3, null, ['a']),
                    index_1.textDef(4, null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, null, 2, null]);
            });
            it('should calculate parents for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(2, null, ['a']),
                    index_1.elementDef(3, 0 /* None */, null, null, 1, 'span'),
                    index_1.textDef(4, null, ['a']),
                    index_1.textDef(5, null, ['a']),
                ]);
                expect(parents(vd)).toEqual([null, 0, 1, null, 3, null]);
            });
        });
        describe('childFlags', function () {
            function childFlags(viewDef) {
                return viewDef.nodes.map(function (node) { return node.childFlags; });
            }
            function directChildFlags(viewDef) {
                return viewDef.nodes.map(function (node) { return node.directChildFlags; });
            }
            it('should calculate childFlags for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 2097152 /* AfterContentChecked */, null, 0, AService, [])
                ]);
                expect(childFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
            });
            it('should calculate childFlags for two levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2, 2097152 /* AfterContentChecked */, null, 0, AService, [])
                ]);
                expect(childFlags(vd)).toEqual([
                    1 /* TypeElement */ | 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    1 /* TypeElement */, 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    0 /* None */
                ]);
            });
            it('should calculate childFlags for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 2097152 /* AfterContentChecked */, null, 0, AService, []),
                    index_1.elementDef(2, 0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(3, 1048576 /* AfterContentInit */, null, 0, AService, []),
                    index_1.directiveDef(4, 8388608 /* AfterViewChecked */, null, 0, AService, []),
                ]);
                expect(childFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 8388608 /* AfterViewChecked */,
                    0 /* None */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 8388608 /* AfterViewChecked */,
                    0 /* None */, 0 /* None */
                ]);
            });
            it('should calculate childFlags for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2, 2097152 /* AfterContentChecked */, null, 0, AService, []),
                    index_1.elementDef(3, 0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(4, 1048576 /* AfterContentInit */, null, 0, AService, []),
                    index_1.directiveDef(5, 4194304 /* AfterViewInit */, null, 0, AService, []),
                ]);
                expect(childFlags(vd)).toEqual([
                    1 /* TypeElement */ | 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */, 0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 4194304 /* AfterViewInit */,
                    0 /* None */, 0 /* None */
                ]);
                expect(directChildFlags(vd)).toEqual([
                    1 /* TypeElement */, 16384 /* TypeDirective */ | 2097152 /* AfterContentChecked */,
                    0 /* None */,
                    16384 /* TypeDirective */ | 1048576 /* AfterContentInit */ | 4194304 /* AfterViewInit */,
                    0 /* None */, 0 /* None */
                ]);
            });
        });
        describe('childMatchedQueries', function () {
            function childMatchedQueries(viewDef) {
                return viewDef.nodes.map(function (node) { return node.childMatchedQueries; });
            }
            it('should calculate childMatchedQueries for one level', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 0 /* None */, [[1, 4 /* Provider */]], 0, AService, [])
                ]);
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), 0]);
            });
            it('should calculate childMatchedQueries for two levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2, 0 /* None */, [[1, 4 /* Provider */]], 0, AService, [])
                ]);
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), util_1.filterQueryId(1), 0]);
            });
            it('should calculate childMatchedQueries for one level, multiple roots', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 0 /* None */, [[1, 4 /* Provider */]], 0, AService, []),
                    index_1.elementDef(2, 0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(3, 0 /* None */, [[2, 4 /* Provider */]], 0, AService, []),
                    index_1.directiveDef(4, 0 /* None */, [[3, 4 /* Provider */]], 0, AService, []),
                ]);
                expect(childMatchedQueries(vd)).toEqual([
                    util_1.filterQueryId(1), 0, util_1.filterQueryId(2) | util_1.filterQueryId(3), 0, 0
                ]);
            });
            it('should calculate childMatchedQueries for multiple levels', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2, 0 /* None */, [[1, 4 /* Provider */]], 0, AService, []),
                    index_1.elementDef(3, 0 /* None */, null, null, 2, 'span'),
                    index_1.directiveDef(4, 0 /* None */, [[2, 4 /* Provider */]], 0, AService, []),
                    index_1.directiveDef(5, 0 /* None */, [[3, 4 /* Provider */]], 0, AService, []),
                ]);
                expect(childMatchedQueries(vd)).toEqual([
                    util_1.filterQueryId(1), util_1.filterQueryId(1), 0, util_1.filterQueryId(2) | util_1.filterQueryId(3), 0, 0
                ]);
            });
            it('should included embedded views into childMatchedQueries', function () {
                var vd = index_1.viewDef(0 /* None */, [
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.anchorDef(0 /* None */, null, null, 0, null, function () { return index_1.viewDef(0 /* None */, [
                        index_1.elementDef(0, 0 /* None */, [[1, 4 /* Provider */]], null, 0, 'span'),
                    ]); })
                ]);
                // Note: the template will become a sibling to the anchor once stamped out,
                expect(childMatchedQueries(vd)).toEqual([util_1.filterQueryId(1), 0]);
            });
        });
    });
}
var AService = /** @class */ (function () {
    function AService() {
    }
    return AService;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19kZWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3ZpZXdfZGVmX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzREFBeUo7QUFDekosb0RBQTBEO0FBRTFEO0lBQ0UsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUVsQixRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlCQUFpQixPQUF1QjtnQkFDdEMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQTFDLENBQTBDLENBQUMsQ0FBQztZQUMvRSxDQUFDO1lBRUQsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO2dCQUMzQyxJQUFNLEVBQUUsR0FBRyxlQUFPLGVBQWlCO29CQUNqQyxrQkFBVSxDQUFDLENBQUMsZ0JBQWtCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDcEQsZUFBTyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsZUFBTyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7Z0JBQzNELElBQU0sRUFBRSxHQUFHLGVBQU8sZUFBaUI7b0JBQ2pDLGtCQUFVLENBQUMs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