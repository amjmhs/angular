"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_1 = require("./src/adapter");
var db_cache_1 = require("./src/db-cache");
var driver_1 = require("./src/driver");
var scope = self;
var adapter = new adapter_1.Adapter();
var driver = new driver_1.Driver(scope, adapter, new db_cache_1.CacheDatabase(scope, adapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXNDO0FBQ3RDLDJDQUE2QztBQUM3Qyx1Q0FBb0M7QUFFcEMsSUFBTSxLQUFLLEdBQUcsSUFBdUMsQ0FBQztBQUV0RCxJQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztBQUM5QixJQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksd0JBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyJ9