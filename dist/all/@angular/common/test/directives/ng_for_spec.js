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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var thisArg;
{
    describe('ngFor', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function detectChangesAndExpectText(text) {
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText(text);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [common_1.CommonModule],
            });
        });
        it('should reflect initial elements', testing_1.async(function () {
            fixture = createTestComponent();
            detectChangesAndExpectText('1;2;');
        }));
        it('should reflect added elements', testing_1.async(function () {
            fixture = createTestComponent();
            fixture.detectChanges();
            getComponent().items.push(3);
            detectChangesAndExpectText('1;2;3;');
        }));
        it('should reflect removed elements', testing_1.async(function () {
            fixture = createTestComponent();
            fixture.detectChanges();
            getComponent().items.splice(1, 1);
            detectChangesAndExpectText('1;');
        }));
        it('should reflect moved elements', testing_1.async(function () {
            fixture = createTestComponent();
            fixture.detectChanges();
            getComponent().items.splice(0, 1);
            getComponent().items.push(1);
            detectChangesAndExpectText('2;1;');
        }));
        it('should reflect a mix of all changes (additions/removals/moves)', testing_1.async(function () {
            fixture = createTestComponent();
            getComponent().items = [0, 1, 2, 3, 4, 5];
            fixture.detectChanges();
            getComponent().items = [6, 2, 7, 0, 4, 8];
            detectChangesAndExpectText('6;2;7;0;4;8;');
        }));
        it('should iterate over an array of objects', testing_1.async(function () {
            var template = '<ul><li *ngFor="let item of items">{{item["name"]}};</li></ul>';
            fixture = createTestComponent(template);
            // INIT
            getComponent().items = [{ 'name': 'misko' }, { 'name': 'shyam' }];
            detectChangesAndExpectText('misko;shyam;');
            // GROW
            getComponent().items.push({ 'name': 'adam' });
            detectChangesAndExpectText('misko;shyam;adam;');
            // SHRINK
            getComponent().items.splice(2, 1);
            getComponent().items.splice(0, 1);
            detectChangesAndExpectText('shyam;');
        }));
        it('should gracefully handle nulls', testing_1.async(function () {
            var template = '<ul><li *ngFor="let item of null">{{item}};</li></ul>';
            fixture = createTestComponent(template);
            detectChangesAndExpectText('');
        }));
        it('should gracefully handle ref changing to null and back', testing_1.async(function () {
            fixture = createTestComponent();
            detectChangesAndExpectText('1;2;');
            getComponent().items = null;
            detectChangesAndExpectText('');
            getComponent().items = [1, 2, 3];
            detectChangesAndExpectText('1;2;3;');
        }));
        it('should throw on non-iterable ref and suggest using an array', testing_1.async(function () {
            fixture = createTestComponent();
            getComponent().items = 'whaaa';
            matchers_1.expect(function () { return fixture.detectChanges(); })
                .toThrowError(/Cannot find a differ supporting object 'whaaa' of type 'string'. NgFor only supports binding to Iterables such as Arrays/);
        }));
        it('should throw on ref changing to string', testing_1.async(function () {
            fixture = createTestComponent();
            detectChangesAndExpectText('1;2;');
            getComponent().items = 'whaaa';
            matchers_1.expect(function () { return fixture.detectChanges(); }).toThrowError();
        }));
        it('should works with duplicates', testing_1.async(function () {
            fixture = createTestComponent();
            var a = new Foo();
            getComponent().items = [a, a];
            detectChangesAndExpectText('foo;foo;');
        }));
        it('should repeat over nested arrays', testing_1.async(function () {
            var template = '<div *ngFor="let item of items">' +
                '<div *ngFor="let subitem of item">{{subitem}}-{{item.length}};</div>|' +
                '</div>';
            fixture = createTestComponent(template);
            getComponent().items = [['a', 'b'], ['c']];
            detectChangesAndExpectText('a-2;b-2;|c-1;|');
            getComponent().items = [['e'], ['f', 'g']];
            detectChangesAndExpectText('e-1;|f-2;g-2;|');
        }));
        it('should repeat over nested arrays with no intermediate element', testing_1.async(function () {
            var template = '<div *ngFor="let item of items">' +
                '<div *ngFor="let subitem of item">{{subitem}}-{{item.length}};</div>' +
                '</div>';
            fixture = createTestComponent(template);
            getComponent().items = [['a', 'b'], ['c']];
            detectChangesAndExpectText('a-2;b-2;c-1;');
            getComponent().items = [['e'], ['f', 'g']];
            detectChangesAndExpectText('e-1;f-2;g-2;');
        }));
        it('should repeat over nested ngIf that are the last node in the ngFor template', testing_1.async(function () {
            var template = "<div *ngFor=\"let item of items; let i=index\">" +
                "<div>{{i}}|</div>" +
                "<div *ngIf=\"i % 2 == 0\">even|</div>" +
                "</div>";
            fixture = createTestComponent(template);
            var items = [1];
            getComponent().items = items;
            detectChangesAndExpectText('0|even|');
            items.push(1);
            detectChangesAndExpectText('0|even|1|');
            items.push(1);
            detectChangesAndExpectText('0|even|1|2|even|');
        }));
        it('should allow of saving the collection', testing_1.async(function () {
            var template = '<ul><li *ngFor="let item of items as collection; index as i">{{i}}/{{collection.length}} - {{item}};</li></ul>';
            fixture = createTestComponent(template);
            detectChangesAndExpectText('0/2 - 1;1/2 - 2;');
            getComponent().items = [1, 2, 3];
            detectChangesAndExpectText('0/3 - 1;1/3 - 2;2/3 - 3;');
        }));
        it('should display indices correctly', testing_1.async(function () {
            var template = '<span *ngFor ="let item of items; let i=index">{{i.toString()}}</span>';
            fixture = createTestComponent(template);
            getComponent().items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            detectChangesAndExpectText('0123456789');
            getComponent().items = [1, 2, 6, 7, 4, 3, 5, 8, 9, 0];
            detectChangesAndExpectText('0123456789');
        }));
        it('should display first item correctly', testing_1.async(function () {
            var template = '<span *ngFor="let item of items; let isFirst=first">{{isFirst.toString()}}</span>';
            fixture = createTestComponent(template);
            getComponent().items = [0, 1, 2];
            detectChangesAndExpectText('truefalsefalse');
            getComponent().items = [2, 1];
            detectChangesAndExpectText('truefalse');
        }));
        it('should display last item correctly', testing_1.async(function () {
            var template = '<span *ngFor="let item of items; let isLast=last">{{isLast.toString()}}</span>';
            fixture = createTestComponent(template);
            getComponent().items = [0, 1, 2];
            detectChangesAndExpectText('falsefalsetrue');
            getComponent().items = [2, 1];
            detectChangesAndExpectText('falsetrue');
        }));
        it('should display even items correctly', testing_1.async(function () {
            var template = '<span *ngFor="let item of items; let isEven=even">{{isEven.toString()}}</span>';
            fixture = createTestComponent(template);
            getComponent().items = [0, 1, 2];
            detectChangesAndExpectText('truefalsetrue');
            getComponent().items = [2, 1];
            detectChangesAndExpectText('truefalse');
        }));
        it('should display odd items correctly', testing_1.async(function () {
            var template = '<span *ngFor="let item of items; let isOdd=odd">{{isOdd.toString()}}</span>';
            fixture = createTestComponent(template);
            getComponent().items = [0, 1, 2, 3];
            detectChangesAndExpectText('falsetruefalsetrue');
            getComponent().items = [2, 1];
            detectChangesAndExpectText('falsetrue');
        }));
        it('should allow to use a custom template', testing_1.async(function () {
            var template = '<ng-container *ngFor="let item of items; template: tpl"></ng-container>' +
                '<ng-template let-item let-i="index" #tpl><p>{{i}}: {{item}};</p></ng-template>';
            fixture = createTestComponent(template);
            getComponent().items = ['a', 'b', 'c'];
            fixture.detectChanges();
            detectChangesAndExpectText('0: a;1: b;2: c;');
        }));
        it('should use a default template if a custom one is null', testing_1.async(function () {
            var template = "<ul><ng-container *ngFor=\"let item of items; template: null; let i=index\">{{i}}: {{item}};</ng-container></ul>";
            fixture = createTestComponent(template);
            getComponent().items = ['a', 'b', 'c'];
            fixture.detectChanges();
            detectChangesAndExpectText('0: a;1: b;2: c;');
        }));
        it('should use a custom template when both default and a custom one are present', testing_1.async(function () {
            var template = '<ng-container *ngFor="let item of items; template: tpl">{{i}};</ng-container>' +
                '<ng-template let-item let-i="index" #tpl>{{i}}: {{item}};</ng-template>';
            fixture = createTestComponent(template);
            getComponent().items = ['a', 'b', 'c'];
            fixture.detectChanges();
            detectChangesAndExpectText('0: a;1: b;2: c;');
        }));
        describe('track by', function () {
            it('should console.warn if trackBy is not a function', testing_1.async(function () {
                // TODO(vicb): expect a warning message when we have a proper log service
                var template = "<p *ngFor=\"let item of items; trackBy: value\"></p>";
                fixture = createTestComponent(template);
                fixture.componentInstance.value = 0;
                fixture.detectChanges();
            }));
            it('should track by identity when trackBy is to `null` or `undefined`', testing_1.async(function () {
                // TODO(vicb): expect no warning message when we have a proper log service
                var template = "<p *ngFor=\"let item of items; trackBy: value\">{{ item }}</p>";
                fixture = createTestComponent(template);
                fixture.componentInstance.items = ['a', 'b', 'c'];
                fixture.componentInstance.value = null;
                detectChangesAndExpectText('abc');
                fixture.componentInstance.value = undefined;
                detectChangesAndExpectText('abc');
            }));
            it('should set the context to the component instance', testing_1.async(function () {
                var template = "<p *ngFor=\"let item of items; trackBy: trackByContext.bind(this)\"></p>";
                fixture = createTestComponent(template);
                thisArg = null;
                fixture.detectChanges();
                matchers_1.expect(thisArg).toBe(getComponent());
            }));
            it('should not replace tracked items', testing_1.async(function () {
                var template = "<p *ngFor=\"let item of items; trackBy: trackById; let i=index\">{{items[i]}}</p>";
                fixture = createTestComponent(template);
                var buildItemList = function () {
                    getComponent().items = [{ 'id': 'a' }];
                    fixture.detectChanges();
                    return fixture.debugElement.queryAll(by_1.By.css('p'))[0];
                };
                var firstP = buildItemList();
                var finalP = buildItemList();
                matchers_1.expect(finalP.nativeElement).toBe(firstP.nativeElement);
            }));
            it('should update implicit local variable on view', testing_1.async(function () {
                var template = "<div *ngFor=\"let item of items; trackBy: trackById\">{{item['color']}}</div>";
                fixture = createTestComponent(template);
                getComponent().items = [{ 'id': 'a', 'color': 'blue' }];
                detectChangesAndExpectText('blue');
                getComponent().items = [{ 'id': 'a', 'color': 'red' }];
                detectChangesAndExpectText('red');
            }));
            it('should move items around and keep them updated ', testing_1.async(function () {
                var template = "<div *ngFor=\"let item of items; trackBy: trackById\">{{item['color']}}</div>";
                fixture = createTestComponent(template);
                getComponent().items = [{ 'id': 'a', 'color': 'blue' }, { 'id': 'b', 'color': 'yellow' }];
                detectChangesAndExpectText('blueyellow');
                getComponent().items = [{ 'id': 'b', 'color': 'orange' }, { 'id': 'a', 'color': 'red' }];
                detectChangesAndExpectText('orangered');
            }));
            it('should handle added and removed items properly when tracking by index', testing_1.async(function () {
                var template = "<div *ngFor=\"let item of items; trackBy: trackByIndex\">{{item}}</div>";
                fixture = createTestComponent(template);
                getComponent().items = ['a', 'b', 'c', 'd'];
                fixture.detectChanges();
                getComponent().items = ['e', 'f', 'g', 'h'];
                fixture.detectChanges();
                getComponent().items = ['e', 'f', 'h'];
                detectChangesAndExpectText('efh');
            }));
        });
    });
}
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.prototype.toString = function () { return 'foo'; };
    return Foo;
}());
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.items = [1, 2];
    }
    TestComponent.prototype.trackById = function (index, item) { return item['id']; };
    TestComponent.prototype.trackByIndex = function (index, item) { return index; };
    TestComponent.prototype.trackByContext = function () { thisArg = this; };
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' })
    ], TestComponent);
    return TestComponent;
}());
var TEMPLATE = '<div><span *ngFor="let item of items">{{item.toString()}};</span></div>';
function createTestComponent(template) {
    if (template === void 0) { template = TEMPLATE; }
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX2Zvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUF3QztBQUN4QyxpREFBdUU7QUFDdkUsaUVBQThEO0FBQzlELDJFQUFzRTtBQUV0RSxJQUFJLE9BQVksQ0FBQztBQUVqQjtJQUNFLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDaEIsSUFBSSxPQUE4QixDQUFDO1FBRW5DLDBCQUF5QyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFNUUsb0NBQW9DLElBQVk7WUFDOUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQzthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxlQUFLLENBQUM7WUFDdkMsT0FBTyxHQUFHLG1CQUFtQixFQUFFLENBQUM7WUFFaEMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxlQUFLLENBQUM7WUFDckMsT0FBTyxHQUFHLG1CQUFtQixFQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxlQUFLLENBQUM7WUFDdkMsT0FBTyxHQUFHLG1CQUFtQixFQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsK0JBQStCLEVBQUUsZUFBSyxDQUFDO1lBQ3JDLE9BQU8sR0FBRyxtQkFBbUIsRUFBRSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsZ0VBQWdFLEVBQUUsZUFBSyxDQUFDO1lBQ3RFLE9BQU8sR0FBRyxtQkFBbUIsRUFBRSxDQUFDO1lBRWhDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXhCLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFMUMsMEJBQTBCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxlQUFLLENBQUM7WUFDL0MsSUFBTSxRQUFRLEdBQUcsZ0VBQWdFLENBQUM7WUFDbEYsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLE9BQU87WUFDUCxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBQzlELDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTNDLE9BQU87WUFDUCxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDNUMsMEJBQTBCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUVoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxlQUFLLENBQUM7WUFDdEMsSUFBTSxRQUFRLEdBQUcsdURBQXVELENBQUM7WUFDekUsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsd0RBQXdELEVBQUUsZUFBSyxDQUFDO1lBQzlELE9BQU8sR0FBRyxtQkFBbUIsRUFBRSxDQUFDO1lBRWhDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRW5DLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFNLENBQUM7WUFDOUIsMEJBQTBCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFL0IsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLGVBQUssQ0FBQztZQUNuRSxPQUFPLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztZQUVoQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQVEsT0FBTyxDQUFDO1lBQ3BDLGlCQUFNLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBdkIsQ0FBdUIsQ0FBQztpQkFDaEMsWUFBWSxDQUNULDBIQUEwSCxDQUFDLENBQUM7UUFDdEksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxlQUFLLENBQUM7WUFDOUMsT0FBTyxHQUFHLG1CQUFtQixFQUFFLENBQUM7WUFFaEMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFRLE9BQU8sQ0FBQztZQUNwQyxpQkFBTSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDhCQUE4QixFQUFFLGVBQUssQ0FBQztZQUNwQyxPQUFPLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztZQUVoQyxJQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QiwwQkFBMEIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLGVBQUssQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBRyxrQ0FBa0M7Z0JBQy9DLHVFQUF1RTtnQkFDdkUsUUFBUSxDQUFDO1lBQ2IsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTdDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsK0RBQStELEVBQUUsZUFBSyxDQUFDO1lBQ3JFLElBQU0sUUFBUSxHQUFHLGtDQUFrQztnQkFDL0Msc0VBQXNFO2dCQUN0RSxRQUFRLENBQUM7WUFDYixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNDLDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTNDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQywwQkFBMEIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDZFQUE2RSxFQUFFLGVBQUssQ0FBQztZQUNuRixJQUFNLFFBQVEsR0FBRyxpREFBK0M7Z0JBQzVELG1CQUFtQjtnQkFDbkIsdUNBQXFDO2dCQUNyQyxRQUFRLENBQUM7WUFFYixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzdCLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXRDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZCwwQkFBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV4QyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsMEJBQTBCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLGVBQUssQ0FBQztZQUM3QyxJQUFNLFFBQVEsR0FDVixnSEFBZ0gsQ0FBQztZQUNySCxPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsMEJBQTBCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUUvQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLDBCQUEwQixDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxlQUFLLENBQUM7WUFDeEMsSUFBTSxRQUFRLEdBQUcsd0VBQXdFLENBQUM7WUFDMUYsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RELDBCQUEwQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXpDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RELDBCQUEwQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMscUNBQXFDLEVBQUUsZUFBSyxDQUFDO1lBQzNDLElBQU0sUUFBUSxHQUNWLG1GQUFtRixDQUFDO1lBQ3hGLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLDBCQUEwQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFN0MsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsZUFBSyxDQUFDO1lBQzFDLElBQU0sUUFBUSxHQUNWLGdGQUFnRixDQUFDO1lBQ3JGLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLDBCQUEwQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFN0MsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMscUNBQXFDLEVBQUUsZUFBSyxDQUFDO1lBQzNDLElBQU0sUUFBUSxHQUNWLGdGQUFnRixDQUFDO1lBQ3JGLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLDBCQUEwQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRTVDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QiwwQkFBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLGVBQUssQ0FBQztZQUMxQyxJQUFNLFFBQVEsR0FDViw2RUFBNkUsQ0FBQztZQUNsRixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEMsMEJBQTBCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVqRCxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsMEJBQTBCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxlQUFLLENBQUM7WUFDN0MsSUFBTSxRQUFRLEdBQ1YseUVBQXlFO2dCQUN6RSxnRkFBZ0YsQ0FBQztZQUNyRixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLGVBQUssQ0FBQztZQUM3RCxJQUFNLFFBQVEsR0FDVixrSEFBZ0gsQ0FBQztZQUNySCxPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDZFQUE2RSxFQUFFLGVBQUssQ0FBQztZQUNuRixJQUFNLFFBQVEsR0FDViwrRUFBK0U7Z0JBQy9FLHlFQUF5RSxDQUFDO1lBQzlFLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QiwwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxlQUFLLENBQUM7Z0JBQ3hELHlFQUF5RTtnQkFDekUsSUFBTSxRQUFRLEdBQUcsc0RBQW9ELENBQUM7Z0JBQ3RFLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLGVBQUssQ0FBQztnQkFDekUsMEVBQTBFO2dCQUMxRSxJQUFNLFFBQVEsR0FBRyxnRUFBOEQsQ0FBQztnQkFDaEYsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3ZDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDNUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxlQUFLLENBQUM7Z0JBQ3hELElBQU0sUUFBUSxHQUNWLDBFQUF3RSxDQUFDO2dCQUM3RSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXhDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixpQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsZUFBSyxDQUFDO2dCQUN4QyxJQUFNLFFBQVEsR0FDVixtRkFBaUYsQ0FBQztnQkFDdEYsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV4QyxJQUFNLGFBQWEsR0FBRztvQkFDcEIsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztvQkFDckMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUN4QixPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDO2dCQUVGLElBQU0sTUFBTSxHQUFHLGFBQWEsRUFBRSxDQUFDO2dCQUMvQixJQUFNLE1BQU0sR0FBRyxhQUFhLEVBQUUsQ0FBQztnQkFDL0IsaUJBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLCtDQUErQyxFQUFFLGVBQUssQ0FBQztnQkFDckQsSUFBTSxRQUFRLEdBQ1YsK0VBQTZFLENBQUM7Z0JBQ2xGLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO2dCQUN0RCwwQkFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFbkMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUNyRCwwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLGVBQUssQ0FBQztnQkFDdkQsSUFBTSxRQUFRLEdBQ1YsK0VBQTZFLENBQUM7Z0JBQ2xGLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFeEMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7Z0JBQ3RGLDBCQUEwQixDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUV6QyxZQUFZLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDckYsMEJBQTBCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRSxlQUFLLENBQUM7Z0JBQzdFLElBQU0sUUFBUSxHQUFHLHlFQUF1RSxDQUFDO2dCQUN6RixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXhDLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLFlBQVksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFRDtJQUFBO0lBRUEsQ0FBQztJQURDLHNCQUFRLEdBQVIsY0FBYSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUIsVUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBR0Q7SUFEQTtRQUdFLFVBQUssR0FBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUl4QixDQUFDO0lBSEMsaUNBQVMsR0FBVCxVQUFVLEtBQWEsRUFBRSxJQUFTLElBQVksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLG9DQUFZLEdBQVosVUFBYSxLQUFhLEVBQUUsSUFBUyxJQUFZLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRSxzQ0FBYyxHQUFkLGNBQXlCLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBTHRDLGFBQWE7UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO09BQzFDLGFBQWEsQ0FNbEI7SUFBRCxvQkFBQztDQUFBLEFBTkQsSUFNQztBQUVELElBQU0sUUFBUSxHQUFHLHlFQUF5RSxDQUFDO0FBRTNGLDZCQUE2QixRQUEyQjtJQUEzQix5QkFBQSxFQUFBLG1CQUEyQjtJQUN0RCxPQUFPLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUM7U0FDdkUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3RDLENBQUMifQ==