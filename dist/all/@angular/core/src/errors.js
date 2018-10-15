"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_TYPE = 'ngType';
exports.ERROR_DEBUG_CONTEXT = 'ngDebugContext';
exports.ERROR_ORIGINAL_ERROR = 'ngOriginalError';
exports.ERROR_LOGGER = 'ngErrorLogger';
function getType(error) {
    return error[exports.ERROR_TYPE];
}
exports.getType = getType;
function getDebugContext(error) {
    return error[exports.ERROR_DEBUG_CONTEXT];
}
exports.getDebugContext = getDebugContext;
function getOriginalError(error) {
    return error[exports.ERROR_ORIGINAL_ERROR];
}
exports.getOriginalError = getOriginalError;
function getErrorLogger(error) {
    return error[exports.ERROR_LOGGER] || defaultErrorLogger;
}
exports.getErrorLogger = getErrorLogger;
function defaultErrorLogger(console) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    console.error.apply(console, values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSVUsUUFBQSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3RCLFFBQUEsbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUM7QUFDdkMsUUFBQSxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQztBQUN6QyxRQUFBLFlBQVksR0FBRyxlQUFlLENBQUM7QUFHNUMsaUJBQXdCLEtBQVk7SUFDbEMsT0FBUSxLQUFhLENBQUMsa0JBQVUsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFGRCwwQkFFQztBQUVELHlCQUFnQyxLQUFZO0lBQzFDLE9BQVEsS0FBYSxDQUFDLDJCQUFtQixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELDBDQUVDO0FBRUQsMEJBQWlDLEtBQVk7SUFDM0MsT0FBUSxLQUFhLENBQUMsNEJBQW9CLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRkQsNENBRUM7QUFFRCx3QkFBK0IsS0FBWTtJQUN6QyxPQUFRLEtBQWEsQ0FBQyxvQkFBWSxDQUFDLElBQUksa0JBQWtCLENBQUM7QUFDNUQsQ0FBQztBQUZELHdDQUVDO0FBR0QsNEJBQTRCLE9BQWdCO0lBQUUsZ0JBQWdCO1NBQWhCLFVBQWdCLEVBQWhCLHFCQUFnQixFQUFoQixJQUFnQjtRQUFoQiwrQkFBZ0I7O0lBQ3RELE9BQU8sQ0FBQyxLQUFLLE9BQWIsT0FBTyxFQUFXLE1BQU0sRUFBRTtBQUNsQyxDQUFDIn0=