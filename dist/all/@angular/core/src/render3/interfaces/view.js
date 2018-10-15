"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Size of LViewData's header. Necessary to adjust for it when setting slots.  */
exports.HEADER_OFFSET = 16;
// Below are constants for LViewData indices to help us look up LViewData members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
exports.TVIEW = 0;
exports.PARENT = 1;
exports.NEXT = 2;
exports.QUERIES = 3;
exports.FLAGS = 4;
exports.HOST_NODE = 5;
exports.BINDING_INDEX = 6;
exports.DIRECTIVES = 7;
exports.CLEANUP = 8;
exports.CONTEXT = 9;
exports.INJECTOR = 10;
exports.RENDERER = 11;
exports.SANITIZER = 12;
exports.TAIL = 13;
exports.CONTAINER_INDEX = 14;
exports.CONTENT_QUERIES = 15;
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
exports.unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW50ZXJmYWNlcy92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBWUgsa0ZBQWtGO0FBQ3JFLFFBQUEsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUVoQyxpRkFBaUY7QUFDakYsbURBQW1EO0FBQ25ELHdFQUF3RTtBQUMzRCxRQUFBLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDVixRQUFBLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDWCxRQUFBLElBQUksR0FBRyxDQUFDLENBQUM7QUFDVCxRQUFBLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDWixRQUFBLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDVixRQUFBLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDZCxRQUFBLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBQSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBQSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBQSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBQSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2QsUUFBQSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2QsUUFBQSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBQSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ1YsUUFBQSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQUEsZUFBZSxHQUFHLEVBQUUsQ0FBQztBQTBibEMsaUZBQWlGO0FBQ2pGLDBCQUEwQjtBQUNiLFFBQUEsNkJBQTZCLEdBQUcsQ0FBQyxDQUFDIn0=