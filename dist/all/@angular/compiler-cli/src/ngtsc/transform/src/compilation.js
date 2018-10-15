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
var reflector_1 = require("../../metadata/src/reflector");
var declaration_1 = require("./declaration");
/**
 * Manages a compilation of Ivy decorators into static fields across an entire ts.Program.
 *
 * The compilation is stateful - source files are analyzed and records of the operations that need
 * to be performed during the transform/emit process are maintained internally.
 */
var IvyCompilation = /** @class */ (function () {
    /**
     * @param handlers array of `DecoratorHandler`s which will be executed against each class in the
     * program
     * @param checker TypeScript `TypeChecker` instance for the program
     * @param reflector `ReflectionHost` through which all reflection operations will be performed
     * @param coreImportsFrom a TypeScript `SourceFile` which exports symbols needed for Ivy imports
     * when compiling @angular/core, or `null` if the current program is not @angular/core. This is
     * `null` in most cases.
     */
    function IvyCompilation(handlers, checker, reflector, coreImportsFrom) {
        this.handlers = handlers;
        this.checker = checker;
        this.reflector = reflector;
        this.coreImportsFrom = coreImportsFrom;
        /**
         * Tracks classes which have been analyzed and found to have an Ivy decorator, and the
         * information recorded about them for later compilation.
         */
        this.analysis = new Map();
        /**
         * Tracks the `DtsFileTransformer`s for each TS file that needs .d.ts transformations.
         */
        this.dtsMap = new Map();
        this._diagnostics = [];
    }
    IvyCompilation.prototype.analyzeSync = function (sf) { return this.analyze(sf, false); };
    IvyCompilation.prototype.analyzeAsync = function (sf) { return this.analyze(sf, true); };
    IvyCompilation.prototype.analyze = function (sf, preanalyze) {
        var _this = this;
        var promises = [];
        var analyzeClass = function (node) {
            // The first step is to reflect the decorators.
            var decorators = _this.reflector.getDecoratorsOfDeclaration(node);
            if (decorators === null) {
                return;
            }
            // Look through the DecoratorHandlers to see if any are relevant.
            _this.handlers.forEach(function (adapter) {
                // An adapter is relevant if it matches one of the decorators on the class.
                var decorator = adapter.detect(decorators);
                if (decorator === undefined) {
                    return;
                }
                var completeAnalysis = function () {
                    var _a;
                    // Check for multiple decorators on the same node. Technically speaking this
                    // could be supported, but right now it's an error.
                    if (_this.analysis.has(node)) {
                        throw new Error('TODO.Diagnostic: Class has multiple Angular decorators.');
                    }
                    // Run analysis on the decorator. This will produce either diagnostics, an
                    // analysis result, or both.
                    var analysis = adapter.analyze(node, decorator);
                    if (analysis.analysis !== undefined) {
                        _this.analysis.set(node, {
                            adapter: adapter,
                            analysis: analysis.analysis, decorator: decorator,
                        });
                    }
                    if (analysis.diagnostics !== undefined) {
                        (_a = _this._diagnostics).push.apply(_a, analysis.diagnostics);
                    }
                };
                if (preanalyze && adapter.preanalyze !== undefined) {
                    var preanalysis = adapter.preanalyze(node, decorator);
                    if (preanalysis !== undefined) {
                        promises.push(preanalysis.then(function () { return completeAnalysis(); }));
                    }
                    else {
                        completeAnalysis();
                    }
                }
                else {
                    completeAnalysis();
                }
            });
        };
        var visit = function (node) {
            // Process nodes recursively, and look for class declarations with decorators.
            if (ts.isClassDeclaration(node)) {
                analyzeClass(node);
            }
            ts.forEachChild(node, visit);
        };
        visit(sf);
        if (preanalyze && promises.length > 0) {
            return Promise.all(promises).then(function () { return undefined; });
        }
        else {
            return undefined;
        }
    };
    /**
     * Perform a compilation operation on the given class declaration and return instructions to an
     * AST transformer if any are available.
     */
    IvyCompilation.prototype.compileIvyFieldFor = function (node) {
        // Look to see whether the original node was analyzed. If not, there's nothing to do.
        var original = ts.getOriginalNode(node);
        if (!this.analysis.has(original)) {
            return undefined;
        }
        var op = this.analysis.get(original);
        // Run the actual compilation, which generates an Expression for the Ivy field.
        var res = op.adapter.compile(node, op.analysis);
        if (!Array.isArray(res)) {
            res = [res];
        }
        // Look up the .d.ts transformer for the input file and record that a field was generated,
        // which will allow the .d.ts to be transformed later.
        var fileName = original.getSourceFile().fileName;
        var dtsTransformer = this.getDtsTransformer(fileName);
        dtsTransformer.recordStaticField(reflector_1.reflectNameOfDeclaration(node), res);
        // Return the instruction to the transformer so the field will be added.
        return res;
    };
    /**
     * Lookup the `ts.Decorator` which triggered transformation of a particular class declaration.
     */
    IvyCompilation.prototype.ivyDecoratorFor = function (node) {
        var original = ts.getOriginalNode(node);
        if (!this.analysis.has(original)) {
            return undefined;
        }
        return this.analysis.get(original).decorator;
    };
    /**
     * Process a .d.ts source string and return a transformed version that incorporates the changes
     * made to the source file.
     */
    IvyCompilation.prototype.transformedDtsFor = function (tsFileName, dtsOriginalSource, dtsPath) {
        // No need to transform if no changes have been requested to the input file.
        if (!this.dtsMap.has(tsFileName)) {
            return dtsOriginalSource;
        }
        // Return the transformed .d.ts source.
        return this.dtsMap.get(tsFileName).transform(dtsOriginalSource, tsFileName);
    };
    Object.defineProperty(IvyCompilation.prototype, "diagnostics", {
        get: function () { return this._diagnostics; },
        enumerable: true,
        configurable: true
    });
    IvyCompilation.prototype.getDtsTransformer = function (tsFileName) {
        if (!this.dtsMap.has(tsFileName)) {
            this.dtsMap.set(tsFileName, new declaration_1.DtsFileTransformer(this.coreImportsFrom));
        }
        return this.dtsMap.get(tsFileName);
    };
    return IvyCompilation;
}());
exports.IvyCompilation = IvyCompilation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvY29tcGlsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQkFBaUM7QUFHakMsMERBQXNFO0FBR3RFLDZDQUFpRDtBQVlqRDs7Ozs7R0FLRztBQUNIO0lBY0U7Ozs7Ozs7O09BUUc7SUFDSCx3QkFDWSxRQUFpQyxFQUFVLE9BQXVCLEVBQ2xFLFNBQXlCLEVBQVUsZUFBbUM7UUFEdEUsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUNsRSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQXhCbEY7OztXQUdHO1FBQ0ssYUFBUSxHQUFHLElBQUksR0FBRyxFQUEyQyxDQUFDO1FBRXRFOztXQUVHO1FBQ0ssV0FBTSxHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1FBQy9DLGlCQUFZLEdBQW9CLEVBQUUsQ0FBQztJQWMwQyxDQUFDO0lBR3RGLG9DQUFXLEdBQVgsVUFBWSxFQUFpQixJQUFVLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhFLHFDQUFZLEdBQVosVUFBYSxFQUFpQixJQUE2QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQU9uRixnQ0FBTyxHQUFmLFVBQWdCLEVBQWlCLEVBQUUsVUFBbUI7UUFBdEQsaUJBb0VDO1FBbkVDLElBQU0sUUFBUSxHQUFvQixFQUFFLENBQUM7UUFFckMsSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFvQjtZQUN4QywrQ0FBK0M7WUFDL0MsSUFBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRSxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELGlFQUFpRTtZQUNqRSxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQzNCLDJFQUEyRTtnQkFDM0UsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO29CQUMzQixPQUFPO2lCQUNSO2dCQUVELElBQU0sZ0JBQWdCLEdBQUc7O29CQUN2Qiw0RUFBNEU7b0JBQzVFLG1EQUFtRDtvQkFDbkQsSUFBSSxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO3FCQUM1RTtvQkFFRCwwRUFBMEU7b0JBQzFFLDRCQUE0QjtvQkFDNUIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBRWxELElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQ25DLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTs0QkFDdEIsT0FBTyxTQUFBOzRCQUNQLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsV0FBQTt5QkFDdkMsQ0FBQyxDQUFDO3FCQUNKO29CQUVELElBQUksUUFBUSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7d0JBQ3RDLENBQUEsS0FBQSxLQUFJLENBQUMsWUFBWSxDQUFBLENBQUMsSUFBSSxXQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUU7cUJBQ2pEO2dCQUNILENBQUMsQ0FBQztnQkFFRixJQUFJLFVBQVUsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFDbEQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3hELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTt3QkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxnQkFBZ0IsRUFBRSxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQztxQkFDM0Q7eUJBQU07d0JBQ0wsZ0JBQWdCLEVBQUUsQ0FBQztxQkFDcEI7aUJBQ0Y7cUJBQU07b0JBQ0wsZ0JBQWdCLEVBQUUsQ0FBQztpQkFDcEI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLElBQU0sS0FBSyxHQUFHLFVBQUMsSUFBYTtZQUMxQiw4RUFBOEU7WUFDOUUsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwQjtZQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQztRQUVGLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVWLElBQUksVUFBVSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLFNBQVMsRUFBVCxDQUFTLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0wsT0FBTyxTQUFTLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMkNBQWtCLEdBQWxCLFVBQW1CLElBQW9CO1FBQ3JDLHFGQUFxRjtRQUNyRixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBbUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDaEMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUcsQ0FBQztRQUV6QywrRUFBK0U7UUFDL0UsSUFBSSxHQUFHLEdBQWtDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYjtRQUVELDBGQUEwRjtRQUMxRixzREFBc0Q7UUFDdEQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNuRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsY0FBYyxDQUFDLGlCQUFpQixDQUFDLG9DQUF3QixDQUFDLElBQUksQ0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXhFLHdFQUF3RTtRQUN4RSxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNILHdDQUFlLEdBQWYsVUFBZ0IsSUFBb0I7UUFDbEMsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQW1CLENBQUM7UUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUcsQ0FBQyxTQUFTLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7T0FHRztJQUNILDBDQUFpQixHQUFqQixVQUFrQixVQUFrQixFQUFFLGlCQUF5QixFQUFFLE9BQWU7UUFDOUUsNEVBQTRFO1FBQzVFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNoQyxPQUFPLGlCQUFpQixDQUFDO1NBQzFCO1FBRUQsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxzQkFBSSx1Q0FBVzthQUFmLGNBQWtELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXJFLDBDQUFpQixHQUF6QixVQUEwQixVQUFrQjtRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksZ0NBQWtCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDM0U7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRyxDQUFDO0lBQ3ZDLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUF6S0QsSUF5S0M7QUF6S1ksd0NBQWMifQ==