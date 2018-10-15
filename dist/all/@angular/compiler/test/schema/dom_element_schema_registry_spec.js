"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_element_schema_registry_1 = require("@angular/compiler/src/schema/dom_element_schema_registry");
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var schema_extractor_1 = require("./schema_extractor");
{
    testing_internal_1.describe('DOMElementSchema', function () {
        var registry;
        testing_internal_1.beforeEach(function () { registry = new dom_element_schema_registry_1.DomElementSchemaRegistry(); });
        testing_internal_1.it('should detect elements', function () {
            testing_internal_1.expect(registry.hasElement('div', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('b', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('ng-container', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('ng-content', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('my-cmp', [])).toBeFalsy();
            testing_internal_1.expect(registry.hasElement('abc', [])).toBeFalsy();
        });
        // https://github.com/angular/angular/issues/11219
        testing_internal_1.it('should detect elements missing from chrome', function () {
            testing_internal_1.expect(registry.hasElement('data', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('menuitem', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('summary', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('time', [])).toBeTruthy();
        });
        testing_internal_1.it('should detect properties on regular elements', function () {
            testing_internal_1.expect(registry.hasProperty('div', 'id', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('div', 'title', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h1', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h2', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h3', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h4', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h5', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h6', 'align', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('h7', 'align', [])).toBeFalsy();
            testing_internal_1.expect(registry.hasProperty('textarea', 'disabled', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('input', 'disabled', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('div', 'unknown', [])).toBeFalsy();
        });
        // https://github.com/angular/angular/issues/11219
        testing_internal_1.it('should detect properties on elements missing from Chrome', function () {
            testing_internal_1.expect(registry.hasProperty('data', 'value', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('menuitem', 'type', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('menuitem', 'default', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('time', 'dateTime', [])).toBeTruthy();
        });
        testing_internal_1.it('should detect different kinds of types', function () {
            // inheritance: video => media => [HTMLElement] => [Element]
            testing_internal_1.expect(registry.hasProperty('video', 'className', [])).toBeTruthy(); // from [Element]
            testing_internal_1.expect(registry.hasProperty('video', 'id', [])).toBeTruthy(); // string
            testing_internal_1.expect(registry.hasProperty('video', 'scrollLeft', [])).toBeTruthy(); // number
            testing_internal_1.expect(registry.hasProperty('video', 'height', [])).toBeTruthy(); // number
            testing_internal_1.expect(registry.hasProperty('video', 'autoplay', [])).toBeTruthy(); // boolean
            testing_internal_1.expect(registry.hasProperty('video', 'classList', [])).toBeTruthy(); // object
            // from *; but events are not properties
            testing_internal_1.expect(registry.hasProperty('video', 'click', [])).toBeFalsy();
        });
        testing_internal_1.it('should treat custom elements as an unknown element by default', function () {
            testing_internal_1.expect(registry.hasProperty('custom-like', 'unknown', [])).toBe(false);
            testing_internal_1.expect(registry.hasProperty('custom-like', 'className', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('custom-like', 'style', [])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('custom-like', 'id', [])).toBeTruthy();
        });
        testing_internal_1.it('should return true for custom-like elements if the CUSTOM_ELEMENTS_SCHEMA was used', function () {
            testing_internal_1.expect(registry.hasProperty('custom-like', 'unknown', [core_1.CUSTOM_ELEMENTS_SCHEMA])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('custom-like', [core_1.CUSTOM_ELEMENTS_SCHEMA])).toBeTruthy();
        });
        testing_internal_1.it('should return true for all elements if the NO_ERRORS_SCHEMA was used', function () {
            testing_internal_1.expect(registry.hasProperty('custom-like', 'unknown', [core_1.NO_ERRORS_SCHEMA])).toBeTruthy();
            testing_internal_1.expect(registry.hasProperty('a', 'unknown', [core_1.NO_ERRORS_SCHEMA])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('custom-like', [core_1.NO_ERRORS_SCHEMA])).toBeTruthy();
            testing_internal_1.expect(registry.hasElement('unknown', [core_1.NO_ERRORS_SCHEMA])).toBeTruthy();
        });
        testing_internal_1.it('should re-map property names that are specified in DOM facade', function () { testing_internal_1.expect(registry.getMappedPropName('readonly')).toEqual('readOnly'); });
        testing_internal_1.it('should not re-map property names that are not specified in DOM facade', function () {
            testing_internal_1.expect(registry.getMappedPropName('title')).toEqual('title');
            testing_internal_1.expect(registry.getMappedPropName('exotic-unknown')).toEqual('exotic-unknown');
        });
        testing_internal_1.it('should return an error message when asserting event properties', function () {
            var report = registry.validateProperty('onClick');
            testing_internal_1.expect(report.error).toBeTruthy();
            testing_internal_1.expect(report.msg)
                .toEqual("Binding to event property 'onClick' is disallowed for security reasons, please use (Click)=...\nIf 'onClick' is a directive input, make sure the directive is imported by the current module.");
            report = registry.validateProperty('onAnything');
            testing_internal_1.expect(report.error).toBeTruthy();
            testing_internal_1.expect(report.msg)
                .toEqual("Binding to event property 'onAnything' is disallowed for security reasons, please use (Anything)=...\nIf 'onAnything' is a directive input, make sure the directive is imported by the current module.");
        });
        testing_internal_1.it('should return an error message when asserting event attributes', function () {
            var report = registry.validateAttribute('onClick');
            testing_internal_1.expect(report.error).toBeTruthy();
            testing_internal_1.expect(report.msg)
                .toEqual("Binding to event attribute 'onClick' is disallowed for security reasons, please use (Click)=...");
            report = registry.validateAttribute('onAnything');
            testing_internal_1.expect(report.error).toBeTruthy();
            testing_internal_1.expect(report.msg)
                .toEqual("Binding to event attribute 'onAnything' is disallowed for security reasons, please use (Anything)=...");
        });
        testing_internal_1.it('should not return an error message when asserting non-event properties or attributes', function () {
            var report = registry.validateProperty('title');
            testing_internal_1.expect(report.error).toBeFalsy();
            testing_internal_1.expect(report.msg).not.toBeDefined();
            report = registry.validateProperty('exotic-unknown');
            testing_internal_1.expect(report.error).toBeFalsy();
            testing_internal_1.expect(report.msg).not.toBeDefined();
        });
        testing_internal_1.it('should return security contexts for elements', function () {
            testing_internal_1.expect(registry.securityContext('iframe', 'srcdoc', false)).toBe(core_1.SecurityContext.HTML);
            testing_internal_1.expect(registry.securityContext('p', 'innerHTML', false)).toBe(core_1.SecurityContext.HTML);
            testing_internal_1.expect(registry.securityContext('a', 'href', false)).toBe(core_1.SecurityContext.URL);
            testing_internal_1.expect(registry.securityContext('a', 'style', false)).toBe(core_1.SecurityContext.STYLE);
            testing_internal_1.expect(registry.securityContext('ins', 'cite', false)).toBe(core_1.SecurityContext.URL);
            testing_internal_1.expect(registry.securityContext('base', 'href', false)).toBe(core_1.SecurityContext.RESOURCE_URL);
        });
        testing_internal_1.it('should detect properties on namespaced elements', function () {
            var htmlAst = new html_parser_1.HtmlParser().parse('<svg:style>', 'TestComp');
            var nodeName = htmlAst.rootNodes[0].name;
            testing_internal_1.expect(registry.hasProperty(nodeName, 'type', [])).toBeTruthy();
        });
        testing_internal_1.it('should check security contexts case insensitive', function () {
            testing_internal_1.expect(registry.securityContext('p', 'iNnErHtMl', false)).toBe(core_1.SecurityContext.HTML);
            testing_internal_1.expect(registry.securityContext('p', 'formaction', false)).toBe(core_1.SecurityContext.URL);
            testing_internal_1.expect(registry.securityContext('p', 'formAction', false)).toBe(core_1.SecurityContext.URL);
        });
        testing_internal_1.it('should check security contexts for attributes', function () {
            testing_internal_1.expect(registry.securityContext('p', 'innerHtml', true)).toBe(core_1.SecurityContext.HTML);
            testing_internal_1.expect(registry.securityContext('p', 'formaction', true)).toBe(core_1.SecurityContext.URL);
        });
        testing_internal_1.describe('Angular custom elements', function () {
            testing_internal_1.it('should support <ng-container>', function () { testing_internal_1.expect(registry.hasProperty('ng-container', 'id', [])).toBeFalsy(); });
            testing_internal_1.it('should support <ng-content>', function () {
                testing_internal_1.expect(registry.hasProperty('ng-content', 'id', [])).toBeFalsy();
                testing_internal_1.expect(registry.hasProperty('ng-content', 'select', [])).toBeFalsy();
            });
        });
        if (browser_util_1.browserDetection.isChromeDesktop) {
            testing_internal_1.it('generate a new schema', function () {
                var schema = '\n';
                schema_extractor_1.extractSchema().forEach(function (props, name) { schema += "'" + name + "|" + props.join(',') + "',\n"; });
                // Uncomment this line to see:
                // the generated schema which can then be pasted to the DomElementSchemaRegistry
                // console.log(schema);
            });
        }
        testing_internal_1.describe('normalizeAnimationStyleProperty', function () {
            testing_internal_1.it('should normalize the given CSS property to camelCase', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleProperty('border-radius')).toBe('borderRadius');
                testing_internal_1.expect(registry.normalizeAnimationStyleProperty('zIndex')).toBe('zIndex');
                testing_internal_1.expect(registry.normalizeAnimationStyleProperty('-webkit-animation'))
                    .toBe('WebkitAnimation');
            });
        });
        testing_internal_1.describe('normalizeAnimationStyleValue', function () {
            testing_internal_1.it('should normalize the given dimensional CSS style value to contain a PX value when numeric', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('borderRadius', 'border-radius', 10)['value'])
                    .toBe('10px');
            });
            testing_internal_1.it('should not normalize any values that are of zero', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('opacity', 'opacity', 0)['value']).toBe('0');
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('width', 'width', 0)['value']).toBe('0');
            });
            testing_internal_1.it('should retain the given dimensional CSS style value\'s unit if it already exists', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('borderRadius', 'border-radius', '10em')['value'])
                    .toBe('10em');
            });
            testing_internal_1.it('should trim the provided CSS style value', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('color', 'color', '   red ')['value'])
                    .toBe('red');
            });
            testing_internal_1.it('should stringify all non dimensional numeric style values', function () {
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('zIndex', 'zIndex', 10)['value']).toBe('10');
                testing_internal_1.expect(registry.normalizeAnimationStyleValue('opacity', 'opacity', 0.5)['value'])
                    .toBe('0.5');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3NjaGVtYS9kb21fZWxlbWVudF9zY2hlbWFfcmVnaXN0cnlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHdHQUFrRztBQUNsRyxzQ0FBd0Y7QUFDeEYsK0VBQTRGO0FBQzVGLG1GQUFvRjtBQUdwRiwrREFBMkQ7QUFFM0QsdURBQWlEO0FBRWpEO0lBQ0UsMkJBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixJQUFJLFFBQWtDLENBQUM7UUFDdkMsNkJBQVUsQ0FBQyxjQUFRLFFBQVEsR0FBRyxJQUFJLHNEQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRSxxQkFBRSxDQUFDLHdCQUF3QixFQUFFO1lBQzNCLHlCQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEQseUJBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzdELHlCQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUUzRCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdEQseUJBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUss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