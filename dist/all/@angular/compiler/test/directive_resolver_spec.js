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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var directive_resolver_1 = require("@angular/compiler/src/directive_resolver");
var metadata_1 = require("@angular/core/src/metadata");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    SomeDirective = __decorate([
        metadata_1.Directive({ selector: 'someDirective' })
    ], SomeDirective);
    return SomeDirective;
}());
var SomeDirectiveWithInputs = /** @class */ (function () {
    function SomeDirectiveWithInputs() {
    }
    __decorate([
        metadata_1.Input(),
        __metadata("design:type", Object)
    ], SomeDirectiveWithInputs.prototype, "a", void 0);
    __decorate([
        metadata_1.Input('renamed'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithInputs.prototype, "b", void 0);
    SomeDirectiveWithInputs = __decorate([
        metadata_1.Directive({ selector: 'someDirective', inputs: ['c'] })
    ], SomeDirectiveWithInputs);
    return SomeDirectiveWithInputs;
}());
var SomeDirectiveWithOutputs = /** @class */ (function () {
    function SomeDirectiveWithOutputs() {
    }
    __decorate([
        metadata_1.Output(),
        __metadata("design:type", Object)
    ], SomeDirectiveWithOutputs.prototype, "a", void 0);
    __decorate([
        metadata_1.Output('renamed'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithOutputs.prototype, "b", void 0);
    SomeDirectiveWithOutputs = __decorate([
        metadata_1.Directive({ selector: 'someDirective', outputs: ['c'] })
    ], SomeDirectiveWithOutputs);
    return SomeDirectiveWithOutputs;
}());
var SomeDirectiveWithSetterProps = /** @class */ (function () {
    function SomeDirectiveWithSetterProps() {
    }
    Object.defineProperty(SomeDirectiveWithSetterProps.prototype, "a", {
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    __decorate([
        metadata_1.Input('renamed'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SomeDirectiveWithSetterProps.prototype, "a", null);
    SomeDirectiveWithSetterProps = __decorate([
        metadata_1.Directive({ selector: 'someDirective' })
    ], SomeDirectiveWithSetterProps);
    return SomeDirectiveWithSetterProps;
}());
var SomeDirectiveWithGetterOutputs = /** @class */ (function () {
    function SomeDirectiveWithGetterOutputs() {
    }
    Object.defineProperty(SomeDirectiveWithGetterOutputs.prototype, "a", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    __decorate([
        metadata_1.Output('renamed'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SomeDirectiveWithGetterOutputs.prototype, "a", null);
    SomeDirectiveWithGetterOutputs = __decorate([
        metadata_1.Directive({ selector: 'someDirective' })
    ], SomeDirectiveWithGetterOutputs);
    return SomeDirectiveWithGetterOutputs;
}());
var SomeDirectiveWithHostBindings = /** @class */ (function () {
    function SomeDirectiveWithHostBindings() {
    }
    __decorate([
        metadata_1.HostBinding(),
        __metadata("design:type", Object)
    ], SomeDirectiveWithHostBindings.prototype, "a", void 0);
    __decorate([
        metadata_1.HostBinding('renamed'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithHostBindings.prototype, "b", void 0);
    SomeDirectiveWithHostBindings = __decorate([
        metadata_1.Directive({ selector: 'someDirective', host: { '[c]': 'c' } })
    ], SomeDirectiveWithHostBindings);
    return SomeDirectiveWithHostBindings;
}());
var SomeDirectiveWithHostListeners = /** @class */ (function () {
    function SomeDirectiveWithHostListeners() {
    }
    SomeDirectiveWithHostListeners.prototype.onA = function () { };
    SomeDirectiveWithHostListeners.prototype.onB = function (value) { };
    __decorate([
        metadata_1.HostListener('a'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SomeDirectiveWithHostListeners.prototype, "onA", null);
    __decorate([
        metadata_1.HostListener('b', ['$event.value']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SomeDirectiveWithHostListeners.prototype, "onB", null);
    SomeDirectiveWithHostListeners = __decorate([
        metadata_1.Directive({ selector: 'someDirective', host: { '(c)': 'onC()' } })
    ], SomeDirectiveWithHostListeners);
    return SomeDirectiveWithHostListeners;
}());
var SomeDirectiveWithContentChildren = /** @class */ (function () {
    function SomeDirectiveWithContentChildren() {
    }
    __decorate([
        metadata_1.ContentChildren('a'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithContentChildren.prototype, "as", void 0);
    SomeDirectiveWithContentChildren = __decorate([
        metadata_1.Directive({ selector: 'someDirective', queries: { 'cs': new metadata_1.ContentChildren('c') } })
    ], SomeDirectiveWithContentChildren);
    return SomeDirectiveWithContentChildren;
}());
var SomeDirectiveWithViewChildren = /** @class */ (function () {
    function SomeDirectiveWithViewChildren() {
    }
    __decorate([
        metadata_1.ViewChildren('a'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithViewChildren.prototype, "as", void 0);
    SomeDirectiveWithViewChildren = __decorate([
        metadata_1.Directive({ selector: 'someDirective', queries: { 'cs': new metadata_1.ViewChildren('c') } })
    ], SomeDirectiveWithViewChildren);
    return SomeDirectiveWithViewChildren;
}());
var SomeDirectiveWithContentChild = /** @class */ (function () {
    function SomeDirectiveWithContentChild() {
    }
    __decorate([
        metadata_1.ContentChild('a'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithContentChild.prototype, "a", void 0);
    SomeDirectiveWithContentChild = __decorate([
        metadata_1.Directive({ selector: 'someDirective', queries: { 'c': new metadata_1.ContentChild('c') } })
    ], SomeDirectiveWithContentChild);
    return SomeDirectiveWithContentChild;
}());
var SomeDirectiveWithViewChild = /** @class */ (function () {
    function SomeDirectiveWithViewChild() {
    }
    __decorate([
        metadata_1.ViewChild('a'),
        __metadata("design:type", Object)
    ], SomeDirectiveWithViewChild.prototype, "a", void 0);
    SomeDirectiveWithViewChild = __decorate([
        metadata_1.Directive({ selector: 'someDirective', queries: { 'c': new metadata_1.ViewChild('c') } })
    ], SomeDirectiveWithViewChild);
    return SomeDirectiveWithViewChild;
}());
var ComponentWithTemplate = /** @class */ (function () {
    function ComponentWithTemplate() {
    }
    ComponentWithTemplate = __decorate([
        metadata_1.Component({
            selector: 'sample',
            template: 'some template',
            styles: ['some styles'],
            preserveWhitespaces: true
        })
    ], ComponentWithTemplate);
    return ComponentWithTemplate;
}());
var SomeDirectiveWithSameHostBindingAndInput = /** @class */ (function () {
    function SomeDirectiveWithSameHostBindingAndInput() {
    }
    __decorate([
        metadata_1.Input(), metadata_1.HostBinding(),
        __metadata("design:type", Object)
    ], SomeDirectiveWithSameHostBindingAndInput.prototype, "prop", void 0);
    SomeDirectiveWithSameHostBindingAndInput = __decorate([
        metadata_1.Directive({
            selector: 'someDirective',
            host: { '[decorator]': 'decorator' },
            inputs: ['decorator'],
        })
    ], SomeDirectiveWithSameHostBindingAndInput);
    return SomeDirectiveWithSameHostBindingAndInput;
}());
var SomeDirectiveWithMalformedHostBinding1 = /** @class */ (function () {
    function SomeDirectiveWithMalformedHostBinding1() {
    }
    SomeDirectiveWithMalformedHostBinding1.prototype.onA = function () { };
    __decorate([
        metadata_1.HostBinding('(a)'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SomeDirectiveWithMalformedHostBinding1.prototype, "onA", null);
    SomeDirectiveWithMalformedHostBinding1 = __decorate([
        metadata_1.Directive({ selector: 'someDirective' })
    ], SomeDirectiveWithMalformedHostBinding1);
    return SomeDirectiveWithMalformedHostBinding1;
}());
var SomeDirectiveWithMalformedHostBinding2 = /** @class */ (function () {
    function SomeDirectiveWithMalformedHostBinding2() {
    }
    SomeDirectiveWithMalformedHostBinding2.prototype.onA = function () { };
    __decorate([
        metadata_1.HostBinding('[a]'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SomeDirectiveWithMalformedHostBinding2.prototype, "onA", null);
    SomeDirectiveWithMalformedHostBinding2 = __decorate([
        metadata_1.Directive({ selector: 'someDirective' })
    ], SomeDirectiveWithMalformedHostBinding2);
    return SomeDirectiveWithMalformedHostBinding2;
}());
var SomeDirectiveWithoutMetadata = /** @class */ (function () {
    function SomeDirectiveWithoutMetadata() {
    }
    return SomeDirectiveWithoutMetadata;
}());
{
    describe('DirectiveResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new directive_resolver_1.DirectiveResolver(new compiler_reflector_1.JitReflector()); });
        it('should read out the Directive metadata', function () {
            var directiveMetadata = resolver.resolve(SomeDirective);
            expect(directiveMetadata).toEqual(compiler_1.core.createDirective({
                selector: 'someDirective',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                guards: {},
                exportAs: undefined,
                providers: undefined
            }));
        });
        it('should throw if not matching metadata is found', function () {
            expect(function () {
                resolver.resolve(SomeDirectiveWithoutMetadata);
            }).toThrowError('No Directive annotation found on SomeDirectiveWithoutMetadata');
        });
        it('should support inheriting the Directive metadata', function () {
            var Parent = /** @class */ (function () {
                function Parent() {
                }
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                return Parent;
            }());
            var ChildNoDecorator = /** @class */ (function (_super) {
                __extends(ChildNoDecorator, _super);
                function ChildNoDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildNoDecorator;
            }(Parent));
            var ChildWithDecorator = /** @class */ (function (_super) {
                __extends(ChildWithDecorator, _super);
                function ChildWithDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ChildWithDecorator = __decorate([
                    metadata_1.Directive({ selector: 'c' })
                ], ChildWithDecorator);
                return ChildWithDecorator;
            }(Parent));
            expect(resolver.resolve(ChildNoDecorator)).toEqual(compiler_1.core.createDirective({
                selector: 'p',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                guards: {},
                exportAs: undefined,
                providers: undefined
            }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(compiler_1.core.createDirective({
                selector: 'c',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                guards: {},
                exportAs: undefined,
                providers: undefined
            }));
        });
        describe('inputs', function () {
            it('should append directive inputs', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithInputs);
                expect(directiveMetadata.inputs).toEqual(['c', 'a', 'b: renamed']);
            });
            it('should work with getters and setters', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithSetterProps);
                expect(directiveMetadata.inputs).toEqual(['a: renamed']);
            });
            it('should remove duplicate inputs', function () {
                var SomeDirectiveWithDuplicateInputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    SomeDirectiveWithDuplicateInputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', inputs: ['a', 'a'] })
                    ], SomeDirectiveWithDuplicateInputs);
                    return SomeDirectiveWithDuplicateInputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['a']);
            });
            it('should use the last input if duplicate inputs (with rename)', function () {
                var SomeDirectiveWithDuplicateInputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    SomeDirectiveWithDuplicateInputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', inputs: ['a', 'localA: a'] })
                    ], SomeDirectiveWithDuplicateInputs);
                    return SomeDirectiveWithDuplicateInputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['localA: a']);
            });
            it('should prefer @Input over @Directive.inputs', function () {
                var SomeDirectiveWithDuplicateInputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    __decorate([
                        metadata_1.Input('a'),
                        __metadata("design:type", Object)
                    ], SomeDirectiveWithDuplicateInputs.prototype, "propA", void 0);
                    SomeDirectiveWithDuplicateInputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', inputs: ['a'] })
                    ], SomeDirectiveWithDuplicateInputs);
                    return SomeDirectiveWithDuplicateInputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['propA: a']);
            });
            it('should support inheriting inputs', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    __decorate([
                        metadata_1.Input(),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p1", void 0);
                    __decorate([
                        metadata_1.Input('p21'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p2", void 0);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    __decorate([
                        metadata_1.Input('p22'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p2", void 0);
                    __decorate([
                        metadata_1.Input(),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p3", void 0);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.inputs).toEqual(['p1', 'p2: p22', 'p3']);
            });
        });
        describe('outputs', function () {
            it('should append directive outputs', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithOutputs);
                expect(directiveMetadata.outputs).toEqual(['c', 'a', 'b: renamed']);
            });
            it('should work with getters and setters', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithGetterOutputs);
                expect(directiveMetadata.outputs).toEqual(['a: renamed']);
            });
            it('should remove duplicate outputs', function () {
                var SomeDirectiveWithDuplicateOutputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    SomeDirectiveWithDuplicateOutputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', outputs: ['a', 'a'] })
                    ], SomeDirectiveWithDuplicateOutputs);
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['a']);
            });
            it('should use the last output if duplicate outputs (with rename)', function () {
                var SomeDirectiveWithDuplicateOutputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    SomeDirectiveWithDuplicateOutputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', outputs: ['a', 'localA: a'] })
                    ], SomeDirectiveWithDuplicateOutputs);
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['localA: a']);
            });
            it('should prefer @Output over @Directive.outputs', function () {
                var SomeDirectiveWithDuplicateOutputs = /** @class */ (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    __decorate([
                        metadata_1.Output('a'),
                        __metadata("design:type", Object)
                    ], SomeDirectiveWithDuplicateOutputs.prototype, "propA", void 0);
                    SomeDirectiveWithDuplicateOutputs = __decorate([
                        metadata_1.Directive({ selector: 'someDirective', outputs: ['a'] })
                    ], SomeDirectiveWithDuplicateOutputs);
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['propA: a']);
            });
            it('should support inheriting outputs', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    __decorate([
                        metadata_1.Output(),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p1", void 0);
                    __decorate([
                        metadata_1.Output('p21'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p2", void 0);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    __decorate([
                        metadata_1.Output('p22'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p2", void 0);
                    __decorate([
                        metadata_1.Output(),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p3", void 0);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.outputs).toEqual(['p1', 'p2: p22', 'p3']);
            });
        });
        describe('host', function () {
            it('should append host bindings', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithHostBindings);
                expect(directiveMetadata.host).toEqual({ '[c]': 'c', '[a]': 'a', '[renamed]': 'b' });
            });
            it('should append host binding and input on the same property', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithSameHostBindingAndInput);
                expect(directiveMetadata.host).toEqual({ '[decorator]': 'decorator', '[prop]': 'prop' });
                expect(directiveMetadata.inputs).toEqual(['decorator', 'prop']);
            });
            it('should append host listeners', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithHostListeners);
                expect(directiveMetadata.host)
                    .toEqual({ '(c)': 'onC()', '(a)': 'onA()', '(b)': 'onB($event.value)' });
            });
            it('should throw when @HostBinding name starts with "("', function () {
                expect(function () { return resolver.resolve(SomeDirectiveWithMalformedHostBinding1); })
                    .toThrowError('@HostBinding can not bind to events. Use @HostListener instead.');
            });
            it('should throw when @HostBinding name starts with "["', function () {
                expect(function () { return resolver.resolve(SomeDirectiveWithMalformedHostBinding2); })
                    .toThrowError("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
            });
            it('should support inheriting host bindings', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    __decorate([
                        metadata_1.HostBinding(),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p1", void 0);
                    __decorate([
                        metadata_1.HostBinding('p21'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p2", void 0);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    __decorate([
                        metadata_1.HostBinding('p22'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p2", void 0);
                    __decorate([
                        metadata_1.HostBinding(),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p3", void 0);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host)
                    .toEqual({ '[p1]': 'p1', '[p21]': 'p2', '[p22]': 'p2', '[p3]': 'p3' });
            });
            it('should support inheriting host listeners', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.prototype.p1 = function () { };
                    Parent.prototype.p2 = function () { };
                    __decorate([
                        metadata_1.HostListener('p1'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Parent.prototype, "p1", null);
                    __decorate([
                        metadata_1.HostListener('p21'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Parent.prototype, "p2", null);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.p2 = function () { };
                    Child.prototype.p3 = function () { };
                    __decorate([
                        metadata_1.HostListener('p22'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Child.prototype, "p2", null);
                    __decorate([
                        metadata_1.HostListener('p3'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Child.prototype, "p3", null);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host)
                    .toEqual({ '(p1)': 'p1()', '(p21)': 'p2()', '(p22)': 'p2()', '(p3)': 'p3()' });
            });
            it('should combine host bindings and listeners during inheritance', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.prototype.p1 = function () { };
                    __decorate([
                        metadata_1.HostListener('p11'), metadata_1.HostListener('p12'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Parent.prototype, "p1", null);
                    __decorate([
                        metadata_1.HostBinding('p21'), metadata_1.HostBinding('p22'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p2", void 0);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.p1 = function () { };
                    __decorate([
                        metadata_1.HostListener('c1'),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", []),
                        __metadata("design:returntype", void 0)
                    ], Child.prototype, "p1", null);
                    __decorate([
                        metadata_1.HostBinding('c2'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p2", void 0);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host).toEqual({
                    '(p11)': 'p1()',
                    '(p12)': 'p1()',
                    '(c1)': 'p1()',
                    '[p21]': 'p2',
                    '[p22]': 'p2',
                    '[c2]': 'p2'
                });
            });
        });
        describe('queries', function () {
            it('should append ContentChildren', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithContentChildren);
                expect(directiveMetadata.queries)
                    .toEqual({ 'cs': new metadata_1.ContentChildren('c'), 'as': new metadata_1.ContentChildren('a') });
            });
            it('should append ViewChildren', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithViewChildren);
                expect(directiveMetadata.queries)
                    .toEqual({ 'cs': new metadata_1.ViewChildren('c'), 'as': new metadata_1.ViewChildren('a') });
            });
            it('should append ContentChild', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithContentChild);
                expect(directiveMetadata.queries)
                    .toEqual({ 'c': new metadata_1.ContentChild('c'), 'a': new metadata_1.ContentChild('a') });
            });
            it('should append ViewChild', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithViewChild);
                expect(directiveMetadata.queries)
                    .toEqual({ 'c': new metadata_1.ViewChild('c'), 'a': new metadata_1.ViewChild('a') });
            });
            it('should support inheriting queries', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    __decorate([
                        metadata_1.ContentChild('p1'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p1", void 0);
                    __decorate([
                        metadata_1.ContentChild('p21'),
                        __metadata("design:type", Object)
                    ], Parent.prototype, "p2", void 0);
                    Parent = __decorate([
                        metadata_1.Directive({ selector: 'p' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    __decorate([
                        metadata_1.ContentChild('p22'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p2", void 0);
                    __decorate([
                        metadata_1.ContentChild('p3'),
                        __metadata("design:type", Object)
                    ], Child.prototype, "p3", void 0);
                    return Child;
                }(Parent));
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.queries).toEqual({
                    'p1': new metadata_1.ContentChild('p1'),
                    'p2': new metadata_1.ContentChild('p22'),
                    'p3': new metadata_1.ContentChild('p3')
                });
            });
        });
        describe('Component', function () {
            it('should read out the template related metadata from the Component metadata', function () {
                var compMetadata = resolver.resolve(ComponentWithTemplate);
                expect(compMetadata.template).toEqual('some template');
                expect(compMetadata.styles).toEqual(['some styles']);
                expect(compMetadata.preserveWhitespaces).toBe(true);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2RpcmVjdGl2ZV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUF1QztBQUN2QywrRUFBMkU7QUFDM0UsdURBQWtLO0FBQ2xLLCtGQUFzRjtBQUd0RjtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFEbEIsb0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQztPQUNqQyxhQUFhLENBQ2xCO0lBQUQsb0JBQUM7Q0FBQSxBQURELElBQ0M7QUFHRDtJQUFBO0lBSUEsQ0FBQztJQUhVO1FBQVIsZ0JBQUssRUFBRTs7c0RBQVE7SUFDRTtRQUFqQixnQkFBSyxDQUFDLFNBQVMsQ0FBQzs7c0RBQVE7SUFGckIsdUJBQXVCO1FBRDVCLG9CQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7T0FDaEQsdUJBQXVCLENBSTVCO0lBQUQsOEJBQUM7Q0FBQSxBQUpELElBSUM7QUFHRDtJQUFBO0lBSUEsQ0FBQztJQUhXO1FBQVQsaUJBQU0sRUFBRTs7dURBQVE7SUFDRTtRQUFsQixpQkFBTSxDQUFDLFNBQVMsQ0FBQzs7dURBQVE7SUFGdEIsd0JBQXdCO1FBRDdCLG9CQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7T0FDakQsd0JBQXdCLENBSTdCO0lBQUQsK0JBQUM7Q0FBQSxBQUpELElBSUM7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQURDLHNCQUFJLDJDQUFDO2FBQUwsVUFBTSxLQUFVLElBQUcsQ0FBQzs7O09BQUE7SUFBcEI7UUFEQyxn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