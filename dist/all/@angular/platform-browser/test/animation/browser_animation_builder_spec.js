"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var testing_1 = require("@angular/animations/browser/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var animations_2 = require("@angular/platform-browser/animations");
var animation_builder_1 = require("../../animations/src/animation_builder");
var browser_util_1 = require("../../testing/src/browser_util");
{
    describe('BrowserAnimationBuilder', function () {
        if (isNode)
            return;
        var element;
        beforeEach(function () {
            element = browser_util_1.el('<div></div>');
            testing_2.TestBed.configureTestingModule({
                imports: [animations_2.NoopAnimationsModule],
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }]
            });
        });
        it('should inject AnimationBuilder into a component', function () {
            var Cmp = /** @class */ (function () {
                function Cmp(builder) {
                    this.builder = builder;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: '...',
                    }),
                    __metadata("design:paramtypes", [animations_1.AnimationBuilder])
                ], Cmp);
                return Cmp;
            }());
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            fixture.detectChanges();
            expect(cmp.builder instanceof animation_builder_1.BrowserAnimationBuilder).toBeTruthy();
        });
        it('should listen on start and done on the animation builder\'s player', testing_2.fakeAsync(function () {
            var Cmp = /** @class */ (function () {
                function Cmp(builder) {
                    this.builder = builder;
                }
                Cmp.prototype.build = function () {
                    var definition = this.builder.build([animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]);
                    return definition.create(this.target);
                };
                __decorate([
                    core_1.ViewChild('target'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "target", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: '...',
                    }),
                    __metadata("design:paramtypes", [animations_1.AnimationBuilder])
                ], Cmp);
                return Cmp;
            }());
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            fixture.detectChanges();
            var player = cmp.build();
            var started = false;
            player.onStart(function () { return started = true; });
            var finished = false;
            player.onDone(function () { return finished = true; });
            var destroyed = false;
            player.onDestroy(function () { return destroyed = true; });
            player.init();
            testing_2.flushMicrotasks();
            expect(started).toBeFalsy();
            expect(finished).toBeFalsy();
            expect(destroyed).toBeFalsy();
            player.play();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeFalsy();
            expect(destroyed).toBeFalsy();
            player.finish();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeTruthy();
            expect(destroyed).toBeFalsy();
            player.destroy();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeTruthy();
            expect(destroyed).toBeTruthy();
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9hbmltYXRpb25fYnVpbGRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2FuaW1hdGlvbi9icm93c2VyX2FuaW1hdGlvbl9idWlsZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBcUU7QUFDckUsdURBQTREO0FBQzVELCtEQUF3RTtBQUN4RSxzQ0FBbUQ7QUFDbkQsaURBQTBFO0FBQzFFLG1FQUEwRTtBQUUxRSw0RUFBK0U7QUFDL0UsK0RBQWtEO0FBRWxEO0lBQ0UsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1FBQ2xDLElBQUksTUFBTTtZQUFFLE9BQU87UUFDbkIsSUFBSSxPQUFZLENBQUM7UUFDakIsVUFBVSxDQUFDO1lBQ1QsT0FBTyxHQUFHLGlCQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUIsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsaUNBQW9CLENBQUM7Z0JBQy9CLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFLcEQ7Z0JBQ0UsYUFBbUIsT0FBeUI7b0JBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO2dCQUFHLENBQUM7Z0JBRDVDLEdBQUc7b0JBSlIsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsU0FBUzt3QkFDbkIsUUFBUSxFQUFFLEtBQUs7cUJBQ2hCLENBQUM7cURBRTRCLDZCQUFnQjttQkFEeEMsR0FBRyxDQUVSO2dCQUFELFVBQUM7YUFBQSxBQUZELElBRUM7WUFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXRELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztZQUV0QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLFlBQVksMkNBQXVCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRSxtQkFBUyxDQUFDO1lBSzlFO2dCQUdFLGFBQW1CLE9BQXlCO29CQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtnQkFBRyxDQUFDO2dCQUVoRCxtQkFBSyxHQUFMO29CQUNFLElBQU0sVUFBVSxHQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLG9CQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEYsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFUb0I7b0JBQXBCLGdCQUFTLENBQUMsUUFBUSxDQUFDOzttREFBb0I7Z0JBRHBDLEdBQUc7b0JBSlIsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsU0FBUzt3QkFDbkIsUUFBUSxFQUFFLEtBQUs7cUJBQ2hCLENBQUM7cURBSTRCLDZCQUFnQjttQkFIeEMsR0FBRyxDQVdSO2dCQUFELFVBQUM7YUFBQSxBQVhELElBV0M7WUFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXRELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztZQUN0QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFeEIsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTNCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNwQixNQUFNLENBQUMsT0FBTyxDQUFDLGNBQU0sT0FBQSxPQUFPLEdBQUcsSUFBSSxFQUFkLENBQWMsQ0FBQyxDQUFDO1lBRXJDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSxRQUFRLEdBQUcsSUFBSSxFQUFmLENBQWUsQ0FBQyxDQUFDO1lBRXJDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixNQUFNLENBQUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxTQUFTLEdBQUcsSUFBSSxFQUFoQixDQUFnQixDQUFDLENBQUM7WUFFekMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QseUJBQWUsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM1QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRTlCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLHlCQUFlLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUU5QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIseUJBQWUsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRTlCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQix5QkFBZSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==