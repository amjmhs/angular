"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var metadata_1 = require("../../metadata");
var util_1 = require("./util");
var PipeDecoratorHandler = /** @class */ (function () {
    function PipeDecoratorHandler(checker, reflector, scopeRegistry, isCore) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
    }
    PipeDecoratorHandler.prototype.detect = function (decorator) {
        var _this = this;
        return decorator.find(function (decorator) { return decorator.name === 'Pipe' && (_this.isCore || util_1.isAngularCore(decorator)); });
    };
    PipeDecoratorHandler.prototype.analyze = function (clazz, decorator) {
        if (clazz.name === undefined) {
            throw new Error("@Pipes must have names");
        }
        var name = clazz.name.text;
        var type = new compiler_1.WrappedNodeExpr(clazz.name);
        if (decorator.args === null) {
            throw new Error("@Pipe must be called");
        }
        var meta = util_1.unwrapExpression(decorator.args[0]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error("Decorator argument must be literal.");
        }
        var pipe = metadata_1.reflectObjectLiteral(meta);
        if (!pipe.has('name')) {
            throw new Error("@Pipe decorator is missing name field");
        }
        var pipeName = metadata_1.staticallyResolve(pipe.get('name'), this.reflector, this.checker);
        if (typeof pipeName !== 'string') {
            throw new Error("@Pipe.name must be a string");
        }
        this.scopeRegistry.registerPipe(clazz, pipeName);
        var pure = true;
        if (pipe.has('pure')) {
            var pureValue = metadata_1.staticallyResolve(pipe.get('pure'), this.reflector, this.checker);
            if (typeof pureValue !== 'boolean') {
                throw new Error("@Pipe.pure must be a boolean");
            }
            pure = pureValue;
        }
        return {
            analysis: {
                name: name,
                type: type,
                pipeName: pipeName,
                deps: util_1.getConstructorDependencies(clazz, this.reflector, this.isCore), pure: pure,
            }
        };
    };
    PipeDecoratorHandler.prototype.compile = function (node, analysis) {
        var res = compiler_1.compilePipeFromMetadata(analysis);
        return {
            name: 'ngPipeDef',
            initializer: res.expression,
            statements: [],
            type: res.type,
        };
    };
    return PipeDecoratorHandler;
}());
exports.PipeDecoratorHandler = PipeDecoratorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBd0c7QUFDeEcsK0JBQWlDO0FBR2pDLDJDQUF1RTtBQUl2RSwrQkFBbUY7QUFFbkY7SUFDRSw4QkFDWSxPQUF1QixFQUFVLFNBQXlCLEVBQzFELGFBQW9DLEVBQVUsTUFBZTtRQUQ3RCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBQzFELGtCQUFhLEdBQWIsYUFBYSxDQUF1QjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVM7SUFBRyxDQUFDO0lBRTdFLHFDQUFNLEdBQU4sVUFBTyxTQUFzQjtRQUE3QixpQkFHQztRQUZDLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FDakIsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLElBQUksb0JBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUF0RSxDQUFzRSxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVELHNDQUFPLEdBQVAsVUFBUSxLQUEwQixFQUFFLFNBQW9CO1FBQ3RELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBTSxJQUFJLEdBQUcsSUFBSSwwQkFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUN6QztRQUNELElBQU0sSUFBSSxHQUFHLHVCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQU0sSUFBSSxHQUFHLCtCQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUNELElBQU0sUUFBUSxHQUFHLDRCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckYsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWpELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEIsSUFBTSxTQUFTLEdBQUcsNEJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLE9BQU8sU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2FBQ2pEO1lBQ0QsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUNsQjtRQUVELE9BQU87WUFDTCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxNQUFBO2dCQUNKLElBQUksTUFBQTtnQkFDSixRQUFRLFVBQUE7Z0JBQ1IsSUFBSSxFQUFFLGlDQUEwQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLE1BQUE7YUFDM0U7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELHNDQUFPLEdBQVAsVUFBUSxJQUF5QixFQUFFLFFBQXdCO1FBQ3pELElBQU0sR0FBRyxHQUFHLGtDQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLE9BQU87WUFDTCxJQUFJLEVBQUUsV0FBVztZQUNqQixXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVU7WUFDM0IsVUFBVSxFQUFFLEVBQUU7WUFDZCxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQTlERCxJQThEQztBQTlEWSxvREFBb0IifQ==