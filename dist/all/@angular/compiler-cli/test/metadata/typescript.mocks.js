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
var fs = require("fs");
var ts = require("typescript");
var Host = /** @class */ (function () {
    function Host(directory, scripts) {
        this.directory = directory;
        this.scripts = scripts;
        this.overrides = new Map();
        this.version = 1;
    }
    Host.prototype.getCompilationSettings = function () {
        return {
            experimentalDecorators: true,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES5
        };
    };
    Host.prototype.getScriptFileNames = function () { return this.scripts; };
    Host.prototype.getScriptVersion = function (fileName) { return this.version.toString(); };
    Host.prototype.getScriptSnapshot = function (fileName) {
        var content = this.getFileContent(fileName);
        if (content)
            return ts.ScriptSnapshot.fromString(content);
    };
    Host.prototype.fileExists = function (fileName) { return this.getFileContent(fileName) != null; };
    Host.prototype.getCurrentDirectory = function () { return '/'; };
    Host.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    Host.prototype.overrideFile = function (fileName, content) {
        this.overrides.set(fileName, content);
        this.version++;
    };
    Host.prototype.addFile = function (fileName) {
        this.scripts.push(fileName);
        this.version++;
    };
    Host.prototype.getFileContent = function (fileName) {
        if (this.overrides.has(fileName)) {
            return this.overrides.get(fileName);
        }
        if (fileName.endsWith('lib.d.ts')) {
            return fs.readFileSync(ts.getDefaultLibFilePath(this.getCompilationSettings()), 'utf8');
        }
        var current = open(this.directory, fileName);
        if (typeof current === 'string')
            return current;
    };
    return Host;
}());
exports.Host = Host;
function open(directory, fileName) {
    // Path might be normalized by the current node environment. But it could also happen that this
    // path directly comes from the compiler in POSIX format. Support both separators for development.
    var names = fileName.split(/[\\/]/);
    var current = directory;
    if (names.length && names[0] === '')
        names.shift();
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (!current || typeof current === 'string')
            return undefined;
        current = current[name_1];
    }
    return current;
}
exports.open = open;
var MockNode = /** @class */ (function () {
    function MockNode(kind, flags, pos, end) {
        if (kind === void 0) { kind = ts.SyntaxKind.Identifier; }
        if (flags === void 0) { flags = 0; }
        if (pos === void 0) { pos = 0; }
        if (end === void 0) { end = 0; }
        this.kind = kind;
        this.flags = flags;
        this.pos = pos;
        this.end = end;
    }
    MockNode.prototype.getSourceFile = function () { return null; };
    MockNode.prototype.getChildCount = function (sourceFile) { return 0; };
    MockNode.prototype.getChildAt = function (index, sourceFile) { return null; };
    MockNode.prototype.getChildren = function (sourceFile) { return []; };
    MockNode.prototype.getStart = function (sourceFile) { return 0; };
    MockNode.prototype.getFullStart = function () { return 0; };
    MockNode.prototype.getEnd = function () { return 0; };
    MockNode.prototype.getWidth = function (sourceFile) { return 0; };
    MockNode.prototype.getFullWidth = function () { return 0; };
    MockNode.prototype.getLeadingTriviaWidth = function (sourceFile) { return 0; };
    MockNode.prototype.getFullText = function (sourceFile) { return ''; };
    MockNode.prototype.getText = function (sourceFile) { return ''; };
    MockNode.prototype.getFirstToken = function (sourceFile) { return null; };
    MockNode.prototype.getLastToken = function (sourceFile) { return null; };
    MockNode.prototype.forEachChild = function (cbNode, cbNodeArray) {
        return undefined;
    };
    return MockNode;
}());
exports.MockNode = MockNode;
var MockIdentifier = /** @class */ (function (_super) {
    __extends(MockIdentifier, _super);
    // tslint:enable
    function MockIdentifier(name, kind, flags, pos, end) {
        if (kind === void 0) { kind = ts.SyntaxKind.Identifier; }
        if (flags === void 0) { flags = 0; }
        if (pos === void 0) { pos = 0; }
        if (end === void 0) { end = 0; }
        var _this = _super.call(this, kind, flags, pos, end) || this;
        _this.name = name;
        _this.kind = kind;
        _this.text = name;
        return _this;
    }
    return MockIdentifier;
}(MockNode));
exports.MockIdentifier = MockIdentifier;
var MockVariableDeclaration = /** @class */ (function (_super) {
    __extends(MockVariableDeclaration, _super);
    function MockVariableDeclaration(name, kind, flags, pos, end) {
        if (kind === void 0) { kind = ts.SyntaxKind.VariableDeclaration; }
        if (flags === void 0) { flags = 0; }
        if (pos === void 0) { pos = 0; }
        if (end === void 0) { end = 0; }
        var _this = _super.call(this, kind, flags, pos, end) || this;
        _this.name = name;
        _this.kind = kind;
        return _this;
    }
    MockVariableDeclaration.of = function (name) {
        return new MockVariableDeclaration(new MockIdentifier(name));
    };
    return MockVariableDeclaration;
}(MockNode));
exports.MockVariableDeclaration = MockVariableDeclaration;
var MockSymbol = /** @class */ (function () {
    function MockSymbol(name, node, flags) {
        if (node === void 0) { node = MockVariableDeclaration.of(name); }
        if (flags === void 0) { flags = 0; }
        this.name = name;
        this.node = node;
        this.flags = flags;
    }
    MockSymbol.prototype.getFlags = function () { return this.flags; };
    MockSymbol.prototype.getName = function () { return this.name; };
    MockSymbol.prototype.getEscapedName = function () { return this.escapedName; };
    MockSymbol.prototype.getDeclarations = function () { return [this.node]; };
    MockSymbol.prototype.getDocumentationComment = function () { return []; };
    // TODO(vicb): removed in TS 2.2
    MockSymbol.prototype.getJsDocTags = function () { return []; };
    MockSymbol.of = function (name) { return new MockSymbol(name); };
    return MockSymbol;
}());
exports.MockSymbol = MockSymbol;
function expectNoDiagnostics(diagnostics) {
    for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
        var diagnostic = diagnostics_1[_i];
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file && diagnostic.start) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            // tslint:disable-next-line:no-console
            console.log(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(message);
        }
    }
    expect(diagnostics.length).toBe(0);
}
exports.expectNoDiagnostics = expectNoDiagnostics;
function expectValidSources(service, program) {
    expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        expectNoDiagnostics(service.getSyntacticDiagnostics(sourceFile.fileName));
        expectNoDiagnostics(service.getSemanticDiagnostics(sourceFile.fileName));
    }
}
exports.expectValidSources = expectValidSources;
function allChildren(node, cb) {
    return ts.forEachChild(node, function (child) { return cb(node) || allChildren(child, cb); });
}
exports.allChildren = allChildren;
function findClass(sourceFile, name) {
    return ts.forEachChild(sourceFile, function (node) { return isClass(node) && isNamed(node.name, name) ? node : undefined; });
}
exports.findClass = findClass;
function findVar(sourceFile, name) {
    return allChildren(sourceFile, function (node) { return isVar(node) && isNamed(node.name, name) ? node : undefined; });
}
exports.findVar = findVar;
function findVarInitializer(sourceFile, name) {
    var v = findVar(sourceFile, name);
    expect(v && v.initializer).toBeDefined();
    return v.initializer;
}
exports.findVarInitializer = findVarInitializer;
function isClass(node) {
    return node.kind === ts.SyntaxKind.ClassDeclaration;
}
exports.isClass = isClass;
function isNamed(node, name) {
    return !!node && node.kind === ts.SyntaxKind.Identifier && node.text === name;
}
exports.isNamed = isNamed;
function isVar(node) {
    return node.kind === ts.SyntaxKind.VariableDeclaration;
}
exports.isVar = isVar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5tb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L21ldGFkYXRhL3R5cGVzY3JpcHQubW9ja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXlCO0FBQ3pCLCtCQUFpQztBQUlqQztJQUlFLGNBQW9CLFNBQW9CLEVBQVUsT0FBaUI7UUFBL0MsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFIM0QsY0FBUyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1FBQ3RDLFlBQU8sR0FBRyxDQUFDLENBQUM7SUFFa0QsQ0FBQztJQUV2RSxxQ0FBc0IsR0FBdEI7UUFDRSxPQUFPO1lBQ0wsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1lBQzlCLE1BQU0sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUc7U0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFRCxpQ0FBa0IsR0FBbEIsY0FBaUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUV2RCwrQkFBZ0IsR0FBaEIsVUFBaUIsUUFBZ0IsSUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlFLGdDQUFpQixHQUFqQixVQUFrQixRQUFnQjtRQUNoQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTztZQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELHlCQUFVLEdBQVYsVUFBVyxRQUFnQixJQUFhLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXZGLGtDQUFtQixHQUFuQixjQUFnQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFN0Msb0NBQXFCLEdBQXJCLFVBQXNCLE9BQTJCLElBQVksT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRWpGLDJCQUFZLEdBQVosVUFBYSxRQUFnQixFQUFFLE9BQWU7UUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsc0JBQU8sR0FBUCxVQUFRLFFBQWdCO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRU8sNkJBQWMsR0FBdEIsVUFBdUIsUUFBZ0I7UUFDckMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN6RjtRQUNELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUTtZQUFFLE9BQU8sT0FBTyxDQUFDO0lBQ2xELENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQWpERCxJQWlEQztBQWpEWSxvQkFBSTtBQW1EakIsY0FBcUIsU0FBb0IsRUFBRSxRQUFnQjtJQUN6RCwrRkFBK0Y7SUFDL0Ysa0dBQWtHO0lBQ2xHLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsSUFBSSxPQUFPLEdBQXFCLFNBQVMsQ0FBQztJQUMxQyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkQsS0FBbUIsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUssRUFBRTtRQUFyQixJQUFNLE1BQUksY0FBQTtRQUNiLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUTtZQUFFLE9BQU8sU0FBUyxDQUFDO1FBQzlELE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBSSxDQUFDLENBQUM7S0FDekI7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBWEQsb0JBV0M7QUFFRDtJQUNFLGtCQUNXLElBQThDLEVBQVMsS0FBdUIsRUFDOUUsR0FBZSxFQUFTLEdBQWU7UUFEdkMscUJBQUEsRUFBQSxPQUFzQixFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7UUFBUyxzQkFBQSxFQUFBLFNBQXVCO1FBQzlFLG9CQUFBLEVBQUEsT0FBZTtRQUFTLG9CQUFBLEVBQUEsT0FBZTtRQUR2QyxTQUFJLEdBQUosSUFBSSxDQUEwQztRQUFTLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQzlFLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFZO0lBQUcsQ0FBQztJQUN0RCxnQ0FBYSxHQUFiLGNBQWlDLE9BQU8sSUFBNEIsQ0FBQyxDQUFDLENBQUM7SUFDdkUsZ0NBQWEsR0FBYixVQUFjLFVBQTBCLElBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELDZCQUFVLEdBQVYsVUFBVyxLQUFhLEVBQUUsVUFBMEIsSUFBYSxPQUFPLElBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLDhCQUFXLEdBQVgsVUFBWSxVQUEwQixJQUFlLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqRSwyQkFBUSxHQUFSLFVBQVMsVUFBMEIsSUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsK0JBQVksR0FBWixjQUF5QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMseUJBQU0sR0FBTixjQUFtQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsMkJBQVEsR0FBUixVQUFTLFVBQTBCLElBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELCtCQUFZLEdBQVosY0FBeUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLHdDQUFxQixHQUFyQixVQUFzQixVQUEwQixJQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSw4QkFBVyxHQUFYLFVBQVksVUFBMEIsSUFBWSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUQsMEJBQU8sR0FBUCxVQUFRLFVBQTBCLElBQVksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFELGdDQUFhLEdBQWIsVUFBYyxVQUEwQixJQUFhLE9BQU8sSUFBc0IsQ0FBQyxDQUFDLENBQUM7SUFDckYsK0JBQVksR0FBWixVQUFhLFVBQTBCLElBQWEsT0FBTyxJQUFzQixDQUFDLENBQUMsQ0FBQztJQUNwRiwrQkFBWSxHQUFaLFVBQ0ksTUFBd0MsRUFDeEMsV0FBNkQ7UUFDL0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBdkJELElBdUJDO0FBdkJZLDRCQUFRO0FBeUJyQjtJQUFvQyxrQ0FBUTtJQWExQyxnQkFBZ0I7SUFFaEIsd0JBQ1csSUFBWSxFQUFTLElBQXlELEVBQ3JGLEtBQXVCLEVBQUUsR0FBZSxFQUFFLEdBQWU7UUFEN0IscUJBQUEsRUFBQSxPQUFpQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7UUFDckYsc0JBQUEsRUFBQSxTQUF1QjtRQUFFLG9CQUFBLEVBQUEsT0FBZTtRQUFFLG9CQUFBLEVBQUEsT0FBZTtRQUY3RCxZQUdFLGtCQUFNLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxTQUU3QjtRQUpVLFVBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFJLEdBQUosSUFBSSxDQUFxRDtRQUd2RixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7SUFDbkIsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUFvQyxRQUFRLEdBcUIzQztBQXJCWSx3Q0FBYztBQXVCM0I7SUFBNkMsMkNBQVE7SUFJbkQsaUNBQ1csSUFBbUIsRUFDbkIsSUFBMkUsRUFDbEYsS0FBdUIsRUFBRSxHQUFlLEVBQUUsR0FBZTtRQURsRCxxQkFBQSxFQUFBLE9BQTBDLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CO1FBQ2xGLHNCQUFBLEVBQUEsU0FBdUI7UUFBRSxvQkFBQSxFQUFBLE9BQWU7UUFBRSxvQkFBQSxFQUFBLE9BQWU7UUFIN0QsWUFJRSxrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsU0FDN0I7UUFKVSxVQUFJLEdBQUosSUFBSSxDQUFlO1FBQ25CLFVBQUksR0FBSixJQUFJLENBQXVFOztJQUd0RixDQUFDO0lBRU0sMEJBQUUsR0FBVCxVQUFXLElBQVk7UUFDckIsT0FBTyxJQUFJLHVCQUF1QixDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQWRELENBQTZDLFFBQVEsR0FjcEQ7QUFkWSwwREFBdUI7QUFnQnBDO0lBR0Usb0JBQ1csSUFBWSxFQUFVLElBQXVELEVBQzdFLEtBQXlCO1FBREgscUJBQUEsRUFBQSxPQUF1Qix1QkFBdUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQzdFLHNCQUFBLEVBQUEsU0FBeUI7UUFEekIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFNBQUksR0FBSixJQUFJLENBQW1EO1FBQzdFLFVBQUssR0FBTCxLQUFLLENBQW9CO0lBQUcsQ0FBQztJQUV4Qyw2QkFBUSxHQUFSLGNBQTZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDakQsNEJBQU8sR0FBUCxjQUFvQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLG1DQUFjLEdBQWQsY0FBZ0MsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMxRCxvQ0FBZSxHQUFmLGNBQXNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELDRDQUF1QixHQUF2QixjQUFvRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsZ0NBQWdDO0lBQ2hDLGlDQUFZLEdBQVosY0FBd0IsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdCLGFBQUUsR0FBVCxVQUFXLElBQVksSUFBZ0IsT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsaUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBaEJZLGdDQUFVO0FBa0J2Qiw2QkFBb0MsV0FBNEI7SUFDOUQsS0FBeUIsVUFBVyxFQUFYLDJCQUFXLEVBQVgseUJBQVcsRUFBWCxJQUFXLEVBQUU7UUFBakMsSUFBTSxVQUFVLG9CQUFBO1FBQ25CLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlFLElBQUksVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQ2pDLElBQUEsb0VBQW1GLEVBQWxGLGNBQUksRUFBRSx3QkFBUyxDQUFvRTtZQUMxRixzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsV0FBSyxJQUFJLEdBQUcsQ0FBQyxXQUFJLFNBQVMsR0FBRyxDQUFDLFlBQU0sT0FBUyxDQUFDLENBQUM7U0FDdkY7YUFBTTtZQUNMLHNDQUFzQztZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RCO0tBQ0Y7SUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBYkQsa0RBYUM7QUFFRCw0QkFBbUMsT0FBMkIsRUFBRSxPQUFtQjtJQUNqRixtQkFBbUIsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDO0lBQzdELEtBQXlCLFVBQXdCLEVBQXhCLEtBQUEsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUF4QixjQUF3QixFQUF4QixJQUF3QixFQUFFO1FBQTlDLElBQU0sVUFBVSxTQUFBO1FBQ25CLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDMUU7QUFDSCxDQUFDO0FBTkQsZ0RBTUM7QUFFRCxxQkFBK0IsSUFBYSxFQUFFLEVBQW9DO0lBQ2hGLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFGRCxrQ0FFQztBQUVELG1CQUEwQixVQUF5QixFQUFFLElBQVk7SUFDL0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUNsQixVQUFVLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUE1RCxDQUE0RCxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUhELDhCQUdDO0FBRUQsaUJBQXdCLFVBQXlCLEVBQUUsSUFBWTtJQUM3RCxPQUFPLFdBQVcsQ0FDZCxVQUFVLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUExRCxDQUEwRCxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUhELDBCQUdDO0FBRUQsNEJBQW1DLFVBQXlCLEVBQUUsSUFBWTtJQUN4RSxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pDLE9BQU8sQ0FBRyxDQUFDLFdBQWEsQ0FBQztBQUMzQixDQUFDO0FBSkQsZ0RBSUM7QUFFRCxpQkFBd0IsSUFBYTtJQUNuQyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN0RCxDQUFDO0FBRkQsMEJBRUM7QUFFRCxpQkFBd0IsSUFBeUIsRUFBRSxJQUFZO0lBQzdELE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFvQixJQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztBQUNqRyxDQUFDO0FBRkQsMEJBRUM7QUFFRCxlQUFzQixJQUFhO0lBQ2pDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDO0FBQ3pELENBQUM7QUFGRCxzQkFFQyJ9