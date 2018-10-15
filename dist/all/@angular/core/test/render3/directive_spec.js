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
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('directive', function () {
    describe('host', function () {
        it('should support host bindings in directives', function () {
            var directiveInstance;
            var Directive = /** @class */ (function () {
                function Directive() {
                    this.klass = 'foo';
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'dir', '']],
                    factory: function () { return directiveInstance = new Directive; },
                    hostBindings: function (directiveIndex, elementIndex) {
                        instructions_1.elementProperty(elementIndex, 'className', instructions_1.bind(instructions_1.loadDirective(directiveIndex).klass));
                    }
                });
                return Directive;
            }());
            function Template() {
                instructions_1.elementStart(0, 'span', [1 /* SelectOnly */, 'dir']);
                instructions_1.elementEnd();
            }
            var fixture = new render_util_1.TemplateFixture(Template, function () { }, [Directive]);
            expect(fixture.html).toEqual('<span class="foo"></span>');
            directiveInstance.klass = 'bar';
            fixture.update();
            expect(fixture.html).toEqual('<span class="bar"></span>');
        });
    });
    describe('selectors', function () {
        it('should match directives with attribute selectors on bindings', function () {
            var directiveInstance;
            var Directive = /** @class */ (function () {
                function Directive() {
                }
                Object.defineProperty(Directive.prototype, "test", {
                    /**
                     * A setter to assert that a binding is not invoked with stringified attribute value
                     */
                    set: function (value) {
                        // if a binding is processed correctly we should only be invoked with a false Boolean
                        // and never with the "false" string literal
                        this.testValue = value;
                        if (value !== false) {
                            fail('Should only be called with a false Boolean value, got a non-falsy value');
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'test', '']],
                    factory: function () { return directiveInstance = new Directive; },
                    inputs: { test: 'test', other: 'other' }
                });
                return Directive;
            }());
            /**
             * <span [test]="false" [other]="true"></span>
             */
            function createTemplate() {
                // using 2 bindings to show example shape of attributes array
                instructions_1.elementStart(0, 'span', ['class', 'fade', 1 /* SelectOnly */, 'test', 'other']);
                instructions_1.elementEnd();
            }
            function updateTemplate() { instructions_1.elementProperty(0, 'test', instructions_1.bind(false)); }
            var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [Directive]);
            // the "test" attribute should not be reflected in the DOM as it is here only for directive
            // matching purposes
            expect(fixture.html).toEqual('<span class="fade"></span>');
            expect(directiveInstance.testValue).toBe(false);
        });
        it('should not accidentally set inputs from attributes extracted from bindings / outputs', function () {
            var directiveInstance;
            var Directive = /** @class */ (function () {
                function Directive() {
                }
                Object.defineProperty(Directive.prototype, "test", {
                    /**
                     * A setter to assert that a binding is not invoked with stringified attribute value
                     */
                    set: function (value) {
                        // if a binding is processed correctly we should only be invoked with a false Boolean
                        // and never with the "false" string literal
                        this.testValue = value;
                        if (value !== false) {
                            fail('Should only be called with a false Boolean value, got a non-falsy value');
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'test', '']],
                    factory: function () { return directiveInstance = new Directive; },
                    inputs: { test: 'test', prop1: 'prop1', prop2: 'prop2' }
                });
                return Directive;
            }());
            /**
             * <span class="fade" [prop1]="true" [test]="false" [prop2]="true"></span>
             */
            function createTemplate() {
                // putting name (test) in the "usual" value position
                instructions_1.elementStart(0, 'span', ['class', 'fade', 1 /* SelectOnly */, 'prop1', 'test', 'prop2']);
                instructions_1.elementEnd();
            }
            function updateTemplate() {
                instructions_1.elementProperty(0, 'prop1', instructions_1.bind(true));
                instructions_1.elementProperty(0, 'test', instructions_1.bind(false));
                instructions_1.elementProperty(0, 'prop2', instructions_1.bind(true));
            }
            var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [Directive]);
            // the "test" attribute should not be reflected in the DOM as it is here only for directive
            // matching purposes
            expect(fixture.html).toEqual('<span class="fade"></span>');
            expect(directiveInstance.testValue).toBe(false);
        });
        it('should match directives with attribute selectors on outputs', function () {
            var directiveInstance;
            var Directive = /** @class */ (function () {
                function Directive() {
                    this.out = new core_1.EventEmitter();
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'out', '']],
                    factory: function () { return directiveInstance = new Directive; },
                    outputs: { out: 'out' }
                });
                return Directive;
            }());
            /**
             * <span (out)="someVar = true"></span>
             */
            function createTemplate() {
                instructions_1.elementStart(0, 'span', [1 /* SelectOnly */, 'out']);
                {
                    instructions_1.listener('out', function () { });
                }
                instructions_1.elementEnd();
            }
            var fixture = new render_util_1.TemplateFixture(createTemplate, function () { }, [Directive]);
            // "out" should not be part of reflected attributes
            expect(fixture.html).toEqual('<span></span>');
            expect(directiveInstance).not.toBeUndefined();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9kaXJlY3RpdmVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEyQztBQUUzQyxpREFBeUU7QUFDekUsK0RBQXdIO0FBRXhILDZDQUE4QztBQUU5QyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBRXBCLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFFZixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBSSxpQkFBc0MsQ0FBQztZQUUzQztnQkFBQTtvQkFDRSxVQUFLLEdBQUcsS0FBSyxDQUFDO2dCQVVoQixDQUFDO2dCQVRRLHdCQUFjLEdBQUcsdUJBQWUsQ0FBQztvQkFDdEMsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM1QixPQUFPLEVBQUUsY0FBTSxPQUFBLGlCQUFpQixHQUFHLElBQUksU0FBUyxFQUFqQyxDQUFpQztvQkFDaEQsWUFBWSxFQUFFLFVBQUMsY0FBc0IsRUFBRSxZQUFvQjt3QkFDekQsOEJBQWUsQ0FDWCxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFJLENBQUMsNEJBQWEsQ0FBWSxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RixDQUFDO2lCQUNGLENBQUMsQ0FBQztnQkFDTCxnQkFBQzthQUFBLEFBWEQsSUFXQztZQUVEO2dCQUNFLDJCQUFZLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxxQkFBNkIsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0QseUJBQVUsRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUVELElBQU0sT0FBTyxHQUFHLElBQUksNkJBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBTyxDQUFDLEVBQUUs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