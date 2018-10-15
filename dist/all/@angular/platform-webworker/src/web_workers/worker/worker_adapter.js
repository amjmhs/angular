"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
/**
 * This adapter is required to log error messages.
 *
 * Note: other methods all throw as the DOM is not accessible directly in web worker context.
 */
var WorkerDomAdapter = /** @class */ (function (_super) {
    __extends(WorkerDomAdapter, _super);
    function WorkerDomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkerDomAdapter.makeCurrent = function () { platform_browser_1.ɵsetRootDomAdapter(new WorkerDomAdapter()); };
    WorkerDomAdapter.prototype.logError = function (error) {
        if (console.error) {
            console.error(error);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    };
    WorkerDomAdapter.prototype.log = function (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
    };
    WorkerDomAdapter.prototype.logGroup = function (error) {
        if (console.group) {
            console.group(error);
            this.logError(error);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    };
    WorkerDomAdapter.prototype.logGroupEnd = function () {
        if (console.groupEnd) {
            console.groupEnd();
        }
    };
    WorkerDomAdapter.prototype.contains = function (nodeA, nodeB) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasProperty = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setProperty = function (el, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getProperty = function (el, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.invoke = function (el, methodName, args) { throw 'not implemented'; };
    Object.defineProperty(WorkerDomAdapter.prototype, "attrToPropMap", {
        get: function () { throw 'not implemented'; },
        set: function (value) { throw 'not implemented'; },
        enumerable: true,
        configurable: true
    });
    WorkerDomAdapter.prototype.parse = function (templateHtml) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.querySelector = function (el, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.querySelectorAll = function (el, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.on = function (el, evt, listener) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.onAndCancel = function (el, evt, listener) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.dispatchEvent = function (el, evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createMouseEvent = function (eventType) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createEvent = function (eventType) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.preventDefault = function (evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isPrevented = function (evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getInnerHTML = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTemplateContent = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getOuterHTML = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nodeName = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nodeValue = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.type = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.content = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.firstChild = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nextSibling = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.parentElement = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.childNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.childNodesAsList = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.clearNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.appendChild = function (el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeChild = function (el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.replaceChild = function (el, newNode, oldNode) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.remove = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertBefore = function (parent, el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertAllBefore = function (parent, el, nodes) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertAfter = function (parent, el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setInnerHTML = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getText = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setText = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getValue = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setValue = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getChecked = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setChecked = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createComment = function (text) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createTemplate = function (html) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createElement = function (tagName, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createElementNS = function (ns, tagName, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createTextNode = function (text, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        throw 'not implemented';
    };
    WorkerDomAdapter.prototype.createStyleElement = function (css, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createShadowRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getShadowRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHost = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getDistributedNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.clone = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getElementsByClassName = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getElementsByTagName = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.classList = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.addClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setStyle = function (element, styleName, styleValue) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeStyle = function (element, styleName) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getStyle = function (element, styleName) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        throw 'not implemented';
    };
    WorkerDomAdapter.prototype.tagName = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.attributeMap = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setAttribute = function (element, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.templateAwareRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createHtmlDocument = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getDefaultDocument = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getBoundingClientRect = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTitle = function (doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setTitle = function (doc, newTitle) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.elementMatches = function (n, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isTemplateElement = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isTextNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isCommentNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isElementNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasShadowRoot = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isShadowRoot = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.importIntoDoc = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.adoptNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHref = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getEventKey = function (event) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.resolveAndSetHref = function (element, baseUrl, href) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsDOMEvents = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsNativeShadowDOM = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getGlobalEventTarget = function (doc, target) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHistory = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getLocation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getBaseHref = function (doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.resetBaseElement = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getUserAgent = function () { return 'Fake user agent'; };
    WorkerDomAdapter.prototype.setData = function (element, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getComputedStyle = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getData = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.performanceNow = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAnimationPrefix = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTransitionEnd = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsAnimation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsWebAnimation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsCookies = function () { return false; };
    WorkerDomAdapter.prototype.getCookie = function (name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setCookie = function (name, value) { throw 'not implemented'; };
    return WorkerDomAdapter;
}(platform_browser_1.ɵDomAdapter));
exports.WorkerDomAdapter = WorkerDomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci93b3JrZXJfYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4REFBNkc7QUFFN0c7Ozs7R0FJRztBQUNIO0lBQXNDLG9DQUFVO0lBQWhEOztJQXlKQSxDQUFDO0lBeEpRLDRCQUFXLEdBQWxCLGNBQXVCLHFDQUFpQixDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRSxtQ0FBUSxHQUFSLFVBQVMsS0FBVTtRQUNqQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsOEJBQUcsR0FBSCxVQUFJLEtBQVU7UUFDWixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsbUNBQVEsR0FBUixVQUFTLEtBQVU7UUFDakIsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsc0NBQVcsR0FBWDtRQUNFLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixPQUFPLENBQUMsUUFBUSxF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