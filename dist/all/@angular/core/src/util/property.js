"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function getClosureSafeProperty(objWithPropertyToExtract, target) {
    for (var key in objWithPropertyToExtract) {
        if (objWithPropertyToExtract[key] === target) {
            return key;
        }
    }
    throw Error('Could not find renamed property on target object.');
}
exports.getClosureSafeProperty = getClosureSafeProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy91dGlsL3Byb3BlcnR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQTBDLHdCQUEyQixFQUFFLE1BQVc7SUFDaEYsS0FBSyxJQUFJLEdBQUcsSUFBSSx3QkFBd0IsRUFBRTtRQUN4QyxJQUFJLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUM1QyxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFDRCxNQUFNLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFQRCx3REFPQyJ9