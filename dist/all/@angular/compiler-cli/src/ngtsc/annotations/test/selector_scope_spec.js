"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var metadata_1 = require("../../metadata");
var resolver_1 = require("../../metadata/src/resolver");
var in_memory_typescript_1 = require("../../testing/in_memory_typescript");
var selector_scope_1 = require("../src/selector_scope");
describe('SelectorScopeRegistry', function () {
    it('absolute imports work', function () {
        var program = in_memory_typescript_1.makeProgram([
            {
                name: 'node_modules/@angular/core/index.d.ts',
                contents: "\n        export interface NgComponentDef<A, B> {}\n        export interface NgModuleDef<A, B, C, D> {}\n      "
            },
            {
                name: 'node_modules/some_library/index.d.ts',
                contents: "\n        import {NgComponentDef, NgModuleDef} from '@angular/core';\n        import * as i0 from './component';\n        \n        export declare class SomeModule {\n          static ngModuleDef: NgModuleDef<SomeModule, [typeof i0.SomeCmp], never, [typeof i0.SomeCmp]>;\n        }\n\n        export declare class SomeCmp {\n          static ngComponentDef: NgComponentDef<SomeCmp, 'some-cmp'>;\n        }\n      "
            },
            {
                name: 'node_modules/some_library/component.d.ts',
                contents: "\n        export declare class SomeCmp {}\n      "
            },
            {
                name: 'entry.ts',
                contents: "\n          export class ProgramCmp {}\n          export class ProgramModule {}\n      "
            },
        ]).program;
        var checker = program.getTypeChecker();
        var host = new metadata_1.TypeScriptReflectionHost(checker);
        var ProgramModule = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'ProgramModule', ts.isClassDeclaration);
        var ProgramCmp = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'ProgramCmp', ts.isClassDeclaration);
        var SomeModule = in_memory_typescript_1.getDeclaration(program, 'node_modules/some_library/index.d.ts', 'SomeModule', ts.isClassDeclaration);
        expect(ProgramModule).toBeDefined();
        expect(SomeModule).toBeDefined();
        var registry = new selector_scope_1.SelectorScopeRegistry(checker, host);
        registry.registerModule(ProgramModule, {
            declarations: [new resolver_1.ResolvedReference(ProgramCmp, ProgramCmp.name)],
            exports: [],
            imports: [new resolver_1.AbsoluteReference(SomeModule, SomeModule.name, 'some_library', 'SomeModule')],
        });
        registry.registerSelector(ProgramCmp, 'program-cmp');
        var scope = registry.lookupCompilationScope(ProgramCmp);
        expect(scope).toBeDefined();
        expect(scope.directives).toBeDefined();
        expect(scope.directives.size).toBe(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3Jfc2NvcGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvdGVzdC9zZWxlY3Rvcl9zY29wZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLDJDQUF3RDtBQUN4RCx3REFBaUY7QUFDakYsMkVBQStFO0FBRS9FLHdEQUE0RDtBQUU1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQ25CLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFPLENBb0NYO1FBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksbUNBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxhQUFhLEdBQ2YscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoRixJQUFNLFVBQVUsR0FBRyxxQ0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVGLElBQU0sVUFBVSxHQUFHLHFDQUFjLENBQzdCLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUYsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVqQyxJQUFNLFFBQVEsR0FBRyxJQUFJLHNDQUFxQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUxRCxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRTtZQUNyQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLDRCQUFpQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBTSxDQUFDLENBQUM7WUFDcEUsT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLEVBQUUsQ0FBQyxJQUFJLDRCQUFpQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsSUFBTSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUM5RixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXJELElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUcsQ0FBQztRQUM1RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9