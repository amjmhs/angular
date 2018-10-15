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
var metadata_1 = require("@angular/core/src/metadata");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    describe('directive lifecycle integration spec', function () {
        var log;
        beforeEach(function () {
            testing_1.TestBed
                .configureTestingModule({
                declarations: [
                    LifecycleCmp,
                    LifecycleDir,
                    MyComp5,
                ],
                providers: [testing_internal_1.Log]
            })
                .overrideComponent(MyComp5, { set: { template: '<div [field]="123" lifecycle></div>' } });
        });
        beforeEach(testing_1.inject([testing_internal_1.Log], function (_log) { log = _log; }));
        it('should invoke lifecycle methods ngOnChanges > ngOnInit > ngDoCheck > ngAfterContentChecked', function () {
            var fixture = testing_1.TestBed.createComponent(MyComp5);
            fixture.detectChanges();
            expect(log.result())
                .toEqual('ngOnChanges; ngOnInit; ngDoCheck; ngAfterContentInit; ngAfterContentChecked; child_ngDoCheck; ' +
                'ngAfterViewInit; ngAfterViewChecked');
            log.clear();
            fixture.detectChanges();
            expect(log.result())
                .toEqual('ngDoCheck; ngAfterContentChecked; child_ngDoCheck; ngAfterViewChecked');
        });
    });
}
var LifecycleDir = /** @class */ (function () {
    function LifecycleDir(_log) {
        this._log = _log;
    }
    LifecycleDir.prototype.ngDoCheck = function () { this._log.add('child_ngDoCheck'); };
    LifecycleDir = __decorate([
        metadata_1.Directive({ selector: '[lifecycle-dir]' }),
        __metadata("design:paramtypes", [testing_internal_1.Log])
    ], LifecycleDir);
    return LifecycleDir;
}());
var LifecycleCmp = /** @class */ (function () {
    function LifecycleCmp(_log) {
        this._log = _log;
    }
    LifecycleCmp.prototype.ngOnChanges = function (_ /** TODO #9100 */) { this._log.add('ngOnChanges'); };
    LifecycleCmp.prototype.ngOnInit = function () { this._log.add('ngOnInit'); };
    LifecycleCmp.prototype.ngDoCheck = function () { this._log.add('ngDoCheck'); };
    LifecycleCmp.prototype.ngAfterContentInit = function () { this._log.add('ngAfterContentInit'); };
    LifecycleCmp.prototype.ngAfterContentChecked = function () { this._log.add('ngAfterContentChecked'); };
    LifecycleCmp.prototype.ngAfterViewInit = function () { this._log.add('ngAfterViewInit'); };
    LifecycleCmp.prototype.ngAfterViewChecked = function () { this._log.add('ngAfterViewChecked'); };
    LifecycleCmp = __decorate([
        metadata_1.Component({
            selector: '[lifecycle]',
            inputs: ['field'],
            template: "<div lifecycle-dir></div>",
        }),
        __metadata("design:paramtypes", [testing_internal_1.Log])
    ], LifecycleCmp);
    return LifecycleCmp;
}());
var MyComp5 = /** @class */ (function () {
    function MyComp5() {
    }
    MyComp5 = __decorate([
        metadata_1.Component({ selector: 'my-comp' })
    ], MyComp5);
    return MyComp5;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX2xpZmVjeWNsZV9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2RpcmVjdGl2ZV9saWZlY3ljbGVfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUdILHVEQUFnRTtBQUNoRSxpREFBc0Q7QUFDdEQsK0VBQStEO0FBRS9EO0lBQ0UsUUFBUSxDQUFDLHNDQUFzQyxFQUFFO1FBQy9DLElBQUksR0FBUSxDQUFDO1FBRWIsVUFBVSxDQUFDO1lBQ1QsaUJBQU87aUJBQ0Ysc0JBQXNCLENBQUM7Z0JBQ3RCLFlBQVksRUFBRTtvQkFDWixZQUFZO29CQUNaLFlBQVk7b0JBQ1osT0FBTztpQkFDUjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxzQkFBRyxDQUFDO2FBQ2pCLENBQUM7aUJBQ0QsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLHFDQUFxQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVGLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxzQkFBRyxDQUFDLEVBQUUsVUFBQyxJQUFTLElBQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUQsRUFBRSxDQUFDLDRGQUE0RixFQUM1RjtZQUNFLElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNmLE9BQU8sQ0FDSixnR0FBZ0c7Z0JBQ2hHLHFDQUFxQyxDQUFDLENBQUM7WUFFL0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1osT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2YsT0FBTyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7UUFDeEYsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztDQUNKO0FBSUQ7SUFDRSxzQkFBb0IsSUFBUztRQUFULFNBQUksR0FBSixJQUFJLENBQUs7SUFBRyxDQUFDO0lBQ2pDLGdDQUFTLEdBQVQsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUY3QyxZQUFZO1FBRGpCLG9CQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQzt5Q0FFYixzQkFBRztPQUR6QixZQUFZLENBR2pCO0lBQUQsbUJBQUM7Q0FBQSxBQUhELElBR0M7QUFPRDtJQUdFLHNCQUFvQixJQUFTO1FBQVQsU0FBSSxHQUFKLElBQUksQ0FBSztJQUFHLENBQUM7SUFFakMsa0NBQVcsR0FBWCxVQUFZLENBQU0sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkUsK0JBQVEsR0FBUixjQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6QyxnQ0FBUyxHQUFULGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNDLHlDQUFrQixHQUFsQixjQUF1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RCw0Q0FBcUIsR0FBckIsY0FBMEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkUsc0NBQWUsR0FBZixjQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RCx5Q0FBa0IsR0FBbEIsY0FBdUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFqQnpELFlBQVk7UUFMakIsb0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNqQixRQUFRLEVBQUUsMkJBQTJCO1NBQ3RDLENBQUM7eUNBSTBCLHNCQUFHO09BSHpCLFlBQVksQ0FrQmpCO0lBQUQsbUJBQUM7Q0FBQSxBQWxCRCxJQWtCQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssT0FBTztRQURaLG9CQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUM7T0FDM0IsT0FBTyxDQUNaO0lBQUQsY0FBQztDQUFBLEFBREQsSUFDQyJ9