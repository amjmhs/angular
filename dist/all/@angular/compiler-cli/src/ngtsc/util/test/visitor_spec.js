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
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var in_memory_typescript_1 = require("../../testing/in_memory_typescript");
var visitor_1 = require("../src/visitor");
var TestAstVisitor = /** @class */ (function (_super) {
    __extends(TestAstVisitor, _super);
    function TestAstVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestAstVisitor.prototype.visitClassDeclaration = function (node) {
        var name = node.name.text;
        var statics = node.members.filter(function (member) { return (member.modifiers || []).some(function (mod) { return mod.kind === ts.SyntaxKind.StaticKeyword; }); });
        var idStatic = statics
            .find(function (el) { return ts.isPropertyDeclaration(el) && ts.isIdentifier(el.name) &&
            el.name.text === 'id'; });
        if (idStatic !== undefined) {
            return {
                node: node,
                before: [
                    ts.createVariableStatement(undefined, [
                        ts.createVariableDeclaration(name + "_id", undefined, idStatic.initializer),
                    ]),
                ],
            };
        }
        return { node: node };
    };
    return TestAstVisitor;
}(visitor_1.Visitor));
function testTransformerFactory(context) {
    return function (file) { return visitor_1.visit(file, new TestAstVisitor(), context); };
}
describe('AST Visitor', function () {
    it('should add a statement before class in plain file', function () {
        var _a = in_memory_typescript_1.makeProgram([{ name: 'main.ts', contents: "class A { static id = 3; }" }]), program = _a.program, host = _a.host;
        var sf = program.getSourceFile('main.ts');
        program.emit(sf, undefined, undefined, undefined, { before: [testTransformerFactory] });
        var main = host.readFile('/main.js');
        expect(main).toMatch(/^var A_id = 3;/);
    });
    it('should add a statement before class inside function definition', function () {
        var _a = in_memory_typescript_1.makeProgram([{
                name: 'main.ts',
                contents: "\n      export function foo() {\n        var x = 3;\n        class A { static id = 2; }\n        return A;\n      }\n    "
            }]), program = _a.program, host = _a.host;
        var sf = program.getSourceFile('main.ts');
        program.emit(sf, undefined, undefined, undefined, { before: [testTransformerFactory] });
        var main = host.readFile('/main.js');
        expect(main).toMatch(/var x = 3;\s+var A_id = 2;\s+var A =/);
    });
    it('handles nested statements', function () {
        var _a = in_memory_typescript_1.makeProgram([{
                name: 'main.ts',
                contents: "\n      export class A {\n        static id = 3;\n\n        foo() {\n          class B {\n            static id = 4;\n          }\n          return B;\n        }\n    }"
            }]), program = _a.program, host = _a.host;
        var sf = program.getSourceFile('main.ts');
        program.emit(sf, undefined, undefined, undefined, { before: [testTransformerFactory] });
        var main = host.readFile('/main.js');
        expect(main).toMatch(/var A_id = 3;\s+var A = /);
        expect(main).toMatch(/var B_id = 4;\s+var B = /);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXRvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy91dGlsL3Rlc3QvdmlzaXRvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtCQUFpQztBQUVqQywyRUFBK0Q7QUFDL0QsMENBQW9FO0FBRXBFO0lBQTZCLGtDQUFPO0lBQXBDOztJQTBCQSxDQUFDO0lBekJDLDhDQUFxQixHQUFyQixVQUFzQixJQUF5QjtRQUU3QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBTSxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFNLE9BQU8sR0FDVCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLFNBQXVDLElBQUcsRUFDakQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQXhDLENBQXdDLENBQUMsRUFEeEQsQ0FDd0QsQ0FBQyxDQUFDO1FBQzVGLElBQU0sUUFBUSxHQUFHLE9BQU87YUFDRixJQUFJLENBQ0QsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQzFELEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFEbkIsQ0FDbUIsQ0FDckMsQ0FBQztRQUNkLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPO2dCQUNMLElBQUksTUFBQTtnQkFDSixNQUFNLEVBQUU7b0JBQ04sRUFBRSxDQUFDLHVCQUF1QixDQUN0QixTQUFTLEVBQ1Q7d0JB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