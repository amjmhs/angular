"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
/**
 * Provides a hook for centralized exception handling.
 *
 * The default implementation of `ErrorHandler` prints error messages to the `console`. To
 * intercept error handling, write a custom exception handler that replaces this default as
 * appropriate for your app.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * class MyErrorHandler implements ErrorHandler {
 *   handleError(error) {
 *     // do something with the exception
 *   }
 * }
 *
 * @NgModule({
 *   providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
 * })
 * class MyModule {}
 * ```
 */
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
        /**
         * @internal
         */
        this._console = console;
    }
    ErrorHandler.prototype.handleError = function (error) {
        var originalError = this._findOriginalError(error);
        var context = this._findContext(error);
        // Note: Browser consoles show the place from where console.error was called.
        // We can use this to give users additional information about the error.
        var errorLogger = errors_1.getErrorLogger(error);
        errorLogger(this._console, "ERROR", error);
        if (originalError) {
            errorLogger(this._console, "ORIGINAL ERROR", originalError);
        }
        if (context) {
            errorLogger(this._console, 'ERROR CONTEXT', context);
        }
    };
    /** @internal */
    ErrorHandler.prototype._findContext = function (error) {
        if (error) {
            return errors_1.getDebugContext(error) ? errors_1.getDebugContext(error) :
                this._findContext(errors_1.getOriginalError(error));
        }
        return null;
    };
    /** @internal */
    ErrorHandler.prototype._findOriginalError = function (error) {
        var e = errors_1.getOriginalError(error);
        while (e && errors_1.getOriginalError(e)) {
            e = errors_1.getOriginalError(e);
        }
        return e;
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
function wrappedError(message, originalError) {
    var msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
    var error = Error(msg);
    error[errors_1.ERROR_ORIGINAL_ERROR] = originalError;
    return error;
}
exports.wrappedError = wrappedError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2Vycm9yX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBaUc7QUFJakc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSDtJQUFBO1FBQ0U7O1dBRUc7UUFDSCxhQUFRLEdBQVksT0FBTyxDQUFDO0lBcUM5QixDQUFDO0lBbkNDLGtDQUFXLEdBQVgsVUFBWSxLQUFVO1FBQ3BCLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLDZFQUE2RTtRQUM3RSx3RUFBd0U7UUFDeEUsSUFBTSxXQUFXLEdBQUcsdUJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxhQUFhLEVBQUU7WUFDakIsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFJLE9BQU8sRUFBRTtZQUNYLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsbUNBQVksR0FBWixVQUFhLEtBQVU7UUFDckIsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLHdCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLHlDQUFrQixHQUFsQixVQUFtQixLQUFZO1FBQzdCLElBQUksQ0FBQyxHQUFHLHlCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLHlCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9CLENBQUMsR0FBRyx5QkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6QjtRQUVELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXpDRCxJQXlDQztBQXpDWSxvQ0FBWTtBQTJDekIsc0JBQTZCLE9BQWUsRUFBRSxhQUFrQjtJQUM5RCxJQUFNLEdBQUcsR0FDRixPQUFPLHFCQUFlLGFBQWEsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBRyxDQUFDO0lBQ3RHLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixLQUFhLENBQUMsNkJBQW9CLENBQUMsR0FBRyxhQUFhLENBQUM7SUFDckQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBTkQsb0NBTUMifQ==