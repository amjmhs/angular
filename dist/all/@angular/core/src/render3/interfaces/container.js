"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("./view");
/**
 * Below are constants for LContainer indices to help us look up LContainer members
 * without having to remember the specific indices.
 * Uglify will inline these when minifying so there shouldn't be a cost.
 */
exports.ACTIVE_INDEX = 0;
// PARENT, NEXT, and QUERIES are indices 1, 2, and 3.
// As we already have these constants in LViewData, we don't need to re-create them.
exports.VIEWS = 4;
exports.RENDER_PARENT = 5;
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
exports.unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9pbnRlcmZhY2VzL2NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILCtCQUF3RDtBQUV4RDs7OztHQUlHO0FBQ1UsUUFBQSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLHFEQUFxRDtBQUNyRCxvRkFBb0Y7QUFDdkUsUUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsUUFBQSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBc0UvQixpRkFBaUY7QUFDakYsMEJBQTBCO0FBQ2IsUUFBQSw2QkFBNkIsR0FBRyxDQUFDLENBQUMifQ==