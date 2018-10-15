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
var in_memory_typescript_1 = require("../../testing/in_memory_typescript");
var reflector_1 = require("../src/reflector");
describe('reflector', function () {
    describe('ctor params', function () {
        it('should reflect a single argument', function () {
            var program = in_memory_typescript_1.makeProgram([{
                    name: 'entry.ts',
                    contents: "\n            class Bar {}\n\n            class Foo {\n              constructor(bar: Bar) {}\n            }\n        "
                }]).program;
            var clazz = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'Foo', ts.isClassDeclaration);
            var checker = program.getTypeChecker();
            var host = new reflector_1.TypeScriptReflectionHost(checker);
            var args = host.getConstructorParameters(clazz);
            expect(args.length).toBe(1);
            expectParameter(args[0], 'bar', 'Bar');
        });
        it('should reflect a decorated argument', function () {
            var program = in_memory_typescript_1.makeProgram([
                {
                    name: 'dec.ts',
                    contents: "\n          export function dec(target: any, key: string, index: number) {\n          }\n        "
                },
                {
                    name: 'entry.ts',
                    contents: "\n            import {dec} from './dec';\n            class Bar {}\n            \n            class Foo {\n              constructor(@dec bar: Bar) {}\n            }\n        "
                }
            ]).program;
            var clazz = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'Foo', ts.isClassDeclaration);
            var checker = program.getTypeChecker();
            var host = new reflector_1.TypeScriptReflectionHost(checker);
            var args = host.getConstructorParameters(clazz);
            expect(args.length).toBe(1);
            expectParameter(args[0], 'bar', 'Bar', 'dec', './dec');
        });
        it('should reflect a decorated argument with a call', function () {
            var program = in_memory_typescript_1.makeProgram([
                {
                    name: 'dec.ts',
                    contents: "\n          export function dec(target: any, key: string, index: number) {\n          }\n        "
                },
                {
                    name: 'entry.ts',
                    contents: "\n            import {dec} from './dec';\n            class Bar {}\n            \n            class Foo {\n              constructor(@dec bar: Bar) {}\n            }\n        "
                }
            ]).program;
            var clazz = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'Foo', ts.isClassDeclaration);
            var checker = program.getTypeChecker();
            var host = new reflector_1.TypeScriptReflectionHost(checker);
            var args = host.getConstructorParameters(clazz);
            expect(args.length).toBe(1);
            expectParameter(args[0], 'bar', 'Bar', 'dec', './dec');
        });
        it('should reflect a decorated argument with an indirection', function () {
            var program = in_memory_typescript_1.makeProgram([
                {
                    name: 'bar.ts',
                    contents: "\n          export class Bar {}\n        "
                },
                {
                    name: 'entry.ts',
                    contents: "\n            import {Bar} from './bar';\n            import * as star from './bar';\n            \n            class Foo {\n              constructor(bar: Bar, otherBar: star.Bar) {}\n            }\n        "
                }
            ]).program;
            var clazz = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'Foo', ts.isClassDeclaration);
            var checker = program.getTypeChecker();
            var host = new reflector_1.TypeScriptReflectionHost(checker);
            var args = host.getConstructorParameters(clazz);
            expect(args.length).toBe(2);
            expectParameter(args[0], 'bar', 'Bar');
            expectParameter(args[1], 'otherBar', 'star.Bar');
        });
    });
    it('should reflect a re-export', function () {
        var program = in_memory_typescript_1.makeProgram([
            { name: '/node_modules/absolute/index.ts', contents: 'export class Target {}' },
            { name: 'local1.ts', contents: "export {Target as AliasTarget} from 'absolute';" },
            { name: 'local2.ts', contents: "export {AliasTarget as Target} from './local1';" }, {
                name: 'entry.ts',
                contents: "\n          import {Target} from './local2';\n          import {Target as DirectTarget} from 'absolute';\n\n          const target = Target;\n          const directTarget = DirectTarget;\n      "
            }
        ]).program;
        var target = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'target', ts.isVariableDeclaration);
        if (target.initializer === undefined || !ts.isIdentifier(target.initializer)) {
            return fail('Unexpected initializer for target');
        }
        var directTarget = in_memory_typescript_1.getDeclaration(program, 'entry.ts', 'directTarget', ts.isVariableDeclaration);
        if (directTarget.initializer === undefined || !ts.isIdentifier(directTarget.initializer)) {
            return fail('Unexpected initializer for directTarget');
        }
        var Target = target.initializer;
        var DirectTarget = directTarget.initializer;
        var checker = program.getTypeChecker();
        var host = new reflector_1.TypeScriptReflectionHost(checker);
        var targetDecl = host.getDeclarationOfIdentifier(Target);
        var directTargetDecl = host.getDeclarationOfIdentifier(DirectTarget);
        if (targetDecl === null) {
            return fail('No declaration found for Target');
        }
        else if (directTargetDecl === null) {
            return fail('No declaration found for DirectTarget');
        }
        expect(targetDecl.node.getSourceFile().fileName).toBe('/node_modules/absolute/index.ts');
        expect(ts.isClassDeclaration(targetDecl.node)).toBe(true);
        expect(directTargetDecl.viaModule).toBe('absolute');
        expect(directTargetDecl.node).toBe(targetDecl.node);
    });
});
function expectParameter(param, name, type, decorator, decoratorFrom) {
    expect(param.name).toEqual(name);
    if (type === undefined) {
        expect(param.type).toBeNull();
    }
    else {
        expect(param.type).not.toBeNull();
        expect(argExpressionToString(param.type)).toEqual(type);
    }
    if (decorator !== undefined) {
        expect(param.decorators).not.toBeNull();
        expect(param.decorators.length).toBeGreaterThan(0);
        expect(param.decorators.some(function (dec) { return dec.name === decorator && dec.import !== null &&
            dec.import.from === decoratorFrom; }))
            .toBe(true);
    }
}
function argExpressionToString(name) {
    if (ts.isIdentifier(name)) {
        return name.text;
    }
    else if (ts.isPropertyAccessExpression(name)) {
        return argExpressionToString(name.expression) + "." + name.name.text;
    }
    else {
        throw new Error("Unexpected node in arg expression: " + ts.SyntaxKind[name.kind] + ".");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL21ldGFkYXRhL3Rlc3QvcmVmbGVjdG9yX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQkFBaUM7QUFHakMsMkVBQStFO0FBQy9FLDhDQUEwRDtBQUUxRCxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQzlCLElBQUE7OzsyQkFBTyxDQVNWO1lBQ0osSUFBTSxLQUFLLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNoRixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekMsSUFBTSxJQUFJLEdBQUcsSUFBSSxvQ0FBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFHLENBQUM7WUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDakMsSUFBQTs7Ozs7Ozs7O3NCQUFPLENBbUJYO1lBQ0gsSUFBTSxLQUFLLEdBQUcscUNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNoRixJQUFNLE9BQU8s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