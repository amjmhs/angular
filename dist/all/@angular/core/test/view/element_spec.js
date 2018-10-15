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
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
/**
 * We map addEventListener to the Zones internal name. This is because we want to be fast
 * and bypass the zone bookkeeping. We know that we can do the bookkeeping faster.
 */
var addEventListener = '__zone_symbol__addEventListener';
var removeEventListener = '__zone_symbol__removeEventListener';
{
    describe("View Elements", function () {
        describe('create', function () {
            it('should create elements without parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span')
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
                expect(dom_adapter_1.getDOM().nodeName(rootNodes[0]).toLowerCase()).toBe('span');
            });
            it('should create views with multiple root elements', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'span'),
                    index_1.elementDef(1, 0 /* None */, null, null, 0, 'span'),
                ])).rootNodes;
                expect(rootNodes.length).toBe(2);
            });
            it('should create elements with parents', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'div'),
                    index_1.elementDef(1, 0 /* None */, null, null, 0, 'span'),
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
                var spanEl = dom_adapter_1.getDOM().childNodes(rootNodes[0])[0];
                expect(dom_adapter_1.getDOM().nodeName(spanEl).toLowerCase()).toBe('span');
            });
            it('should set fixed attributes', function () {
                var rootNodes = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', [['title', 'a']]),
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
                expect(dom_adapter_1.getDOM().getAttribute(rootNodes[0], 'title')).toBe('a');
            });
            it('should add debug information to the renderer', function () {
                var someContext = new Object();
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'div')]), someContext), view = _a.view, rootNodes = _a.rootNodes;
                expect(core_1.getDebugNode(rootNodes[0]).nativeNode).toBe(index_1.asElementData(view, 0).renderElement);
            });
        });
        describe('change properties', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'input', null, [
                            [8 /* TypeProperty */, 'title', core_1.SecurityContext.NONE],
                            [8 /* TypeProperty */, 'value', core_1.SecurityContext.NONE],
                        ]),
                    ], null, function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, ['v1', 'v2']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getProperty(el, 'title')).toBe('v1');
                    expect(dom_adapter_1.getDOM().getProperty(el, 'value')).toBe('v2');
                });
            });
        });
        describe('change attributes', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', null, [
                            [1 /* TypeElementAttribute */, 'a1', core_1.SecurityContext.NONE],
                            [1 /* TypeElementAttribute */, 'a2', core_1.SecurityContext.NONE],
                        ]),
                    ], null, function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, ['v1', 'v2']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getAttribute(el, 'a1')).toBe('v1');
                    expect(dom_adapter_1.getDOM().getAttribute(el, 'a2')).toBe('v2');
                });
            });
        });
        describe('change classes', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', null, [
                            [2 /* TypeElementClass */, 'c1', null],
                            [2 /* TypeElementClass */, 'c2', null],
                        ]),
                    ], function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, [true, true]);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().hasClass(el, 'c1')).toBeTruthy();
                    expect(dom_adapter_1.getDOM().hasClass(el, 'c2')).toBeTruthy();
                });
            });
        });
        describe('change styles', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 0, 'div', null, [
                            [4 /* TypeElementStyle */, 'width', 'px'],
                            [4 /* TypeElementStyle */, 'color', null],
                        ]),
                    ], null, function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, [10, 'red']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getStyle(el, 'width')).toBe('10px');
                    expect(dom_adapter_1.getDOM().getStyle(el, 'color')).toBe('red');
                });
            });
        });
        if (helper_1.isBrowser()) {
            describe('listen to DOM events', function () {
                function createAndAttachAndGetRootNodes(viewDef) {
                    var result = helper_1.createAndGetRootNodes(viewDef);
                    // Note: We need to append the node to the document.body, otherwise `click` events
                    // won't work in IE.
                    result.rootNodes.forEach(function (node) {
                        document.body.appendChild(node);
                        helper_1.recordNodeToRemove(node);
                    });
                    return result;
                }
                it('should listen to DOM events', function () {
                    var handleEventSpy = jasmine.createSpy('handleEvent');
                    var removeListenerSpy = spyOn(HTMLElement.prototype, removeEventListener).and.callThrough();
                    var _a = createAndAttachAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'button', null, null, [[null, 'click']], handleEventSpy)])), view = _a.view, rootNodes = _a.rootNodes;
                    rootNodes[0].click();
                    expect(handleEventSpy).toHaveBeenCalled();
                    var handleEventArgs = handleEventSpy.calls.mostRecent().args;
                    expect(handleEventArgs[0]).toBe(view);
                    expect(handleEventArgs[1]).toBe('click');
                    expect(handleEventArgs[2]).toBeTruthy();
                    index_1.Services.destroyView(view);
                    expect(removeListenerSpy).toHaveBeenCalled();
                });
                it('should listen to window events', function () {
                    var handleEventSpy = jasmine.createSpy('handleEvent');
                    var addListenerSpy = spyOn(window, addEventListener);
                    var removeListenerSpy = spyOn(window, removeEventListener);
                    var _a = createAndAttachAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'button', null, null, [['window', 'windowClick']], handleEventSpy)])), view = _a.view, rootNodes = _a.rootNodes;
                    expect(addListenerSpy).toHaveBeenCalled();
                    expect(addListenerSpy.calls.mostRecent().args[0]).toBe('windowClick');
                    helper_1.callMostRecentEventListenerHandler(addListenerSpy, { name: 'windowClick' });
                    expect(handleEventSpy).toHaveBeenCalled();
                    var handleEventArgs = handleEventSpy.calls.mostRecent().args;
                    expect(handleEventArgs[0]).toBe(view);
                    expect(handleEventArgs[1]).toBe('window:windowClick');
                    expect(handleEventArgs[2]).toBeTruthy();
                    index_1.Services.destroyView(view);
                    expect(removeListenerSpy).toHaveBeenCalled();
                });
                it('should listen to document events', function () {
                    var handleEventSpy = jasmine.createSpy('handleEvent');
                    var addListenerSpy = spyOn(document, addEventListener);
                    var removeListenerSpy = spyOn(document, removeEventListener);
                    var _a = createAndAttachAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'button', null, null, [['document', 'documentClick']], handleEventSpy)])), view = _a.view, rootNodes = _a.rootNodes;
                    expect(addListenerSpy).toHaveBeenCalled();
                    expect(addListenerSpy.calls.mostRecent().args[0]).toBe('documentClick');
                    helper_1.callMostRecentEventListenerHandler(addListenerSpy, { name: 'windowClick' });
                    expect(handleEventSpy).toHaveBeenCalled();
                    var handleEventArgs = handleEventSpy.calls.mostRecent().args;
                    expect(handleEventArgs[0]).toBe(view);
                    expect(handleEventArgs[1]).toBe('document:documentClick');
                    expect(handleEventArgs[2]).toBeTruthy();
                    index_1.Services.destroyView(view);
                    expect(removeListenerSpy).toHaveBeenCalled();
                });
                it('should preventDefault only if the handler returns false', function () {
                    var eventHandlerResult;
                    var preventDefaultSpy = undefined;
                    var _a = createAndAttachAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'button', null, null, [[null, 'click']], function (view, eventName, event) {
                            preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
                            return eventHandlerResult;
                        })])), view = _a.view, rootNodes = _a.rootNodes;
                    eventHandlerResult = undefined;
                    rootNodes[0].click();
                    expect(preventDefaultSpy).not.toHaveBeenCalled();
                    eventHandlerResult = true;
                    rootNodes[0].click();
                    expect(preventDefaultSpy).not.toHaveBeenCalled();
                    eventHandlerResult = 'someString';
                    rootNodes[0].click();
                    expect(preventDefaultSpy).not.toHaveBeenCalled();
                    eventHandlerResult = false;
                    rootNodes[0].click();
                    expect(preventDefaultSpy).toHaveBeenCalled();
                });
                it('should report debug info on event errors', function () {
                    var handleErrorSpy = spyOn(testing_1.TestBed.get(core_1.ErrorHandler), 'handleError');
                    var addListenerSpy = spyOn(HTMLElement.prototype, addEventListener).and.callThrough();
                    var _a = createAndAttachAndGetRootNodes(helper_1.compViewDef([index_1.elementDef(0, 0 /* None */, null, null, 0, 'button', null, null, [[null, 'click']], function () { throw new Error('Test'); })])), view = _a.view, rootNodes = _a.rootNodes;
                    helper_1.callMostRecentEventListenerHandler(addListenerSpy, 'SomeEvent');
                    var err = handleErrorSpy.calls.mostRecent().args[0];
                    expect(err).toBeTruthy();
                    expect(err.message).toBe('Test');
                    var debugCtx = errors_1.getDebugContext(err);
                    expect(debugCtx.view).toBe(view);
                    expect(debugCtx.nodeIndex).toBe(0);
                });
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvZWxlbWVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTBFO0FBQzFFLG1EQUF5RDtBQUN6RCxzREFBb0k7QUFDcEksaURBQThDO0FBQzlDLDZFQUFxRTtBQUVyRSxtQ0FBMEs7QUFJMUs7OztHQUdHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxpQ0FBdUQsQ0FBQztBQUNqRixJQUFNLG1CQUFtQixHQUFHLG9DQUE2RCxDQUFDO0FBRTFGO0lBQ0UsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUV4QixRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsSUFBTSxTQUFTLEdBQUcsOEJBQXFCLENBQUMsb0JBQVcsQ0FBQztvQkFDaEMsa0JBQVUsQ0FBQyxDQUFDLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7aUJBQ3JELENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO2dCQUNwRCxJQUFNLFNBQVMsR0FBRyw4QkFBcUIsQ0FBQyxvQkFBVyxDQUFDO29CQUNoQyxrQkFBVSxDQUFDLENBQUMsZ0JBQWtCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztvQkFDcEQsa0JBQVUsQ0FBQyxDQUFDLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7aUJBQ3JELENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7Z0JBQ3hDLElBQU0sU0FBUyxHQUFHLDhCQUFxQixDQUFDLG9CQUFXLENBQUM7b0JBQ2hDLGtCQUFVLENBQUMsQ0FBQyxnQkFBa0IsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDO29CQUNuRCxrQkFBVSxDQUFDLENBQUMsZ0JBQWtCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztpQkFDckQsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBTSxNQUFNLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ2hDLElBQU0sU0FBUyxHQUFHLDhCQUFxQixDQUFDLG9CQUFXLENBQUM7b0JBQ2hDLGtCQUFVLENBQUMsQ0FBQyxnQkFBa0IsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDdEUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO2dCQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixJQUFBLG1JQUM4RSxFQUQ3RSxjQUFJLEVBQUUsd0JBQVMsQ0FDK0Q7Z0JBQ3JGLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3RixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLHdCQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsYUFBYTtnQkFDcEMsRUFBRSxDQUFDLGdDQUE4QixhQUFlLEVBQUU7b0JBRTFDLElBQUE7Ozs7Ozs7dUJBV0MsRUFYQSxjQUFJLEVBQUUsd0JBQVMsQ0FXZDtvQkFFUixnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVsQyxJQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckQsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsd0JBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxhQUFhO2dCQUNwQyxFQUFFLENBQUMsZ0NBQThCLGFBQWUsRUFBRTtvQkFDMUMsSUFBQTs7Ozs7Ozt1QkFXQyxFQVhBLGNBQUksRUFBRSx3QkFBUyxDQVdkO29CQUVSLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRWxDLElBQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNuRCxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6Qix3QkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLGFBQWE7Z0JBQ3BDLEVBQUUsQ0FBQyxnQ0FBOEIsYUFBZSxFQUFFO29CQUMxQyxJQUFBOzs7Ozs7O3VCQVdDLEVBWEEsY0FBSSxFQUFFLHdCQUFTLENBV2Q7b0JBRVIsZ0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFbEMsSUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDakQsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ25ELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIsd0JBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxhQUFhO2dCQUNwQyxFQUFFLENBQUMsZ0NBQThCLGFBQWUsRUFBRTtvQkFDMUMsSUFBQTs7Ozs7Ozt1QkFXQyxFQVhBLGNBQUksRUFBRSx3QkFBUyxDQVdkO29CQUVSLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRWxDLElBQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwRCxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksa0JBQVMsRUFBRSxFQUFFO1lBQ2YsUUFBUSxDQUFDLHNCQUFzQixFQUFFO2dCQUMvQix3Q0FBd0MsT0FBdUI7b0JBRTdELElBQU0sTUFBTSxHQUFHLDhCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM5QyxrRkFBa0Y7b0JBQ2xGLG9CQUFvQjtvQkFDcEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO3dCQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDaEMsMkJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDO2dCQUVELEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtvQkFDaEMsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDeEQsSUFBTSxpQkFBaUIsR0FDbkIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ2xFLElBQUEsd0tBRWdCLEVBRmYsY0FBSSxFQUFFLHdCQUFTLENBRUM7b0JBRXZCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFckIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBQzFDLElBQUksZUFBZSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUM3RCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBRXhDLGdCQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUUzQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7b0JBQ25DLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3hELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDdkQsSUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7b0JBQ3ZELElBQUEsa0xBRWdCLEVBRmYsY0FBSSxFQUFFLHdCQUFTLENBRUM7b0JBRXZCLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3RFLDJDQUFrQyxDQUFDLGNBQWMsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO29CQUUxRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDMUMsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUV4QyxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFM0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDL0MsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO29CQUNyQyxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUN4RCxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3pELElBQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO29CQUN6RCxJQUFBLHNMQUVpRCxFQUZoRCxjQUFJLEVBQUUsd0JBQVMsQ0FFa0M7b0JBRXhELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBQ3hFLDJDQUFrQyxDQUFDLGNBQWMsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO29CQUUxRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDMUMsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUV4QyxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFM0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDL0MsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO29CQUM1RCxJQUFJLGtCQUF1QixDQUFDO29CQUM1QixJQUFJLGlCQUFpQixHQUFnQixTQUFXLENBQUM7b0JBRTNDLElBQUE7Ozs2QkFLRyxFQUxGLGNBQUksRUFBRSx3QkFBUyxDQUtaO29CQUVWLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztvQkFDL0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNyQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFFakQsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO29CQUMxQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUVqRCxrQkFBa0IsR0FBRyxZQUFZLENBQUM7b0JBQ2xDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDckIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBRWpELGtCQUFrQixHQUFHLEtBQUssQ0FBQztvQkFDM0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNyQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7b0JBQzdDLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBWSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3ZFLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNsRixJQUFBLGtNQUVvQyxFQUZuQyxjQUFJLEVBQUUsd0JBQVMsQ0FFcUI7b0JBRTNDLDJDQUFrQyxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztvQkFDaEUsSUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2pDLElBQU0sUUFBUSxHQUFHLHdCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9