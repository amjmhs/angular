"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
{
    testing_internal_1.describe('dom adapter', function () {
        var defaultDoc;
        testing_internal_1.beforeEach(function () {
            defaultDoc = dom_adapter_1.getDOM().supportsDOMEvents() ? document : dom_adapter_1.getDOM().createHtmlDocument();
        });
        testing_internal_1.it('should not coalesque text nodes', function () {
            var el1 = browser_util_1.el('<div>a</div>');
            var el2 = browser_util_1.el('<div>b</div>');
            dom_adapter_1.getDOM().appendChild(el2, dom_adapter_1.getDOM().firstChild(el1));
            testing_internal_1.expect(dom_adapter_1.getDOM().childNodes(el2).length).toBe(2);
            var el2Clone = dom_adapter_1.getDOM().clone(el2);
            testing_internal_1.expect(dom_adapter_1.getDOM().childNodes(el2Clone).length).toBe(2);
        });
        testing_internal_1.it('should clone correctly', function () {
            var el1 = browser_util_1.el('<div x="y">a<span>b</span></div>');
            var clone = dom_adapter_1.getDOM().clone(el1);
            testing_internal_1.expect(clone).not.toBe(el1);
            dom_adapter_1.getDOM().setAttribute(clone, 'test', '1');
            testing_internal_1.expect(browser_util_1.stringifyElement(clone)).toEqual('<div test="1" x="y">a<span>b</span></div>');
            testing_internal_1.expect(dom_adapter_1.getDOM().getAttribute(el1, 'test')).toBeFalsy();
            var cNodes = dom_adapter_1.getDOM().childNodes(clone);
            var firstChild = cNodes[0];
            var secondChild = cNodes[1];
            testing_internal_1.expect(dom_adapter_1.getDOM().parentElement(firstChild)).toBe(clone);
            testing_internal_1.expect(dom_adapter_1.getDOM().nextSibling(firstChild)).toBe(secondChild);
            testing_internal_1.expect(dom_adapter_1.getDOM().isTextNode(firstChild)).toBe(true);
            testing_internal_1.expect(dom_adapter_1.getDOM().parentElement(secondChild)).toBe(clone);
            testing_internal_1.expect(dom_adapter_1.getDOM().nextSibling(secondChild)).toBeFalsy();
            testing_internal_1.expect(dom_adapter_1.getDOM().isElementNode(secondChild)).toBe(true);
        });
        testing_internal_1.it('should be able to create text nodes and use them with the other APIs', function () {
            var t = dom_adapter_1.getDOM().createTextNode('hello');
            testing_internal_1.expect(dom_adapter_1.getDOM().isTextNode(t)).toBe(true);
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().appendChild(d, t);
            testing_internal_1.expect(dom_adapter_1.getDOM().getInnerHTML(d)).toEqual('hello');
        });
        testing_internal_1.it('should set className via the class attribute', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setAttribute(d, 'class', 'class1');
            testing_internal_1.expect(d.className).toEqual('class1');
        });
        testing_internal_1.it('should allow to remove nodes without parents', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            testing_internal_1.expect(function () { return dom_adapter_1.getDOM().remove(d); }).not.toThrow();
        });
        testing_internal_1.it('should parse styles with urls correctly', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setStyle(d, 'background-url', 'url(http://test.com/bg.jpg)');
            testing_internal_1.expect(dom_adapter_1.getDOM().getStyle(d, 'background-url')).toBe('url(http://test.com/bg.jpg)');
        });
        // Test for regression caused by angular/angular#22536
        testing_internal_1.it('should parse styles correctly following the spec', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setStyle(d, 'background-image', 'url("paper.gif")');
            testing_internal_1.expect(d.style.backgroundImage).toBe('url("paper.gif")');
            testing_internal_1.expect(d.style.getPropertyValue('background-image')).toBe('url("paper.gif")');
            testing_internal_1.expect(dom_adapter_1.getDOM().getStyle(d, 'background-image')).toBe('url("paper.gif")');
        });
        testing_internal_1.it('should parse camel-case styles correctly', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setStyle(d, 'marginRight', '10px');
            testing_internal_1.expect(dom_adapter_1.getDOM().getStyle(d, 'margin-right')).toBe('10px');
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.describe('getBaseHref', function () {
                testing_internal_1.beforeEach(function () { return dom_adapter_1.getDOM().resetBaseElement(); });
                testing_internal_1.it('should return null if base element is absent', function () { testing_internal_1.expect(dom_adapter_1.getDOM().getBaseHref(defaultDoc)).toBeNull(); });
                testing_internal_1.it('should return the value of the base element', function () {
                    var baseEl = dom_adapter_1.getDOM().createElement('base');
                    dom_adapter_1.getDOM().setAttribute(baseEl, 'href', '/drop/bass/connon/');
                    var headEl = defaultDoc.head;
                    dom_adapter_1.getDOM().appendChild(headEl, baseEl);
                    var baseHref = dom_adapter_1.getDOM().getBaseHref(defaultDoc);
                    dom_adapter_1.getDOM().removeChild(headEl, baseEl);
                    dom_adapter_1.getDOM().resetBaseElement();
                    testing_internal_1.expect(baseHref).toEqual('/drop/bass/connon/');
                });
                testing_internal_1.it('should return a relative url', function () {
                    var baseEl = dom_adapter_1.getDOM().createElement('base');
                    dom_adapter_1.getDOM().setAttribute(baseEl, 'href', 'base');
                    var headEl = defaultDoc.head;
                    dom_adapter_1.getDOM().appendChild(headEl, baseEl);
                    var baseHref = dom_adapter_1.getDOM().getBaseHref(defaultDoc);
                    dom_adapter_1.getDOM().removeChild(headEl, baseEl);
                    dom_adapter_1.getDOM().resetBaseElement();
                    testing_internal_1.expect(baseHref.endsWith('/base')).toBe(true);
                });
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2FkYXB0ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kb20vZG9tX2FkYXB0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUE0RjtBQUM1Riw2RUFBcUU7QUFDckUsbUZBQXdGO0FBRXhGO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBSSxVQUFlLENBQUM7UUFDcEIsNkJBQVUsQ0FBQztZQUNULFVBQVUsR0FBRyxvQkFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxvQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMsSUFBTSxHQUFHLEdBQUcsaUJBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMvQixJQUFNLEdBQUcsR0FBRyxpQkFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9CLG9CQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhELElBQU0sUUFBUSxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMseUJBQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FB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