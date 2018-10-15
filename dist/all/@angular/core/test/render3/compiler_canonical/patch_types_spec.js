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
var core_1 = require("../../../src/core");
/**
 * GOALS:
 * - Patch types in tree shakable way
 * - Generate these types for files which have `metadata.json` (since those are the files which
 * have not been compiled with Ivy)
 * - Have build optimizer hoist the patch functions into corresponding types to allow tree-shaking.
 */
// File: node_modules/some_library/path/public.ts
// Implies metadata: node_modules/some_library/path/public.metadata.json
// Assume: node_modules/some_library/index.js re-exports ./path/public.ts#ThirdPartyClass
var ThirdPartyClass = /** @class */ (function () {
    function ThirdPartyClass() {
    }
    ThirdPartyClass = __decorate([
        core_1.Injectable()
    ], ThirdPartyClass);
    return ThirdPartyClass;
}());
var CompiledWithIvy = /** @class */ (function () {
    function CompiledWithIvy() {
    }
    CompiledWithIvy_1 = CompiledWithIvy;
    var CompiledWithIvy_1;
    // NORMATIVE
    CompiledWithIvy.ngInjectableDef = core_1.defineInjectable({ factory: function CompileWithIvy_Factory() { return new CompiledWithIvy_1(); } });
    CompiledWithIvy = CompiledWithIvy_1 = __decorate([
        core_1.Injectable()
    ], CompiledWithIvy);
    return CompiledWithIvy;
}());
// import { CompiledWithIvy } from 'some_library';
var CompiledWithIvyModule = /** @class */ (function () {
    function CompiledWithIvyModule() {
    }
    CompiledWithIvyModule_1 = CompiledWithIvyModule;
    var CompiledWithIvyModule_1;
    // NORMATIVE
    CompiledWithIvyModule.ngInjectorDef = core_1.defineInjector({
        providers: [ThirdPartyClass, CompiledWithIvy],
        factory: function CompiledWithIvyModule_Factory() { return new CompiledWithIvyModule_1(); }
    });
    CompiledWithIvyModule = CompiledWithIvyModule_1 = __decorate([
        core_1.NgModule({ providers: [ThirdPartyClass, CompiledWithIvy] })
    ], CompiledWithIvyModule);
    return CompiledWithIvyModule;
}());
/**
 * Below is a function which should be generated right next to the `@NgModule` which
 * imports types which have `.metadata.json` files.
 *
 * # JIT Mode
 * - Because the `ngPatch_CompiledWithIvyModule` is invoked all parts get patched.
 *
 * # AOT Mode
 * - Build Optimizer detects `@__BUILD_OPTIMIZER_COLOCATE__` annotation and moves the
 * code from the current location to the destination.
 * - The resulting `ngPatch_CompiledWithIvyModule` becomes empty and eligible for tree-shaking.
 * - Uglify removes the `ngPatch_CompiledWithIvyModule` since it is empty.
 *
 * # AOT Closure Mode
 * - Option A: not supported. (Preferred option)
 *   - Externally very few people use closure they will just have to wait until all of their
 *     libraries are Ivy.
 *   - Internally (g3) we build from source hence everyone switches to Ivy at the same time.
 * - Option B: Write a closure pass similar to Build Optimizer which would move the code.
 */
// NORMATIVE
ngPatch_depsOf_CompiledWithIvyModule();
function ngPatch_depsOf_CompiledWithIvyModule() {
    ngPatch_node_modules_some_library_path_public_CompileWithIvy();
}
function ngPatch_node_modules_some_library_path_public_CompileWithIvy() {
    /** @__BUILD_OPTIMIZER_COLOCATE__ */
    ThirdPartyClass.ngInjectableDef = core_1.defineInjectable({ factory: function CompileWithIvy_Factory() { return new ThirdPartyClass(); } });
}
// /NORMATIVE
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2hfdHlwZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9wYXRjaF90eXBlc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQXdQO0FBSXhQOzs7Ozs7R0FNRztBQUVILGlEQUFpRDtBQUNqRCx3RUFBd0U7QUFDeEUseUZBQXlGO0FBRXpGO0lBQUE7SUFDQSxDQUFDO0lBREssZUFBZTtRQURwQixpQkFBVSxFQUFFO09BQ1AsZUFBZSxDQUNwQjtJQUFELHNCQUFDO0NBQUEsQUFERCxJQUNDO0FBSUQ7SUFBQTtJQUtBLENBQUM7d0JBTEssZUFBZTs7SUFDbkIsWUFBWTtJQUNMLCtCQUFlLEdBQUcsdUJBQWdCLENBQ3JDLEVBQUMsT0FBTyxFQUFFLG9DQUFvQyxPQUFPLElBQUksaUJBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUhoRixlQUFlO1FBRHBCLGlCQUFVLEVBQUU7T0FDUCxlQUFlLENBS3BCO0lBQUQsc0JBQUM7Q0FBQSxBQUxELElBS0M7QUFFRCxrREFBa0Q7QUFFbEQ7SUFBQTtJQU9BLENBQUM7OEJBUEsscUJBQXFCOztJQUN6QixZQUFZO0lBQ0wsbUNBQWEsR0FBRyxxQkFBYyxDQUFDO1FBQ3BDLFNBQVMsRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7UUFDN0MsT0FBTyxFQUFFLDJDQUEyQyxPQUFPLElBQUksdUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDMUYsQ0FBQyxDQUFDO0lBTEMscUJBQXFCO1FBRDFCLGVBQVEsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsRUFBQyxDQUFDO09BQ3BELHFCQUFxQixDQU8xQjtJQUFELDRCQUFDO0NBQUEsQUFQRCxJQU9DO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxZQUFZO0FBQ1osb0NBQW9DLEVBQUUsQ0FBQztBQUN2QztJQUNFLDREQUE0RCxFQUFFLENBQUM7QUFDakUsQ0FBQztBQUNEO0lBQ0Usb0NBQW9DO0lBQ25DLGVBQXVCLENBQUMsZUFBZSxHQUFHLHVCQUFnQixDQUN2RCxFQUFDLE9BQU8sRUFBRSxvQ0FBb0MsT0FBTyxJQUFJLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBQ0QsYUFBYSJ9