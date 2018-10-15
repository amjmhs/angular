"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("../../src/render3/definition");
var instructions_1 = require("../../src/render3/instructions");
var bypass_1 = require("../../src/sanitization/bypass");
var sanitization_1 = require("../../src/sanitization/sanitization");
var common_with_def_1 = require("./common_with_def");
var render_util_1 = require("./render_util");
describe('instructions', function () {
    function createAnchor() {
        instructions_1.elementStart(0, 'a');
        instructions_1.elementStyling();
        instructions_1.elementEnd();
    }
    function createDiv(initialStyles, styleSanitizer) {
        instructions_1.elementStart(0, 'div');
        instructions_1.elementStyling([], initialStyles && Array.isArray(initialStyles) ? initialStyles : null, styleSanitizer);
        instructions_1.elementEnd();
    }
    function createScript() {
        instructions_1.elementStart(0, 'script');
        instructions_1.elementEnd();
    }
    describe('bind', function () {
        it('should update bindings when value changes', function () {
            var t = new render_util_1.TemplateFixture(createAnchor);
            t.update(function () { return instructions_1.elementProperty(0, 'title', instructions_1.bind('Hello')); });
            expect(t.html).toEqual('<a title="Hello"></a>');
            t.update(function () { return instructions_1.elementProperty(0, 'title', instructions_1.bind('World')); });
            expect(t.html).toEqual('<a title="World"></a>');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
                rendererSetProperty: 2
            });
        });
        it('should not update bindings when value does not change', function () {
            var idempotentUpdate = function () { return instructions_1.elementProperty(0, 'title', instructions_1.bind('Hello')); };
            var t = new render_util_1.TemplateFixture(createAnchor, idempotentUpdate);
            t.update();
            expect(t.html).toEqual('<a title="Hello"></a>');
            t.update();
            expect(t.html).toEqual('<a title="Hello"></a>');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
                rendererSetProperty: 1
            });
        });
    });
    describe('element', function () {
        it('should create an element', function () {
            var t = new render_util_1.TemplateFixture(function () { instructions_1.element(0, 'div', ['id', 'test', 'title', 'Hello']); });
            var div = t.hostNode.native.querySelector('div');
            expect(div.id).toEqual('test');
            expect(div.title).toEqual('Hello');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
            });
        });
        it('should allow setting namespaced attributes', function () {
            var t = new render_util_1.TemplateFixture(function () {
                instructions_1.elementStart(0, 'div', [
                    // id="test"
                    'id',
                    'test',
                    0 /* NamespaceURI */,
                    'http://someuri.com/2018/test',
                    'test:foo',
                    'bar',
                    // title="Hello"
                    'title',
                    'Hello',
                ]);
                instructions_1.elementEnd();
            });
            var div = t.hostNode.native.querySelector('div');
            var attrs = div.attributes;
            expect(attrs['id'].name).toEqual('id');
            expect(attrs['id'].namespaceURI).toEqual(null);
            expect(attrs['id'].value).toEqual('test');
            expect(attrs['test:foo'].name).toEqual('test:foo');
            expect(attrs['test:foo'].namespaceURI).toEqual('http://someuri.com/2018/test');
            expect(attrs['test:foo'].value).toEqual('bar');
            expect(attrs['title'].name).toEqual('title');
            expect(attrs['title'].namespaceURI).toEqual(null);
            expect(attrs['title'].value).toEqual('Hello');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
                rendererSetAttribute: 3
            });
        });
    });
    describe('elementAttribute', function () {
        it('should use sanitizer function', function () {
            var t = new render_util_1.TemplateFixture(createDiv);
            t.update(function () { return instructions_1.elementAttribute(0, 'title', 'javascript:true', sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual('<div title="unsafe:javascript:true"></div>');
            t.update(function () { return instructions_1.elementAttribute(0, 'title', bypass_1.bypassSanitizationTrustUrl('javascript:true'), sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual('<div title="javascript:true"></div>');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
                rendererSetAttribute: 2
            });
        });
    });
    describe('elementProperty', function () {
        it('should use sanitizer function when available', function () {
            var t = new render_util_1.TemplateFixture(createDiv);
            t.update(function () { return instructions_1.elementProperty(0, 'title', 'javascript:true', sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual('<div title="unsafe:javascript:true"></div>');
            t.update(function () { return instructions_1.elementProperty(0, 'title', bypass_1.bypassSanitizationTrustUrl('javascript:false'), sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual('<div title="javascript:false"></div>');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
            });
        });
        it('should not stringify non string values', function () {
            var t = new render_util_1.TemplateFixture(createDiv);
            t.update(function () { return instructions_1.elementProperty(0, 'hidden', false); });
            // The hidden property would be true if `false` was stringified into `"false"`.
            expect(t.hostNode.native.querySelector('div').hidden).toEqual(false);
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 2,
                tView: 1,
                rendererCreateElement: 1,
                rendererSetProperty: 1
            });
        });
    });
    describe('elementStyleProp', function () {
        it('should automatically sanitize unless a bypass operation is applied', function () {
            var t = new render_util_1.TemplateFixture(function () { return createDiv(['background-image'], sanitization_1.defaultStyleSanitizer); });
            t.update(function () {
                instructions_1.elementStyleProp(0, 0, 'url("http://server")');
                instructions_1.elementStylingApply(0);
            });
            // nothing is set because sanitizer suppresses it.
            expect(t.html).toEqual('<div></div>');
            t.update(function () {
                instructions_1.elementStyleProp(0, 0, bypass_1.bypassSanitizationTrustStyle('url("http://server2")'));
                instructions_1.elementStylingApply(0);
            });
            expect(t.hostElement.firstChild.style.getPropertyValue('background-image'))
                .toEqual('url("http://server2")');
        });
        it('should not re-apply the style value even if it is a newly bypassed again', function () {
            var sanitizerInterceptor = new MockSanitizerInterceptor();
            var t = createTemplateFixtureWithSanitizer(function () { return createDiv(['background-image'], sanitizerInterceptor.getStyleSanitizer()); }, sanitizerInterceptor);
            t.update(function () {
                instructions_1.elementStyleProp(0, 0, bypass_1.bypassSanitizationTrustStyle('apple'));
                instructions_1.elementStylingApply(0);
            });
            expect(sanitizerInterceptor.lastValue).toEqual('apple');
            sanitizerInterceptor.lastValue = null;
            t.update(function () {
                instructions_1.elementStyleProp(0, 0, bypass_1.bypassSanitizationTrustStyle('apple'));
                instructions_1.elementStylingApply(0);
            });
            expect(sanitizerInterceptor.lastValue).toEqual(null);
        });
    });
    describe('elementStyleMap', function () {
        function createDivWithStyle() {
            instructions_1.elementStart(0, 'div');
            instructions_1.elementStyling([], ['height', 1 /* VALUES_MODE */, 'height', '10px']);
            instructions_1.elementEnd();
        }
        it('should add style', function () {
            var fixture = new render_util_1.TemplateFixture(createDivWithStyle);
            fixture.update(function () {
                instructions_1.elementStylingMap(0, null, { 'background-color': 'red' });
                instructions_1.elementStylingApply(0);
            });
            expect(fixture.html).toEqual('<div style="background-color: red; height: 10px;"></div>');
        });
        it('should sanitize new styles that may contain `url` properties', function () {
            var detectedValues = [];
            var sanitizerInterceptor = new MockSanitizerInterceptor(function (value) { detectedValues.push(value); });
            var fixture = createTemplateFixtureWithSanitizer(function () { return createDiv([], sanitizerInterceptor.getStyleSanitizer()); }, sanitizerInterceptor);
            fixture.update(function () {
                instructions_1.elementStylingMap(0, null, {
                    'background-image': 'background-image',
                    'background': 'background',
                    'border-image': 'border-image',
                    'list-style': 'list-style',
                    'list-style-image': 'list-style-image',
                    'filter': 'filter',
                    'width': 'width'
                });
                instructions_1.elementStylingApply(0);
            });
            var props = detectedValues.sort();
            expect(props).toEqual([
                'background', 'background-image', 'border-image', 'filter', 'list-style', 'list-style-image'
            ]);
        });
    });
    describe('elementClass', function () {
        function createDivWithStyling() {
            instructions_1.elementStart(0, 'div');
            instructions_1.elementStyling();
            instructions_1.elementEnd();
        }
        it('should add class', function () {
            var fixture = new render_util_1.TemplateFixture(createDivWithStyling);
            fixture.update(function () {
                instructions_1.elementStylingMap(0, 'multiple classes');
                instructions_1.elementStylingApply(0);
            });
            expect(fixture.html).toEqual('<div class="multiple classes"></div>');
        });
    });
    describe('performance counters', function () {
        it('should create tViews only once for each nested level', function () {
            var _c0 = ['ngFor', '', 'ngForOf', ''];
            /**
             * <ul *ngFor="let row of rows">
             *   <li *ngFor="let col of row.cols">{{col}}</li>
             * </ul>
             */
            var NestedLoops = /** @class */ (function () {
                function NestedLoops() {
                    this.rows = [['a', 'b'], ['A', 'B'], ['a', 'b'], ['A', 'B']];
                }
                NestedLoops.ngComponentDef = definition_1.defineComponent({
                    type: NestedLoops,
                    selectors: [['nested-loops']],
                    factory: function ToDoAppComponent_Factory() { return new NestedLoops(); },
                    template: function ToDoAppComponent_Template(rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, ToDoAppComponent_NgForOf_Template_0, null, _c0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'ngForOf', instructions_1.bind(ctx.rows));
                        }
                        function ToDoAppComponent_NgForOf_Template_0(rf, ctx0) {
                            if (rf & 1 /* Create */) {
                                instructions_1.elementStart(0, 'ul');
                                instructions_1.container(1, ToDoAppComponent_NgForOf_NgForOf_Template_1, null, _c0);
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                var row_r2 = ctx0.$implicit;
                                instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(row_r2));
                            }
                            function ToDoAppComponent_NgForOf_NgForOf_Template_1(rf, ctx1) {
                                if (rf & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'li');
                                    instructions_1.text(1);
                                    instructions_1.elementEnd();
                                }
                                if (rf & 2 /* Update */) {
                                    var col_r3 = ctx1.$implicit;
                                    instructions_1.textBinding(1, instructions_1.interpolation1('', col_r3, ''));
                                }
                            }
                        }
                    },
                    directives: [common_with_def_1.NgForOf]
                });
                return NestedLoops;
            }());
            var fixture = new render_util_1.ComponentFixture(NestedLoops);
            expect(ngDevMode).toHaveProperties({
                // Expect: fixture view/Host view + component + ngForRow + ngForCol
                tView: 4,
            });
        });
    });
    describe('sanitization injection compatibility', function () {
        it('should work for url sanitization', function () {
            var s = new LocalMockSanitizer(function (value) { return value + "-sanitized"; });
            var t = new render_util_1.TemplateFixture(createAnchor, undefined, null, null, s);
            var inputValue = 'http://foo';
            var outputValue = 'http://foo-sanitized';
            t.update(function () { return instructions_1.elementAttribute(0, 'href', inputValue, sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual("<a href=\"" + outputValue + "\"></a>");
            expect(s.lastSanitizedValue).toEqual(outputValue);
        });
        it('should bypass url sanitization if marked by the service', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createAnchor, undefined, null, null, s);
            var inputValue = s.bypassSecurityTrustUrl('http://foo');
            var outputValue = 'http://foo';
            t.update(function () { return instructions_1.elementAttribute(0, 'href', inputValue, sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual("<a href=\"" + outputValue + "\"></a>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should bypass ivy-level url sanitization if a custom sanitizer is used', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createAnchor, undefined, null, null, s);
            var inputValue = bypass_1.bypassSanitizationTrustUrl('http://foo');
            var outputValue = 'http://foo-ivy';
            t.update(function () { return instructions_1.elementAttribute(0, 'href', inputValue, sanitization_1.sanitizeUrl); });
            expect(t.html).toEqual("<a href=\"" + outputValue + "\"></a>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should work for style sanitization', function () {
            var s = new LocalMockSanitizer(function (value) { return "color:blue"; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = 'color:red';
            var outputValue = 'color:blue';
            t.update(function () { return instructions_1.elementAttribute(0, 'style', inputValue, sanitization_1.sanitizeStyle); });
            expect(stripStyleWsCharacters(t.html)).toEqual("<div style=\"" + outputValue + "\"></div>");
            expect(s.lastSanitizedValue).toEqual(outputValue);
        });
        it('should bypass style sanitization if marked by the service', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = s.bypassSecurityTrustStyle('color:maroon');
            var outputValue = 'color:maroon';
            t.update(function () { return instructions_1.elementAttribute(0, 'style', inputValue, sanitization_1.sanitizeStyle); });
            expect(stripStyleWsCharacters(t.html)).toEqual("<div style=\"" + outputValue + "\"></div>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should bypass ivy-level style sanitization if a custom sanitizer is used', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = bypass_1.bypassSanitizationTrustStyle('font-family:foo');
            var outputValue = 'font-family:foo-ivy';
            t.update(function () { return instructions_1.elementAttribute(0, 'style', inputValue, sanitization_1.sanitizeStyle); });
            expect(stripStyleWsCharacters(t.html)).toEqual("<div style=\"" + outputValue + "\"></div>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should work for resourceUrl sanitization', function () {
            var s = new LocalMockSanitizer(function (value) { return value + "-sanitized"; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = 'http://resource';
            var outputValue = 'http://resource-sanitized';
            t.update(function () { return instructions_1.elementAttribute(0, 'src', inputValue, sanitization_1.sanitizeResourceUrl); });
            expect(t.html).toEqual("<script src=\"" + outputValue + "\"></script>");
            expect(s.lastSanitizedValue).toEqual(outputValue);
        });
        it('should bypass resourceUrl sanitization if marked by the service', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = s.bypassSecurityTrustResourceUrl('file://all-my-secrets.pdf');
            var outputValue = 'file://all-my-secrets.pdf';
            t.update(function () { return instructions_1.elementAttribute(0, 'src', inputValue, sanitization_1.sanitizeResourceUrl); });
            expect(t.html).toEqual("<script src=\"" + outputValue + "\"></script>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should bypass ivy-level resourceUrl sanitization if a custom sanitizer is used', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = bypass_1.bypassSanitizationTrustResourceUrl('file://all-my-secrets.pdf');
            var outputValue = 'file://all-my-secrets.pdf-ivy';
            t.update(function () { return instructions_1.elementAttribute(0, 'src', inputValue, sanitization_1.sanitizeResourceUrl); });
            expect(t.html).toEqual("<script src=\"" + outputValue + "\"></script>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should work for script sanitization', function () {
            var s = new LocalMockSanitizer(function (value) { return value + " //sanitized"; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = 'fn();';
            var outputValue = 'fn(); //sanitized';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeScript); });
            expect(t.html).toEqual("<script>" + outputValue + "</script>");
            expect(s.lastSanitizedValue).toEqual(outputValue);
        });
        it('should bypass script sanitization if marked by the service', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = s.bypassSecurityTrustScript('alert("bar")');
            var outputValue = 'alert("bar")';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeScript); });
            expect(t.html).toEqual("<script>" + outputValue + "</script>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should bypass ivy-level script sanitization if a custom sanitizer is used', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createScript, undefined, null, null, s);
            var inputValue = bypass_1.bypassSanitizationTrustScript('alert("bar")');
            var outputValue = 'alert("bar")-ivy';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeScript); });
            expect(t.html).toEqual("<script>" + outputValue + "</script>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should work for html sanitization', function () {
            var s = new LocalMockSanitizer(function (value) { return value + " <!--sanitized-->"; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = '<header></header>';
            var outputValue = '<header></header> <!--sanitized-->';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeHtml); });
            expect(t.html).toEqual("<div>" + outputValue + "</div>");
            expect(s.lastSanitizedValue).toEqual(outputValue);
        });
        it('should bypass html sanitization if marked by the service', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = s.bypassSecurityTrustHtml('<div onclick="alert(123)"></div>');
            var outputValue = '<div onclick="alert(123)"></div>';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeHtml); });
            expect(t.html).toEqual("<div>" + outputValue + "</div>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
        it('should bypass ivy-level script sanitization if a custom sanitizer is used', function () {
            var s = new LocalMockSanitizer(function (value) { return ''; });
            var t = new render_util_1.TemplateFixture(createDiv, undefined, null, null, s);
            var inputValue = bypass_1.bypassSanitizationTrustHtml('<div onclick="alert(123)"></div>');
            var outputValue = '<div onclick="alert(123)"></div>-ivy';
            t.update(function () { return instructions_1.elementProperty(0, 'innerHTML', inputValue, sanitization_1.sanitizeHtml); });
            expect(t.html).toEqual("<div>" + outputValue + "</div>");
            expect(s.lastSanitizedValue).toBeFalsy();
        });
    });
});
var LocalSanitizedValue = /** @class */ (function () {
    function LocalSanitizedValue(value) {
        this.value = value;
    }
    LocalSanitizedValue.prototype.toString = function () { return this.value; };
    return LocalSanitizedValue;
}());
var LocalMockSanitizer = /** @class */ (function () {
    function LocalMockSanitizer(_interceptor) {
        this._interceptor = _interceptor;
    }
    LocalMockSanitizer.prototype.sanitize = function (context, value) {
        if (value instanceof String) {
            return value.toString() + '-ivy';
        }
        if (value instanceof LocalSanitizedValue) {
            return value.toString();
        }
        return this.lastSanitizedValue = this._interceptor(value);
    };
    LocalMockSanitizer.prototype.bypassSecurityTrustHtml = function (value) { return new LocalSanitizedValue(value); };
    LocalMockSanitizer.prototype.bypassSecurityTrustStyle = function (value) { return new LocalSanitizedValue(value); };
    LocalMockSanitizer.prototype.bypassSecurityTrustScript = function (value) { return new LocalSanitizedValue(value); };
    LocalMockSanitizer.prototype.bypassSecurityTrustUrl = function (value) { return new LocalSanitizedValue(value); };
    LocalMockSanitizer.prototype.bypassSecurityTrustResourceUrl = function (value) { return new LocalSanitizedValue(value); };
    return LocalMockSanitizer;
}());
var MockSanitizerInterceptor = /** @class */ (function () {
    function MockSanitizerInterceptor(_interceptorFn) {
        this._interceptorFn = _interceptorFn;
        this.lastValue = null;
    }
    MockSanitizerInterceptor.prototype.getStyleSanitizer = function () { return sanitization_1.defaultStyleSanitizer; };
    MockSanitizerInterceptor.prototype.sanitize = function (context, value) {
        if (this._interceptorFn) {
            this._interceptorFn(value);
        }
        return this.lastValue = value;
    };
    return MockSanitizerInterceptor;
}());
function stripStyleWsCharacters(value) {
    // color: blue; => color:blue
    return value.replace(/;/g, '').replace(/:\s+/g, ':');
}
function createTemplateFixtureWithSanitizer(buildFn, sanitizer) {
    return new render_util_1.TemplateFixture(buildFn, function () { }, null, null, sanitizer);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb25zX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9pbnN0cnVjdGlvbnNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILDJEQUE2RDtBQUM3RCwrREFBa1E7QUFJbFEsd0RBQXVNO0FBQ3ZNLG9FQUF5SjtBQUl6SixxREFBMEM7QUFDMUMsNkNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkI7UUFDRSwyQkFBWSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQiw2QkFBYyxFQUFFLENBQUM7UUFDakIseUJBQVUsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELG1CQUFtQixhQUFtQyxFQUFFLGNBQWdDO1FBQ3RGLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLDZCQUFjLENBQ1YsRUFBRSxFQUFFLGFBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUM5Rix5QkFBVSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQ7UUFDRSwyQkFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxQix5QkFBVSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFNUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFaEQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO2dCQUNqQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixLQUFLLEVBQUUsQ0FBQztnQkFDUixLQUFLLEVBQUUsQ0FBQztnQkFDUixxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixtQkFBbUIsRUFBRSxDQUFDO2FBQ3ZCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELElBQU0sZ0JBQWdCLEdBQUcsY0FBTSxPQUFBLDhCQUFlLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTFDLENBQTBDLENBQUM7WUFDMUUsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTlELENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFaEQsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2pDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUssRUFBRSxDQUFDO2dCQUNSLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3hCLG1CQUFtQixFQUFFLENBQUM7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLElBQU0sQ0FBQyxHQUFHLElBQUksNkJBQWUsQ0FBQyxjQUFRLHNCQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixJQUFNLEdBQUcsR0FBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQXNCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBRyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDakMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IscUJBQXFCLEVBQUUsQ0FBQzthQUN6QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUM7Z0JBQzVCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtvQkFDckIsWUFBWTtvQkFDWixJQUFJO29CQUNKLE1BQU07O29CQUdOLDhCQUE4QjtvQkFDOUIsVUFBVTtvQkFDVixLQUFLO29CQUNMLGdCQUFnQjtvQkFDaEIsT0FBTztvQkFDUCxPQUFPO2lCQUNSLENBQUMsQ0FBQztnQkFDSCx5QkFBVSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sR0FBRyxHQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBc0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFHLENBQUM7WUFDdEUsSUFBTSxLQUFLLEdBQVEsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUVsQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUxQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDakMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IscUJBQXFCLEVBQUUsQ0FBQztnQkFDeEIsb0JBQW9CLEVBQUUsQ0FBQzthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNsQyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFekMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsK0JBQWdCLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSwwQkFBVyxDQUFDLEVBQTVELENBQTRELENBQUMsQ0FBQztZQUM3RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBRXJFLENBQUMsQ0FBQyxNQUFNLENBQ0osY0FBTSxPQUFBLCtCQUFnQixDQUNsQixDQUFDLEVBQUUsT0FBTyxFQUFFLG1DQUEwQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsMEJBQVcsQ0FBQyxFQURyRSxDQUNxRSxDQUFDLENBQUM7WUFDakYsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2pDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUssRUFBRSxDQUFDO2dCQUNSLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3hCLG9CQUFvQixFQUFFLENBQUM7YUFDeEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXpDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLDhCQUFlLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSwwQkFBVyxDQUFDLEVBQTNELENBQTJELENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBRXJFLENBQUMsQ0FBQyxNQUFNLENBQ0osY0FBTSxPQUFBLDhCQUFlLENBQ2pCLENBQUMsRUFBRSxPQUFPLEVBQUUsbUNBQTBCLENBQUMsa0JBQWtCLENBQUMsRUFBRSwwQkFBVyxDQUFDLEVBRHRFLENBQ3NFLENBQUMsQ0FBQztZQUNsRixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDakMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IscUJBQXFCLEVBQUUsQ0FBQzthQUN6QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFekMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7WUFDcEQsK0VBQStFO1lBQy9FLE1BQU0sQ0FBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQXNCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2pDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUssRUFBRSxDQUFDO2dCQUNSLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3hCLG1CQUFtQixFQUFFLENBQUM7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUN6QixjQUFRLE9BQU8sU0FBUyxDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRSxvQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDUCwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLENBQUM7Z0JBQy9DLGtDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsa0RBQWtEO1lBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXRDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ1AsK0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxxQ0FBNEIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLGtDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBMEIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDdkYsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7WUFDNUQsSUFBTSxDQUFDLEdBQUcsa0NBQWtDLENBQ3hDLGNBQU0sT0FBQSxTQUFTLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBekUsQ0FBeUUsRUFDL0Usb0JBQW9CLENBQUMsQ0FBQztZQUUxQixDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNQLCtCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUscUNBQTRCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsa0NBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELG9CQUFvQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFFdEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDUCwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHFDQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzlELGtDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCO1lBQ0UsMkJBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkIsNkJBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLHVCQUFtQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsRix5QkFBVSxFQUFFLENBQUM7UUFDZixDQUFDO1FBRUQsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JCLElBQU0sT0FBTyxHQUFHLElBQUksNkJBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ2IsZ0NBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7Z0JBQ3hELGtDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtZQUNqRSxJQUFNLGNBQWMsR0FBYSxFQUFFLENBQUM7WUFDcEMsSUFBTSxvQkFBb0IsR0FDdEIsSUFBSSx3QkFBd0IsQ0FBQyxVQUFBLEtBQUssSUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsSUFBTSxPQUFPLEdBQUcsa0NBQWtDLENBQzlDLGNBQU0sT0FBQSxTQUFTLENBQUMsRUFBRSxFQUFFLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBdkQsQ0FBdUQsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBRXpGLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ2IsZ0NBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRTtvQkFDekIsa0JBQWtCLEVBQUUsa0JBQWtCO29CQUN0QyxZQUFZLEVBQUUsWUFBWTtvQkFDMUIsY0FBYyxFQUFFLGNBQWM7b0JBQzlCLFlBQVksRUFBRSxZQUFZO29CQUMxQixrQkFBa0IsRUFBRSxrQkFBa0I7b0JBQ3RDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixPQUFPLEVBQUUsT0FBTztpQkFDakIsQ0FBQyxDQUFDO2dCQUNILGtDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BCLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxrQkFBa0I7YUFDN0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkI7WUFDRSwyQkFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2Qiw2QkFBYyxFQUFFLENBQUM7WUFDakIseUJBQVUsRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUVELEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNyQixJQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUMxRCxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUNiLGdDQUFpQixDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN6QyxrQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsSUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6Qzs7OztlQUlHO1lBQ0g7Z0JBQUE7b0JBQ0UsU0FBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkF3QzFELENBQUM7Z0JBdENRLDBCQUFjLEdBQUcsNEJBQWUsQ0FBQztvQkFDdEMsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFNBQVMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzdCLE9BQU8sRUFBRSxzQ0FBc0MsT0FBTyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUUsUUFBUSxFQUFFLG1DQUFtQyxFQUFlLEVBQUUsR0FBZ0I7d0JBQzVFLElBQUksRUFBRSxpQkFBcUIsRUFBRTs0QkFDM0Isd0JBQVMsQ0FBQyxDQUFDLEVBQUUsbUNBQW1DLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUM5RDt3QkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7NEJBQzNCLDhCQUFlLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxtQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3lCQUMvQzt3QkFDRCw2Q0FDSSxFQUFlLEVBQUUsSUFBeUI7NEJBQzVDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQ0FDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0NBQ3RCLHdCQUFTLENBQUMsQ0FBQyxFQUFFLDJDQUEyQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQ0FDckUseUJBQVUsRUFBRSxDQUFDOzZCQUNkOzRCQUNELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQ0FDM0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQ0FDOUIsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLG1CQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs2QkFDN0M7NEJBQ0QscURBQ0ksRUFBZSxFQUFFLElBQXlCO2dDQUM1QyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0NBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUN0QixtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUNSLHlCQUFVLEVBQUUsQ0FBQztpQ0FDZDtnQ0FDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0NBQzNCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQzlCLDBCQUFXLENBQUMsQ0FBQyxFQUFFLDZCQUFjLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUNoRDs0QkFDSCxDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQztvQkFDRCxVQUFVLEVBQUUsQ0FBQyx5QkFBTyxDQUFDO2lCQUN0QixDQUFDLENBQUM7Z0JBQ0wsa0JBQUM7YUFBQSxBQXpDRCxJQXlDQztZQUNELElBQU0sT0FBTyxHQUFHLElBQUksOEJBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO2dCQUNqQyxtRUFBbUU7Z0JBQ25FLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxzQ0FBc0MsRUFBRTtRQUMvQyxFQUFFLENBQUMsa0NBQWtDLEVBQUU7WUFDckMsSUFBTSxDQUFDLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFHLEtBQUssZUFBWSxFQUFwQixDQUFvQixDQUFDLENBQUM7WUFDaEUsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7WUFDaEMsSUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7WUFFM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsK0JBQWdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsMEJBQVcsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBWSxXQUFXLFlBQVEsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7WUFDNUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxRCxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUM7WUFFakMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsK0JBQWdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsMEJBQVcsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBWSxXQUFXLFlBQVEsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3RUFBd0UsRUFBRTtZQUMzRSxJQUFNLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsRUFBRSxFQUFGLENBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQU0sQ0FBQyxHQUFHLElBQUksNkJBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBTSxVQUFVLEdBQUcsbUNBQTBCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUQsSUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7WUFFckMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsK0JBQWdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsMEJBQVcsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBWSxXQUFXLFlBQVEsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxJQUFNLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsWUFBWSxFQUFaLENBQVksQ0FBQyxDQUFDO1lBQ3hELElBQU0sQ0FBQyxHQUFHLElBQUksNkJBQWUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQy9CLElBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQztZQUVqQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSw0QkFBYSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFlLFdBQVcsY0FBVSxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM5RCxJQUFNLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsRUFBRSxFQUFGLENBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQU0sQ0FBQyxHQUFHLElBQUksNkJBQWUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQztZQUVuQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSw0QkFBYSxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFlLFdBQVcsY0FBVSxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO1lBQzdFLElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7WUFDOUMsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFNLFVBQVUsR0FBRyxxQ0FBNEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ25FLElBQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDO1lBRTFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLCtCQUFnQixDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLDRCQUFhLENBQUMsRUFBdkQsQ0FBdUQsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWUsV0FBVyxjQUFVLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBTSxDQUFDLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFHLEtBQUssZUFBWSxFQUFwQixDQUFvQixDQUFDLENBQUM7WUFDaEUsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQztZQUNyQyxJQUFNLFdBQVcsR0FBRywyQkFBMkIsQ0FBQztZQUVoRCxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxrQ0FBbUIsQ0FBQyxFQUEzRCxDQUEyRCxDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQWdCLFdBQVcsaUJBQWEsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUVBQWlFLEVBQUU7WUFDcEUsSUFBTSxDQUFDLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQ2pGLElBQU0sV0FBVyxHQUFHLDJCQUEyQixDQUFDO1lBRWhELENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLCtCQUFnQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGtDQUFtQixDQUFDLEVBQTNELENBQTJELENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBZ0IsV0FBVyxpQkFBYSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdGQUFnRixFQUFFO1lBQ25GLElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7WUFDOUMsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFNLFVBQVUsR0FBRywyQ0FBa0MsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQ25GLElBQU0sV0FBVyxHQUFHLCtCQUErQixDQUFDO1lBRXBELENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLCtCQUFnQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGtDQUFtQixDQUFDLEVBQTNELENBQTJELENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBZ0IsV0FBVyxpQkFBYSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBRyxLQUFLLGlCQUFjLEVBQXRCLENBQXNCLENBQUMsQ0FBQztZQUNsRSxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztZQUMzQixJQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztZQUV4QyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSw4QkFBZSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLDZCQUFjLENBQUMsRUFBM0QsQ0FBMkQsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQVcsV0FBVyxjQUFXLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQy9ELElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7WUFDOUMsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMseUJBQXlCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0QsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1lBRW5DLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLDhCQUFlLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsNkJBQWMsQ0FBQyxFQUEzRCxDQUEyRCxDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBVyxXQUFXLGNBQVcsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsRUFBRSxFQUFGLENBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQU0sQ0FBQyxHQUFHLElBQUksNkJBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBTSxVQUFVLEdBQUcsc0NBQTZCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDakUsSUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7WUFFdkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSw2QkFBYyxDQUFDLEVBQTNELENBQTJELENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFXLFdBQVcsY0FBVyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBRyxLQUFLLHNCQUFtQixFQUEzQixDQUEyQixDQUFDLENBQUM7WUFDdkUsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQztZQUN2QyxJQUFNLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQztZQUV6RCxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSw4QkFBZSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLDJCQUFZLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVEsV0FBVyxXQUFRLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzdELElBQU0sQ0FBQyxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7WUFDOUMsSUFBTSxDQUFDLEdBQUcsSUFBSSw2QkFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUNqRixJQUFNLFdBQVcsR0FBRyxrQ0FBa0MsQ0FBQztZQUV2RCxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSw4QkFBZSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLDJCQUFZLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVEsV0FBVyxXQUFRLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkVBQTJFLEVBQUU7WUFDOUUsSUFBTSxDQUFDLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLDZCQUFlLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQU0sVUFBVSxHQUFHLG9DQUEyQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDbkYsSUFBTSxXQUFXLEdBQUcsc0NBQXNDLENBQUM7WUFFM0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSwyQkFBWSxDQUFDLEVBQXpELENBQXlELENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFRLFdBQVcsV0FBUSxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVIO0lBQ0UsNkJBQW1CLEtBQVU7UUFBVixVQUFLLEdBQUwsS0FBSyxDQUFLO0lBQUcsQ0FBQztJQUVqQyxzQ0FBUSxHQUFSLGNBQWEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuQywwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7SUFJRSw0QkFBb0IsWUFBZ0Q7UUFBaEQsaUJBQVksR0FBWixZQUFZLENBQW9DO0lBQUcsQ0FBQztJQUV4RSxxQ0FBUSxHQUFSLFVBQVMsT0FBd0IsRUFBRSxLQUEwQztRQUMzRSxJQUFJLEtBQUssWUFBWSxNQUFNLEVBQUU7WUFDM0IsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxLQUFLLFlBQVksbUJBQW1CLEVBQUU7WUFDeEMsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxvREFBdUIsR0FBdkIsVUFBd0IsS0FBYSxJQUFJLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakYscURBQXdCLEdBQXhCLFVBQXlCLEtBQWEsSUFBSSxPQUFPLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxGLHNEQUF5QixHQUF6QixVQUEwQixLQUFhLElBQUksT0FBTyxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRixtREFBc0IsR0FBdEIsVUFBdUIsS0FBYSxJQUFJLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEYsMkRBQThCLEdBQTlCLFVBQStCLEtBQWEsSUFBSSxPQUFPLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLHlCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQztBQUVEO0lBRUUsa0NBQW9CLGNBQTJDO1FBQTNDLG1CQUFjLEdBQWQsY0FBYyxDQUE2QjtRQUR4RCxjQUFTLEdBQWdCLElBQUksQ0FBQztJQUM2QixDQUFDO0lBQ25FLG9EQUFpQixHQUFqQixjQUFzQixPQUFPLG9DQUFxQixDQUFDLENBQUMsQ0FBQztJQUNyRCwyQ0FBUSxHQUFSLFVBQVMsT0FBd0IsRUFBRSxLQUEwQztRQUMzRSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDaEMsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFFRCxnQ0FBZ0MsS0FBYTtJQUMzQyw2QkFBNkI7SUFDN0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCw0Q0FBNEMsT0FBa0IsRUFBRSxTQUFvQjtJQUNsRixPQUFPLElBQUksNkJBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN2RSxDQUFDIn0=