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
var index_1 = require("../../src/metadata/index");
var metadata_cache_1 = require("../../src/transformers/metadata_cache");
var r3_metadata_transform_1 = require("../../src/transformers/r3_metadata_transform");
describe('r3_transform_spec', function () {
    it('should add a static method to collected metadata', function () {
        var fileName = '/some/directory/someFileName.ts';
        var className = 'SomeClass';
        var newFieldName = 'newStaticField';
        var source = "\n      export class " + className + " {\n        myMethod(): void {}\n      }\n    ";
        var sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, /* setParentNodes */ true);
        var partialModule = {
            fileName: fileName,
            statements: [new compiler_1.ClassStmt(className, /* parent */ null, /* fields */ [new compiler_1.ClassField(
                    /* name */ newFieldName, /* type */ null, /* modifiers */ [compiler_1.StmtModifier.Static])], 
                /* getters */ [], 
                /* constructorMethod */ new compiler_1.ClassMethod(/* name */ null, /* params */ [], /* body */ []), 
                /* methods */ [])]
        };
        var cache = new metadata_cache_1.MetadataCache(new index_1.MetadataCollector(), /* strict */ true, [new r3_metadata_transform_1.PartialModuleMetadataTransformer([partialModule])]);
        var metadata = cache.getMetadata(sourceFile);
        expect(metadata).toBeDefined('Expected metadata from test source file');
        if (metadata) {
            var classData = metadata.metadata[className];
            expect(classData && index_1.isClassMetadata(classData))
                .toBeDefined("Expected metadata to contain data for \"" + className + "\"");
            if (classData && index_1.isClassMetadata(classData)) {
                var statics = classData.statics;
                expect(statics).toBeDefined("Expected \"" + className + "\" metadata to contain statics");
                if (statics) {
                    expect(statics[newFieldName]).toEqual({}, 'Expected new field to recorded as a function');
                }
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbWV0YWRhdGFfdHJhbnNmb3JtX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC90cmFuc2Zvcm1lcnMvcjNfbWV0YWRhdGFfdHJhbnNmb3JtX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBNkc7QUFDN0csK0JBQWlDO0FBRWpDLGtEQUE0RTtBQUM1RSx3RUFBb0U7QUFDcEUsc0ZBQThGO0FBRTlGLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUU1QixFQUFFLENBQUMsa0RBQWtELEVBQUU7UUFDckQsSUFBTSxRQUFRLEdBQUcsaUNBQWlDLENBQUM7UUFDbkQsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDO1FBQzlCLElBQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDO1FBQ3RDLElBQU0sTUFBTSxHQUFHLDBCQUNFLFNBQVMsbURBR3pCLENBQUM7UUFFRixJQUFNLFVBQVUsR0FDWixFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RixJQUFNLGFBQWEsR0FBa0I7WUFDbkMsUUFBUSxVQUFBO1lBQ1IsVUFBVSxFQUFFLENBQUMsSUFBSSxvQkFBUyxDQUN0QixTQUFTLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUEsQ0FBQyxJQUFJLHFCQUFVO29CQUNyRCxVQUFVLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFBLENBQUMsdUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixhQUFhLENBQUEsRUFBRTtnQkFDZix1QkFBdUIsQ0FBQyxJQUFJLHNCQUFXLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUEsRUFBRSxFQUFFLFVBQVUsQ0FBQSxFQUFFLENBQUM7Z0JBQ3RGLGFBQWEsQ0FBQSxFQUFFLENBQUMsQ0FBQztTQUN0QixDQUFDO1FBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSw4QkFBYSxDQUMzQixJQUFJLHlCQUFpQixFQUFFLEVBQUUsWUFBWSxDQUFDLElBQUksRUFDMUMsQ0FBQyxJQUFJLHdEQUFnQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDeEUsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxTQUFTLElBQUksdUJBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDMUMsV0FBVyxDQUFDLDZDQUEwQyxTQUFTLE9BQUcsQ0FBQyxDQUFDO1lBQ3pFLElBQUksU0FBUyxJQUFJLHVCQUFlLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzNDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWEsU0FBUyxtQ0FBK0IsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLE9BQU8sRUFBRTtvQkFDWCxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO2lCQUMzRjthQUNGO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=