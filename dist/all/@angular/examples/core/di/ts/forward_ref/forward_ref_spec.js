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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
{
    describe('forwardRef examples', function () {
        it('ForwardRefFn example works', function () {
            // #docregion forward_ref_fn
            var ref = core_1.forwardRef(function () { return Lock; });
            // #enddocregion
            expect(ref).not.toBeNull();
            var Lock = /** @class */ (function () {
                function Lock() {
                }
                return Lock;
            }());
        });
        it('can be used to inject a class defined later', function () {
            // #docregion forward_ref
            var Door = /** @class */ (function () {
                // Door attempts to inject Lock, despite it not being defined yet.
                // forwardRef makes this possible.
                function Door(lock) {
                    this.lock = lock;
                }
                Door = __decorate([
                    __param(0, core_1.Inject(core_1.forwardRef(function () { return Lock; }))),
                    __metadata("design:paramtypes", [Lock])
                ], Door);
                return Door;
            }());
            // Only at this point Lock is defined.
            var Lock = /** @class */ (function () {
                function Lock() {
                }
                return Lock;
            }());
            var injector = core_1.ReflectiveInjector.resolveAndCreate([Door, Lock]);
            var door = injector.get(Door);
            expect(door instanceof Door).toBeTruthy();
            expect(door.lock instanceof Lock).toBeTruthy();
            // #enddocregion
        });
        it('can be unwrapped', function () {
            // #docregion resolve_forward_ref
            var ref = core_1.forwardRef(function () { return 'refValue'; });
            expect(core_1.resolveForwardRef(ref)).toEqual('refValue');
            expect(core_1.resolveForwardRef('regularValue')).toEqual('regularValue');
            // #enddocregion
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZF9yZWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvZm9yd2FyZF9yZWYvZm9yd2FyZF9yZWZfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHNDQUF3RjtBQUV4RjtJQUNFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsNEJBQTRCLEVBQUU7WUFDL0IsNEJBQTRCO1lBQzVCLElBQU0sR0FBRyxHQUFHLGlCQUFVLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztZQUNuQyxnQkFBZ0I7WUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUUzQjtnQkFBQTtnQkFBWSxDQUFDO2dCQUFELFdBQUM7WUFBRCxDQUFDLEFBQWIsSUFBYTtRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELHlCQUF5QjtZQUN6QjtnQkFHRSxrRUFBa0U7Z0JBQ2xFLGtDQUFrQztnQkFDbEMsY0FBNEMsSUFBVTtvQkFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFBQyxDQUFDO2dCQUx6RSxJQUFJO29CQUtLLFdBQUEsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxDQUFBO3FEQUFPLElBQUk7bUJBTGxELElBQUksQ0FNVDtnQkFBRCxXQUFDO2FBQUEsQUFORCxJQU1DO1lBRUQsc0NBQXNDO1lBQ3RDO2dCQUFBO2dCQUFZLENBQUM7Z0JBQUQsV0FBQztZQUFELENBQUMsQUFBYixJQUFhO1lBRWIsSUFBTSxRQUFRLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0MsZ0JBQWdCO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JCLGlDQUFpQztZQUNqQyxJQUFNLEdBQUcsR0FBRyxpQkFBVSxDQUFDLGNBQU0sT0FBQSxVQUFVLEVBQVYsQ0FBVSxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyx3QkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNsRSxnQkFBZ0I7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=