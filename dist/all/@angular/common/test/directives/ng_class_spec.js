"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
{
    describe('binding to CSS class list', function () {
        var fixture;
        function normalizeClassNames(classes) {
            return classes.trim().split(' ').sort().join(' ');
        }
        function detectChangesAndExpectClassName(classes) {
            fixture.detectChanges();
            var nonNormalizedClassName = fixture.debugElement.children[0].nativeElement.className;
            expect(normalizeClassNames(nonNormalizedClassName)).toEqual(normalizeClassNames(classes));
        }
        function getComponent() { return fixture.debugElement.componentInstance; }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
            });
        });
        it('should clean up when the directive is destroyed', testing_1.async(function () {
            fixture = createTestComponent('<div *ngFor="let item of items" [ngClass]="item"></div>');
            getComponent().items = [['0']];
            fixture.detectChanges();
            getComponent().items = [['1']];
            detectChangesAndExpectClassName('1');
        }));
        describe('expressions evaluating to objects', function () {
            it('should add classes specified in an object literal', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="{foo: true, bar: false}"></div>');
                detectChangesAndExpectClassName('foo');
            }));
            it('should add classes specified in an object literal without change in class names', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"{'foo-bar': true, 'fooBar': true}\"></div>");
                detectChangesAndExpectClassName('foo-bar fooBar');
            }));
            it('should add and remove classes based on changes in object literal values', testing_1.async(function () {
                fixture =
                    createTestComponent('<div [ngClass]="{foo: condition, bar: !condition}"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().condition = false;
                detectChangesAndExpectClassName('bar');
            }));
            it('should add and remove classes based on changes to the expression object', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                var objExpr = getComponent().objExpr;
                detectChangesAndExpectClassName('foo');
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('foo bar');
                objExpr['baz'] = true;
                detectChangesAndExpectClassName('foo bar baz');
                delete (objExpr['bar']);
                detectChangesAndExpectClassName('foo baz');
            }));
            it('should add and remove classes based on reference changes to the expression object', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().objExpr = { foo: true, bar: true };
                detectChangesAndExpectClassName('foo bar');
                getComponent().objExpr = { baz: true };
                detectChangesAndExpectClassName('baz');
            }));
            it('should remove active classes when expression evaluates to null', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().objExpr = null;
                detectChangesAndExpectClassName('');
                getComponent().objExpr = { 'foo': false, 'bar': true };
                detectChangesAndExpectClassName('bar');
            }));
            it('should allow multiple classes per expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                getComponent().objExpr = { 'bar baz': true, 'bar1 baz1': true };
                detectChangesAndExpectClassName('bar baz bar1 baz1');
                getComponent().objExpr = { 'bar baz': false, 'bar1 baz1': true };
                detectChangesAndExpectClassName('bar1 baz1');
            }));
            it('should split by one or more spaces between classes', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                getComponent().objExpr = { 'foo bar     baz': true };
                detectChangesAndExpectClassName('foo bar baz');
            }));
        });
        describe('expressions evaluating to lists', function () {
            it('should add classes specified in a list literal', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"['foo', 'bar', 'foo-bar', 'fooBar']\"></div>");
                detectChangesAndExpectClassName('foo bar foo-bar fooBar');
            }));
            it('should add and remove classes based on changes to the expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                var arrExpr = getComponent().arrExpr;
                detectChangesAndExpectClassName('foo');
                arrExpr.push('bar');
                detectChangesAndExpectClassName('foo bar');
                arrExpr[1] = 'baz';
                detectChangesAndExpectClassName('foo baz');
                getComponent().arrExpr = arrExpr.filter(function (v) { return v !== 'baz'; });
                detectChangesAndExpectClassName('foo');
            }));
            it('should add and remove classes when a reference changes', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().arrExpr = ['bar'];
                detectChangesAndExpectClassName('bar');
            }));
            it('should take initial classes into account when a reference changes', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().arrExpr = ['bar'];
                detectChangesAndExpectClassName('foo bar');
            }));
            it('should ignore empty or blank class names', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = ['', '  '];
                detectChangesAndExpectClassName('foo');
            }));
            it('should trim blanks from class names', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = [' bar  '];
                detectChangesAndExpectClassName('foo bar');
            }));
            it('should allow multiple classes per item in arrays', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = ['foo bar baz', 'foo1 bar1   baz1'];
                detectChangesAndExpectClassName('foo bar baz foo1 bar1 baz1');
                getComponent().arrExpr = ['foo bar   baz foobar'];
                detectChangesAndExpectClassName('foo bar baz foobar');
            }));
            it('should throw with descriptive error message when CSS class is not a string', function () {
                fixture = createTestComponent("<div [ngClass]=\"['foo', {}]\"></div>");
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/NgClass can only toggle CSS classes expressed as strings, got \[object Object\]/);
            });
        });
        describe('expressions evaluating to sets', function () {
            it('should add and remove classes if the set instance changed', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="setExpr"></div>');
                var setExpr = new Set();
                setExpr.add('bar');
                getComponent().setExpr = setExpr;
                detectChangesAndExpectClassName('bar');
                setExpr = new Set();
                setExpr.add('baz');
                getComponent().setExpr = setExpr;
                detectChangesAndExpectClassName('baz');
            }));
        });
        describe('expressions evaluating to string', function () {
            it('should add classes specified in a string literal', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"'foo bar foo-bar fooBar'\"></div>");
                detectChangesAndExpectClassName('foo bar foo-bar fooBar');
            }));
            it('should add and remove classes based on changes to the expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="strExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = 'foo bar';
                detectChangesAndExpectClassName('foo bar');
                getComponent().strExpr = 'baz';
                detectChangesAndExpectClassName('baz');
            }));
            it('should remove active classes when switching from string to null', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"strExpr\"></div>");
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = null;
                detectChangesAndExpectClassName('');
            }));
            it('should take initial classes into account when switching from string to null', testing_1.async(function () {
                fixture = createTestComponent("<div class=\"foo\" [ngClass]=\"strExpr\"></div>");
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = null;
                detectChangesAndExpectClassName('foo');
            }));
            it('should ignore empty and blank strings', testing_1.async(function () {
                fixture = createTestComponent("<div class=\"foo\" [ngClass]=\"strExpr\"></div>");
                getComponent().strExpr = '';
                detectChangesAndExpectClassName('foo');
            }));
        });
        describe('cooperation with other class-changing constructs', function () {
            it('should co-operate with the class attribute', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr" class="init foo"></div>');
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo bar');
                objExpr['foo'] = false;
                detectChangesAndExpectClassName('init bar');
                getComponent().objExpr = null;
                detectChangesAndExpectClassName('init foo');
            }));
            it('should co-operate with the interpolated class attribute', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"objExpr\" class=\"{{'init foo'}}\"></div>");
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName("init foo bar");
                objExpr['foo'] = false;
                detectChangesAndExpectClassName("init bar");
                getComponent().objExpr = null;
                detectChangesAndExpectClassName("init foo");
            }));
            it('should co-operate with the interpolated class attribute when interpolation changes', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"{large: false, small: true}\" class=\"{{strExpr}}\"></div>");
                detectChangesAndExpectClassName("foo small");
                getComponent().strExpr = 'bar';
                detectChangesAndExpectClassName("bar small");
            }));
            it('should co-operate with the class attribute and binding to it', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"objExpr\" class=\"init\" [class]=\"'foo'\"></div>");
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName("init foo bar");
                objExpr['foo'] = false;
                detectChangesAndExpectClassName("init bar");
                getComponent().objExpr = null;
                detectChangesAndExpectClassName("init foo");
            }));
            it('should co-operate with the class attribute and class.name binding', testing_1.async(function () {
                var template = '<div class="init foo" [ngClass]="objExpr" [class.baz]="condition"></div>';
                fixture = createTestComponent(template);
                var objExpr = getComponent().objExpr;
                detectChangesAndExpectClassName('init foo baz');
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo baz bar');
                objExpr['foo'] = false;
                detectChangesAndExpectClassName('init baz bar');
                getComponent().condition = false;
                detectChangesAndExpectClassName('init bar');
            }));
            it('should co-operate with initial class and class attribute binding when binding changes', testing_1.async(function () {
                var template = '<div class="init" [ngClass]="objExpr" [class]="strExpr"></div>';
                fixture = createTestComponent(template);
                var cmp = getComponent();
                detectChangesAndExpectClassName('init foo');
                cmp.objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo bar');
                cmp.strExpr = 'baz';
                detectChangesAndExpectClassName('init bar baz foo');
                cmp.objExpr = null;
                detectChangesAndExpectClassName('init baz');
            }));
        });
    });
}
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.condition = true;
        this.arrExpr = ['foo'];
        this.setExpr = new Set();
        this.objExpr = { 'foo': true, 'bar': false };
        this.strExpr = 'foo';
        this.setExpr.add('foo');
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' }),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    return TestComponent;
}());
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY2xhc3Nfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfY2xhc3Nfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF3QztBQUN4QyxpREFBdUU7QUFFdkU7SUFDRSxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsSUFBSSxPQUFtQyxDQUFDO1FBRXhDLDZCQUE2QixPQUFlO1lBQzFDLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVELHlDQUF5QyxPQUFlO1lBQ3RELE9BQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMxQixJQUFJLHNCQUFzQixHQUFHLE9BQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFDeEYsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM1RixDQUFDO1FBRUQsMEJBQXlDLE9BQU8sT0FBUyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFM0YsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQzthQUM5QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxlQUFLLENB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