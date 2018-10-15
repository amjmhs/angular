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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@angular/core/src/reflection/reflection");
var reflection_capabilities_1 = require("@angular/core/src/reflection/reflection_capabilities");
var decorators_1 = require("@angular/core/src/util/decorators");
/** @Annotation */ var ClassDecorator = decorators_1.makeDecorator('ClassDecorator', function (data) { return data; });
/** @Annotation */ var ParamDecorator = decorators_1.makeParamDecorator('ParamDecorator', function (value) { return ({ value: value }); });
/** @Annotation */ var PropDecorator = decorators_1.makePropDecorator('PropDecorator', function (value) { return ({ value: value }); });
var AType = /** @class */ (function () {
    function AType(value) {
        this.value = value;
    }
    return AType;
}());
var ClassWithDecorators = /** @class */ (function () {
    function ClassWithDecorators(a, b) {
        this.a = a;
        this.b = b;
    }
    Object.defineProperty(ClassWithDecorators.prototype, "c", {
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    ClassWithDecorators.prototype.someMethod = function () { };
    __decorate([
        PropDecorator('p1'), PropDecorator('p2'),
        __metadata("design:type", AType)
    ], ClassWithDecorators.prototype, "a", void 0);
    __decorate([
        PropDecorator('p3'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ClassWithDecorators.prototype, "c", null);
    __decorate([
        PropDecorator('p4'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ClassWithDecorators.prototype, "someMethod", null);
    ClassWithDecorators = __decorate([
        ClassDecorator({ value: 'class' }),
        __param(0, ParamDecorator('a')), __param(1, ParamDecorator('b')),
        __metadata("design:paramtypes", [AType, AType])
    ], ClassWithDecorators);
    return ClassWithDecorators;
}());
var ClassWithoutDecorators = /** @class */ (function () {
    function ClassWithoutDecorators(a, b) {
    }
    return ClassWithoutDecorators;
}());
var TestObj = /** @class */ (function () {
    function TestObj(a, b) {
        this.a = a;
        this.b = b;
    }
    TestObj.prototype.identity = function (arg) { return arg; };
    return TestObj;
}());
{
    describe('Reflector', function () {
        var reflector;
        beforeEach(function () { reflector = new reflection_1.Reflector(new reflection_capabilities_1.ReflectionCapabilities()); });
        describe('factory', function () {
            it('should create a factory for the given type', function () {
                var obj = reflector.factory(TestObj)(1, 2);
                expect(obj.a).toEqual(1);
                expect(obj.b).toEqual(2);
            });
        });
        describe('parameters', function () {
            it('should return an array of parameters for a type', function () {
                var p = reflector.parameters(ClassWithDecorators);
                expect(p).toEqual([[AType, new ParamDecorator('a')], [AType, new ParamDecorator('b')]]);
            });
            it('should work for a class without annotations', function () {
                var p = reflector.parameters(ClassWithoutDecorators);
                expect(p.length).toEqual(2);
            });
            // See https://github.com/angular/tsickle/issues/261
            it('should read forwardRef down-leveled type', function () {
                var Dep = /** @class */ (function () {
                    function Dep() {
                    }
                    return Dep;
                }());
                var ForwardLegacy = /** @class */ (function () {
                    function ForwardLegacy(d) {
                    }
                    // Older tsickle had a bug: wrote a forward reference
                    ForwardLegacy.ctorParameters = [{ type: Dep }];
                    return ForwardLegacy;
                }());
                expect(reflector.parameters(ForwardLegacy)).toEqual([[Dep]]);
                var Forward = /** @class */ (function () {
                    function Forward(d) {
                    }
                    // Newer tsickle generates a functionClosure
                    Forward.ctorParameters = function () { return [{ type: ForwardDep }]; };
                    return Forward;
                }());
                var ForwardDep = /** @class */ (function () {
                    function ForwardDep() {
                    }
                    return ForwardDep;
                }());
                expect(reflector.parameters(Forward)).toEqual([[ForwardDep]]);
            });
        });
        describe('propMetadata', function () {
            it('should return a string map of prop metadata for the given class', function () {
                var p = reflector.propMetadata(ClassWithDecorators);
                expect(p['a']).toEqual([new PropDecorator('p1'), new PropDecorator('p2')]);
                expect(p['c']).toEqual([new PropDecorator('p3')]);
                expect(p['someMethod']).toEqual([new PropDecorator('p4')]);
            });
            it('should also return metadata if the class has no decorator', function () {
                var Test = /** @class */ (function () {
                    function Test() {
                    }
                    __decorate([
                        PropDecorator('test'),
                        __metadata("design:type", Object)
                    ], Test.prototype, "prop", void 0);
                    return Test;
                }());
                expect(reflector.propMetadata(Test)).toEqual({ 'prop': [new PropDecorator('test')] });
            });
        });
        describe('annotations', function () {
            it('should return an array of annotations for a type', function () {
                var p = reflector.annotations(ClassWithDecorators);
                expect(p).toEqual([new ClassDecorator({ value: 'class' })]);
            });
            it('should work for a class without annotations', function () {
                var p = reflector.annotations(ClassWithoutDecorators);
                expect(p).toEqual([]);
            });
        });
        describe('getter', function () {
            it('returns a function reading a property', function () {
                var getA = reflector.getter('a');
                expect(getA(new TestObj(1, 2))).toEqual(1);
            });
        });
        describe('setter', function () {
            it('returns a function setting a property', function () {
                var setA = reflector.setter('a');
                var obj = new TestObj(1, 2);
                setA(obj, 100);
                expect(obj.a).toEqual(100);
            });
        });
        describe('method', function () {
            it('returns a function invoking a method', function () {
                var func = reflector.method('identity');
                var obj = new TestObj(1, 2);
                expect(func(obj, ['value'])).toEqual('value');
            });
        });
        describe('ctor inheritance detection', function () {
            it('should use the right regex', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                var ChildNoCtor = /** @class */ (function (_super) {
                    __extends(ChildNoCtor, _super);
                    function ChildNoCtor() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoCtor;
                }(Parent));
                var ChildWithCtor = /** @class */ (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    return ChildWithCtor;
                }(Parent));
                var ChildNoCtorPrivateProps = /** @class */ (function (_super) {
                    __extends(ChildNoCtorPrivateProps, _super);
                    function ChildNoCtorPrivateProps() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.x = 10;
                        return _this;
                    }
                    return ChildNoCtorPrivateProps;
                }(Parent));
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildNoCtor.toString())).toBeTruthy();
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildNoCtorPrivateProps.toString())).toBeTruthy();
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildWithCtor.toString())).toBeFalsy();
            });
            it('should not throw when no prototype on type', function () {
                // Cannot test arrow function here due to the compilation
                var dummyArrowFn = function () { };
                Object.defineProperty(dummyArrowFn, 'prototype', { value: undefined });
                expect(function () { return reflector.annotations(dummyArrowFn); }).not.toThrow();
            });
            it('should support native class', function () {
                var ChildNoCtor = "class ChildNoCtor extends Parent {}\n";
                var ChildWithCtor = "class ChildWithCtor extends Parent {\n" +
                    "  constructor() { super(); }" +
                    "}\n";
                var ChildNoCtorPrivateProps = "class ChildNoCtorPrivateProps extends Parent {\n" +
                    "  private x = 10;\n" +
                    "}\n";
                var checkNoOwnMetadata = function (str) {
                    return reflection_capabilities_1.INHERITED_CLASS.exec(str) && !reflection_capabilities_1.INHERITED_CLASS_WITH_CTOR.exec(str);
                };
                expect(checkNoOwnMetadata(ChildNoCtor)).toBeTruthy();
                expect(checkNoOwnMetadata(ChildNoCtorPrivateProps)).toBeTruthy();
                expect(checkNoOwnMetadata(ChildWithCtor)).toBeFalsy();
            });
            it('should properly handle all class forms', function () {
                var ctor = function (str) { return expect(reflection_capabilities_1.INHERITED_CLASS.exec(str)).toBeTruthy() &&
                    expect(reflection_capabilities_1.INHERITED_CLASS_WITH_CTOR.exec(str)).toBeTruthy(); };
                var noCtor = function (str) { return expect(reflection_capabilities_1.INHERITED_CLASS.exec(str)).toBeTruthy() &&
                    expect(reflection_capabilities_1.INHERITED_CLASS_WITH_CTOR.exec(str)).toBeFalsy(); };
                ctor("class Bar extends Foo {constructor(){}}");
                ctor("class Bar extends Foo { constructor ( ) {} }");
                ctor("class Bar extends Foo { other(){}; constructor(){} }");
                noCtor("class extends Foo{}");
                noCtor("class extends Foo {}");
                noCtor("class Bar extends Foo {}");
                noCtor("class $Bar1_ extends $Fo0_ {}");
                noCtor("class Bar extends Foo { other(){} }");
            });
        });
        describe('inheritance with decorators', function () {
            it('should inherit annotations', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent = __decorate([
                        ClassDecorator({ value: 'parent' })
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child = __decorate([
                        ClassDecorator({ value: 'child' })
                    ], Child);
                    return Child;
                }(Parent));
                var ChildNoDecorators = /** @class */ (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                var NoDecorators = /** @class */ (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(NoDecorators)).toEqual([]);
                expect(reflector.annotations({})).toEqual([]);
                expect(reflector.annotations(1)).toEqual([]);
                expect(reflector.annotations(null)).toEqual([]);
            });
            it('should inherit parameters', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                // Note: We need the class decorator as well,
                // as otherwise TS won't capture the ctor arguments!
                var Parent = /** @class */ (function () {
                    function Parent(a, b) {
                    }
                    Parent = __decorate([
                        ClassDecorator({ value: 'parent' }),
                        __param(0, ParamDecorator('a')), __param(1, ParamDecorator('b')),
                        __metadata("design:paramtypes", [A, B])
                    ], Parent);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithDecorator = /** @class */ (function (_super) {
                    __extends(ChildWithDecorator, _super);
                    function ChildWithDecorator() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ChildWithDecorator = __decorate([
                        ClassDecorator({ value: 'child' })
                    ], ChildWithDecorator);
                    return ChildWithDecorator;
                }(Parent));
                var ChildWithDecoratorAndProps = /** @class */ (function (_super) {
                    __extends(ChildWithDecoratorAndProps, _super);
                    function ChildWithDecoratorAndProps() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.x = 10;
                        return _this;
                    }
                    ChildWithDecoratorAndProps = __decorate([
                        ClassDecorator({ value: 'child' })
                    ], ChildWithDecoratorAndProps);
                    return ChildWithDecoratorAndProps;
                }(Parent));
                // Note: We need the class decorator as well,
                // as otherwise TS won't capture the ctor arguments!
                var ChildWithCtor = /** @class */ (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor(c) {
                        return _super.call(this, null, null) || this;
                    }
                    ChildWithCtor = __decorate([
                        ClassDecorator({ value: 'child' }),
                        __param(0, ParamDecorator('c')),
                        __metadata("design:paramtypes", [C])
                    ], ChildWithCtor);
                    return ChildWithCtor;
                }(Parent));
                var ChildWithCtorNoDecorator = /** @class */ (function (_super) {
                    __extends(ChildWithCtorNoDecorator, _super);
                    function ChildWithCtorNoDecorator(a, b, c) {
                        return _super.call(this, null, null) || this;
                    }
                    return ChildWithCtorNoDecorator;
                }(Parent));
                var NoDecorators = /** @class */ (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithDecorator)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithDecoratorAndProps)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
                // If we have no decorator, we don't get metadata about the ctor params.
                // But we should still get an array of the right length based on function.length.
                expect(reflector.parameters(ChildWithCtorNoDecorator)).toEqual([
                    undefined, undefined, undefined
                ]); // TODO: Review use of `any` here (#19904)
                expect(reflector.parameters(NoDecorators)).toEqual([]);
                expect(reflector.parameters({})).toEqual([]);
                expect(reflector.parameters(1)).toEqual([]);
                expect(reflector.parameters(null)).toEqual([]);
            });
            it('should inherit property metadata', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    __decorate([
                        PropDecorator('a'),
                        __metadata("design:type", A)
                    ], Parent.prototype, "a", void 0);
                    __decorate([
                        PropDecorator('b1'),
                        __metadata("design:type", B)
                    ], Parent.prototype, "b", void 0);
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    __decorate([
                        PropDecorator('b2'),
                        __metadata("design:type", B)
                    ], Child.prototype, "b", void 0);
                    __decorate([
                        PropDecorator('c'),
                        __metadata("design:type", C)
                    ], Child.prototype, "c", void 0);
                    return Child;
                }(Parent));
                var NoDecorators = /** @class */ (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
                expect(reflector.propMetadata(NoDecorators)).toEqual({});
                expect(reflector.propMetadata({})).toEqual({});
                expect(reflector.propMetadata(1)).toEqual({});
                expect(reflector.propMetadata(null)).toEqual({});
            });
            it('should inherit lifecycle hooks', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.prototype.hook1 = function () { };
                    Parent.prototype.hook2 = function () { };
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.hook2 = function () { };
                    Child.prototype.hook3 = function () { };
                    return Child;
                }(Parent));
                function hooks(symbol, names) {
                    return names.map(function (name) { return reflector.hasLifecycleHook(symbol, name); });
                }
                // Check that metadata for Parent was not changed!
                expect(hooks(Parent, ['hook1', 'hook2', 'hook3'])).toEqual([true, true, false]);
                expect(hooks(Child, ['hook1', 'hook2', 'hook3'])).toEqual([true, true, true]);
            });
        });
        describe('inheritance with tsickle', function () {
            it('should inherit annotations', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.decorators = [{ type: ClassDecorator, args: [{ value: 'parent' }] }];
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.decorators = [{ type: ClassDecorator, args: [{ value: 'child' }] }];
                    return Child;
                }(Parent));
                var ChildNoDecorators = /** @class */ (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
            });
            it('should inherit parameters', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.ctorParameters = function () {
                        return [{ type: A, decorators: [{ type: ParamDecorator, args: ['a'] }] },
                            { type: B, decorators: [{ type: ParamDecorator, args: ['b'] }] },
                        ];
                    };
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithCtor = /** @class */ (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    ChildWithCtor.ctorParameters = function () { return [{ type: C, decorators: [{ type: ParamDecorator, args: ['c'] }] },]; };
                    return ChildWithCtor;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
            });
            it('should inherit property metadata', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.propDecorators = {
                        'a': [{ type: PropDecorator, args: ['a'] }],
                        'b': [{ type: PropDecorator, args: ['b1'] }],
                    };
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.propDecorators = {
                        'b': [{ type: PropDecorator, args: ['b2'] }],
                        'c': [{ type: PropDecorator, args: ['c'] }],
                    };
                    return Child;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
            });
        });
        describe('inheritance with es5 API', function () {
            it('should inherit annotations', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.annotations = [new ClassDecorator({ value: 'parent' })];
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.annotations = [new ClassDecorator({ value: 'child' })];
                    return Child;
                }(Parent));
                var ChildNoDecorators = /** @class */ (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
            });
            it('should inherit parameters', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.parameters = [
                        [A, new ParamDecorator('a')],
                        [B, new ParamDecorator('b')],
                    ];
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithCtor = /** @class */ (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    ChildWithCtor.parameters = [
                        [C, new ParamDecorator('c')],
                    ];
                    return ChildWithCtor;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
            });
            it('should inherit property metadata', function () {
                var A = /** @class */ (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = /** @class */ (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = /** @class */ (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = /** @class */ (function () {
                    function Parent() {
                    }
                    Parent.propMetadata = {
                        'a': [new PropDecorator('a')],
                        'b': [new PropDecorator('b1')],
                    };
                    return Parent;
                }());
                var Child = /** @class */ (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.propMetadata = {
                        'b': [new PropDecorator('b2')],
                        'c': [new PropDecorator('c')],
                    };
                    return Child;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVmbGVjdGlvbi9yZWZsZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzRUFBa0U7QUFDbEUsZ0dBQXVKO0FBRXZKLGdFQUF1RztBQW1Cdkcsa0JBQWtCLENBQUMsSUFBTSxjQUFjLEdBQ1osMEJBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztBQUNoRixrQkFBa0IsQ0FBQyxJQUFNLGNBQWMsR0FDbkMsK0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0FBQ3BFLGtCQUFrQixDQUFDLElBQU0sYUFBYSxHQUNsQyw4QkFBaUIsQ0FBQyxlQUFlLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0FBRWxFO0lBQ0UsZUFBbUIsS0FBVTtRQUFWLFVBQUssR0FBTCxLQUFLLENBQUs7SUFBRyxDQUFDO0lBQ25DLFlBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUdEO0lBV0UsNkJBQWlDLENBQVEsRUFBdUIsQ0FBUTtRQUN0RSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQVJELHNCQUFJLGtDQUFDO2FBQUwsVUFBTSxLQUFVLElBQUcsQ0FBQzs7O09BQUE7SUFHcEIsd0NBQVUsR0FBVixjQUFjLENBQUM7SUFSMkI7UUFBekMsYUFBYSxDQUFDLElBQUksQ0FB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