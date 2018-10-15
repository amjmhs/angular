"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Attention:
// This file duplicates types and values from @angular/core
// so that we are able to make @angular/compiler independent of @angular/core.
// This is important to prevent a build cycle, as @angular/core needs to
// be compiled with the compiler.
var selector_1 = require("./selector");
exports.createInject = makeMetadataFactory('Inject', function (token) { return ({ token: token }); });
exports.createInjectionToken = makeMetadataFactory('InjectionToken', function (desc) { return ({ _desc: desc, ngInjectableDef: undefined }); });
exports.createAttribute = makeMetadataFactory('Attribute', function (attributeName) { return ({ attributeName: attributeName }); });
exports.createContentChildren = makeMetadataFactory('ContentChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: false, isViewQuery: false, descendants: false }, data));
});
exports.createContentChild = makeMetadataFactory('ContentChild', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: true, isViewQuery: false, descendants: true }, data));
});
exports.createViewChildren = makeMetadataFactory('ViewChildren', function (selector, data) {
    if (data === void 0) { data = {}; }
    return (__assign({ selector: selector, first: false, isViewQuery: true, descendants: true }, data));
});
exports.createViewChild = makeMetadataFactory('ViewChild', function (selector, data) {
    return (__assign({ selector: selector, first: true, isViewQuery: true, descendants: true }, data));
});
exports.createDirective = makeMetadataFactory('Directive', function (dir) {
    if (dir === void 0) { dir = {}; }
    return dir;
});
var ViewEncapsulation;
(function (ViewEncapsulation) {
    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
    ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
})(ViewEncapsulation = exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
var ChangeDetectionStrategy;
(function (ChangeDetectionStrategy) {
    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(ChangeDetectionStrategy = exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
exports.createComponent = makeMetadataFactory('Component', function (c) {
    if (c === void 0) { c = {}; }
    return (__assign({ changeDetection: ChangeDetectionStrategy.Default }, c));
});
exports.createPipe = makeMetadataFactory('Pipe', function (p) { return (__assign({ pure: true }, p)); });
exports.createInput = makeMetadataFactory('Input', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
exports.createOutput = makeMetadataFactory('Output', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
exports.createHostBinding = makeMetadataFactory('HostBinding', function (hostPropertyName) { return ({ hostPropertyName: hostPropertyName }); });
exports.createHostListener = makeMetadataFactory('HostListener', function (eventName, args) { return ({ eventName: eventName, args: args }); });
exports.createNgModule = makeMetadataFactory('NgModule', function (ngModule) { return ngModule; });
exports.createInjectable = makeMetadataFactory('Injectable', function (injectable) {
    if (injectable === void 0) { injectable = {}; }
    return injectable;
});
exports.CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
exports.NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
exports.createOptional = makeMetadataFactory('Optional');
exports.createSelf = makeMetadataFactory('Self');
exports.createSkipSelf = makeMetadataFactory('SkipSelf');
exports.createHost = makeMetadataFactory('Host');
exports.Type = Function;
var SecurityContext;
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext = exports.SecurityContext || (exports.SecurityContext = {}));
var MissingTranslationStrategy;
(function (MissingTranslationStrategy) {
    MissingTranslationStrategy[MissingTranslationStrategy["Error"] = 0] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy["Warning"] = 1] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy = exports.MissingTranslationStrategy || (exports.MissingTranslationStrategy = {}));
function makeMetadataFactory(name, props) {
    var factory = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var values = props ? props.apply(void 0, args) : {};
        return __assign({ ngMetadataName: name }, values);
    };
    factory.isTypeOf = function (obj) { return obj && obj.ngMetadataName === name; };
    factory.ngMetadataName = name;
    return factory;
}
function parserSelectorToSimpleSelector(selector) {
    var classes = selector.classNames && selector.classNames.length ? [8 /* CLASS */].concat(selector.classNames) :
        [];
    var elementName = selector.element && selector.element !== '*' ? selector.element : '';
    return [elementName].concat(selector.attrs, classes);
}
function parserSelectorToNegativeSelector(selector) {
    var classes = selector.classNames && selector.classNames.length ? [8 /* CLASS */].concat(selector.classNames) :
        [];
    if (selector.element) {
        return [
            1 /* NOT */ | 4 /* ELEMENT */, selector.element
        ].concat(selector.attrs, classes);
    }
    else if (selector.attrs.length) {
        return [1 /* NOT */ | 2 /* ATTRIBUTE */].concat(selector.attrs, classes);
    }
    else {
        return selector.classNames && selector.classNames.length ? [1 /* NOT */ | 8 /* CLASS */].concat(selector.classNames) :
            [];
    }
}
function parserSelectorToR3Selector(selector) {
    var positive = parserSelectorToSimpleSelector(selector);
    var negative = selector.notSelectors && selector.notSelectors.length ?
        selector.notSelectors.map(function (notSelector) { return parserSelectorToNegativeSelector(notSelector); }) :
        [];
    return positive.concat.apply(positive, negative);
}
function parseSelectorToR3Selector(selector) {
    var selectors = selector_1.CssSelector.parse(selector);
    return selectors.map(parserSelectorToR3Selector);
}
exports.parseSelectorToR3Selector = parseSelectorToR3Selector;
//# sourceMappingURL=core.js.map