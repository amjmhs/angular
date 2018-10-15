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
const core_1 = require("@angular/core");
{
    describe('forwardRef examples', () => {
        it('ForwardRefFn example works', () => {
            // #docregion forward_ref_fn
            const ref = core_1.forwardRef(() => Lock);
            // #enddocregion
            expect(ref).not.toBeNull();
            class Lock {
            }
        });
        it('can be used to inject a class defined later', () => {
            // #docregion forward_ref
            let Door = class Door {
                // Door attempts to inject Lock, despite it not being defined yet.
                // forwardRef makes this possible.
                constructor(lock) { this.lock = lock; }
            };
            Door = __decorate([
                __param(0, core_1.Inject(core_1.forwardRef(() => Lock))),
                __metadata("design:paramtypes", [Lock])
            ], Door);
            // Only at this point Lock is defined.
            class Lock {
            }
            const injector = core_1.ReflectiveInjector.resolveAndCreate([Door, Lock]);
            const door = injector.get(Door);
            expect(door instanceof Door).toBeTruthy();
            expect(door.lock instanceof Lock).toBeTruthy();
            // #enddocregion
        });
        it('can be unwrapped', () => {
            // #docregion resolve_forward_ref
            const ref = core_1.forwardRef(() => 'refValue');
            expect(core_1.resolveForwardRef(ref)).toEqual('refValue');
            expect(core_1.resolveForwardRef('regularValue')).toEqual('regularValue');
            // #enddocregion
        });
    });
}
//# sourceMappingURL=forward_ref_spec.js.map