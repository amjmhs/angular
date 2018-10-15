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
var testing_1 = require("@angular/compiler/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function createUrlResolverWithoutPackagePrefix() {
    return new compiler_1.UrlResolver();
}
exports.createUrlResolverWithoutPackagePrefix = createUrlResolverWithoutPackagePrefix;
var TEST_COMPILER_PROVIDERS = [
    { provide: compiler_1.ElementSchemaRegistry, useValue: new testing_1.MockSchemaRegistry({}, {}, {}, [], []) },
    { provide: compiler_1.ResourceLoader, useClass: testing_1.MockResourceLoader, deps: [] },
    { provide: compiler_1.UrlResolver, useFactory: createUrlResolverWithoutPackagePrefix, deps: [] }
];
(function () {
    var elSchema;
    var renderLog;
    var directiveLog;
    function createCompFixture(template, compType) {
        if (compType === void 0) { compType = TestComponent; }
        testing_2.TestBed.overrideComponent(compType, { set: new core_1.Component({ template: template }) });
        initHelpers();
        return testing_2.TestBed.createComponent(compType);
    }
    function initHelpers() {
        elSchema = testing_2.TestBed.get(compiler_1.ElementSchemaRegistry);
        renderLog = testing_2.TestBed.get(RenderLog);
        directiveLog = testing_2.TestBed.get(DirectiveLog);
        elSchema.existingProperties['someProp'] = true;
        patchLoggingRenderer2(testing_2.TestBed.get(core_1.RendererFactory2), renderLog);
    }
    function queryDirs(el, dirType) {
        var nodes = el.queryAllNodes(by_1.By.directive(dirType));
        return nodes.map(function (node) { return node.injector.get(dirType); });
    }
    function _bindSimpleProp(bindAttr, compType) {
        if (compType === void 0) { compType = TestComponent; }
        var template = "<div " + bindAttr + "></div>";
        return createCompFixture(template, compType);
    }
    function _bindSimpleValue(expression, compType) {
        if (compType === void 0) { compType = TestComponent; }
        return _bindSimpleProp("[someProp]='" + expression + "'", compType);
    }
    function _bindAndCheckSimpleValue(expression, compType) {
        if (compType === void 0) { compType = TestComponent; }
        var ctx = _bindSimpleValue(expression, compType);
        ctx.detectChanges(false);
        return renderLog.log;
    }
    describe("ChangeDetection", function () {
        // On CJS fakeAsync is not supported...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        beforeEach(function () {
            testing_2.TestBed.configureCompiler({ providers: TEST_COMPILER_PROVIDERS });
            testing_2.TestBed.configureTestingModule({
                declarations: [
                    TestData,
                    TestDirective,
                    TestComponent,
                    AnotherComponent,
                    TestLocals,
                    CompWithRef,
                    WrapCompWithRef,
                    EmitterDirective,
                    PushComp,
                    OnDestroyDirective,
                    OrderCheckDirective2,
                    OrderCheckDirective0,
                    OrderCheckDirective1,
                    Gh9882,
                    Uninitialized,
                    Person,
                    PersonHolder,
                    PersonHolderHolder,
                    CountingPipe,
                    CountingImpurePipe,
                    MultiArgPipe,
                    PipeWithOnDestroy,
                    IdentityPipe,
                    WrappedPipe,
                ],
                providers: [
                    RenderLog,
                    DirectiveLog,
                ],
            });
        });
        describe('expressions', function () {
            it('should support literals', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue(10)).toEqual(['someProp=10']); }));
            it('should strip quotes from literals', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('"str"')).toEqual(['someProp=str']); }));
            it('should support newlines in literals', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('"a\n\nb"')).toEqual(['someProp=a\n\nb']);
            }));
            it('should support + operations', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 + 2')).toEqual(['someProp=12']); }));
            it('should support - operations', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 - 2')).toEqual(['someProp=8']); }));
            it('should support * operations', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 * 2')).toEqual(['someProp=20']); }));
            it('should support / operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('10 / 2')).toEqual(["someProp=" + 5.0]);
            })); // dart exp=5.0, js exp=5
            it('should support % operations', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('11 % 2')).toEqual(['someProp=1']); }));
            it('should support == operations on identical', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 == 1')).toEqual(['someProp=true']);
            }));
            it('should support != operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 != 1')).toEqual(['someProp=false']);
            }));
            it('should support == operations on coerceible', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 == true')).toEqual(["someProp=true"]);
            }));
            it('should support === operations on identical', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 === 1')).toEqual(['someProp=true']);
            }));
            it('should support !== operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 !== 1')).toEqual(['someProp=false']);
            }));
            it('should support === operations on coerceible', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 === true')).toEqual(['someProp=false']);
            }));
            it('should support true < operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 < 2')).toEqual(['someProp=true']);
            }));
            it('should support false < operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 < 1')).toEqual(['someProp=false']);
            }));
            it('should support false > operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 > 2')).toEqual(['someProp=false']);
            }));
            it('should support true > operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 > 1')).toEqual(['someProp=true']);
            }));
            it('should support true <= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 <= 2')).toEqual(['someProp=true']);
            }));
            it('should support equal <= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 <= 2')).toEqual(['someProp=true']);
            }));
            it('should support false <= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 <= 1')).toEqual(['someProp=false']);
            }));
            it('should support true >= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 >= 1')).toEqual(['someProp=true']);
            }));
            it('should support equal >= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 >= 2')).toEqual(['someProp=true']);
            }));
            it('should support false >= operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 >= 2')).toEqual(['someProp=false']);
            }));
            it('should support true && operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true && true')).toEqual(['someProp=true']);
            }));
            it('should support false && operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true && false')).toEqual(['someProp=false']);
            }));
            it('should support true || operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true || false')).toEqual(['someProp=true']);
            }));
            it('should support false || operations', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('false || false')).toEqual(['someProp=false']);
            }));
            it('should support negate', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('!true')).toEqual(['someProp=false']);
            }));
            it('should support double negate', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('!!true')).toEqual(['someProp=true']);
            }));
            it('should support true conditionals', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 < 2 ? 1 : 2')).toEqual(['someProp=1']);
            }));
            it('should support false conditionals', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 > 2 ? 1 : 2')).toEqual(['someProp=2']);
            }));
            it('should support keyed access to a list item', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('["foo", "bar"][0]')).toEqual(['someProp=foo']);
            }));
            it('should support keyed access to a map item', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('{"foo": "bar"}["foo"]')).toEqual(['someProp=bar']);
            }));
            it('should report all changes on the first run including uninitialized values', testing_2.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('value', Uninitialized)).toEqual(['someProp=null']);
            }));
            it('should report all changes on the first run including null values', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = null;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
            }));
            it('should support simple chained property access', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('address.city', Person);
                ctx.componentInstance.name = 'Victor';
                ctx.componentInstance.address = new Address('Grenoble');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Grenoble']);
            }));
            describe('safe navigation operator', function () {
                it('should support reading properties of nulls', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.city', Person);
                    ctx.componentInstance.address = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support calling methods on nulls', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.toString()', Person);
                    ctx.componentInstance.address = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support reading properties on non nulls', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.city', Person);
                    ctx.componentInstance.address = new Address('MTV');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
                }));
                it('should support calling methods on non nulls', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.toString()', Person);
                    ctx.componentInstance.address = new Address('MTV');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
                }));
                it('should support short-circuting safe navigation', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.address.city', PersonHolder);
                    ctx.componentInstance.value = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support nested short-circuting safe navigation', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value.value?.address.city', PersonHolderHolder);
                    ctx.componentInstance.value = new PersonHolder();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support chained short-circuting safe navigation', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.value?.address.city', PersonHolderHolder);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support short-circuting array index operations', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.phones[0]', PersonHolder);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should still throw if right-side would throw', testing_2.fakeAsync(function () {
                    matchers_1.expect(function () {
                        var ctx = _bindSimpleValue('value?.address.city', PersonHolder);
                        var person = new Person();
                        person.address = null;
                        ctx.componentInstance.value = person;
                        ctx.detectChanges(false);
                    }).toThrow();
                }));
            });
            it('should support method calls', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('sayHi("Jim")', Person);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Hi, Jim']);
            }));
            it('should support function calls', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('a()(99)', TestData);
                ctx.componentInstance.a = function () { return function (a) { return a; }; };
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=99']);
            }));
            it('should support chained method calls', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('address.toString()', Person);
                ctx.componentInstance.address = new Address('MTV');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
            }));
            it('should support NaN', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('age', Person);
                ctx.componentInstance.age = NaN;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=NaN']);
                renderLog.clear();
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('should do simple watching', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('name', Person);
                ctx.componentInstance.name = 'misko';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=misko']);
                renderLog.clear();
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
                renderLog.clear();
                ctx.componentInstance.name = 'Misko';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Misko']);
            }));
            it('should support literal array made of literals', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, 2]');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2]]);
            }));
            it('should support empty literal array', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('[]');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[]]);
            }));
            it('should support literal array made of expressions', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, a]', TestData);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2]]);
            }));
            it('should not recreate literal arrays unless their content changed', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, a]', TestData);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                ctx.componentInstance.a = 3;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2], [1, 3]]);
            }));
            it('should support literal maps made of literals', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: 1}');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
            }));
            it('should support empty literal map', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('{}');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([{}]);
            }));
            it('should support literal maps made of expressions', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: a}');
                ctx.componentInstance.a = 1;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
            }));
            it('should not recreate literal maps unless their content changed', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: a}');
                ctx.componentInstance.a = 1;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues.length).toBe(2);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
                matchers_1.expect(renderLog.loggedValues[1]['z']).toEqual(2);
            }));
            it('should ignore empty bindings', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleProp('[someProp]', TestData);
                ctx.componentInstance.a = 'value';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('should support interpolation', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleProp('someProp="B{{a}}A"', TestData);
                ctx.componentInstance.a = 'value';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=BvalueA']);
            }));
            it('should output empty strings for null values in interpolation', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleProp('someProp="B{{a}}A"', TestData);
                ctx.componentInstance.a = null;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=BA']);
            }));
            it('should escape values in literals that indicate interpolation', testing_2.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('"$"')).toEqual(['someProp=$']); }));
            it('should read locals', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<ng-template testLocals let-local="someLocal">{{local}}</ng-template>');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['{{someLocalValue}}']);
            }));
            describe('pipes', function () {
                it('should use the return value of the pipe', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingPipe', Person);
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0']);
                }));
                it('should support arguments in pipes', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"one":address.city', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.componentInstance.address = new Address('two');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value one two default']);
                }));
                it('should associate pipes right-to-left', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"a":"b" | multiArgPipe:0:1', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value a b default 0 1 default']);
                }));
                it('should support calling pure pipes with different number of arguments', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"a":"b" | multiArgPipe:0:1:2', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value a b default 0 1 2']);
                }));
                it('should do nothing when no change', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('"Megatron" | identityPipe', Person);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                    renderLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual([]);
                }));
                it('should unwrap the wrapped value and force a change', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('"Megatron" | wrappedPipe', Person);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                    renderLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                }));
                it('should record unwrapped values via ngOnChanges', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div [testDirective]="\'aName\' | wrappedPipe" [a]="1" [b]="2 | wrappedPipe"></div>');
                    var dir = queryDirs(ctx.debugElement, TestDirective)[0];
                    ctx.detectChanges(false);
                    dir.changes = {};
                    ctx.detectChanges(false);
                    // Note: the binding for `b` did not change and has no ValueWrapper,
                    // and should therefore stay unchanged.
                    matchers_1.expect(dir.changes).toEqual({
                        'name': new core_1.SimpleChange('aName', 'aName', false),
                        'b': new core_1.SimpleChange(2, 2, false)
                    });
                    ctx.detectChanges(false);
                    matchers_1.expect(dir.changes).toEqual({
                        'name': new core_1.SimpleChange('aName', 'aName', false),
                        'b': new core_1.SimpleChange(2, 2, false)
                    });
                }));
                it('should call pure pipes only if the arguments change', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingPipe', Person);
                    // change from undefined -> null
                    ctx.componentInstance.name = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0']);
                    // change from null -> some value
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0', 'bob state:1']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0', 'bob state:1']);
                    // change from some value -> some other value
                    ctx.componentInstance.name = 'bart';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'null state:0', 'bob state:1', 'bart state:2'
                    ]);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'null state:0', 'bob state:1', 'bart state:2'
                    ]);
                }));
                it('should call pure pipes that are used multiple times only when the arguments change', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture("<div [someProp]=\"name | countingPipe\"></div><div [someProp]=\"age | countingPipe\"></div>" +
                        '<div *ngFor="let x of [1,2]" [someProp]="address.city | countingPipe"></div>', Person);
                    ctx.componentInstance.name = 'a';
                    ctx.componentInstance.age = 10;
                    ctx.componentInstance.address = new Address('mtv');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3'
                    ]);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3'
                    ]);
                    ctx.componentInstance.age = 11;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3', '11 state:4'
                    ]);
                }));
                it('should call impure pipes on each change detection run', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingImpurePipe', Person);
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0', 'bob state:1']);
                }));
            });
            describe('event expressions', function () {
                it('should support field assignments', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="b=a=$event"');
                    var childEl = ctx.debugElement.children[0];
                    var evt = 'EVENT';
                    childEl.triggerEventHandler('event', evt);
                    matchers_1.expect(ctx.componentInstance.a).toEqual(evt);
                    matchers_1.expect(ctx.componentInstance.b).toEqual(evt);
                }));
                it('should support keyed assignments', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a[0]=$event"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = ['OLD'];
                    var evt = 'EVENT';
                    childEl.triggerEventHandler('event', evt);
                    matchers_1.expect(ctx.componentInstance.a).toEqual([evt]);
                }));
                it('should support chains', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a=a+1; a=a+1;"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = 0;
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual(2);
                }));
                it('should support empty literals', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a=[{},[]]"');
                    var childEl = ctx.debugElement.children[0];
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual([{}, []]);
                }));
                it('should throw when trying to assign to a local', testing_2.fakeAsync(function () {
                    matchers_1.expect(function () {
                        _bindSimpleProp('(event)="$event=1"');
                    }).toThrowError(new RegExp('Cannot assign to a reference or variable!'));
                }));
                it('should support short-circuiting', testing_2.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="true ? a = a + 1 : a = a + 1"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = 0;
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual(1);
                }));
            });
        });
        describe('RendererFactory', function () {
            it('should call the begin and end methods on the renderer factory when change detection is called', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<div testDirective [a]="42"></div>');
                var rf = testing_2.TestBed.get(core_1.RendererFactory2);
                spyOn(rf, 'begin');
                spyOn(rf, 'end');
                matchers_1.expect(rf.begin).not.toHaveBeenCalled();
                matchers_1.expect(rf.end).not.toHaveBeenCalled();
                ctx.detectChanges(false);
                matchers_1.expect(rf.begin).toHaveBeenCalled();
                matchers_1.expect(rf.end).toHaveBeenCalled();
            }));
        });
        describe('change notification', function () {
            describe('updating directives', function () {
                it('should happen without invoking the renderer', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective [a]="42"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual([]);
                    matchers_1.expect(queryDirs(ctx.debugElement, TestDirective)[0].a).toEqual(42);
                }));
            });
            describe('reading directives', function () {
                it('should read directive properties', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective [a]="42" ref-dir="testDirective" [someProp]="dir.a"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([42]);
                }));
            });
            describe('ngOnChanges', function () {
                it('should notify the directive when a group of records changes', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div [testDirective]="\'aName\'" [a]="1" [b]="2"></div><div [testDirective]="\'bName\'" [a]="4"></div>');
                    ctx.detectChanges(false);
                    var dirs = queryDirs(ctx.debugElement, TestDirective);
                    matchers_1.expect(dirs[0].changes).toEqual({
                        'a': new core_1.SimpleChange(undefined, 1, true),
                        'b': new core_1.SimpleChange(undefined, 2, true),
                        'name': new core_1.SimpleChange(undefined, 'aName', true)
                    });
                    matchers_1.expect(dirs[1].changes).toEqual({
                        'a': new core_1.SimpleChange(undefined, 4, true),
                        'name': new core_1.SimpleChange(undefined, 'bName', true)
                    });
                }));
            });
        });
        describe('lifecycle', function () {
            function createCompWithContentAndViewChild() {
                testing_2.TestBed.overrideComponent(AnotherComponent, {
                    set: new core_1.Component({
                        selector: 'other-cmp',
                        template: '<div testDirective="viewChild"></div>',
                    })
                });
                return createCompFixture('<div testDirective="parent"><div *ngIf="true" testDirective="contentChild"></div><other-cmp></other-cmp></div>', TestComponent);
            }
            describe('ngOnInit', function () {
                it('should be called after ngOnChanges', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    matchers_1.expect(directiveLog.filter(['ngOnInit', 'ngOnChanges'])).toEqual([]);
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit', 'ngOnChanges'])).toEqual([
                        'dir.ngOnChanges', 'dir.ngOnInit'
                    ]);
                    directiveLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
                it('should only be called only once', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual(['dir.ngOnInit']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
                it('should not call ngOnInit again if it throws', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngOnInit"></div>');
                    var errored = false;
                    // First pass fails, but ngOnInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        matchers_1.expect(e.message).toBe('Boom!');
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual(['dir.ngOnInit']);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngOnInit should not be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        matchers_1.expect(e.message).toBe('Boom!');
                        throw new Error('Second detectChanges() should not have called ngOnInit.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
            });
            describe('ngDoCheck', function () {
                it('should be called after ngOnInit', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngOnInit'])).toEqual([
                        'dir.ngOnInit', 'dir.ngDoCheck'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual(['dir.ngDoCheck']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual(['dir.ngDoCheck']);
                }));
            });
            describe('ngAfterContentInit', function () {
                it('should be called after processing the content children but before the view children', testing_2.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterContentInit'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterContentInit',
                        'parent.ngAfterContentInit', 'viewChild.ngDoCheck', 'viewChild.ngAfterContentInit'
                    ]);
                }));
                it('should only be called only once', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([
                        'dir.ngAfterContentInit'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                }));
                it('should not call ngAfterContentInit again if it throws', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngAfterContentInit"></div>');
                    var errored = false;
                    // First pass fails, but ngAfterContentInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([
                        'dir.ngAfterContentInit'
                    ]);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngAfterContentInit should not be
                    // called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        throw new Error('Second detectChanges() should not have run detection.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                }));
            });
            describe('ngAfterContentChecked', function () {
                it('should be called after the content children but before the view children', testing_2.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterContentChecked'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterContentChecked',
                        'parent.ngAfterContentChecked', 'viewChild.ngDoCheck',
                        'viewChild.ngAfterContentChecked'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'dir.ngAfterContentChecked'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'dir.ngAfterContentChecked'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'child.ngAfterContentChecked', 'parent.ngAfterContentChecked',
                        'sibling.ngAfterContentChecked'
                    ]);
                }));
            });
            describe('ngAfterViewInit', function () {
                it('should be called after processing the view children', testing_2.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterViewInit'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterViewInit',
                        'viewChild.ngDoCheck', 'viewChild.ngAfterViewInit', 'parent.ngAfterViewInit'
                    ]);
                }));
                it('should only be called only once', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual(['dir.ngAfterViewInit']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                }));
                it('should not call ngAfterViewInit again if it throws', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngAfterViewInit"></div>');
                    var errored = false;
                    // First pass fails, but ngAfterViewInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual(['dir.ngAfterViewInit']);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngAfterViewInit should not be
                    // called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        throw new Error('Second detectChanges() should not have run detection.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                }));
            });
            describe('ngAfterViewChecked', function () {
                it('should be called after processing the view children', testing_2.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterViewChecked'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterViewChecked',
                        'viewChild.ngDoCheck', 'viewChild.ngAfterViewChecked', 'parent.ngAfterViewChecked'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'dir.ngAfterViewChecked'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'dir.ngAfterViewChecked'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'child.ngAfterViewChecked', 'parent.ngAfterViewChecked', 'sibling.ngAfterViewChecked'
                    ]);
                }));
            });
            describe('ngOnDestroy', function () {
                it('should be called on view destruction', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual(['dir.ngOnDestroy']);
                }));
                it('should be called after processing the content and view children', testing_2.fakeAsync(function () {
                    testing_2.TestBed.overrideComponent(AnotherComponent, {
                        set: new core_1.Component({ selector: 'other-cmp', template: '<div testDirective="viewChild"></div>' })
                    });
                    var ctx = createCompFixture('<div testDirective="parent"><div *ngFor="let x of [0,1]" testDirective="contentChild{{x}}"></div>' +
                        '<other-cmp></other-cmp></div>', TestComponent);
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'contentChild0.ngOnDestroy', 'contentChild1.ngOnDestroy', 'viewChild.ngOnDestroy',
                        'parent.ngOnDestroy'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'child.ngOnDestroy', 'parent.ngOnDestroy', 'sibling.ngOnDestroy'
                    ]);
                }));
                it('should deliver synchronous events to parent', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('<div (destroy)="a=$event" onDestroyDirective></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(ctx.componentInstance.a).toEqual('destroyed');
                }));
                it('should call ngOnDestroy on pipes', testing_2.fakeAsync(function () {
                    var ctx = createCompFixture('{{true | pipeWithOnDestroy }}');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'pipeWithOnDestroy.ngOnDestroy'
                    ]);
                }));
                it('should call ngOnDestroy on an injectable class', testing_2.fakeAsync(function () {
                    testing_2.TestBed.overrideDirective(TestDirective, { set: { providers: [InjectableWithLifecycle] } });
                    var ctx = createCompFixture('<div testDirective="dir"></div>', TestComponent);
                    ctx.debugElement.children[0].injector.get(InjectableWithLifecycle);
                    ctx.detectChanges(false);
                    ctx.destroy();
                    // We don't care about the exact order in this test.
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy']).sort()).toEqual([
                        'dir.ngOnDestroy', 'injectable.ngOnDestroy'
                    ]);
                }));
            });
        });
        describe('enforce no new changes', function () {
            it('should throw when a record gets changed after it has been checked', testing_2.fakeAsync(function () {
                var ChangingDirective = /** @class */ (function () {
                    function ChangingDirective() {
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], ChangingDirective.prototype, "changed", void 0);
                    ChangingDirective = __decorate([
                        core_1.Directive({ selector: '[changed]' })
                    ], ChangingDirective);
                    return ChangingDirective;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ChangingDirective] });
                var ctx = createCompFixture('<div [someProp]="a" [changed]="b"></div>', TestData);
                ctx.componentInstance.b = 1;
                matchers_1.expect(function () { return ctx.checkNoChanges(); })
                    .toThrowError(/Previous value: 'changed: undefined'\. Current value: 'changed: 1'/g);
            }));
            it('should warn when the view has been created in a cd hook', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<div *gh9882>{{ a }}</div>', TestData);
                ctx.componentInstance.a = 1;
                matchers_1.expect(function () { return ctx.detectChanges(); })
                    .toThrowError(/It seems like the view has been created after its parent and its children have been dirty checked/);
            }));
            it('should not throw when two arrays are structurally the same', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = ['value'];
                ctx.detectChanges(false);
                ctx.componentInstance.a = ['value'];
                matchers_1.expect(function () { return ctx.checkNoChanges(); }).not.toThrow();
            }));
            it('should not break the next run', testing_2.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = 'value';
                matchers_1.expect(function () { return ctx.checkNoChanges(); }).toThrow();
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['value']);
            }));
        });
        describe('mode', function () {
            it('Detached', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<comp-with-ref></comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('Detached should disable OnPush', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<push-cmp [value]="value"></push-cmp>');
                ctx.componentInstance.value = 0;
                ctx.detectChanges();
                renderLog.clear();
                var cmp = queryDirs(ctx.debugElement, PushComp)[0];
                cmp.changeDetectorRef.detach();
                ctx.componentInstance.value = 1;
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('Detached view can be checked locally', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<wrap-comp-with-ref></wrap-comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                matchers_1.expect(renderLog.log).toEqual([]);
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
                cmp.changeDetectorRef.detectChanges();
                matchers_1.expect(renderLog.log).toEqual(['{{hello}}']);
            }));
            it('Reattaches', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<comp-with-ref></comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
                cmp.changeDetectorRef.reattach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual(['{{hello}}']);
            }));
            it('Reattaches in the original cd mode', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<push-cmp></push-cmp>');
                var cmp = queryDirs(ctx.debugElement, PushComp)[0];
                cmp.changeDetectorRef.detach();
                cmp.changeDetectorRef.reattach();
                // renderCount should NOT be incremented with each CD as CD mode should be resetted to
                // on-push
                ctx.detectChanges();
                matchers_1.expect(cmp.renderCount).toBeGreaterThan(0);
                var count = cmp.renderCount;
                ctx.detectChanges();
                matchers_1.expect(cmp.renderCount).toBe(count);
            }));
        });
        describe('multi directive order', function () {
            it('should follow the DI order for the same element', testing_2.fakeAsync(function () {
                var ctx = createCompFixture('<div orderCheck2="2" orderCheck0="0" orderCheck1="1"></div>');
                ctx.detectChanges(false);
                ctx.destroy();
                matchers_1.expect(directiveLog.filter(['set'])).toEqual(['0.set', '1.set', '2.set']);
            }));
        });
        describe('nested view recursion', function () {
            it('should recurse into nested components even if there are no bindings in the component view', function () {
                var Nested = /** @class */ (function () {
                    function Nested() {
                        this.name = 'Tom';
                    }
                    Nested = __decorate([
                        core_1.Component({ selector: 'nested', template: '{{name}}' })
                    ], Nested);
                    return Nested;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Nested] });
                var ctx = createCompFixture('<nested></nested>');
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['Tom']);
            });
            it('should recurse into nested view containers even if there are no bindings in the component view', function () {
                var Comp = /** @class */ (function () {
                    function Comp() {
                        this.name = 'Tom';
                    }
                    __decorate([
                        core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
                        __metadata("design:type", core_1.ViewContainerRef)
                    ], Comp.prototype, "vc", void 0);
                    __decorate([
                        core_1.ViewChild(core_1.TemplateRef),
                        __metadata("design:type", core_1.TemplateRef)
                    ], Comp.prototype, "template", void 0);
                    Comp = __decorate([
                        core_1.Component({ template: '<ng-template #vc>{{name}}</ng-template>' })
                    ], Comp);
                    return Comp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Comp] });
                initHelpers();
                var ctx = testing_2.TestBed.createComponent(Comp);
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual([]);
                ctx.componentInstance.vc.createEmbeddedView(ctx.componentInstance.template);
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['Tom']);
            });
            describe('projected views', function () {
                var log;
                var DummyDirective = /** @class */ (function () {
                    function DummyDirective() {
                    }
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", Object)
                    ], DummyDirective.prototype, "i", void 0);
                    DummyDirective = __decorate([
                        core_1.Directive({ selector: '[i]' })
                    ], DummyDirective);
                    return DummyDirective;
                }());
                var MainComp = /** @class */ (function () {
                    function MainComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    MainComp.prototype.log = function (id) { log.push("main-" + id); };
                    MainComp = __decorate([
                        core_1.Component({
                            selector: 'main-cmp',
                            template: "<span [i]=\"log('start')\"></span><outer-cmp><ng-template><span [i]=\"log('tpl')\"></span></ng-template></outer-cmp>"
                        }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], MainComp);
                    return MainComp;
                }());
                var OuterComp = /** @class */ (function () {
                    function OuterComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    OuterComp.prototype.log = function (id) { log.push("outer-" + id); };
                    __decorate([
                        core_1.ContentChild(core_1.TemplateRef),
                        __metadata("design:type", core_1.TemplateRef)
                    ], OuterComp.prototype, "tpl", void 0);
                    OuterComp = __decorate([
                        core_1.Component({
                            selector: 'outer-cmp',
                            template: "<span [i]=\"log('start')\"></span><inner-cmp [outerTpl]=\"tpl\"><ng-template><span [i]=\"log('tpl')\"></span></ng-template></inner-cmp>"
                        }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], OuterComp);
                    return OuterComp;
                }());
                var InnerComp = /** @class */ (function () {
                    function InnerComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    InnerComp.prototype.log = function (id) { log.push("inner-" + id); };
                    __decorate([
                        core_1.ContentChild(core_1.TemplateRef),
                        __metadata("design:type", core_1.TemplateRef)
                    ], InnerComp.prototype, "tpl", void 0);
                    __decorate([
                        core_1.Input(),
                        __metadata("design:type", core_1.TemplateRef)
                    ], InnerComp.prototype, "outerTpl", void 0);
                    InnerComp = __decorate([
                        core_1.Component({
                            selector: 'inner-cmp',
                            template: "<span [i]=\"log('start')\"></span>><ng-container [ngTemplateOutlet]=\"outerTpl\"></ng-container><ng-container [ngTemplateOutlet]=\"tpl\"></ng-container>"
                        }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], InnerComp);
                    return InnerComp;
                }());
                var ctx;
                var mainComp;
                var outerComp;
                var innerComp;
                beforeEach(function () {
                    log = [];
                    ctx = testing_2.TestBed
                        .configureTestingModule({ declarations: [MainComp, OuterComp, InnerComp, DummyDirective] })
                        .createComponent(MainComp);
                    mainComp = ctx.componentInstance;
                    outerComp = ctx.debugElement.query(by_1.By.directive(OuterComp)).injector.get(OuterComp);
                    innerComp = ctx.debugElement.query(by_1.By.directive(InnerComp)).injector.get(InnerComp);
                });
                it('should dirty check projected views in regular order', function () {
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'inner-start', 'main-tpl', 'outer-tpl']);
                    log = [];
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'inner-start', 'main-tpl', 'outer-tpl']);
                });
                it('should not dirty check projected views if neither the declaration nor the insertion place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    mainComp.cdRef.detach();
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual([]);
                });
                it('should dirty check projected views if the insertion place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    innerComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['inner-start', 'main-tpl', 'outer-tpl']);
                });
                it('should dirty check projected views if the declaration place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    innerComp.cdRef.detach();
                    mainComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'main-tpl', 'outer-tpl']);
                    log = [];
                    outerComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['outer-start', 'outer-tpl']);
                    log = [];
                    outerComp.cdRef.detach();
                    mainComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['main-start', 'main-tpl']);
                });
            });
        });
        describe('class binding', function () {
            it('should coordinate class attribute and class host binding', function () {
                var Comp = /** @class */ (function () {
                    function Comp() {
                        this.initClasses = 'init';
                    }
                    Comp = __decorate([
                        core_1.Component({ template: "<div class=\"{{initClasses}}\" someDir></div>" })
                    ], Comp);
                    return Comp;
                }());
                var SomeDir = /** @class */ (function () {
                    function SomeDir() {
                        this.fooClass = true;
                    }
                    __decorate([
                        core_1.HostBinding('class.foo'),
                        __metadata("design:type", Object)
                    ], SomeDir.prototype, "fooClass", void 0);
                    SomeDir = __decorate([
                        core_1.Directive({ selector: '[someDir]' })
                    ], SomeDir);
                    return SomeDir;
                }());
                var ctx = testing_2.TestBed
                    .configureCompiler({
                    providers: [{ provide: compiler_1.ElementSchemaRegistry, useExisting: compiler_1.DomElementSchemaRegistry }]
                })
                    .configureTestingModule({ declarations: [Comp, SomeDir] })
                    .createComponent(Comp);
                ctx.detectChanges();
                var divEl = ctx.debugElement.children[0];
                matchers_1.expect(divEl.nativeElement).toHaveCssClass('init');
                matchers_1.expect(divEl.nativeElement).toHaveCssClass('foo');
            });
        });
        describe('lifecycle asserts', function () {
            var logged;
            function log(value) { logged.push(value); }
            function clearLog() { logged = []; }
            function expectOnceAndOnlyOnce(log) {
                matchers_1.expect(logged.indexOf(log) >= 0)
                    .toBeTruthy("'" + log + "' not logged. Log was " + JSON.stringify(logged));
                matchers_1.expect(logged.lastIndexOf(log) === logged.indexOf(log))
                    .toBeTruthy("'" + log + "' logged more than once. Log was " + JSON.stringify(logged));
            }
            beforeEach(function () { clearLog(); });
            var LifetimeMethods;
            (function (LifetimeMethods) {
                LifetimeMethods[LifetimeMethods["None"] = 0] = "None";
                LifetimeMethods[LifetimeMethods["ngOnInit"] = 1] = "ngOnInit";
                LifetimeMethods[LifetimeMethods["ngOnChanges"] = 2] = "ngOnChanges";
                LifetimeMethods[LifetimeMethods["ngAfterViewInit"] = 4] = "ngAfterViewInit";
                LifetimeMethods[LifetimeMethods["ngAfterContentInit"] = 8] = "ngAfterContentInit";
                LifetimeMethods[LifetimeMethods["ngDoCheck"] = 16] = "ngDoCheck";
                LifetimeMethods[LifetimeMethods["InitMethods"] = 13] = "InitMethods";
                LifetimeMethods[LifetimeMethods["InitMethodsAndChanges"] = 15] = "InitMethodsAndChanges";
                LifetimeMethods[LifetimeMethods["All"] = 31] = "All";
            })(LifetimeMethods || (LifetimeMethods = {}));
            function forEachMethod(methods, cb) {
                if (methods & LifetimeMethods.ngOnInit)
                    cb(LifetimeMethods.ngOnInit);
                if (methods & LifetimeMethods.ngOnChanges)
                    cb(LifetimeMethods.ngOnChanges);
                if (methods & LifetimeMethods.ngAfterContentInit)
                    cb(LifetimeMethods.ngAfterContentInit);
                if (methods & LifetimeMethods.ngAfterViewInit)
                    cb(LifetimeMethods.ngAfterViewInit);
                if (methods & LifetimeMethods.ngDoCheck)
                    cb(LifetimeMethods.ngDoCheck);
            }
            describe('calling init', function () {
                function initialize(options) {
                    var MyChild = /** @class */ (function () {
                        function MyChild() {
                            this.thrown = LifetimeMethods.None;
                            this.outp = new core_1.EventEmitter();
                        }
                        MyChild.prototype.ngDoCheck = function () { this.check(LifetimeMethods.ngDoCheck); };
                        MyChild.prototype.ngOnInit = function () { this.check(LifetimeMethods.ngOnInit); };
                        MyChild.prototype.ngOnChanges = function () { this.check(LifetimeMethods.ngOnChanges); };
                        MyChild.prototype.ngAfterViewInit = function () { this.check(LifetimeMethods.ngAfterViewInit); };
                        MyChild.prototype.ngAfterContentInit = function () { this.check(LifetimeMethods.ngAfterContentInit); };
                        MyChild.prototype.check = function (method) {
                            log("MyChild::" + LifetimeMethods[method] + "()");
                            if ((options.childRecursion & method) !== 0) {
                                if (logged.length < 20) {
                                    this.outp.emit(null);
                                }
                                else {
                                    fail("Unexpected MyChild::" + LifetimeMethods[method] + " recursion");
                                }
                            }
                            if ((options.childThrows & method) !== 0) {
                                if ((this.thrown & method) === 0) {
                                    this.thrown |= method;
                                    log("<THROW from MyChild::" + LifetimeMethods[method] + ">()");
                                    throw new Error("Throw from MyChild::" + LifetimeMethods[method]);
                                }
                            }
                        };
                        __decorate([
                            core_1.Input(),
                            __metadata("design:type", Boolean)
                        ], MyChild.prototype, "inp", void 0);
                        __decorate([
                            core_1.Output(),
                            __metadata("design:type", Object)
                        ], MyChild.prototype, "outp", void 0);
                        MyChild = __decorate([
                            core_1.Component({ selector: 'my-child', template: '' }),
                            __metadata("design:paramtypes", [])
                        ], MyChild);
                        return MyChild;
                    }());
                    var MyComponent = /** @class */ (function () {
                        function MyComponent(changeDetectionRef) {
                            this.changeDetectionRef = changeDetectionRef;
                        }
                        MyComponent.prototype.ngDoCheck = function () { this.check(LifetimeMethods.ngDoCheck); };
                        MyComponent.prototype.ngOnInit = function () { this.check(LifetimeMethods.ngOnInit); };
                        MyComponent.prototype.ngAfterViewInit = function () { this.check(LifetimeMethods.ngAfterViewInit); };
                        MyComponent.prototype.ngAfterContentInit = function () { this.check(LifetimeMethods.ngAfterContentInit); };
                        MyComponent.prototype.onOutp = function () {
                            log('<RECURSION START>');
                            this.changeDetectionRef.detectChanges();
                            log('<RECURSION DONE>');
                        };
                        MyComponent.prototype.check = function (method) {
                            log("MyComponent::" + LifetimeMethods[method] + "()");
                        };
                        MyComponent = __decorate([
                            core_1.Component({
                                selector: 'my-component',
                                template: "<my-child [inp]='true' (outp)='onOutp()'></my-child>"
                            }),
                            __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                        ], MyComponent);
                        return MyComponent;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [MyChild, MyComponent] });
                    return createCompFixture("<my-component></my-component>");
                }
                function ensureOneInit(options) {
                    var ctx = initialize(options);
                    var throws = options.childThrows != LifetimeMethods.None;
                    if (throws) {
                        log("<CYCLE 0 START>");
                        matchers_1.expect(function () {
                            // Expect child to throw.
                            ctx.detectChanges();
                        }).toThrow();
                        log("<CYCLE 0 END>");
                        log("<CYCLE 1 START>");
                    }
                    ctx.detectChanges();
                    if (throws)
                        log("<CYCLE 1 DONE>");
                    expectOnceAndOnlyOnce('MyComponent::ngOnInit()');
                    expectOnceAndOnlyOnce('MyChild::ngOnInit()');
                    expectOnceAndOnlyOnce('MyComponent::ngAfterViewInit()');
                    expectOnceAndOnlyOnce('MyComponent::ngAfterContentInit()');
                    expectOnceAndOnlyOnce('MyChild::ngAfterViewInit()');
                    expectOnceAndOnlyOnce('MyChild::ngAfterContentInit()');
                }
                forEachMethod(LifetimeMethods.InitMethodsAndChanges, function (method) {
                    it("should ensure that init hooks are called once an only once with recursion in " + LifetimeMethods[method] + " ", function () {
                        // Ensure all the init methods are called once.
                        ensureOneInit({ childRecursion: method, childThrows: LifetimeMethods.None });
                    });
                });
                forEachMethod(LifetimeMethods.All, function (method) {
                    it("should ensure that init hooks are called once an only once with a throw in " + LifetimeMethods[method] + " ", function () {
                        // Ensure all the init methods are called once.
                        // the first cycle throws but the next cycle should complete the inits.
                        ensureOneInit({ childRecursion: LifetimeMethods.None, childThrows: method });
                    });
                });
            });
        });
    });
})();
var RenderLog = /** @class */ (function () {
    function RenderLog() {
        this.log = [];
        this.loggedValues = [];
    }
    RenderLog.prototype.setElementProperty = function (el, propName, propValue) {
        this.log.push(propName + "=" + propValue);
        this.loggedValues.push(propValue);
    };
    RenderLog.prototype.setText = function (node, value) {
        this.log.push("{{" + value + "}}");
        this.loggedValues.push(value);
    };
    RenderLog.prototype.clear = function () {
        this.log = [];
        this.loggedValues = [];
    };
    RenderLog = __decorate([
        core_1.Injectable()
    ], RenderLog);
    return RenderLog;
}());
var DirectiveLogEntry = /** @class */ (function () {
    function DirectiveLogEntry(directiveName, method) {
        this.directiveName = directiveName;
        this.method = method;
    }
    return DirectiveLogEntry;
}());
function patchLoggingRenderer2(rendererFactory, log) {
    if (rendererFactory.__patchedForLogging) {
        return;
    }
    rendererFactory.__patchedForLogging = true;
    var origCreateRenderer = rendererFactory.createRenderer;
    rendererFactory.createRenderer = function () {
        var renderer = origCreateRenderer.apply(this, arguments);
        if (renderer.__patchedForLogging) {
            return renderer;
        }
        renderer.__patchedForLogging = true;
        var origSetProperty = renderer.setProperty;
        var origSetValue = renderer.setValue;
        renderer.setProperty = function (el, name, value) {
            log.setElementProperty(el, name, value);
            origSetProperty.call(renderer, el, name, value);
        };
        renderer.setValue = function (node, value) {
            if (dom_adapter_1.getDOM().isTextNode(node)) {
                log.setText(node, value);
            }
            origSetValue.call(renderer, node, value);
        };
        return renderer;
    };
}
var DirectiveLog = /** @class */ (function () {
    function DirectiveLog() {
        this.entries = [];
    }
    DirectiveLog.prototype.add = function (directiveName, method) {
        this.entries.push(new DirectiveLogEntry(directiveName, method));
    };
    DirectiveLog.prototype.clear = function () { this.entries = []; };
    DirectiveLog.prototype.filter = function (methods) {
        return this.entries.filter(function (entry) { return methods.indexOf(entry.method) !== -1; })
            .map(function (entry) { return entry.directiveName + "." + entry.method; });
    };
    DirectiveLog = __decorate([
        core_1.Injectable()
    ], DirectiveLog);
    return DirectiveLog;
}());
var CountingPipe = /** @class */ (function () {
    function CountingPipe() {
        this.state = 0;
    }
    CountingPipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    CountingPipe = __decorate([
        core_1.Pipe({ name: 'countingPipe' })
    ], CountingPipe);
    return CountingPipe;
}());
var CountingImpurePipe = /** @class */ (function () {
    function CountingImpurePipe() {
        this.state = 0;
    }
    CountingImpurePipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    CountingImpurePipe = __decorate([
        core_1.Pipe({ name: 'countingImpurePipe', pure: false })
    ], CountingImpurePipe);
    return CountingImpurePipe;
}());
var PipeWithOnDestroy = /** @class */ (function () {
    function PipeWithOnDestroy(directiveLog) {
        this.directiveLog = directiveLog;
    }
    PipeWithOnDestroy.prototype.ngOnDestroy = function () { this.directiveLog.add('pipeWithOnDestroy', 'ngOnDestroy'); };
    PipeWithOnDestroy.prototype.transform = function (value) { return null; };
    PipeWithOnDestroy = __decorate([
        core_1.Pipe({ name: 'pipeWithOnDestroy' }),
        __metadata("design:paramtypes", [DirectiveLog])
    ], PipeWithOnDestroy);
    return PipeWithOnDestroy;
}());
var IdentityPipe = /** @class */ (function () {
    function IdentityPipe() {
    }
    IdentityPipe.prototype.transform = function (value) { return value; };
    IdentityPipe = __decorate([
        core_1.Pipe({ name: 'identityPipe' })
    ], IdentityPipe);
    return IdentityPipe;
}());
var WrappedPipe = /** @class */ (function () {
    function WrappedPipe() {
    }
    WrappedPipe.prototype.transform = function (value) { return core_1.WrappedValue.wrap(value); };
    WrappedPipe = __decorate([
        core_1.Pipe({ name: 'wrappedPipe' })
    ], WrappedPipe);
    return WrappedPipe;
}());
var MultiArgPipe = /** @class */ (function () {
    function MultiArgPipe() {
    }
    MultiArgPipe.prototype.transform = function (value, arg1, arg2, arg3) {
        if (arg3 === void 0) { arg3 = 'default'; }
        return value + " " + arg1 + " " + arg2 + " " + arg3;
    };
    MultiArgPipe = __decorate([
        core_1.Pipe({ name: 'multiArgPipe' })
    ], MultiArgPipe);
    return MultiArgPipe;
}());
var TestComponent = /** @class */ (function () {
    function TestComponent() {
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: 'empty' })
    ], TestComponent);
    return TestComponent;
}());
var AnotherComponent = /** @class */ (function () {
    function AnotherComponent() {
    }
    AnotherComponent = __decorate([
        core_1.Component({ selector: 'other-cmp', template: 'empty' })
    ], AnotherComponent);
    return AnotherComponent;
}());
var CompWithRef = /** @class */ (function () {
    function CompWithRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    CompWithRef.prototype.noop = function () { };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompWithRef.prototype, "value", void 0);
    CompWithRef = __decorate([
        core_1.Component({
            selector: 'comp-with-ref',
            template: '<div (event)="noop()" emitterDirective></div>{{value}}',
            host: { 'event': 'noop()' }
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], CompWithRef);
    return CompWithRef;
}());
var WrapCompWithRef = /** @class */ (function () {
    function WrapCompWithRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    WrapCompWithRef = __decorate([
        core_1.Component({ selector: 'wrap-comp-with-ref', template: '<comp-with-ref></comp-with-ref>' }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], WrapCompWithRef);
    return WrapCompWithRef;
}());
var PushComp = /** @class */ (function () {
    function PushComp(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.renderCount = 0;
    }
    Object.defineProperty(PushComp.prototype, "renderIncrement", {
        get: function () {
            this.renderCount++;
            return '';
        },
        enumerable: true,
        configurable: true
    });
    PushComp.prototype.noop = function () { };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PushComp.prototype, "value", void 0);
    PushComp = __decorate([
        core_1.Component({
            selector: 'push-cmp',
            template: '<div (event)="noop()" emitterDirective></div>{{value}}{{renderIncrement}}',
            host: { '(event)': 'noop()' },
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], PushComp);
    return PushComp;
}());
var EmitterDirective = /** @class */ (function () {
    function EmitterDirective() {
        this.emitter = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output('event'),
        __metadata("design:type", Object)
    ], EmitterDirective.prototype, "emitter", void 0);
    EmitterDirective = __decorate([
        core_1.Directive({ selector: '[emitterDirective]' })
    ], EmitterDirective);
    return EmitterDirective;
}());
var Gh9882 = /** @class */ (function () {
    function Gh9882(_viewContainer, _templateRef) {
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
    }
    Gh9882.prototype.ngAfterContentInit = function () { this._viewContainer.createEmbeddedView(this._templateRef); };
    Gh9882 = __decorate([
        core_1.Directive({ selector: '[gh9882]' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
    ], Gh9882);
    return Gh9882;
}());
var TestDirective = /** @class */ (function () {
    function TestDirective(log) {
        this.log = log;
        this.eventEmitter = new core_1.EventEmitter();
    }
    TestDirective.prototype.onEvent = function (event) { this.event = event; };
    TestDirective.prototype.ngDoCheck = function () { this.log.add(this.name, 'ngDoCheck'); };
    TestDirective.prototype.ngOnInit = function () {
        this.log.add(this.name, 'ngOnInit');
        if (this.throwOn == 'ngOnInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngOnChanges = function (changes) {
        this.log.add(this.name, 'ngOnChanges');
        this.changes = changes;
        if (this.throwOn == 'ngOnChanges') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterContentInit = function () {
        this.log.add(this.name, 'ngAfterContentInit');
        if (this.throwOn == 'ngAfterContentInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterContentChecked = function () {
        this.log.add(this.name, 'ngAfterContentChecked');
        if (this.throwOn == 'ngAfterContentChecked') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterViewInit = function () {
        this.log.add(this.name, 'ngAfterViewInit');
        if (this.throwOn == 'ngAfterViewInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterViewChecked = function () {
        this.log.add(this.name, 'ngAfterViewChecked');
        if (this.throwOn == 'ngAfterViewChecked') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngOnDestroy = function () {
        this.log.add(this.name, 'ngOnDestroy');
        if (this.throwOn == 'ngOnDestroy') {
            throw new Error('Boom!');
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TestDirective.prototype, "a", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TestDirective.prototype, "b", void 0);
    __decorate([
        core_1.Input('testDirective'),
        __metadata("design:type", String)
    ], TestDirective.prototype, "name", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TestDirective.prototype, "throwOn", void 0);
    TestDirective = __decorate([
        core_1.Directive({ selector: '[testDirective]', exportAs: 'testDirective' }),
        __metadata("design:paramtypes", [DirectiveLog])
    ], TestDirective);
    return TestDirective;
}());
var InjectableWithLifecycle = /** @class */ (function () {
    function InjectableWithLifecycle(log) {
        this.log = log;
        this.name = 'injectable';
    }
    InjectableWithLifecycle.prototype.ngOnDestroy = function () { this.log.add(this.name, 'ngOnDestroy'); };
    InjectableWithLifecycle = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [DirectiveLog])
    ], InjectableWithLifecycle);
    return InjectableWithLifecycle;
}());
var OnDestroyDirective = /** @class */ (function () {
    function OnDestroyDirective() {
        this.emitter = new core_1.EventEmitter(false);
    }
    OnDestroyDirective.prototype.ngOnDestroy = function () { this.emitter.emit('destroyed'); };
    __decorate([
        core_1.Output('destroy'),
        __metadata("design:type", Object)
    ], OnDestroyDirective.prototype, "emitter", void 0);
    OnDestroyDirective = __decorate([
        core_1.Directive({ selector: '[onDestroyDirective]' })
    ], OnDestroyDirective);
    return OnDestroyDirective;
}());
var OrderCheckDirective0 = /** @class */ (function () {
    function OrderCheckDirective0(log) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective0.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input('orderCheck0'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], OrderCheckDirective0.prototype, "name", null);
    OrderCheckDirective0 = __decorate([
        core_1.Directive({ selector: '[orderCheck0]' }),
        __metadata("design:paramtypes", [DirectiveLog])
    ], OrderCheckDirective0);
    return OrderCheckDirective0;
}());
var OrderCheckDirective1 = /** @class */ (function () {
    function OrderCheckDirective1(log, _check0) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective1.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input('orderCheck1'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], OrderCheckDirective1.prototype, "name", null);
    OrderCheckDirective1 = __decorate([
        core_1.Directive({ selector: '[orderCheck1]' }),
        __metadata("design:paramtypes", [DirectiveLog, OrderCheckDirective0])
    ], OrderCheckDirective1);
    return OrderCheckDirective1;
}());
var OrderCheckDirective2 = /** @class */ (function () {
    function OrderCheckDirective2(log, _check1) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective2.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input('orderCheck2'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], OrderCheckDirective2.prototype, "name", null);
    OrderCheckDirective2 = __decorate([
        core_1.Directive({ selector: '[orderCheck2]' }),
        __metadata("design:paramtypes", [DirectiveLog, OrderCheckDirective1])
    ], OrderCheckDirective2);
    return OrderCheckDirective2;
}());
var TestLocalsContext = /** @class */ (function () {
    function TestLocalsContext(someLocal) {
        this.someLocal = someLocal;
    }
    return TestLocalsContext;
}());
var TestLocals = /** @class */ (function () {
    function TestLocals(templateRef, vcRef) {
        vcRef.createEmbeddedView(templateRef, new TestLocalsContext('someLocalValue'));
    }
    TestLocals = __decorate([
        core_1.Directive({ selector: '[testLocals]' }),
        __metadata("design:paramtypes", [core_1.TemplateRef, core_1.ViewContainerRef])
    ], TestLocals);
    return TestLocals;
}());
var Person = /** @class */ (function () {
    function Person() {
        this.address = null;
    }
    Person.prototype.init = function (name, address) {
        if (address === void 0) { address = null; }
        this.name = name;
        this.address = address;
    };
    Person.prototype.sayHi = function (m) { return "Hi, " + m; };
    Person.prototype.passThrough = function (val) { return val; };
    Person.prototype.toString = function () {
        var address = this.address == null ? '' : ' address=' + this.address.toString();
        return 'name=' + this.name + address;
    };
    Person = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], Person);
    return Person;
}());
var Address = /** @class */ (function () {
    function Address(_city, _zipcode) {
        if (_zipcode === void 0) { _zipcode = null; }
        this._city = _city;
        this._zipcode = _zipcode;
        this.cityGetterCalls = 0;
        this.zipCodeGetterCalls = 0;
    }
    Object.defineProperty(Address.prototype, "city", {
        get: function () {
            this.cityGetterCalls++;
            return this._city;
        },
        set: function (v) { this._city = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "zipcode", {
        get: function () {
            this.zipCodeGetterCalls++;
            return this._zipcode;
        },
        set: function (v) { this._zipcode = v; },
        enumerable: true,
        configurable: true
    });
    Address.prototype.toString = function () { return this.city || '-'; };
    return Address;
}());
var Uninitialized = /** @class */ (function () {
    function Uninitialized() {
        this.value = null;
    }
    Uninitialized = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], Uninitialized);
    return Uninitialized;
}());
var TestData = /** @class */ (function () {
    function TestData() {
    }
    TestData = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], TestData);
    return TestData;
}());
var TestDataWithGetter = /** @class */ (function () {
    function TestDataWithGetter() {
    }
    Object.defineProperty(TestDataWithGetter.prototype, "a", {
        get: function () { return this.fn(); },
        enumerable: true,
        configurable: true
    });
    TestDataWithGetter = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], TestDataWithGetter);
    return TestDataWithGetter;
}());
var Holder = /** @class */ (function () {
    function Holder() {
    }
    return Holder;
}());
var PersonHolder = /** @class */ (function (_super) {
    __extends(PersonHolder, _super);
    function PersonHolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PersonHolder = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], PersonHolder);
    return PersonHolder;
}(Holder));
var PersonHolderHolder = /** @class */ (function (_super) {
    __extends(PersonHolderHolder, _super);
    function PersonHolderHolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PersonHolderHolder = __decorate([
        core_1.Component({ selector: 'root', template: 'empty' })
    ], PersonHolderHolder);
    return PersonHolderHolder;
}(Holder));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9jaGFuZ2VfZGV0ZWN0aW9uX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQStHO0FBQy9HLHFEQUFpRjtBQUNqRixzQ0FBaWU7QUFDamUsaURBQTJFO0FBQzNFLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsT0FBTyxJQUFJLHNCQUFXLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRkQsc0ZBRUM7QUFFRCxJQUFNLHVCQUF1QixHQUFlO0lBQzFDLEVBQUMsT0FBTyxFQUFFLGdDQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLDRCQUFrQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztJQUN0RixFQUFDLE9BQU8sRUFBRSx5QkFBYyxFQUFFLFFBQVEsRUFBRSw0QkFBa0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQ2pFLEVBQUMsT0FBTyxFQUFFLHNCQUFXLEVBQUUsVUFBVSxFQUFFLHFDQUFxQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7Q0FDcEYsQ0FBQztBQUdGLENBQUM7SUFDQyxJQUFJLFFBQTRCLENBQUM7SUFDakMsSUFBSSxTQUFvQixDQUFDO0lBQ3pCLElBQUksWUFBMEIsQ0FBQztJQUkvQiwyQkFDSSxRQUFnQixFQUFFLFFBQXNDO1FBQXRDLHlCQUFBLEVBQUEsV0FBeUIsYUFBYTtRQUMxRCxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLGdCQUFTLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFD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