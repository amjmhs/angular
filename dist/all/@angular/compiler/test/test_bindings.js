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
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var schema_registry_mock_1 = require("@angular/compiler/testing/src/schema_registry_mock");
function createUrlResolverWithoutPackagePrefix() {
    return new compiler_1.UrlResolver();
}
exports.createUrlResolverWithoutPackagePrefix = createUrlResolverWithoutPackagePrefix;
// This provider is put here just so that we can access it from multiple
// internal test packages.
// TODO: get rid of it or move to a separate @angular/internal_testing package
exports.TEST_COMPILER_PROVIDERS = [
    { provide: compiler_1.ElementSchemaRegistry, useValue: new schema_registry_mock_1.MockSchemaRegistry({}, {}, {}, [], []) },
    { provide: compiler_1.ResourceLoader, useClass: resource_loader_mock_1.MockResourceLoader, deps: [] },
    { provide: compiler_1.UrlResolver, useFactory: createUrlResolverWithoutPackagePrefix, deps: [] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9iaW5kaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvdGVzdF9iaW5kaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxRjtBQUNyRiwyRkFBc0Y7QUFDdEYsMkZBQXNGO0FBR3RGO0lBQ0UsT0FBTyxJQUFJLHNCQUFXLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRkQsc0ZBRUM7QUFFRCx3RUFBd0U7QUFDeEUsMEJBQTBCO0FBQzFCLDhFQUE4RTtBQUNqRSxRQUFBLHVCQUF1QixHQUFlO0lBQ2pELEVBQUMsT0FBTyxFQUFFLGdDQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLHlDQUFrQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztJQUN0RixFQUFDLE9BQU8sRUFBRSx5QkFBYyxFQUFFLFFBQVEsRUFBRSx5Q0FBa0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQ2pFLEVBQUMsT0FBTyxFQUFFLHNCQUFXLEVBQUUsVUFBVSxFQUFFLHFDQUFxQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7Q0FDcEYsQ0FBQyJ9